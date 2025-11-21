import React from 'react';
import { ProductSlider } from '../ProductSlider';

export function Hero({ dealRemaining, sliderImages }) {
  const scrollToPackages = () => {
    document.getElementById('paket-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section id="hero" className="relative pt-4 md:pt-10">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 rounded-3xl" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="space-y-5 max-w-xl">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 animate-pulse-slow">Bakso Warisan Mbah Jambul</span><br />
            <span className="text-gray-900">Asli resep keluarga sejak dulu</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">Racikan turun-temurun—daging sapi pilihan berserat, tanpa pengawet, gurih kaldu alami. Cukup rebus 5 menit, nikmati sensasi bakso jadul yang hangat & nendang.</p>
          <ul className="grid grid-cols-2 gap-2 text-[11px] md:text-xs font-semibold text-gray-700">
            <li className="flex items-center gap-1">✅ Resep Keluarga Otentik</li>
            <li className="flex items-center gap-1">✅ Full Daging Berserat</li>
            <li className="flex items-center gap-1">✅ Vakum Frozen Higienis</li>
            <li className="flex items-center gap-1">✅ Siap Saji 5 Menit</li>
          </ul>
          <div className="flex gap-3 pt-1">
            <button onClick={scrollToPackages} className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-pink-600 text-white text-xs md:text-sm font-bold tracking-wide shadow hover:shadow-lg transition">Pesan Sekarang • Coba Rasa Aslinya</button>
            <button onClick={scrollToPackages} className="px-6 py-3 rounded-full bg-white text-gray-700 border border-gray-200 text-xs md:text-sm font-bold tracking-wide hover:border-gray-300 transition">Lihat Paket Keluarga</button>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-500 pt-1">
            <span className="bg-white border border-gray-200 px-2 py-1 rounded">Tanpa Pengawet</span>
            <span className="bg-white border border-gray-200 px-2 py-1 rounded">Halal</span>
            <span className="bg-white border border-gray-200 px-2 py-1 rounded">Kaldu Alami</span>
            <span className="bg-white border border-gray-200 px-2 py-1 rounded">Repeat Order Tinggi</span>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <ProductSlider images={sliderImages} />
        </div>
      </div>
    </section>
  );
}
