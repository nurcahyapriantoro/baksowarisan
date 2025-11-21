import React, { useEffect, useRef } from 'react';

// AnimatedBackground: layer partikel lembut di belakang konten.
// Menggunakan canvas + requestAnimationFrame, jumlah partikel dibatasi agar ringan.
export function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const computeSize = () => {
      const doc = document.documentElement;
      const w = window.innerWidth;
      const h = Math.max(window.innerHeight, doc.scrollHeight);
      canvas.width = w; canvas.height = h; return { w, h };
    };
    let { w: width, h: height } = computeSize();

    const onResize = () => { const sz = computeSize(); width = sz.w; height = sz.h; };
    const onScroll = () => { const sz = computeSize(); width = sz.w; height = sz.h; };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    const COLORS = ['#fb923c','#f472b6','#fcd34d','#fde68a','#fdba74'];
    const PARTICLE_COUNT = 45; // cukup sedikit
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const r = Math.random() * 40 + 20;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.25 + 0.05,
        pulse: Math.random() * Math.PI * 2
      };
    });

    let rafId;
    const draw = () => {
      ctx.clearRect(0,0,width,height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy; p.pulse += 0.005;
        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;
        const scale = (Math.sin(p.pulse) + 1) / 2 * 0.4 + 0.8;
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, p.r * 0.1, p.x, p.y, p.r);
        grad.addColorStop(0, p.color + 'CC');
        grad.addColorStop(1, p.color + '00');
        ctx.fillStyle = grad;
        ctx.globalAlpha = p.alpha * scale;
        ctx.arc(p.x, p.y, p.r * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-full -z-30 pointer-events-none opacity-[0.5]"
      style={{ height: '100%' }}
    />
  );
}