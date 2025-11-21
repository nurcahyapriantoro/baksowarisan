import React from 'react';

// MultiLayerBackground: bentuk-bentuk dekoratif animasi (blob) tambahan.
// Menggunakan div absolutely positioned dengan animasi CSS.
export function MultiLayerBackground() {
  const blobs = Array.from({ length: 9 });
  return (
    <div className="fixed inset-0 -z-40 pointer-events-none">
      {blobs.map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full mix-blend-plus-lighter animate-blob`}
          style={{
            width: `${180 + Math.random()*160}px`,
            height: `${180 + Math.random()*160}px`,
            top: `${Math.random()*80}%`,
            left: `${Math.random()*80}%`,
            background: `radial-gradient(circle at 30% 30%, rgba(255,140,0,0.4), rgba(255,0,128,0.15))`,
            animationDelay: `${i * 2}s`
          }}
        />
      ))}
    </div>
  );
}