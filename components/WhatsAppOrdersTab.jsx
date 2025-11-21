import React, { useState, useMemo } from 'react';
import { useStickyState } from '../hooks/useStickyState';
import { Download, Trash2, PlusCircle } from 'lucide-react';

function generateId() { return Date.now() + '-' + Math.floor(Math.random()*9000+1000); }

function parseWhatsAppText(text) {
  // Robust parser for common WhatsApp paste formats.
  // Accepts labeled lines (Nama/Name, Tel/Telp/No HP, Pesanan/Items, Total/Jumlah)
  // and unlabeled variations where lines appear in order: name, phone, items, total.
  const rawLines = text.split(/\r?\n/).map(l => l.replace(/^\s*[-•\*]?\s*/, '').trim());
  const lines = rawLines.filter(Boolean);
  const result = { customer: '', phone: '', items: [], total: 0, note: text };

  // Helper to parse an item string into {name, qty}
  const parseItem = (p) => {
    const part = p.trim();
    const q = part.match(/(.+)x\s*(\d+)$/i) || part.match(/^(\d+)x\s*(.+)/i);
    if (q) {
      const name = (q[1] && isNaN(q[1]) ? q[1] : q[2]).trim();
      const qty = parseInt(q[2] || q[1]) || 1;
      return { name, qty };
    }
    const m = part.match(/(.+)\s+(\d+)$/);
    if (m) return { name: m[1].trim(), qty: parseInt(m[2]) };
    return { name: part, qty: 1 };
  };

  // First pass: find explicit labeled fields
  let inItemsBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const low = line.toLowerCase();

    if (/^(nama|name|customer|pembeli)[:\-]?\s*/i.test(line)) {
      result.customer = line.split(/[:\-]/).slice(1).join(':').trim();
      inItemsBlock = false; continue;
    }
    if (/^(tel|telp|no\.?\s*hp|hp|phone|wa)[:\-]?/i.test(low)) {
      const m = line.match(/(\+?\d[\d\s\-\(\)]{5,})/);
      result.phone = m ? m[1].replace(/[\s\-\(\)]/g,'') : line.split(/[:\-]/).slice(1).join(':').trim();
      inItemsBlock = false; continue;
    }
    if (/^(pesan|pesanan|order|items?)[:\-]?/i.test(low)) {
      // items may be on same line after colon or subsequent lines
      const after = line.split(/[:\-]/).slice(1).join(':').trim();
      if (after) {
        const parts = after.split(/[;,]/).map(s=>s.trim()).filter(Boolean);
        for (const p of parts) result.items.push(parseItem(p));
      }
      // consume following lines as items until next label or empty
      inItemsBlock = true; continue;
    }
    const tot = line.match(/^(total|jumlah)[:\-]?\s*Rp?\s*([\d.,]+)/i);
    if (tot) { result.total = parseInt(tot[2].replace(/[.,]/g,''))||0; inItemsBlock = false; continue; }

    if (inItemsBlock) {
      // line likely an item entry
      // split multiple items on same line by ; or ,
      const parts = line.split(/[;,]/).map(s=>s.trim()).filter(Boolean);
      for (const p of parts) result.items.push(parseItem(p));
      continue;
    }
  }

  // If no explicit name/phone/total found, attempt heuristic mapping from ordered lines
  if (!result.customer || !result.phone || (result.items.length === 0 && result.total === 0)) {
    // try common structure: name (line0), phone (line1), items (line2..n-1), total (last line)
    const maybe = [...lines];
    // detect total at last line
    if (maybe.length) {
      const last = maybe[maybe.length-1];
      const totm = last.match(/^(total|jumlah)[:\-]?\s*Rp?\s*([\d.,]+)|^Rp\s*([\d.,]+)$/i);
      if (totm) {
        const num = (totm[2] || totm[3] || '').replace(/[.,]/g,'');
        const n = parseInt(num) || 0; result.total = n;
        maybe.pop();
      }
    }

    // if phone not set, find first line that looks like phone
    if (!result.phone) {
      for (let i=0;i<maybe.length;i++) {
        const l = maybe[i];
        const m = l.match(/(\+?\d[\d\s\-\(\)]{5,})/);
        if (m) { result.phone = m[1].replace(/[\s\-\(\)]/g,''); maybe.splice(i,1); break; }
      }
    }

    // if customer not set, assume first remaining line
    if (!result.customer && maybe.length) {
      result.customer = maybe.shift();
    }

    // remaining lines are items
    if (result.items.length === 0 && maybe.length) {
      const joined = maybe.join(';');
      const parts = joined.split(/[;|,]+/).map(s=>s.trim()).filter(Boolean);
      for (const p of parts) result.items.push(parseItem(p));
    }
  }

  // ensure types
  result.total = Number(result.total) || 0;
  if (!result.customer) result.customer = '';
  if (!result.phone) result.phone = '';
  if (!result.items || !result.items.length) result.items = [];
  return result;
}

