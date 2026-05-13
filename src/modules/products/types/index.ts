import type { Book, ProductFilters } from '../../../shared/types';

export interface ProductsState {
  books: Book[];
  filters: ProductFilters;
  isLoading: boolean;
  isStale: boolean;
  error: string | null;
  selectedBook: Book | null;
  isLoadingDetail: boolean;
  errorDetail: string | null;
  fetchBooks: (filters?: ProductFilters) => Promise<void>;
  fetchBookById: (id: string) => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  markAsStale: () => void;
  reset: () => void;
}

export type { Book, ProductFilters } from '../../../shared/types';