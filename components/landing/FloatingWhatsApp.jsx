import React from 'react';

const STORAGE_KEY_ADMIN_WA = 'bakso_admin_whatsapp';
const DEFAULT_WHATSAPP_NUMBER = '6285117208660';

export function FloatingWhatsApp() {
  const admin = (typeof window !== 'undefined') ? (localStorage.getItem(STORAGE_KEY_ADMIN_WA) || DEFAULT_WHATSAPP_NUMBER) : DEFAULT_WHATSAPP_NUMBER;
  const target = admin && admin.length ? admin.replace(/[^0-9+]/g,'') : DEFAULT_WHATSAPP_NUMBER;
  const text = encodeURIComponent('Halo, saya ingin melakukan Custom Order. Bisa dibantu?');
  const href = `https://wa.me/${target}?text=${text}`;

  return (
    <a href={href} aria-label="Custom Order via WhatsApp" className="fixed bottom-5 right-5 z-40 group">
      <div className="flex items-center gap-3 px-4 py-2 md:px-5 md:py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-full shadow-2xl hover:scale-[1.03] transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-sm md:text-base font-semibold">Custom Order</span>
          <span className="text-[11px] md:text-xs opacity-90">Pesan sesuai keinginan — cepat & mudah</span>
        </div>
      </div>
    </a>
  );
}

export default FloatingWhatsApp;
