import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Snowflake, Truck, Sandwich, FlameKindling } from 'lucide-react';

// Struktur data FAQ kategori -> daftar Q/A
const FAQ_SECTIONS = [
  {
    kode: 'A',
    judul: 'Tentang Produk & Kualitas',
    fokus: 'Meyakinkan rasa dan kehalalan',
    items: [
      {
        q: 'Baksonya terbuat dari daging apa? Halal nggak kak?',
        a: '100% daging sapi segar pilihan. Proses & bahan 100% halal: tanpa babi, minyak babi, alkohol. Higienis & aman untuk keluarga.'
      },
      {
        q: 'Teksturnya gimana? Kebanyakan tepung nggak?',
        a: 'Prinsip kami: Full daging, bukan full tepung. Rasio daging dominan → gigitan berserat, juicy, bukan lembek seperti cilok.'
      },
      {
        q: 'Apakah pakai bahan pengawet?',
        a: 'Tidak. Tanpa pengawet & tanpa MSG berlebih. Tahan karena teknik pembekuan (frozen) + kemasan vakum hampa udara.'
      }
    ]
  },
  {
    kode: 'B',
    judul: 'Penyimpanan & Daya Tahan',
    fokus: 'Edukasi keamanan produk',
    items: [
      {
        q: 'Baksonya tahan berapa lama?',
        a: 'Freezer -18°C: 1–2 bulan (disarankan). Chiller: 3–5 hari. Suhu ruang: max 24 jam. Segera masukkan freezer jika tidak langsung dimasak.'
      },
      {
        q: 'Kalau sudah dibuka kemasannya, harus diapain?',
        a: 'Sebaiknya langsung dihabiskan. Sisa? Simpan wadah tertutup rapat (Tupperware) dan kembali ke freezer secepatnya.'
      }
    ]
  },
  {
    kode: 'C',
    judul: 'Pengiriman & Garansi',
    fokus: 'Menghilangkan rasa takut barang rusak/basi',
    items: [
      {
        q: 'Pengiriman ke luar kota aman nggak? Takut basi di jalan.',
        a: 'Aman. Cold Chain Packing: vakum nylon, bubble wrap, ice gel, kardus/Styrofoam. Tetap dingin 2–3 hari perjalanan.'
      },
      {
        q: 'Ada garansi kalau pas sampai ternyata basi?',
        a: 'Garansi 100% ganti baru. Jika rusak/basi ≤3 hari perjalanan karena kami/ekspedisi, kirim video unboxing ke WhatsApp → kirim ulang GRATIS.'
      }
    ]
  },
  {
    kode: 'D',
    judul: 'Cara Penyajian',
    fokus: 'Kemudahan & praktis',
    items: [
      {
        q: 'Cara masaknya ribet nggak?',
        a: 'Praktis 5 menit: keluarkan sebentar, didihkan kuah, masukkan bakso beku, rebus 3–5 menit sampai mengapung. Sajikan dengan bumbu & sambal.'
      },
      {
        q: 'Apakah setiap pembelian sudah dapat bumbu kuah?',
        a: 'Paket Keluarga & Stok Bulanan: termasuk bumbu kuah + sambal. Paket Coba: bumbu add-on opsional saat checkout.'
      }
    ]
  }
];

export function FAQ() {
  const [openId, setOpenId] = useState(null); // id gabungan kode+index
  const toggle = (id) => setOpenId(o => o === id ? null : id);

  // Mapping kategori ke ikon dekoratif
  const iconFor = (kode) => {
    // use explicit color and strokeWidth to ensure visibility across backgrounds
    if (kode === 'A') return <ShieldCheck size={18} color="#ffffff" strokeWidth={1.8} />;
    if (kode === 'B') return <Snowflake size={18} color="#ffffff" strokeWidth={1.6} />;
    if (kode === 'C') return <Truck size={18} color="#ffffff" strokeWidth={1.6} />;
    if (kode === 'D') return <FlameKindling size={18} color="#ffffff" strokeWidth={1.6} />;
    return <Sandwich size={18} color="#ffffff" strokeWidth={1.6} />;
  };

  return (
    <section id="faq" className="relative max-w-5xl mx-auto py-12">
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-white via-pink-50/40 to-orange-50/40" />
      <h2 className="text-center mb-2 font-extrabold text-[11px] md:text-sm tracking-widest uppercase text-gray-500">Pertanyaan Umum (FAQ)</h2>
      <p className="text-center mb-8 text-[11px] md:text-xs font-semibold text-orange-700">Bakso Warisan Mbah Jambul • Asli resep keluarga sejak dulu</p>
      <div className="space-y-10">
        {FAQ_SECTIONS.map(section => (
          <div key={section.kode} className="space-y-4">
            <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 shadow ring-2 ring-white">
                        {iconFor(section.kode)}
                      </div>
              <div>
                <h3 className="font-extrabold text-sm md:text-base text-gray-800 tracking-tight">{section.kode}. {section.judul}</h3>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-pink-600">{section.fokus}</p>
              </div>
            </div>
            <div className="space-y-3">
              {section.items.map((item, i) => {
                const id = section.kode + '-' + i;
                const isOpen = openId === id;
                return (
                  <div
                    key={id}
                    className={`group rounded-xl border backdrop-blur-sm transition overflow-hidden ${isOpen ? 'border-pink-400 shadow-lg shadow-pink-100' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'} bg-white/90`}
                  >
                    <button
                      onClick={() => toggle(id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-6 px-5 py-4 text-left focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <span className="font-semibold text-sm md:text-[15px] text-gray-800 leading-snug flex-1">{item.q}</span>
                      <ChevronDown size={18} className={`shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-pink-500' : 'group-hover:text-gray-600'}`} />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} px-5`}
                      aria-hidden={!isOpen}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-0 pb-5 text-[12px] md:text-[13px] leading-relaxed text-gray-600">
                          {item.a}
                        </div>
                      </div>
                    </div>
                    {isOpen && <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
