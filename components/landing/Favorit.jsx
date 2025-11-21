import React from 'react';
import { formatRupiah } from '../../utils/formatRupiah';

export function Favorit({ highlight }) {
  return (
    <section id="favorit" className="space-y-6">
      <h2 className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400">Pilihan Favorit</h2>
      <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-center">
        {highlight.map(h => (
          <div key={h.id} className="animated-card bg-white rounded-2xl p-4 w-full md:w-60 shadow-sm hover:shadow-xl transition relative">
            {h.images && h.images[0] && <img src={h.images[0]} alt={h.name} className="w-full h-32 object-cover rounded-xl mb-3" />}
            <h3 className="font-bold text-sm md:text-base line-clamp-2">{h.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{formatRupiah(h.price)}</p>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-[10px] ${i < Math.round(h.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
              ))}
              <span className="text-[10px] font-bold text-gray-500 ml-1">{h.rating?.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
