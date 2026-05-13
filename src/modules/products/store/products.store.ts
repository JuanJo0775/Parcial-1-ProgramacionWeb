import { create } from 'zustand';
import { getProducts, getProductById } from '../services/products.service';
import type { ProductsState } from '../types';
export type { ProductsState };

let abortController: AbortController | null = null;

export const useProductsStore = create<ProductsState>((set, get) => ({
  books: [],
  filters: {},
  isLoading: false,
  isStale: false,
  error: null,
  selectedBook: null,
  isLoadingDetail: false,
  errorDetail: null,

  fetchBooks: async (filters) => {
    abortController?.abort();
    abortController = new AbortController();
    set({ isLoading: true, error: null });

    const response = await getProducts(filters ?? get().filters);

    if (response.success) {
      set({ books: response.data, isLoading: false, isStale: false });
    } else {
      set({ error: response.error.message, isLoading: false });
    }
  },

  fetchBookById: async (id) => {
    set({ isLoadingDetail: true, errorDetail: null });
    const response = await getProductById(id);
    if (response.success) {
      set({ selectedBook: response.data, isLoadingDetail: false });
    } else {
      set({ errorDetail: response.error.message, isLoadingDetail: false });
    }
  },

  setFilters: (filters) => set({ filters, isStale: true }),

  markAsStale: () => set({ books: [], isStale: true }),

  reset: () => {
    abortController?.abort();
    set({
      books: [],
      filters: {},
      isLoading: false,
      isStale: false,
      error: null,
      selectedBook: null,
      isLoadingDetail: false,
      errorDetail: null,
    });
  },
}));