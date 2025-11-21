import { useState, useEffect } from 'react';

// Reusable localStorage-persisted state hook
// Persists value under given key and rehydrates on mount.
export function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // fail silently
    }
  }, [key, value]);

  return [value, setValue];
}
