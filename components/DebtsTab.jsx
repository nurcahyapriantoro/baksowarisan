import React from 'react';
import { formatRupiah } from '../utils/formatRupiah';

export function DebtsTab({ totalPiutang, transaksi, markAsPaid }) {
  const unpaid = transaksi.filter(t => t.status === 'Belum Lunas');
  return (
    <div className="animate-fade-in">
      <div className="bg-red-500 text-white p-6 rounded-xl mb-6 shadow-lg shadow-red-200">
        <h2 className="text-xs font-bold uppercase tracking-widest text-red-100 mb-1">Total Belum Dibayar</h2>
        <p className="text-3xl font-mono font-bold">{formatRupiah(totalPiutang)}</p>
        <p className="text-xs mt-2 text-red-100 italic">Segera tagih agar modal berputar!</p>
      </div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Daftar Penunggak</h3>
      <div className="space-y-3">
        {unpaid.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">Tidak ada piutang. Aman! 🎉</div>
        ) : (
          unpaid.map(t => (
            <div key={t.id} className="border border-red-100 bg-red-50 rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-red-900">{t.customer}</p>
                <p className="text-xs text-red-700">{t.date} • {t.productName}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-red-800 mb-1">{formatRupiah(t.total)}</p>
                <button
                  onClick={() => markAsPaid(t.id)}
                  className="text-[10px] bg-white border border-red-200 px-2 py-1 rounded shadow-sm font-bold text-red-600 uppercase tracking-wider hover:bg-red-100"
                >
                  Tandai Lunas
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
