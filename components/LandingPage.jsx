import React, { useMemo, useState, useEffect } from 'react';
import { Navbar } from './landing/Navbar';
import { Hero } from './landing/Hero';
import { PromoScroller } from './landing/PromoScroller';
import { Testimonials } from './landing/Testimonials';
import { Packages } from './landing/Packages';
import { CartDrawer } from './CartDrawer';
import Footer from './landing/Footer';
import { FAQ } from './landing/FAQ';
import { FloatingWhatsApp } from './landing/FloatingWhatsApp';

export function LandingPage({
  products,
  customerOrder,
  setCustomerOrder,
  pendingOrder,
  paymentMethodPublic,
  setPaymentMethodPublic,
  paymentSuccess,
  startPublicOrder,
  confirmPublicPayment
}) {
  const sliderImages = useMemo(() => {
    const imgs = [];
    products.forEach(p => Array.isArray(p.images) && p.images.forEach(i => imgs.push(i)));
    return imgs.slice(0,12);
  }, [products]);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredProducts = products.filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const [dealRemaining, setDealRemaining] = useState('');
  useEffect(() => {
    const target = new Date();
    target.setHours(21,0,0,0);
    const tick = () => {
      const now = new Date();
      let diff = target - now;
      if (diff < 0) diff = 0;
      const h = String(Math.floor(diff/3600000)).padStart(2,'0');
      const m = String(Math.floor(diff%3600000/60000)).padStart(2,'0');
      const s = String(Math.floor(diff%60000/1000)).padStart(2,'0');
      setDealRemaining(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick,1000);
    return () => clearInterval(id);
  }, []);

  // Hardcoded paketList dihapus; kini memakai data products langsung.

  // Tilt logic removed (discover section removed)

  return (
    <div className="w-full mx-auto min-h-screen flex flex-col px-4 md:px-8 lg:px-12 xl:px-20">
      <Navbar />
      <main className="pt-20 space-y-20">
        <Hero dealRemaining={dealRemaining} sliderImages={sliderImages} />
        <div className="-mx-4 md:-mx-8 lg:-mx-12 xl:-mx-20">
          <div id="promo">
            <PromoScroller
              className="relative overflow-hidden w-full rounded-none border-y border-pink-100 bg-gradient-to-r from-orange-50 via-pink-50 to-yellow-50 shadow-inner"
              promos={[
                { emoji: '🔥', text: 'Bakso Full Daging Tanpa Pengawet' },
                { emoji: '✅', text: '100% Halal & Higienis' },
                { emoji: '🥶', text: 'Vakum Frozen Menjaga Kaldu' },
                { emoji: '💪', text: 'Protein Padat, Serat Nyata' },
                { emoji: '⭐', text: 'Rating Pelanggan Tinggi' },
                { emoji: '🚚', text: 'Pengiriman Cold Chain Aman' },
                { emoji: '🎁', text: 'Paket Keluarga Hemat' },
                { emoji: '♻️', text: 'Repeat Order 70%+' }
              ]}
              speed={55}
            />
          </div>
        </div>
        <Testimonials />
        <Packages products={products} />
        <CartDrawer />
        <FAQ />
        <Footer />
      </main>
      <FloatingWhatsApp />
    </div>
  );
}
