import type { ApiResponse } from '../../core/api/types/api-response.types';
import type { Book, ProductFilters } from '../../shared/types';
import { booksData } from '../data/books.data';
import { delay } from '../utils/delay.util';
import { mockSuccess, mockError, shouldSimulateError } from '../utils/mock-response.util';

const handle = async <T>(fn: () => ApiResponse<T>): Promise<ApiResponse<T>> => {
  await delay();
  if (shouldSimulateError()) {
    console.error('500 Internal Server Error – getProducts');
    return mockError(500, 'INTERNAL_SERVER_ERROR', 'Error inesperado del servidor. Intenta de nuevo.');
  }
  return fn();
};

export const getProductsHandler = (filters?: ProductFilters): Promise<ApiResponse<Book[]>> =>
  handle(() => {
    let result = [...booksData];

    if (filters?.genre) {
      result = result.filter((b) => b.genre.toLowerCase() === filters.genre!.toLowerCase());
    }
    if (filters?.priceMax !== undefined) {
      result = result.filter((b) => b.price <= filters.priceMax!);
    }
    if (filters?.available) {
      result = result.filter((b) => b.stock > 0);
    }

    return mockSuccess(result, 200);
  });

export const getProductByIdHandler = (id: string): Promise<ApiResponse<Book>> =>
  handle(() => {
    const book = booksData.find((b) => b.id === id);
    if (!book) {
      return mockError(404, 'NOT_FOUND', `Libro con id "${id}" no encontrado.`);
    }
    return mockSuccess(book, 200);
  });