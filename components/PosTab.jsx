import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatRupiah } from '../utils/formatRupiah';

/* PosTab: Kasir internal admin
   Props:
     orderForm, setOrderForm
     products
     addTransaksi()
     transaksi
*/
export function PosTab({ orderForm, setOrderForm, products, addTransaksi, transaksi }) {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Order Form */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Buat Pesanan</h2>
        <input
          type="text"
          placeholder="Nama Pembeli"
          value={orderForm.customer}
          onChange={e => setOrderForm({ ...orderForm, customer: e.target.value })}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-black text-sm font-medium"
        />
        <div className="flex gap-2">
          <select
            value={orderForm.productId}
            onChange={e => setOrderForm({ ...orderForm, productId: e.target.value })}
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-black text-sm appearance-none"
          >
            <option value="">-- Pilih Produk --</option>
            {products.map(p => (
              <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                {p.name} — {formatRupiah(p.price)} {p.stock <= 0 ? '(Habis)' : `(Sisa: ${p.stock})`}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={orderForm.qty}
            min="1"
            onChange={e => setOrderForm({ ...orderForm, qty: e.target.value })}
            className="w-16 p-3 bg-gray-50 border border-gray-200 rounded text-center text-sm font-bold"
          />
        </div>
        <select
          value={orderForm.status}
          onChange={e => setOrderForm({ ...orderForm, status: e.target.value })}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded text-sm"
        >
          <option value="Lunas">Bayar Lunas</option>
          <option value="Belum Lunas">Hutang (Catat di Piutang)</option>
        </select>
        <button
          onClick={addTransaksi}
          className="w-full bg-black text-white py-4 rounded font-bold uppercase tracking-widest text-xs hover:bg-gray-800 flex justify-center items-center gap-2 shadow-lg shadow-gray-200"
        >
          <ShoppingBag size={16} /> Proses Pesanan
        </button>
      </div>
      {/* Recent Orders */}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Transaksi Terakhir</h3>
        <div className="space-y-3">
          {transaksi.slice().reverse().slice(0, 5).map(t => (
            <div key={t.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <div>
                <p className="font-bold">{t.customer}</p>
                <p className="text-xs text-gray-500">{t.qty}x {t.productName}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold">{formatRupiah(t.total)}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${t.status === 'Lunas' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
