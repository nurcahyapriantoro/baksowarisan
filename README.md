# Bakso App

Aplikasi sederhana manajemen penjualan & keuangan usaha bakso (React + Vite + React Router). Mendukung pemesanan publik, dashboard admin (kasir, stok, arus kas, piutang), serta penyimpanan data lokal via `localStorage`.

## Fitur Utama
- Landing page publik (pesan & bayar) dengan metode: Cash / QRIS / Transfer.
- Dashboard admin (via route `/admin`, login password sederhana) berisi:
  - Kasir (POS) transaksi cepat potong stok otomatis.
  - Manajemen produk & stok (tambah / hapus / adjust stok).
  - Arus kas: catat pengeluaran, modal awal, export CSV.
  - Piutang: monitor transaksi belum lunas & tandai lunas.
- Transaksi menyimpan `paymentMethod` dan `source` (pos | online) untuk analitik nanti.
- Persistensi data memakai custom hook `useStickyState` (localStorage).
- Desain mobile-first dengan peningkatan responsif untuk tablet & desktop.
- Paket bundling bakso dinamis: otomatis dibuat pertama kali via `initBaksoBundles()` dan disimpan di `localStorage` key `bakso_bundle_packages_v1` tanpa hardcode di komponen. Dapat diedit manual atau lewat UI yang akan ditambahkan.

## Menjalankan Secara Lokal
```powershell
# Install dependencies
npm install

# Jalankan dev (hanya lokal mesin)
npm run dev

# Jalankan dev mode + akses LAN (perangkat lain di jaringan Wi-Fi)
npm run dev:host
```
Setelah jalan, buka URL yang muncul (misal `http://localhost:5173`).

Mengakses Admin Panel:
- Buka langsung `http://localhost:5173/admin`.
- Masukkan password default: `baksonisa123`.
- Setelah login berhasil tab navigasi POS / Products / Cashflow / Debts muncul.

Jika memakai `dev:host` Anda akan melihat alamat IP LAN (misal `http://192.168.1.5:5173`). Perangkat lain di jaringan sama bisa membuka alamat tersebut.

> Catatan: Jika tidak bisa diakses dari device lain, periksa firewall Windows dan izinkan Node/Vite listen di jaringan privat.

## Struktur Folder
```
App.jsx               # Orchestrator utama (state global + handler bisnis)
components/           # Komponen terpisah domain (LandingPage, Tabs, Header, Nav)
hooks/useStickyState.js
utils/formatRupiah.js
utils/initBaksoBundles.js   # Generator + helper penyimpanan paket bundling
hooks/useBaksoBundles.js    # Hook CRUD bundling (add/update/delete) sinkron antar tab
index.html            # Entrypoint Vite + Tailwind CDN
main.jsx              # React root render
```

## Responsif & Aksesibilitas
- Container admin melebar hingga `lg:max-w-4xl` untuk layar besar, tetap fokus konten di tengah.
- Landing page memakai grid: 1 kolom (mobile), 2 (≥640px), 3 (≥1024px).
- Typography skala bertahap: `text-sm` → `md:text-base` untuk keterbacaan.
- Navigasi bawah memakai `aria-label="Navigasi dashboard"` dan `aria-current` di tab aktif.
- Tombol utama memiliki states fokus (`focus:ring`) meningkatkan aksesibilitas keyboard.

## Reset Data
Gunakan DevTools (Application → Local Storage) atau di console:
```js
localStorage.clear();
```

## Rencana Pengembangan Berikutnya
- Ekspansi routing tambahan untuk detail produk & laporan mingguan.
- Analitik filter berdasarkan `source` & `paymentMethod`.
- Sistem user / multi-admin & otentikasi aman (hash/JWT + backend).
- Optimisasi PWA (offline + ikon install) agar lebih layak dipakai di perangkat mobile.
- Pengelompokan kategori produk dan pencarian cepat.
- UI admin untuk tambah / edit / hapus paket bundling (memakai hook `useBaksoBundles`).

## Lisensi
Internal / privat (tidak ditentukan). Tambahkan lisensi jika hendak dipublikasikan.
