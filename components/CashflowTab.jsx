import React from 'react';
import { Download } from 'lucide-react';
import { formatRupiah } from '../utils/formatRupiah';

export function CashflowTab({
  newExpense,
  setNewExpense,
  addExpense,
  kasMasuk,
  kasKeluar,
  modalAwal,
  setModalAwal,
  downloadCSV
}) {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Catat Pengeluaran */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Catat Pengeluaran</h3>
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Ket (mis: Beli Gas)"
            value={newExpense.deskripsi}
            onChange={e => setNewExpense({ ...newExpense, deskripsi: e.target.value })}
            className="flex-1 border-b border-gray-200 p-2 text-sm focus:outline-none focus:border-black"
          />
          <input
            type="number"
            placeholder="Rp 0"
            value={newExpense.jumlah}
            onChange={e => setNewExpense({ ...newExpense, jumlah: e.target.value })}
            className="w-24 border-b border-gray-200 p-2 text-sm font-mono focus:outline-none focus:border-black"
          />
        </div>
        <button onClick={addExpense} className="w-full bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded hover:bg-gray-200">Simpan Pengeluaran</button>
      </div>

      {/* Laporan Mini */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded border border-green-100">
          <p className="text-[10px] uppercase text-green-600 font-bold">Pemasukan</p>
          <p className="font-mono font-bold text-green-800">{formatRupiah(kasMasuk)}</p>
        </div>
        <div className="p-4 bg-red-50 rounded border border-red-100">
          <p className="text-[10px] uppercase text-red-600 font-bold">Pengeluaran</p>
          <p className="font-mono font-bold text-red-800">{formatRupiah(kasKeluar)}</p>
        </div>
      </div>

      {/* Modal Awal */}
      <div className="pt-4">
        <label className="text-[10px] uppercase text-gray-400 font-bold block mb-1">Modal Awal (Cash on Hand)</label>
        <input
          type="number"
          value={modalAwal}
          onChange={e => setModalAwal(e.target.value)}
          className="w-full border-b border-gray-300 py-2 font-mono text-xl font-bold focus:outline-none focus:border-black"
        />
      </div>

      {/* Download */}
      <button onClick={downloadCSV} className="w-full border border-gray-200 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-gray-50">
        <Download size={16} /> Download Laporan Excel
      </button>
    </div>
  );
}
