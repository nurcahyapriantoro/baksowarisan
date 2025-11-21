import React from 'react';

const TESTIMONIALS = [
  ['Rina (Ibu 2 Anak)','“Teksturnya beda, ber-serat. Anak langsung minta tambah.”'],
  ['Andi (Karyawan)','“Pulang kerja tinggal rebus. Rasanya mantap dan bersih.”'],
  ['Dedi (Food Enthusiast)','“Paling berasa dagingnya dibanding merek frozen lain.”']
];

export function Testimonials() {
  return (
    <section id="testimoni" className="space-y-6">
      <h2 className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400">Apa Kata Mereka</h2>
      <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-gray-600">
        <span className="flex items-center gap-1">⭐⭐⭐⭐⭐ <span className="text-gray-500">4.9/5</span></span>
        <span className="bg-white border border-gray-200 px-2 py-1 rounded">&gt;3.500 Paket Terjual</span>
        <span className="bg-white border border-gray-200 px-2 py-1 rounded">70% Repeat Order</span>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t,i)=>(
          <div key={i} className="animated-card bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition">
            <p className="text-[11px] text-gray-600 leading-relaxed italic">{t[1]}</p>
            <p className="mt-2 text-[10px] font-bold text-gray-500">{t[0]} • ⭐⭐⭐⭐⭐</p>
          </div>
        ))}
      </div>
    </section>
  );
}
