import React from 'react';

/* AdminLogin: Form login sederhana untuk akses dashboard.
   Props:
     adminPassInput, setAdminPassInput
     loginError
     attemptLogin() -> mencoba login
     onCancel() -> kembali ke landing
*/
export function AdminLogin({ adminPassInput, setAdminPassInput, loginError, attemptLogin, onCancel }) {
  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight mb-2">Admin Panel</h1>
      <p className="text-xs text-gray-500 mb-4">Masukkan password untuk mengakses dashboard keuangan.</p>
      <input
        type="password"
        value={adminPassInput}
        onChange={e => setAdminPassInput(e.target.value)}
        placeholder="Password admin"
        className="w-full border border-gray-300 rounded p-3 text-sm mb-2 focus:outline-none focus:border-black"
      />
      {loginError && <div className="text-red-600 text-[11px] mb-3">{loginError}</div>}
      <div className="flex gap-2">
        <button
          onClick={attemptLogin}
          className="flex-1 bg-black text-white py-3 rounded text-[11px] font-bold uppercase tracking-widest"
        >Login</button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded text-[11px] font-bold uppercase tracking-widest"
        >Batal</button>
      </div>
      <div className="mt-6 text-center text-[10px] text-gray-400">Versi Admin • Akses terbatas</div>
    </div>
  );
}
