import { useEffect, useCallback } from 'react';
import { useProductsStore } from '../store';

export const useProducts = () => {
  const { books, filters, isLoading, isStale, error, fetchBooks, setFilters } = useProductsStore();

  useEffect(() => {
    if (books.length === 0 || isStale) {
      fetchBooks();
    }
  }, [isStale]);

  const applyFilters = useCallback((newFilters: Parameters<typeof setFilters>[0]) => {
    setFilters(newFilters);
    fetchBooks(newFilters);
  }, [setFilters, fetchBooks]);

  return { books, filters, isLoading, error, setFilters: applyFilters };
};