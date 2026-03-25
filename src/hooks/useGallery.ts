import { useState, useCallback } from 'react';

export interface GalleryItem {
  id: string;
  dataUrl: string;
  createdAt: number;
  mode: string;
}

const STORAGE_KEY = 'sand_zen_gallery';

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const save = useCallback((dataUrl: string, mode: string) => {
    const item: GalleryItem = {
      id: Date.now().toString(),
      dataUrl,
      createdAt: Date.now(),
      mode,
    };
    setItems(prev => {
      const next = [item, ...prev].slice(0, 30); // max 30
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full — remove oldest
        const trimmed = [item, ...prev].slice(0, 15);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        return trimmed;
      }
      return next;
    });
    return item.id;
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { items, save, remove };
}
