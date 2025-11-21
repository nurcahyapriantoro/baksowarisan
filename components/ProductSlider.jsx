import React, { useEffect, useState, useCallback } from 'react';

/* ProductSlider: menampilkan kumpulan gambar produk dalam bentuk slider otomatis.
   Props:
     images: array string (dataURL/base64)
*/
export function ProductSlider({ images = [] }) {
  const safeImages = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const len = safeImages.length;
  const next = useCallback(() => setIndex(i => (i + 1) % len), [len]);
  const prev = useCallback(() => setIndex(i => (i - 1 + len) % len), [len]);

  useEffect(() => {
    if (len <= 1) return; // Tidak perlu autoplay jika hanya 0/1 gambar
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [next, len]);

  if (len === 0) {
    return (
      <div className="h-48 md:h-64 w-full flex items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <p className="text-xs md:text-sm text-gray-400 font-bold tracking-widest">Belum ada foto produk</p>
      </div>
    );
  }

  return (
    <div className="relative select-none">
      <div className="h-48 md:h-64 w-full overflow-hidden rounded-[2.2rem] border border-gray-100 shadow-lg bg-white">
        {safeImages.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 ease-out ${i === index ? 'opacity-100 scale-100' : 'opacity-0 scale-102'}`}
          >
            <img
              src={src}
              alt={'slide-'+i}
              className="h-full w-full object-cover rounded-[2.2rem]"
              draggable={false}
            />
            <div className="absolute inset-0 rounded-[2.2rem] ring-1 ring-black/5 pointer-events-none" />
          </div>
        ))}

        {/* Minimal indicators (subtle, bottom-right) */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {safeImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={'Ke slide '+(i+1)}
              className={`h-2 w-2 rounded-full transition-all ${i === index ? 'bg-orange-500 scale-110' : 'bg-white/70'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}