import { useEffect, useCallback, useRef } from 'react';
import { useProductsStore } from '../store';

export const useProducts = () => {
  const { books, filters, isLoading, isStale, error, fetchBooks, setFilters } = useProductsStore();
  const fetchCalledRef = useRef(false);

  useEffect(() => {
    if ((books.length === 0 || isStale) && !fetchCalledRef.current) {
      fetchBooks();
    }
    fetchCalledRef.current = false;
  }, [books.length, isStale, fetchBooks]);

  const applyFilters = useCallback((newFilters: Parameters<typeof setFilters>[0]) => {
    fetchCalledRef.current = true;
    setFilters(newFilters);
    fetchBooks(newFilters);
  }, [setFilters, fetchBooks]);

  return { books, filters, isLoading, error, setFilters: applyFilters, fetchBooks };
};