export function WhatsAppOrdersTab({ products = [] }) {
  const [orders, setOrders] = useStickyState([], 'bakso_wa_orders_v1');
  const [inputText, setInputText] = useState('');
  const [manual, setManual] = useState({ customer:'', phone:'', itemsText:'', total:'' });
  const [apiUrl, setApiUrl] = useStickyState(import.meta.env.VITE_WA_API_URL || 'http://localhost:4000', 'bakso_wa_api_url');
  const [apiSecret, setApiSecret] = useStickyState('', 'bakso_wa_api_secret');
  const [autoSync, setAutoSync] = useStickyState(true, 'bakso_wa_auto_sync');

  const addFromText = () => {
    if (!inputText.trim()) return;
    const parsed = parseWhatsAppText(inputText);
    const order = {
      id: generateId(),
      date: new Date().toISOString(),
      customer: parsed.customer || 'Pelanggan WA',
      phone: parsed.phone || '',
      items: parsed.items.length ? parsed.items : [{ name: 'Pesanan (lihat note)', qty:1 }],
      total: parsed.total || 0,
      status: parsed.total > 0 ? 'Belum bayar' : 'Pengiriman',
      note: parsed.note || inputText,
      source: 'whatsapp'
    };
    setOrders([ ...orders, order ]);
    setInputText('');
  };

  const addManual = () => {
    const items = manual.itemsText.split(/[,;\n]/).map(l=>l.trim()).filter(Boolean).map(p=>{
      const m = p.match(/(.+)x\s*(\d+)/i) || p.match(/(\d+)x\s*(.+)/i);
      if (m) return { name: (m[1] && isNaN(m[1])? m[1] : m[2]).trim(), qty: parseInt(m[2]||m[1])||1 };
      const mm = p.match(/(.+)\s+(\d+)$/);
      if (mm) return { name: mm[1].trim(), qty: parseInt(mm[2]) };
      return { name: p, qty: 1 };
    });
    const order = { id: generateId(), date: new Date().toISOString(), customer: manual.customer||'Pelanggan', phone: manual.phone||'', items, total: parseInt(manual.total) || 0, status: 'Belum bayar', note: '', source: 'manual' };
    setOrders([...orders, order]);
    setManual({ customer:'', phone:'', itemsText:'', total:'' });
  };

  const updateStatus = (id, status) => setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  const removeOrder = (id) => setOrders(orders.filter(o => o.id !== id));

  const exportCSV = () => {
    if (!orders.length) return;
    const header = ['ID','Date','Customer','Phone','Items','Total','Status','Note','Source'];
    const rows = orders.map(o => [o.id, o.date, o.customer, o.phone, o.items.map(it=>`${it.qty}x ${it.name}`).join(' | '), o.total, o.status, (o.note||'').replace(/\n/g,' '), o.source]);
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `wa_orders_${(new Date()).toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  // Polling for remote orders
  React.useEffect(() => {
    if (!autoSync) return;
    let mounted = true;
    async function pollOnce(){
      try{
        const res = await fetch((apiUrl||'http://localhost:4000') + '/api/wa-orders');
        if(!res.ok) return;
        const remote = await res.json();
        if(!mounted) return;
        // merge new orders by id
        const known = new Set(orders.map(o=>o.id));
        const toAdd = remote.filter(r=>!known.has(r.id));
        if(toAdd.length) setOrders(prev => [...prev, ...toAdd]);
      }catch(e){ /* silent */ }
    }
    pollOnce();
    const id = setInterval(pollOnce, 8000);
    return () => { mounted = false; clearInterval(id); };
  }, [apiUrl, autoSync, orders, setOrders]);

  const stats = useMemo(()=>{
    const tot = orders.length;
    const byStatus = orders.reduce((acc,o)=>{ acc[o.status] = (acc[o.status]||0)+1; return acc; },{});
    return { tot, byStatus };
  },[orders]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pesanan WhatsApp</h2>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-600">Total: <strong>{stats.tot}</strong></div>
          <button onClick={exportCSV} title="Export CSV" className="inline-flex items-center gap-2 px-3 py-2 rounded bg-white border hover:shadow-sm"><Download size={14}/> Export CSV</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="font-bold mb-2">Import dari WhatsApp (tempel chat)</h3>
          <textarea value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="Tempel isi chat WhatsApp di sini (nama, telp, pesanan, total)..." className="w-full h-36 p-3 border border-gray-200 rounded resize-none" />
          <div className="flex gap-2 mt-2">
            <button onClick={addFromText} className="px-4 py-2 bg-orange-600 text-white rounded font-bold inline-flex items-center gap-2"><PlusCircle size={16}/> Tambah dari Chat</button>
            <button onClick={()=>setInputText('')} className="px-4 py-2 border rounded">Bersihkan</button>
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="font-bold mb-2">Tambah Manual</h3>
          <input placeholder="Nama pembeli" value={manual.customer} onChange={e=>setManual({...manual, customer:e.target.value})} className="w-full p-2 border border-gray-200 rounded mb-2" />
          <input placeholder="No. HP" value={manual.phone} onChange={e=>setManual({...manual, phone:e.target.value})} className="w-full p-2 border border-gray-200 rounded mb-2" />
          <textarea placeholder="Items, contoh: Bakso Halus x2; Bakso Urat x1" value={manual.itemsText} onChange={e=>setManual({...manual, itemsText:e.target.value})} className="w-full p-2 border border-gray-200 rounded mb-2" />
          <input placeholder="Total (angka)" value={manual.total} onChange={e=>setManual({...manual, total:e.target.value})} className="w-full p-2 border border-gray-200 rounded mb-2" />
          <div className="flex gap-2">
            <button onClick={addManual} className="px-4 py-2 bg-green-600 text-white rounded font-bold">Tambah Manual</button>
            <button onClick={()=>setManual({ customer:'', phone:'', itemsText:'', total:'' })} className="px-4 py-2 border rounded">Bersihkan</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-3">
        <h3 className="font-bold mb-2">Daftar Pesanan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="p-2">Waktu</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Items</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice().reverse().map(o => (
                <tr key={o.id} className="border-t">
                  <td className="p-2 align-top">{new Date(o.date).toLocaleString()}</td>
                  <td className="p-2 align-top">{o.customer}<div className="text-xs text-gray-400">{o.note ? o.note.slice(0,60) : ''}</div></td>
                  <td className="p-2 align-top">{o.phone}</td>
                  <td className="p-2 align-top">{o.items.map(it=> <div key={it.name} className="text-xs">{it.qty}× {it.name}</div>)}</td>
                  <td className="p-2 align-top font-mono">Rp {o.total ? o.total.toLocaleString() : '-'}</td>
                  <td className="p-2 align-top">
                    <select value={o.status} onChange={e=>updateStatus(o.id, e.target.value)} className="p-2 border rounded">
                      <option>Pengiriman</option>
                      <option>Belum bayar</option>
                      <option>Sudah selesai</option>
                    </select>
                  </td>
                  <td className="p-2 align-top">
                    <div className="flex gap-2">
                      <button onClick={()=>removeOrder(o.id)} title="Hapus" className="px-2 py-1 rounded bg-red-50 text-red-600 border border-red-100 inline-flex items-center"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500">Belum ada pesanan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppOrdersTab;
