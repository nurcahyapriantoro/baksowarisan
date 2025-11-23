// Renamed from index.js to App.jsx to ensure JSX parsing under Vite/React
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatedBackground } from './components/AnimatedBackground';
import { MultiLayerBackground } from './components/MultiLayerBackground';
import { BaksoBackground } from './components/BaksoBackground';
import { useStickyState } from './hooks/useStickyState';
import { fetchProductsFromDB, createProductDB, updateProductDB, deleteProductDB } from './utils/supabaseProducts';
import { LandingPage } from './components/LandingPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminHeader } from './components/AdminHeader';
import { AdminNav } from './components/AdminNav';
import { PosTab } from './components/PosTab';
import { ProductsTab } from './components/ProductsTab';
import { CashflowTab } from './components/CashflowTab';
import { DebtsTab } from './components/DebtsTab';
import { AdminBundles } from './components/AdminBundles';
import { AdminSettings } from './components/AdminSettings';
import WhatsAppOrdersTab from './components/WhatsAppOrdersTab';

/* Orchestrator component (see previous inline docs) */
export default function BaksoFinanceApp() {
  const [activeTab, setActiveTab] = useState('pos');
  const [isAdminAuthed, setIsAdminAuthed] = useStickyState(false, 'bakso_admin_auth');
  // activeView digantikan oleh routing ("/" dan "/admin")
  const [adminPassInput, setAdminPassInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const ADMIN_PASSWORD = 'baksonisa123';


  const [customerOrder, setCustomerOrder] = useState({ customer: '', productId: '', qty: 1 });
  const [pendingOrder, setPendingOrder] = useState(null);
  const [paymentMethodPublic, setPaymentMethodPublic] = useState('Cash');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [products, setProducts] = useStickyState([
    { id: 1, name: 'Bakso Halus (Isi 25)', hpp: 25000, price: 35000, stock: 20, images: [], rating: 4.9 },
    { id: 2, name: 'Bakso Urat (Isi 20)', hpp: 28000, price: 40000, stock: 15, images: [], rating: 4.8 },
  ], 'bakso_products_v2');
  // State untuk gambar baru saat menambah produk
  const [newProdImages, setNewProdImages] = useState([]);
  const [newProd, setNewProd] = useState({ name: '', hpp: '', price: '', stock: '' });
  const [transaksi, setTransaksi] = useStickyState([], 'bakso_transaksi_v2');
  const [orderForm, setOrderForm] = useState({ customer: '', productId: '', qty: 1, status: 'Lunas' });
  const [pengeluaran, setPengeluaran] = useStickyState([], 'bakso_pengeluaran_v2');
  const [modalAwal, setModalAwal] = useStickyState(500000, 'bakso_modal_v2');
  const [newExpense, setNewExpense] = useState({ deskripsi: '', jumlah: '' });

  const kasMasuk = transaksi.filter(t => t.status === 'Lunas').reduce((a, c) => a + c.total, 0);
  const kasKeluar = pengeluaran.reduce((a, c) => a + parseInt(c.jumlah), 0);
  const saldoAkhir = parseInt(modalAwal) + kasMasuk - kasKeluar;
  const totalPiutang = transaksi.filter(t => t.status === 'Belum Lunas').reduce((a, c) => a + c.total, 0);

  const confirmPublicPayment = () => {
    if (!pendingOrder) return;
    const prod = products.find(p => p.id === pendingOrder.productId);
    if (!prod || prod.stock < pendingOrder.qty) { alert('Stok habis saat konfirmasi'); return; }
    setProducts(products.map(p => p.id === prod.id ? { ...p, stock: p.stock - pendingOrder.qty } : p));
    const profit = (pendingOrder.qty * pendingOrder.price) - (pendingOrder.qty * prod.hpp);
    const trx = { id: Date.now(), date: new Date().toISOString().split('T')[0], customer: pendingOrder.customer, productName: pendingOrder.productName, qty: pendingOrder.qty, price: pendingOrder.price, total: pendingOrder.total, profit, status: 'Lunas', paymentMethod: paymentMethodPublic, source: 'online' };
    setTransaksi(prev => [...prev, trx]);
    setPaymentSuccess(true); setPendingOrder(null); setTimeout(() => setPaymentSuccess(false), 4000);
  };
  const startPublicOrder = () => {
    if (!customerOrder.customer || !customerOrder.productId) { alert('Isi nama dan pilih produk'); return; }
    const prod = products.find(p => p.id === parseInt(customerOrder.productId));
    if (!prod || prod.stock < customerOrder.qty) { alert('Stok tidak cukup'); return; }
    setPendingOrder({ id: Date.now(), customer: customerOrder.customer, productId: prod.id, productName: prod.name, qty: parseInt(customerOrder.qty), price: prod.price, total: parseInt(customerOrder.qty) * prod.price });
  };
  const navigate = useNavigate();
  const attemptLogin = () => {
    if (adminPassInput === ADMIN_PASSWORD) {
      setIsAdminAuthed(true);
      setLoginError('');
      setAdminPassInput('');
      navigate('/admin');
    } else setLoginError('Password salah');
  };
  const logoutAdmin = () => {
    setIsAdminAuthed(false);
    setActiveTab('pos');
    navigate('/');
  };
  const addProduct = () => {
    if (!newProd.name) return;
    // create in supabase and update local state
    (async () => {
      try {
        const prodPayload = { name: newProd.name, hpp: parseInt(newProd.hpp) || 0, price: parseInt(newProd.price) || 0, stock: parseInt(newProd.stock) || 0 };
        console.log('Creating product', prodPayload);
        const created = await createProductDB(prodPayload, newProdImages[0]);
        setProducts(prev => [created, ...prev]);
        setNewProd({ name: '', hpp: '', price: '', stock: '' });
        setNewProdImages([]);
      } catch (err) {
        console.error('Create product failed', err);
        const message = err?.message || JSON.stringify(err);
        alert('Gagal menambahkan produk: ' + message + '\nLihat console/network untuk detail.');
      }
    })();
  };
  const deleteProduct = id => {
    if (!confirm('Hapus produk ini?')) return;
    (async () => {
      try {
        // if id looks like uuid, attempt delete in DB
        if (typeof id === 'string' && id.includes('-')) await deleteProductDB(id);
      } catch (err) {
        console.error('Delete product failed', err);
        alert('Gagal menghapus di server, masih dihapus lokal');
      }
      setProducts(prev => prev.filter(p => p.id !== id));
    })();
  };

  const updateStock = (id, amount) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: p.stock + amount } : p));
    // try to persist to DB if product exists there (uuid)
    (async () => {
      try {
        const prod = products.find(p => p.id === id);
        if (!prod) return;
        const newStock = prod.stock + amount;
        if (typeof id === 'string' && id.includes('-')) {
          await updateProductDB(id, { stock: newStock });
        }
      } catch (err) {
        console.error('Update stock failed', err);
      }
    })();
  };

  // Fetch products from Supabase on mount and replace local products if available
  useEffect(() => {
    (async () => {
      try {
        const remote = await fetchProductsFromDB();
        if (Array.isArray(remote) && remote.length > 0) setProducts(remote);
      } catch (err) {
        console.warn('Could not fetch remote products', err);
      }
    })();
  }, []);
  const addTransaksi = () => {
    if (!orderForm.customer || !orderForm.productId) { alert('Lengkapi data'); return; }
    const product = products.find(p => p.id === parseInt(orderForm.productId));
    if (!product || product.stock < orderForm.qty) { alert('Stok tidak cukup'); return; }
    setProducts(products.map(p => p.id === product.id ? { ...p, stock: p.stock - parseInt(orderForm.qty) } : p));
    const total = parseInt(orderForm.qty) * product.price; const profit = total - (parseInt(orderForm.qty) * product.hpp);
    setTransaksi([...transaksi, { id: Date.now(), date: new Date().toISOString().split('T')[0], customer: orderForm.customer, productName: product.name, qty: parseInt(orderForm.qty), price: product.price, total, profit, status: orderForm.status, paymentMethod: 'Cash', source: 'pos' }]);
    setOrderForm({ ...orderForm, customer: '', qty: 1 });
  };
  const markAsPaid = id => { if (confirm('Tandai sudah lunas?')) setTransaksi(transaksi.map(t => t.id === id ? { ...t, status: 'Lunas' } : t)); };
  const addExpense = () => { if (!newExpense.deskripsi) return; setPengeluaran([...pengeluaran, { id: Date.now(), date: new Date().toISOString().split('T')[0], deskripsi: newExpense.deskripsi, jumlah: parseInt(newExpense.jumlah) }]); setNewExpense({ deskripsi: '', jumlah: '' }); };
  const downloadCSV = () => { let csv = 'data:text/csv;charset=utf-8,'; csv += 'TANGGAL,CUSTOMER,PRODUK,QTY,TOTAL,STATUS\n'; transaksi.forEach(t => csv += `${t.date},${t.customer},${t.productName},${t.qty},${t.total},${t.status}\n`); const link = document.createElement('a'); link.href = encodeURI(csv); link.download = `Laporan_Bakso_${new Date().toISOString().split('T')[0]}.csv`; link.click(); };

  return (
    <div className="min-h-screen font-sans pb-24 selection:bg-black selection:text-white bg-white text-gray-900 relative">
      <div className="animated-gradient-bg" aria-hidden="true"></div>
      <AnimatedBackground />
      <MultiLayerBackground />
      <BaksoBackground />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap'); body { font-family: 'Inter', sans-serif; } @media print { .no-print { display: none !important; } .print-only { display: block !important; } }`}</style>
      <Routes>
        <Route path="/" element={
          <LandingPage
            products={products}
            customerOrder={customerOrder}
            setCustomerOrder={setCustomerOrder}
            pendingOrder={pendingOrder}
            paymentMethodPublic={paymentMethodPublic}
            setPaymentMethodPublic={setPaymentMethodPublic}
            paymentSuccess={paymentSuccess}
            startPublicOrder={startPublicOrder}
            confirmPublicPayment={confirmPublicPayment}
          />
        } />
        <Route path="/admin" element={
          <div className="w-full mx-auto min-h-screen relative px-4 md:px-6 lg:px-10 xl:px-16">
            <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto border-x lg:border border-gray-100 min-h-screen bg-white shadow-2xl shadow-gray-100/50 rounded-none lg:rounded-xl">
            {!isAdminAuthed ? (
              <AdminLogin adminPassInput={adminPassInput} setAdminPassInput={setAdminPassInput} loginError={loginError} attemptLogin={attemptLogin} onCancel={() => { navigate('/'); setLoginError(''); setAdminPassInput(''); }} />
            ) : (
              <AdminHeader saldoAkhir={saldoAkhir} totalPiutang={totalPiutang} onToLanding={() => { navigate('/'); setActiveTab('pos'); }} onLogout={logoutAdmin} />
            )}
            {isAdminAuthed && <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />}
            {isAdminAuthed && (
              <div className="p-4 md:p-6 pb-28 md:pb-32">
                {activeTab === 'pos' && <PosTab orderForm={orderForm} setOrderForm={setOrderForm} products={products} addTransaksi={addTransaksi} transaksi={transaksi} />}
                {activeTab === 'waorders' && <WhatsAppOrdersTab products={products} />}
                {activeTab === 'products' && <ProductsTab products={products} deleteProduct={deleteProduct} updateStock={updateStock} newProd={newProd} setNewProd={setNewProd} addProduct={addProduct} newProdImages={newProdImages} setNewProdImages={setNewProdImages} />}
                {activeTab === 'bundles' && <AdminBundles products={products} />}
                {activeTab === 'settings' && <AdminSettings />}
                {activeTab === 'cashflow' && <CashflowTab newExpense={newExpense} setNewExpense={setNewExpense} addExpense={addExpense} kasMasuk={kasMasuk} kasKeluar={kasKeluar} modalAwal={modalAwal} setModalAwal={setModalAwal} downloadCSV={downloadCSV} />}
                {activeTab === 'debts' && <DebtsTab totalPiutang={totalPiutang} transaksi={transaksi} markAsPaid={markAsPaid} />}
              </div>
            )}
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}
