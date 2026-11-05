import { useState, useEffect, useCallback } from 'react';
import { catalogService } from '../services/trackingService';

export function usePortofolio(initialCategory = 'Semua') {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (category && category !== 'Semua') {
        params.kategori = category;
      }
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await catalogService.getPortofolio(params);
      setItems(res.data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Gagal memuat portofolio.');
    }
  }, [category, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    category,
    setCategory,
    search,
    setSearch,
    refresh: fetchItems,
  };
}
