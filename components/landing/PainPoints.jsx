import React from 'react';

const POINTS = [
  'Hujan deras pengen bakso panas tapi malas keluar & macet?',
  'Pernah beli bakso “sapi” tapi rasa tepung hambar?',
  'Khawatir kebersihan & cara pengolahan di luar?',
  'Pengen stok bakso enak buat anak pulang sekolah?',
  'Sulit dapat rasa konsisten tiap beli?',
  'Ingin solusi cepat saat lapar malam?'
];

export function PainPoints() {
  return (
    <section id="pain" className="space-y-6">
      <h2 className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400">Sering Alami Ini?</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {POINTS.map((txt, i) => (
          <div key={i} className="animated-card bg-white rounded-xl p-4 text-[11px] md:text-xs font-semibold text-gray-700 shadow-sm hover:shadow-lg transition">{txt}</div>
        ))}
      </div>
      <p className="text-center text-[11px] md:text-sm font-medium text-gray-600">Itulah kenapa <span className="font-semibold text-orange-600">Bakso Warisan Mbah Jambul</span> hadir: cita rasa otentik, higienis, praktis, dan hangat seperti buatan rumah.</p>
    </section>
  );
}
