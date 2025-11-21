import React, { useEffect } from 'react';

// ImageLightbox: modal overlay menampilkan carousel gambar produk.
// Props: images (array base64/string), index (awal), onClose(), onChange(newIndex)
export function ImageLightbox({ images = [], index = 0, onClose, onChange }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, images.length, onClose, onChange]);

  if (!images.length) return null;
  const current = images[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-xs font-bold bg-white/10 hover:bg-white/20 rounded px-3 py-2">Tutup ✕</button>
      <div className="w-full max-w-3xl px-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {current ? (
            <img src={current} alt={'foto '+(index+1)} className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="text-white text-xs">Tidak ada gambar</div>
          )}
          <button onClick={() => onChange((index - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center">‹</button>
          <button onClick={() => onChange((index + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center">›</button>
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {images.map((img,i) => (
            <button key={i} onClick={() => onChange(i)} className={`shrink-0 border ${i===index?'border-pink-500':'border-transparent'} rounded-md bg-gray-100 w-20 h-14 overflow-hidden`}>
              <img src={img} alt={'thumb '+(i+1)} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
