import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'bakso_admin_whatsapp';

export function AdminSettings() {
  const [number, setNumber] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || '';
    setNumber(stored);
  }, []);

  const save = () => {
    const cleaned = number.replace(/[^0-9+]/g, '');
    localStorage.setItem(STORAGE_KEY, cleaned);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // Notify other windows/components
    window.dispatchEvent(new Event('bakso_admin_whatsapp_changed'));
  };

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setNumber('');
    window.dispatchEvent(new Event('bakso_admin_whatsapp_changed'));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Pengaturan Admin</h3>
      <div className="grid gap-2 max-w-md">
        <label className="text-sm text-gray-600">Nomor WhatsApp admin (gunakan kode negara, contoh: 6285...)</label>
        <input value={number} onChange={e=>setNumber(e.target.value)} placeholder="6285..." className="p-2 border rounded w-full" />
        <div className="flex gap-2">
          <button onClick={save} className="px-4 py-2 bg-orange-600 text-white rounded">Simpan</button>
          <button onClick={clear} className="px-4 py-2 bg-white border rounded">Hapus</button>
          {saved && <div className="text-sm text-green-600">Tersimpan</div>}
        </div>
        <div className="text-xs text-gray-500">Nomor akan digunakan sebagai tujuan rekap pesanan yang dikirim melalui WhatsApp.</div>
      </div>
    </div>
  );
}

export default AdminSettings;
