import React, { useState, useEffect } from 'react';
import { formatRupiah } from '../../utils/formatRupiah';
import { ImageLightbox } from './ImageLightbox';
import { initBaksoBundles, getBaksoBundles } from '../../utils/initBaksoBundles';
import { useCart } from '../../hooks/useCart';

// Packages: kini dinamis berdasarkan daftar produk dari admin.
// Props: products (array)
export function Packages({ products }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [bundles, setBundles] = useState([]);
  const { addItem } = useCart();
  const [added, setAdded] = useState(null);
  const openLightbox = (images, startIndex=0) => { setLightboxImages(images || []); setLightboxIndex(startIndex); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const handleSelect = (p) => {
    console.log('Select product', p.id);
  };

  // Init bundles once (tanpa hardcode di komponen)
  useEffect(() => {
    const data = initBaksoBundles();
    setBundles(data);
  }, []);

  // Refresh jika localStorage berubah manual (opsional debounce sederhana)
  useEffect(() => {
    const handler = () => {
      setBundles(getBaksoBundles());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return (
    <div className="space-y-10">
      <section id="paket-section" className="space-y-6">
        <h2 className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400">Produk & Paket Pilihan</h2>
        <p className="text-center text-[11px] md:text-sm text-gray-600">Semua bakso dikemas vakum higienis. Paket dibuat otomatis & bisa disesuaikan lewat localStorage (tanpa hardcode).</p>

        <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-pink-600 text-center">Paket Bundling Hemat</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {bundles.map(b => {
            const totalButir = b.items.filter(i => !/Bumbu Kuah/.test(i.name)).reduce((a,c)=>a+c.qty,0);
            const kuahCount = b.items.filter(i => /Bumbu Kuah/.test(i.name)).reduce((a,c)=>a+c.qty,0);
            return (
              <div key={b.id} className="group transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 rounded-2xl bg-gradient-to-b from-pink-50 to-orange-50 shadow-sm overflow-hidden flex flex-col border border-pink-100 hover:shadow-2xl">
                <div className="p-6 flex-1 flex flex-col">
                  {b.image && (
                    <div className="w-full h-40 mb-4 overflow-hidden rounded-lg">
                      <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-start gap-3 mb-3">
                    <span className="inline-block shrink-0 bg-gradient-to-r from-pink-600 to-orange-600 text-white text-[11px] px-3 py-1 rounded-full font-extrabold shadow">Bundle</span>
                    <h3 className="font-extrabold text-base leading-tight mb-0 line-clamp-2 text-pink-700">{b.name}</h3>
                  </div>

                  <p className="text-[11px] text-gray-700 mb-3">{b.description}</p>

                  <ul className="text-[10px] text-gray-600 space-y-1 mb-4">
                    {b.items.map((it,i)=>(
                      <li key={i} className="flex items-center gap-2"> 
                        <span className="text-xs text-pink-600">•</span>
                        <span>{it.qty}x {it.name}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-[11px] text-gray-500">Total Bakso: <span className="font-semibold">{totalButir}</span> | Kuah: <span className="font-semibold">{kuahCount}</span></p>
                  <p className="text-2xl font-extrabold mt-4 text-pink-700">{formatRupiah(b.price)}</p>

                  <div className="flex flex-wrap gap-2 mt-3 mb-4">
                    {b.tags.map(t => <span key={t} className="bg-white/70 px-2 py-1 rounded-full text-[10px] font-semibold text-pink-700 border border-pink-100">{t}</span>)}
                  </div>

                  <button onClick={() => { addItem({ id: b.id, name: b.name, price: b.price }); setAdded(b.id); setTimeout(()=>setAdded(null),1400); }} className="mt-auto w-full px-4 py-3 rounded-full bg-gradient-to-r from-orange-600 to-pink-600 text-white text-[11px] font-bold tracking-wide shadow-lg transition-transform transform-gpu group-hover:-translate-y-0.5">
                    {added === b.id ? 'Ditambahkan ✓' : 'Tambah ke Keranjang'}
                  </button>
                </div>
              </div>
            );
          })}

          {bundles.length === 0 && (
            <div className="col-span-full text-center text-[11px] text-gray-500">Memuat paket...</div>
          )}
        </div>
      </section>

      <section id="produk-section" className="space-y-4">
        <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-orange-600 text-center pt-4">Produk Satuan</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map(p => {
            const img = p.images && p.images.length > 0 ? p.images[0] : null;
            return (
              <div key={p.id} className="group transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col border border-gray-100 hover:shadow-2xl">
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    {p.rating >= 4.9 && <span className="inline-block bg-gradient-to-r from-pink-600 to-orange-600 text-white text-[11px] px-3 py-1 rounded-full font-bold shadow">Favorit</span>}
                    <h3 className="font-bold text-base leading-tight mb-0 line-clamp-2">{p.name}</h3>
                  </div>
                </div>

                <div className="w-full aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {img ? (
                    <>
                      <img src={img} alt={p.name} loading="lazy" className="w-full h-full object-cover opacity-0 animate-fade-in-slow transform transition-transform duration-500 group-hover:scale-105" onLoad={e => e.currentTarget.classList.remove('opacity-0')} onClick={() => openLightbox(p.images,0)} />
                      {p.images && p.images.length > 1 && (
                        <button onClick={() => openLightbox(p.images,0)} className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">{p.images.length} foto</button>
                      )}
                    </>
                  ) : (
                    <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Tidak ada foto</div>
                  )}

                  {p.stock <= 5 && <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded font-bold">Stok Menipis</div>}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-[11px] text-gray-600">Stok: {p.stock} butir</p>
                  <p className="text-lg font-extrabold mt-3">{formatRupiah(p.price)}</p>
                  <p className="text-[11px] text-pink-600 font-semibold">Rating: {p.rating}</p>
                  <button onClick={()=>{ addItem({ id: p.id, name: p.name, price: p.price }); setAdded(p.id); setTimeout(()=>setAdded(null),1400); }} className="mt-auto w-full px-4 py-3 rounded-full bg-gradient-to-r from-orange-600 to-pink-600 text-white text-[11px] font-bold tracking-wide shadow hover:shadow-lg transition">
                    {added === p.id ? 'Ditambahkan ✓' : `Tambah ${p.name.split(' ')[1] || 'ke Keranjang'}`}
                  </button>
                </div>
              </div>
            );
          })}

          {products.length === 0 && (
            <div className="col-span-full text-center text-[11px] text-gray-500">Belum ada produk. Tambahkan lewat panel admin.</div>
          )}
        </div>
      </section>

      {lightboxOpen && (
        <ImageLightbox images={lightboxImages} index={lightboxIndex} onClose={closeLightbox} onChange={setLightboxIndex} />
      )}
    </div>
  );
}
