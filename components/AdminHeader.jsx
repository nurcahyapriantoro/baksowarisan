import React from 'react';
import { AlertCircle } from 'lucide-react';
import { formatRupiah } from '../utils/formatRupiah';

/* AdminHeader: Header dashboard admin.
   Props:
     saldoAkhir
     totalPiutang
     onToLanding()
     onLogout()
*/
export function AdminHeader({ saldoAkhir, totalPiutang, onToLanding, onLogout }) {
  return (
    <header className="bg-white/95 backdrop-blur px-4 md:px-6 py-5 md:py-6 border-b border-gray-100 no-print sticky top-0 z-30" role="banner">
      <div className="flex justify-between items-start md:items-center flex-wrap gap-3">
        <h1 className="text-lg md:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">BAKSO.APP</h1>
        <div className="text-right min-w-[140px]">
          <p className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-widest">Kas Tunai</p>
          <p className="text-base md:text-xl font-bold font-mono">{formatRupiah(saldoAkhir)}</p>
        </div>
      </div>
      {totalPiutang > 0 && (
        <div className="mt-3 bg-red-50 border border-red-100 p-2 rounded flex items-center gap-2 text-[11px] md:text-xs text-red-600" role="alert" aria-live="polite">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>Ada piutang belum tertagih: <b>{formatRupiah(totalPiutang)}</b></span>
        </div>
      )}
      <div className="mt-3 flex justify-between items-center gap-4">
        <button
          onClick={onToLanding}
          className="text-[10px] md:text-[11px] uppercase tracking-widest font-bold text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-black rounded"
        >Ke Landing</button>
        <button
          onClick={onLogout}
          className="text-[10px] md:text-[11px] uppercase tracking-widest font-bold text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
        >Logout</button>
      </div>
    </header>
  );
}
