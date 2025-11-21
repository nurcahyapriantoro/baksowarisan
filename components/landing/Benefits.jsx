import React from 'react';

const BENEFITS = [
  ['Daging Premium','Serat nyata & padat—bukan kopong.'],
  ['Kuah Kaldu Asli','Rebusan tulang & rempah—bukan sachet instan.'],
  ['Vakum Frozen','Higienis, aman kirim & tahan lama.'],
  ['Praktis','Dari freezer ke panci—5 menit siap makan.'],
  ['Ekonomis','Rasa konsisten, hemat dibanding jajan random.'],
  ['Stok Aman','Siap setiap waktu tanpa keluar rumah.']
];

export function Benefits() {
  const scrollToPackages = () => document.getElementById('paket-section')?.scrollIntoView({behavior:'smooth'});
  return (
    <section id="benefits" className="space-y-8">
      <h2 className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400">Kenapa Ini Solusi</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {BENEFITS.map((b,i)=>(
          <div key={i} className="animated-card bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition">
            <h3 className="font-bold text-sm mb-1">{b[0]}</h3>
            <p className="text-[11px] text-gray-600 leading-relaxed">{b[1]}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button onClick={scrollToPackages} className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-pink-600 text-white text-xs md:text-sm font-bold tracking-wide shadow hover:shadow-lg transition">Lihat Rincian Paket »</button>
      </div>
    </section>
  );
}
