import { useEffect } from 'react';
import { useProductsStore } from '../store';

export const useProductDetail = (id: string) => {
  const { selectedBook, isLoadingDetail, errorDetail, fetchBookById } = useProductsStore();

  useEffect(() => {
    fetchBookById(id);
  }, [id]);

  return { selectedBook, isLoadingDetail, errorDetail };
};