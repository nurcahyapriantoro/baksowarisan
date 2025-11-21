import React, { useEffect, useRef } from 'react';

// PromoScroller: Horizontal infinite marquee untuk menampilkan badge promo & foto kecil.
// Props: promos (array objek { text, emoji, image })  image optional.
export function PromoScroller({ promos = [], speed = 40, className = '' }) {
  const trackRef = useRef(null);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const totalWidth = el.scrollWidth;
    const animDuration = totalWidth / speed; // detik
    el.style.setProperty('--marquee-duration', animDuration + 's');
  }, [promos, speed]);

  const defaultPromos = [
    { emoji: '🍲', text: 'Resep keluarga otentik' },
    { emoji: '🥩', text: 'Full daging berserat' },
    { emoji: '❄️', text: 'Vakum frozen higienis' },
    { emoji: '⏱️', text: 'Siap saji 5 menit' },
    { emoji: '🔥', text: 'Kaldu gurih alami' },
    { emoji: '🏠', text: 'Hangat seperti buatan rumah' },
    { emoji: '✅', text: 'Tanpa pengawet berbahaya' },
    { emoji: '🔁', text: 'Repeat order tinggi' }
  ];
  const itemsSource = promos.length ? promos : defaultPromos;
  const items = [...itemsSource, ...itemsSource]; // duplikat untuk looping mulus

  const baseClass = "relative overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-r from-orange-50 via-pink-50 to-yellow-50 shadow-inner";
  return (
    <div className={className ? className : baseClass}>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6),transparent_60%)]" />
      <div
        ref={trackRef}
        className="flex w-max animate-marquee gap-6 py-4 px-6">
        {items.map((p,i) => (
          <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-sm hover:shadow-lg transition">
            {p.image && <img src={p.image} alt={p.text} className="w-8 h-8 rounded-full object-cover" />}
            <span className="text-[11px] font-bold tracking-wide text-gray-700 whitespace-nowrap flex items-center gap-1">
              {p.emoji && <span>{p.emoji}</span>}{p.text}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee var(--marquee-duration,40s) linear infinite; }
      `}</style>
    </div>
  );
}
