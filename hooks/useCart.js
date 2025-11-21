import { useState, useEffect, useCallback } from 'react';

const LS_KEY = 'bakso_cart_v1';

function read() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [cart, setCart] = useState(() => read());

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cart));
      // notify other hook instances in the same tab
      try { window.dispatchEvent(new Event('bakso_cart_updated')); } catch (e) { /* ignore */ }
    } catch (e) {
      console.warn('Gagal menyimpan cart', e);
    }
  }, [cart]);

  useEffect(() => {
    const handler = () => setCart(read());
    // storage event for cross-tab sync
    window.addEventListener('storage', handler);
    // custom event for same-tab sync
    window.addEventListener('bakso_cart_updated', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('bakso_cart_updated', handler);
    };
  }, []);

  const addItem = useCallback((item) => {
    setCart(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + (item.qty || 1) } : p);
      return [...prev, { id: item.id, name: item.name, price: item.price || 0, qty: item.qty || 1 }];
    });
  }, []);

  const removeItem = useCallback((id) => setCart(prev => prev.filter(p => p.id !== id)), []);

  const updateQty = useCallback((id, qty) => setCart(prev => prev.map(p => p.id === id ? { ...p, qty } : p)), []);

  const clear = useCallback(() => setCart([]), []);

  const itemCount = cart.reduce((a,c) => a + c.qty, 0);
  const total = cart.reduce((a,c) => a + (parseInt(c.price)||0) * c.qty, 0);

  return { cart, addItem, removeItem, updateQty, clear, itemCount, total };
}
