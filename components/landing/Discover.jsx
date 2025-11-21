import React from 'react';
import { formatRupiah } from '../../utils/formatRupiah';

export function Discover({ searchTerm, setSearchTerm, filteredProducts, hoverState, handleMove, handleLeave, customerOrder, setCustomerOrder }) {
  return (
    <section id="discover" className="space-y-6">
      <h2 className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400">Discover Menu</h2>
      <div className="max-w-md mx-auto">
        <input value={searchTerm} onChange={e=> setSearchTerm(e.target.value)} placeholder="Cari menu..." className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-black" />
      </div>
      <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map(p => {
          const tilt = hoverState[p.id] || { x:0, y:0 };
          return (
            <div key={p.id} onMouseMove={(e) => handleMove(e, p.id)} onMouseLeave={() => handleLeave(p.id)} style={{ transform: `perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }} className="group animated-card border border-gray-200 rounded-xl p-4 flex flex-col justify-between bg-white/70 backdrop-blur transition-all duration-300 will-change-transform hover:shadow-2xl hover:border-gray-300 hover:-translate-y-1">
              <div className="space-y-2">
                {p.images && p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-32 object-cover rounded-lg border border-gray-100 shadow-sm group-hover:shadow-md transition-all" />}
                <p className="font-bold text-sm md:text-base leading-tight line-clamp-2 tracking-tight">{p.name}</p>
                <p className="text-[11px] md:text-xs text-gray-500 mt-1 font-medium">{formatRupiah(p.price)}</p>
                <div className="flex items-center gap-[2px]">
                  {Array.from({length:5}).map((_,i)=>(<span key={i} className={`text-[9px] ${i < Math.round(p.rating||0) ? 'text-yellow-500':'text-gray-300'}`}>★</span>))}
                  <span className="text-[9px] font-bold text-gray-400 ml-1">{(p.rating||5).toFixed(1)}</span>
                </div>
                <span className={`inline-block text-[10px] md:text-[11px] px-2 py-1 rounded-full font-bold tracking-wide ${p.stock <= 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>{p.stock <= 0 ? 'Habis' : 'Stok: ' + p.stock}</span>
              </div>
              <button disabled={p.stock <= 0} aria-disabled={p.stock <= 0} onClick={() => setCustomerOrder({ ...customerOrder, productId: p.id, qty: 1 })} className={`mt-4 text-[10px] md:text-[11px] px-3 py-2 rounded font-bold uppercase tracking-widest transition-all ${p.stock <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'}`}>Pilih</button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
