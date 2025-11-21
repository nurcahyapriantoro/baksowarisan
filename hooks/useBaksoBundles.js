import { useEffect, useState, useCallback } from 'react';
import { initBaksoBundles, getBaksoBundles, saveBaksoBundles } from '../utils/initBaksoBundles';

// Hook utilitas untuk interaksi paket bundling via localStorage.
// Memastikan inisialisasi otomatis saat pertama kali dipanggil.
export function useBaksoBundles() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = initBaksoBundles();
      setBundles(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listener 'storage' untuk sinkron antar tab
  useEffect(() => {
    const handler = () => setBundles(getBaksoBundles());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addBundle = useCallback((bundle) => {
    setBundles(prev => {
      const next = [...prev, { ...bundle, id: bundle.id || 'bundle-' + Date.now(), createdAt: Date.now() }];
      saveBaksoBundles(next);
      return next;
    });
  }, []);

  const updateBundle = useCallback((id, patch) => {
    setBundles(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...patch } : b);
      saveBaksoBundles(next);
      return next;
    });
  }, []);

  const deleteBundle = useCallback((id) => {
    setBundles(prev => {
      const next = prev.filter(b => b.id !== id);
      saveBaksoBundles(next);
      return next;
    });
  }, []);

  return { bundles, loading, addBundle, updateBundle, deleteBundle };
}
