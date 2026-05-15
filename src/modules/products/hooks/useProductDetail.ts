import { useEffect } from 'react';
import { useProductsStore } from '../store';

export const useProductDetail = (id: string) => {
  const { selectedBook, isLoadingDetail, errorDetail, fetchBookById } = useProductsStore();

  useEffect(() => {
    fetchBookById(id);
  }, [id, fetchBookById]);

  const retry = () => fetchBookById(id);

  return { selectedBook, isLoadingDetail, errorDetail, retry };
};