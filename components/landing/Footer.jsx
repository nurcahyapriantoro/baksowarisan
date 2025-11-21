import React from 'react';

const SHIPPING_LOGOS = [
  '/Images/anteraja.png',
  '/Images/jne.jpg',
  '/Images/jnt.jpg',
  '/Images/sicepat.png',
  '/Images/grabfood.png',
  '/Images/shopeefood.jpg',
  '/Images/gofood.png'
];

const PAYMENT_LOGOS = [
  '/Images/BCA.png',
  '/Images/BNI.png',
  '/Images/GOPAY.jpg',
  '/Images/QRIS.png',
  '/Images/SHOPEEPAY.png'
];

// bakso background moved to global component `BaksoBackground.jsx`

export function Footer() {
  return (
    <footer className="mt-12 border-t border-transparent text-gray-800 relative overflow-hidden">
      <style>{`
        :root{--muted:#f3f4f6;--accent-from:#fff7ed;--accent-to:#f1f9ff}
        .footer-bg{background: linear-gradient(180deg, var(--accent-from) 0%, #fff 36%, var(--accent-to) 100%);} 
        .footer-pattern{background-image: linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px); background-size: 40px 40px;}
        .footer-accent {position:absolute; right:-80px; top:-60px; width:360px; height:360px; background: radial-gradient(circle at 30% 30%, rgba(255,200,150,0.12), transparent 30%), radial-gradient(circle at 70% 70%, rgba(125,211,252,0.06), transparent 30%); filter: blur(28px); transform: rotate(10deg);}
        /* bakso background moved to global component 'BaksoBackground.jsx' */
        @keyframes fadeUp {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .animate-fade-up{animation:fadeUp 640ms cubic-bezier(.2,.9,.3,1) both}
        .logo-card{background:white;border:1px solid rgba(15,23,42,0.04);border-radius:10px;padding:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(10,15,30,0.04);}
        .logo-card img{max-height:40px;object-fit:contain}
        .payment-card{background:white;border:1px solid rgba(15,23,42,0.04);border-radius:10px;padding:8px 12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(10,15,30,0.03)}
        .payment-card img{max-height:34px}
        .muted{color: #6b7280}
      `}</style>

      <div className="footer-bg footer-pattern">
        <div className="footer-accent" aria-hidden />
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 animate-fade-up" style={{animationDelay:'80ms'}}>
              <div>
                <h4 className="text-2xl font-extrabold">Bakso Warisan Mbah Jambul</h4>
                <p className="text-sm md:text-base text-gray-600">Asli resep keluarga sejak dulu • Gurih hangat turun-temurun.</p>
              </div>

              <p className="text-sm md:text-base text-gray-600">Kami menghadirkan bakso sapi berkualitas dengan pengemasan steril dan rantai dingin untuk menjaga rasa dan kesegaran. Pilih paket hemat atau buat pesanan custom sesuai selera keluarga Anda.</p>

              <div className="flex gap-3 items-center mt-4">
                <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-3 hover:shadow-lg transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3 8 4-16 3 8h4"/></svg>
                  <div className="text-sm">Siap kirim cepat & aman</div>
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-3 hover:shadow-lg transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.656 1.567-3 3.5-3s3.5 1.344 3.5 3v3H12v-3z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8v8a2 2 0 002 2h8"></path></svg>
                  <div className="text-sm">Pembayaran & konfirmasi mudah</div>
                </div>
              </div>
            </div>

            <div id="kontak" className="space-y-4 animate-fade-up" style={{animationDelay:'160ms'}}>
              <h5 className="font-extrabold text-lg md:text-xl">Hubungi Kami</h5>
              <div className="text-sm md:text-base text-gray-600 space-y-2">
                <div><span className="font-semibold">Alamat:</span> Perumahan Puri Bukit Depok</div>
                <div><span className="font-semibold">Telepon/WA:</span> <a className="text-orange-600 font-semibold" href="tel:+6285117208660">+62 851-1720-8660</a></div>
                <div><span className="font-semibold">Jam Operasional:</span> Senin–Minggu, 08:00–20:00</div>
                <div className="pt-2">
                  <a className="inline-flex items-center gap-3 px-4 py-2 bg-orange-50 text-orange-700 rounded-full hover:shadow-md transition"> 
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3"/></svg>
                    <span className="text-sm font-semibold">Tanya Stok & Promo</span>
                  </a>
                </div>
              </div>

              <div className="mt-3">
                <h6 className="text-sm font-semibold mb-3">Kami tersedia di</h6>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SHIPPING_LOGOS.map((src, i) => (
                    <div key={i} className="logo-card hover:shadow-md transition-transform transform hover:-translate-y-0.5" style={{animationDelay:`${220 + i*20}ms`}}>
                      <img src={src} alt={`cargo-${i}`} className="max-w-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h6 className="text-sm font-semibold mb-3">Metode Pembayaran</h6>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 items-center">
                  {PAYMENT_LOGOS.map((src, i) => (
                    <div key={i} className="payment-card" style={{animationDelay:`${320 + i*20}ms`}}>
                      <img src={src} alt={`payment-${i}`} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs muted">Pembayaran melalui rekening bank, e-wallet, dan QRIS. Konfirmasi otomatis setelah bukti pembayaran diterima.</div>
              </div>
            </div>

            <div className="space-y-4 animate-fade-up" style={{animationDelay:'220ms'}}>
              <h5 className="font-extrabold text-lg md:text-xl">Lokasi & Peta</h5>
              <div className="w-full h-56 md:h-64 rounded overflow-hidden shadow-inner">
                <iframe
                  title="Peta Lokasi Bakso Warisan Mbah Jambul"
                  src="https://www.google.com/maps?q=Perumahan%20Puri%20Bukit%20Depok&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="mt-2 text-sm md:text-base text-gray-600">Cepat antar ke area Depok & sekitarnya. Pilih kurir favorit Anda saat checkout.</div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm md:text-base text-gray-600">© {new Date().getFullYear()} Bakso Warisan Mbah Jambul — Asli resep keluarga sejak dulu.</div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Terima kasih telah mendukung usaha lokal.</div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Terpercaya</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Pengiriman Cold Chain</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
