import React from 'react';
import { Trash2, Package } from 'lucide-react';
import { formatRupiah } from '../utils/formatRupiah';

/* ProductsTab: Manajemen stok & tambah produk
   Props:
     products
     deleteProduct(id)
     updateStock(id, amount)
     newProd, setNewProd
     addProduct()
*/
export function ProductsTab({ products, deleteProduct, updateStock, newProd, setNewProd, addProduct, newProdImages, setNewProdImages }) {
  // Handler upload gambar multiple -> simpan base64
  const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) { setNewProdImages([]); return; }
    const maxFiles = 8; // batas supaya tidak terlalu berat di localStorage
    const selected = files.slice(0, maxFiles);
    const processFile = (file) => new Promise(res => {
      const imgEl = new Image();
      const reader = new FileReader();
      reader.onload = ev => {
        imgEl.onload = () => {
          // Resize / compress via canvas
          const MAX_W = 800; const MAX_H = 800;
          let { width, height } = imgEl;
          const ratio = Math.min(MAX_W / width, MAX_H / height, 1);
          width = Math.round(width * ratio); height = Math.round(height * ratio);
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgEl, 0, 0, width, height);
          // Convert ke JPEG kualitas 0.72 untuk balance kualitas/ukuran
          const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
          res(dataUrl);
        };
        imgEl.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
    Promise.all(selected.map(processFile)).then(compressed => setNewProdImages(compressed));
  };
  return (
    <div className="animate-fade-in space-y-8">
      {/* List Produk */}
      <div className="grid gap-4">
        {products.map(p => (
          <div key={p.id} className="border border-gray-200 rounded-lg p-4 relative overflow-hidden group">
            {p.stock <= 5 && (
               <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-1 font-bold rounded-bl">STOK MENIPIS</div>
            )}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-xs text-gray-500">HPP: {formatRupiah(p.hpp)} | Jual: {formatRupiah(p.price)}</p>
              </div>
              <button onClick={() => deleteProduct(p.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
            {p.images && p.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {p.images.slice(0,4).map((img,i) => (
                  <img key={i} src={img} alt={p.name + ' img ' + (i+1)} className="w-14 h-14 object-cover rounded-md border border-gray-200" />
                ))}
                {p.images.length > 4 && (
                  <span className="text-[10px] font-bold text-gray-500 self-center">+{p.images.length - 4}</span>
                )}
              </div>
            )}
            <div className="bg-gray-50 rounded p-2 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Sisa Stok</span>
              <div className="flex items-center gap-3">
                <button onClick={() => updateStock(p.id, -1)} className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center hover:border-black">-</button>
                <span className="font-mono font-bold text-xl w-8 text-center">{p.stock}</span>
                <button onClick={() => updateStock(p.id, 1)} className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tambah Produk Form */}
      <div className="bg-gray-900 text-white p-5 rounded-xl shadow-lg">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
           <Package size={16}/> Tambah Menu Baru
        </h3>
        <div className="space-y-3">
          <input 
            placeholder="Nama Menu (mis: Bakso Urat)" 
            value={newProd.name}
            onChange={e => setNewProd({ ...newProd, name: e.target.value })}
            className="w-full bg-gray-800 border-0 rounded p-2 text-sm text-white placeholder:text-gray-500"
          />
          <div className="flex gap-2">
            <input 
              type="number" placeholder="HPP (Modal)" 
              value={newProd.hpp}
              onChange={e => setNewProd({ ...newProd, hpp: e.target.value })}
              className="w-1/3 bg-gray-800 border-0 rounded p-2 text-sm"
            />
            <input 
              type="number" placeholder="Harga Jual" 
              value={newProd.price}
              onChange={e => setNewProd({ ...newProd, price: e.target.value })}
              className="w-1/3 bg-gray-800 border-0 rounded p-2 text-sm"
            />
            <input 
              type="number" placeholder="Stok Awal" 
              value={newProd.stock}
              onChange={e => setNewProd({ ...newProd, stock: e.target.value })}
              className="w-1/3 bg-gray-800 border-0 rounded p-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Foto Produk (maks 8)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesSelect}
              className="block w-full text-[11px] text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
            />
            {newProdImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {newProdImages.map((img,i) => (
                  <img key={i} src={img} alt={'preview '+i} className="w-full h-16 object-cover rounded border border-gray-700" />
                ))}
              </div>
            )}
          </div>
          <button onClick={addProduct} className="w-full bg-white text-black font-bold text-xs uppercase py-3 rounded mt-2">Simpan Produk</button>
        </div>
      </div>
    </div>
  );
}
