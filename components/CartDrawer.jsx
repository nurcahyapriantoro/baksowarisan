import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { formatRupiah } from '../utils/formatRupiah';

const DEFAULT_WHATSAPP_NUMBER = '6285117208660'; // fallback admin number
const STORAGE_KEY_ADMIN_WA = 'bakso_admin_whatsapp';

export function CartDrawer() {
  const { cart, itemCount, total, removeItem, updateQty, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [adminNumber, setAdminNumber] = useState(DEFAULT_WHATSAPP_NUMBER);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const toggle = () => setOpen(prev => {
    const next = !prev;
    window.__bakso_cart_open = next;
    return next;
  });

  // Listen for 'bakso_cart_open' to open drawer from navbar
  React.useEffect(() => {
    const openHandler = () => {
      setOpen(true);
      window.__bakso_cart_open = true;
    };
    const closeHandler = () => {
      setOpen(false);
      window.__bakso_cart_open = false;
    };
    window.addEventListener('bakso_cart_open', openHandler);
    window.addEventListener('bakso_cart_close', closeHandler);
    // load admin number from localStorage and listen for changes
    const loadAdminNumber = () => {
      const stored = localStorage.getItem(STORAGE_KEY_ADMIN_WA);
      setAdminNumber(stored && stored.length ? stored : DEFAULT_WHATSAPP_NUMBER);
    };
    loadAdminNumber();
    const waChangeHandler = () => loadAdminNumber();
    window.addEventListener('bakso_admin_whatsapp_changed', waChangeHandler);
    window.addEventListener('storage', waChangeHandler);
    return () => {
      window.removeEventListener('bakso_cart_open', openHandler);
      window.removeEventListener('bakso_cart_close', closeHandler);
      window.removeEventListener('bakso_admin_whatsapp_changed', waChangeHandler);
      window.removeEventListener('storage', waChangeHandler);
    };
  }, []);

  // Show preview modal first
  const sendWhatsApp = () => {
    if (!cart.length) return alert('Keranjang kosong.');
    setShowPreview(true);
  };

  const buildMessageLines = () => {
    const lines = [];
    lines.push('Pesanan dari Bakso Warisan Mbah Jambul');
    if (name) lines.push(`Nama: ${name}`);
    if (phone) lines.push(`No HP: ${phone}`);
    if (address) lines.push(`Alamat: ${address}`);
    lines.push('');
    lines.push('Detail pesanan:');
    cart.forEach((it, idx) => {
      lines.push(`${idx+1}. ${it.name} x${it.qty} — ${formatRupiah(it.price * it.qty)}`);
    });
    lines.push('');
    lines.push('Subtotal: ' + formatRupiah(total));
    lines.push('');
    lines.push('Mohon konfirmasi ketersediaan dan estimasi pengiriman. Terima kasih.');
    return lines;
  };

  const performSendWhatsApp = () => {
    const lines = buildMessageLines();
    const msg = encodeURIComponent(lines.join('\n'));
    const target = (adminNumber && adminNumber.length) ? adminNumber.replace(/[^0-9+]/g,'') : DEFAULT_WHATSAPP_NUMBER;
    const wa = `https://wa.me/${target}?text=${msg}`;
    window.open(wa, '_blank');
    // Clear cart and close drawers after sending
    clear();
    setShowPreview(false);
    setOpen(false);
    window.__bakso_cart_open = false;
  };

  return (
    <>
      {/* Cart button moved to navbar - floating button removed. Component listens for 'bakso_cart_open' event to open drawer. */}

      <div className={`fixed top-0 right-0 z-50 h-full w-full md:w-96 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full bg-white shadow-2xl flex flex-col">
          <div className="p-4 border-b flex items-center justify-between rounded-bl-lg rounded-none bg-gradient-to-r from-orange-600 to-pink-600 text-white">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8h14l-2-8M10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <h3 className="font-bold">Keranjang ({itemCount})</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { clear(); window.__bakso_cart_open = false; }} className="px-3 py-1 bg-red-500 text-white rounded hover:opacity-95 transition">Kosongkan</button>
            </div>
          </div>
          <div className="p-4 flex-1 overflow-auto">
            {cart.length === 0 && <div className="text-gray-500">Belum ada item dalam keranjang.</div>}
            <div className="space-y-3">
              {cart.map(it => (
                <div key={it.id} className="p-3 bg-white rounded-lg flex items-center gap-3 shadow-sm border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{it.name}</div>
                    <div className="text-xs text-gray-400">{formatRupiah(it.price)} /pcs</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))} className="px-2 py-1 bg-white border rounded">-</button>
                    <input
                      type="number"
                      min={1}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={it.qty}
                      onChange={e => {
                        const v = parseInt(e.target.value, 10);
                        if (Number.isNaN(v)) return updateQty(it.id, 1);
                        updateQty(it.id, Math.max(1, v));
                      }}
                      onBlur={e => {
                        const v = parseInt(e.target.value, 10);
                        if (!v || v < 1) updateQty(it.id, 1);
                      }}
                      className="w-16 text-center p-1 border rounded"
                    />
                    <button onClick={() => updateQty(it.id, it.qty + 1)} className="px-2 py-1 bg-white border rounded">+</button>
                  </div>
                  <div className="text-right ml-3">
                    <div className="font-semibold">{formatRupiah(it.price * it.qty)}</div>
                    <button onClick={() => removeItem(it.id)} className="text-sm text-red-500 mt-1 hover:underline">Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t sticky bottom-0 bg-white z-40">
            <div className="mb-3">
              <input placeholder="Nama" value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded mb-2" />
              <input placeholder="No HP (gunakan kode negara)" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-2 border rounded mb-2" />
              <textarea placeholder="Alamat / Catatan" value={address} onChange={e=>setAddress(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div className="flex-1">
                <div className="text-xs text-gray-500">Rekap akan dikirim ke admin:</div>
                <div className="font-mono text-sm text-gray-700">{adminNumber ? (adminNumber.startsWith('+') ? adminNumber : `+${adminNumber}`) : `+${DEFAULT_WHATSAPP_NUMBER}`}</div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="font-extrabold text-lg">{formatRupiah(total)}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={sendWhatsApp} className="px-4 py-3 bg-green-600 text-white rounded">Pesan Sekarang</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Preview / Confirmation Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPreview(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 z-10">
            <h4 className="text-lg font-bold mb-3">Konfirmasi Pesanan</h4>
            <div className="text-sm text-gray-700 mb-4">
              <div>{name ? `Nama: ${name}` : <span className="text-gray-400">Nama belum diisi</span>}</div>
              <div>{phone ? `No HP: ${phone}` : <span className="text-gray-400">No HP belum diisi</span>}</div>
              <div>{address ? `Alamat: ${address}` : <span className="text-gray-400">Alamat / catatan kosong</span>}</div>
            </div>
            <div className="max-h-64 overflow-auto mb-4">
              <ul className="space-y-2">
                {cart.map((it, idx) => (
                  <li key={it.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{idx+1}. {it.name} x{it.qty}</div>
                      {it.note && <div className="text-xs text-gray-500">{it.note}</div>}
                    </div>
                    <div className="font-medium">{formatRupiah(it.price * it.qty)}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">Subtotal</div>
              <div className="font-bold text-lg">{formatRupiah(total)}</div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Batal</button>
              <button onClick={performSendWhatsApp} className="px-4 py-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded shadow hover:shadow-lg">Kirim ke WhatsApp</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
