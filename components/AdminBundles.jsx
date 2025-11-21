import React, { useState, useEffect, useRef } from 'react';
import { useBaksoBundles } from '../hooks/useBaksoBundles';
import { formatRupiah } from '../utils/formatRupiah';

// AdminBundles: enhanced admin for bundles with search/sort, modal edit, image upload, undo delete
export function AdminBundles({ products = [] }) {
  const { bundles, loading, addBundle, updateBundle, deleteBundle } = useBaksoBundles();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [editing, setEditing] = useState(null); // bundle object or '__new'
  const [form, setForm] = useState({ name: '', description: '', price: 0, tags: '', items: [], image: '' });
  const [lastDeleted, setLastDeleted] = useState(null);
  const undoTimer = useRef(null);

  useEffect(() => () => { if (undoTimer.current) clearTimeout(undoTimer.current); }, []);

  const openNew = () => { setEditing('__new'); setForm({ name: '', description: '', price: 0, tags: '', items: [], image: '' }); };
  const openEdit = (b) => { setEditing(b.id); setForm({ name: b.name, description: b.description || '', price: b.price || 0, tags: (b.tags||[]).join(','), items: b.items || [], image: b.image || '' }); };

  const closeModal = () => { setEditing(null); setForm({ name: '', description: '', price: 0, tags: '', items: [], image: '' }); };

  const onSave = () => {
    const payload = { name: form.name, description: form.description, price: parseInt(form.price) || 0, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean), items: form.items.map(it=>({ name: it.name, qty: parseInt(it.qty)||1 })), image: form.image };
    if (editing === '__new') addBundle(payload); else updateBundle(editing, payload);
    closeModal();
  };

  const onDelete = (b) => {
    // perform soft delete with undo
    deleteBundle(b.id);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setLastDeleted({ bundle: b });
    undoTimer.current = setTimeout(() => setLastDeleted(null), 5000);
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    addBundle(lastDeleted.bundle);
    setLastDeleted(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  };

  const addItemRow = () => setForm(prev => ({ ...prev, items: [...prev.items, { name: products[0]?.name || '', qty: 1 }] }));
  const updateItem = (idx, patch) => setForm(prev => ({ ...prev, items: prev.items.map((it,i)=> i===idx ? { ...it, ...patch } : it) }));
  const removeItem = (idx) => setForm(prev => ({ ...prev, items: prev.items.filter((_,i)=>i!==idx) }));

  const onImageSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // Compress / resize image via canvas before saving to reduce localStorage size
    const reader = new FileReader();
    reader.onload = (ev) => {
      const imgEl = new Image();
      imgEl.onload = () => {
        const MAX_W = 1200; const MAX_H = 800;
        let { width, height } = imgEl;
        const ratio = Math.min(MAX_W / width, MAX_H / height, 1);
        width = Math.round(width * ratio); height = Math.round(height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgEl, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        setForm(prev => ({ ...prev, image: dataUrl }));
      };
      imgEl.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const filtered = bundles.filter(b => !query || b.name.toLowerCase().includes(query.toLowerCase()) || (b.tags||[]).join(' ').toLowerCase().includes(query.toLowerCase()));
  const sorted = filtered.sort((a,b) => {
    if (sortBy === 'price') return (a.price||0) - (b.price||0);
    return (b.createdAt||0) - (a.createdAt||0);
  });

  if (loading) return <div>Memuat paket...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Manajemen Paket Bundling</h3>
        <div className="flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari paket atau tag..." className="p-2 border rounded" />
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="p-2 border rounded">
            <option value="createdAt">Terbaru</option>
            <option value="price">Harga (naik)</option>
          </select>
          <button onClick={openNew} className="px-4 py-2 bg-green-600 text-white rounded">Tambah Paket Baru</button>
        </div>
      </div>

      <div className="grid gap-4">
        {sorted.map(b => (
          <div key={b.id} className="p-4 bg-white rounded border flex items-start gap-4">
            {b.image && <img src={b.image} alt={b.name} className="w-28 h-20 object-cover rounded" />}
            <div className="flex-1">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold">{b.name}</h4>
                  <p className="text-sm text-gray-600">{b.description}</p>
                  <div className="text-xs text-gray-500 mt-2">{b.items.map(it=> `${it.qty}x ${it.name}`).join(' • ')}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold">{formatRupiah(b.price)}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => openEdit(b)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                    <button onClick={() => { if (confirm('Hapus paket ini?')) onDelete(b); }} className="px-3 py-1 bg-red-500 text-white rounded">Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal editor */}
      {editing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold">{editing === '__new' ? 'Tambah Paket' : 'Edit Paket'}</h4>
              <button onClick={closeModal} className="px-3 py-1 bg-gray-200 rounded">Tutup</button>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <input placeholder="Nama paket" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="p-2 border rounded" />
              <input placeholder="Harga jual" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} className="p-2 border rounded" />
              <input placeholder="Tags (pisah koma)" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} className="p-2 border rounded col-span-2" />
              <textarea placeholder="Deskripsi" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="p-2 border rounded col-span-2" />
            </div>
            <div className="mt-3">
              <h5 className="font-bold">Items</h5>
              <div className="grid gap-2">
                {form.items.map((it,idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <select value={it.name} onChange={e=>updateItem(idx, { name: e.target.value })} className="p-2 border rounded flex-1">
                      {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                    <input type="number" value={it.qty} onChange={e=>updateItem(idx, { qty: e.target.value })} className="w-24 p-2 border rounded" />
                    <button onClick={()=>removeItem(idx)} className="px-3 py-1 bg-red-500 text-white rounded">Hapus</button>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <button onClick={addItemRow} className="px-3 py-1 bg-blue-600 text-white rounded">Tambah Item</button>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium">Gambar Paket (opsional)</label>
              <input type="file" accept="image/*" onChange={onImageSelect} className="mt-2" />
              {form.image && <img src={form.image} alt="preview" className="mt-2 w-40 h-28 object-cover rounded" />}
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={onSave} className="px-4 py-2 bg-orange-600 text-white rounded">Simpan</button>
              <button onClick={closeModal} className="px-4 py-2 bg-white border rounded">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Undo toast */}
      {lastDeleted && (
        <div className="fixed bottom-6 right-6 bg-white border p-3 rounded shadow-lg z-50 flex items-center gap-3">
          <div>"{lastDeleted.bundle.name}" dihapus.</div>
          <button onClick={undoDelete} className="px-3 py-1 bg-blue-600 text-white rounded">Undo</button>
        </div>
      )}
    </div>
  );
}
