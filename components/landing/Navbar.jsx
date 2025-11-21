import React, { useEffect, useState } from 'react';
import { useCart } from '../../hooks/useCart';

const SECTIONS = [
  ['Home','hero'],
  ['Promo','promo'],
  ['Testimoni','testimoni'],
  ['Paket','paket-section'],
  ['Produk Satuan','produk-section'],
  ['FAQ','faq'],
  ['Kontak','kontak']
];

export function Navbar() {
  const [active, setActive] = useState('hero');
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const scrollToPackages = () => scrollTo('paket-section');

  useEffect(() => {
    const ids = SECTIONS.map(s => s[1]);
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 px-3 md:px-6 lg:px-10 xl:px-16 h-16 bg-white/90 backdrop-blur border-b border-gray-100 z-40 flex items-center">
      <div className="flex items-center w-full gap-4">
        <div className="flex flex-col">
          <div className="font-extrabold shrink-0 text-sm md:text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600">Bakso Warisan Mbah Jambul</div>
          <div className="hidden md:block text-[10px] font-semibold text-gray-500 tracking-wide">Asli resep keluarga sejak dulu</div>
        </div>
        <ul className="hidden lg:flex gap-3 flex-wrap text-[11px] font-semibold">
          {SECTIONS.map(([label,id]) => (
            <li key={id}>
              <button onClick={()=>scrollTo(id)} className={`px-3 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-orange-300 ${active===id ? 'text-orange-600 underline decoration-orange-200 underline-offset-4' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>{label}</button>
            </li>
          ))}
        </ul>
        {/* Mobile scrollable nav */}
        <div className="lg:hidden overflow-x-auto flex gap-2 scrollbar-hide text-[11px] font-semibold text-gray-600">
          {SECTIONS.map(([label,id]) => (
            <button key={id} onClick={()=>scrollTo(id)} className={`px-2 py-1 rounded whitespace-nowrap bg-white/60 hover:bg-gray-100 border border-gray-200 transition ${active===id ? 'ring-2 ring-orange-200' : ''}`}>{label}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3">
            <button onClick={scrollToPackages} className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-600 to-pink-600 text-white text-[11px] font-bold tracking-wide shadow hover:shadow-lg transition">
              Beli Sekarang
            </button>
            <CartIcon />
          </div>
          <div className="md:hidden">
            <CartIcon compact />
          </div>
        </div>
      </div>
    </nav>
  );
}

function CartIcon({ compact }) {
  const { itemCount } = useCart();
  const toggleCart = () => {
    if (typeof window !== 'undefined' && window.__bakso_cart_open) {
      window.dispatchEvent(new Event('bakso_cart_close'));
    } else {
      window.dispatchEvent(new Event('bakso_cart_open'));
    }
  };

  return (
    <button onClick={toggleCart} title="Buka/Tutup Keranjang" className="relative inline-flex items-center gap-2 px-3 py-2 rounded-full transition hover:shadow-lg bg-white/60 hover:bg-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8h14l-2-8M10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
      {!compact && <span className="font-medium text-sm">Keranjang</span>}
      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white rounded-full bg-orange-500">{itemCount}</span>
    </button>
  );
}
