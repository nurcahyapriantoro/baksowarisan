// Inisialisasi paket bakso dinamis ke localStorage (tanpa hardcode di komponen UI)
// Akan berjalan sekali: jika key sudah ada, fungsi hanya mengembalikan data yang tersimpan.
// Struktur bundle:
// {
//   id: 'bundle-xxx',
//   name: 'Nama Paket',
//   items: [ { name: 'Bakso Urat', qty: 10 }, ... ],
//   tags: ['pedas','keju'],
//   baseValue: <perkiraan hpp total>,
//   price: <harga jual rekomendasi>,
//   description: 'Copywriting menarik',
//   rating: 5,
//   createdAt: 1732147200000,
// }
// Catatan: baseValue & price dihitung algoritmik supaya bisa dikustomisasi manual belakangan oleh admin.

export function initBaksoBundles() {
  const LS_KEY = 'bakso_bundle_packages_v1';
  try {
    const existing = localStorage.getItem(LS_KEY);
    if (existing) {
      return JSON.parse(existing);
    }
  } catch (e) {
    console.warn('Gagal membaca bundle dari localStorage', e);
  }

  // Daftar item dasar (bisa diubah lewat UI di masa depan)
  const baseItems = [
    { key: 'mozza', name: 'Bakso Keju Mozarella', baseHpp: 1200 },
    { key: 'urat', name: 'Bakso Urat', baseHpp: 1000 },
    { key: 'isi_daging', name: 'Bakso Isi Daging', baseHpp: 1400 },
    { key: 'biasa', name: 'Bakso Biasa', baseHpp: 800 },
    { key: 'kuah_ori', name: 'Bumbu Kuah Original', baseHpp: 300 },
    { key: 'kuah_mercon', name: 'Bumbu Kuah Mercon', baseHpp: 350 },
    { key: 'tahu_bakso', name: 'Tahu Bakso', baseHpp: 900 }
  ];

  // Helper untuk hitung HPP total
  const sumHpp = (entries) => entries.reduce((a, c) => {
    const ref = baseItems.find(b => b.name === c.name);
    return a + (ref ? ref.baseHpp * c.qty : 0);
  }, 0);

  // Template paket (komposisi kuantitas)
  const bundleTemplates = [
    {
      name: 'Signature Mozza Urat Fusion',
      items: [
        { name: 'Bakso Keju Mozarella', qty: 8 },
        { name: 'Bakso Urat', qty: 8 },
        { name: 'Bumbu Kuah Original', qty: 2 }
      ],
      tags: ['keju','protein','favorit'],
      description: 'Perpaduan gurih urat & lumer keju dengan kuah original.'
    },
    {
      name: 'Sultan Mercon Feast',
      items: [
        { name: 'Bakso Isi Daging', qty: 10 },
        { name: 'Bakso Biasa', qty: 10 },
        { name: 'Tahu Bakso', qty: 6 },
        { name: 'Bumbu Kuah Mercon', qty: 3 }
      ],
      tags: ['pedas','premium','mercon'],
      description: 'Paket pesta rasa daging padat plus sensasi pedas mercon.'
    },
    {
      name: 'Epic Double Kuah Supreme',
      items: [
        { name: 'Bakso Keju Mozarella', qty: 6 },
        { name: 'Bakso Isi Daging', qty: 6 },
        { name: 'Tahu Bakso', qty: 4 },
        { name: 'Bumbu Kuah Original', qty: 2 },
        { name: 'Bumbu Kuah Mercon', qty: 2 }
      ],
      tags: ['combo','dua-kuah','epic'],
      description: 'Dua sensasi kuah dalam satu paket: original & mercon.'
    },
    {
      name: 'Nusantara Classic Set',
      items: [
        { name: 'Bakso Urat', qty: 10 },
        { name: 'Bakso Biasa', qty: 10 },
        { name: 'Tahu Bakso', qty: 6 },
        { name: 'Bumbu Kuah Original', qty: 2 }
      ],
      tags: ['klasik','hemat','keluarga'],
      description: 'Rasa klasik bakso urat & halus ditemani tahu bakso gurih.'
    },
    {
      name: 'Champion Ultimate Family Pack',
      items: [
        { name: 'Bakso Keju Mozarella', qty: 10 },
        { name: 'Bakso Urat', qty: 10 },
        { name: 'Bakso Isi Daging', qty: 10 },
        { name: 'Bakso Biasa', qty: 10 },
        { name: 'Tahu Bakso', qty: 8 },
        { name: 'Bumbu Kuah Original', qty: 3 },
        { name: 'Bumbu Kuah Mercon', qty: 3 }
      ],
      tags: ['family','ultimate','value'],
      description: 'Semua varian terbaik dalam satu paket lengkap untuk keluarga.'
    }
  ];

  // Bangun final bundle dengan perhitungan harga rekomendasi (markup ±60%)
  const bundles = bundleTemplates.map(t => {
    const baseValue = sumHpp(t.items);
    // Markup menengah; bisa diubah/admin edit nantinya
    const price = Math.round(baseValue * 1.6 / 100) * 100; // dibulatkan ke ratusan
    return {
      id: 'bundle-' + btoa(t.name).replace(/=/g,'').slice(0,10),
      name: t.name,
      items: t.items,
      tags: t.tags,
      baseValue,
      price,
      description: t.description,
      rating: 5,
      createdAt: Date.now()
    };
  });

  try {
    localStorage.setItem(LS_KEY, JSON.stringify(bundles));
  } catch (e) {
    console.warn('Gagal menyimpan bundle ke localStorage', e);
  }
  return bundles;
}

export function getBaksoBundles() {
  try {
    const raw = localStorage.getItem('bakso_bundle_packages_v1');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveBaksoBundles(next) {
  try {
    localStorage.setItem('bakso_bundle_packages_v1', JSON.stringify(next));
  } catch (e) {
    console.warn('Gagal update bundle', e);
  }
}
