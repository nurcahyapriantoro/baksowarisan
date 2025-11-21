import React from 'react';

export function Guarantee() {
  const scrollToPackages = () => document.getElementById('paket-section')?.scrollIntoView({behavior:'smooth'});
  return (
    <section id="garansi">
      <div className="animated-card bg-white rounded-2xl p-6 md:p-8 shadow-sm max-w-3xl mx-auto text-center space-y-3">
        <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400">Garansi Aman</h2>
        <p className="text-sm md:text-base text-gray-700">Garansi Segar & Aman — Jika produk tiba rusak / berbau, kami kirim ulang <span className="font-bold">GRATIS</span> tanpa debat.</p>
        <button onClick={scrollToPackages} className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-pink-600 text-white text-xs md:text-sm font-bold tracking-wide shadow hover:shadow-lg transition">Pesan Sekarang</button>
      </div>
    </section>
  );
}
