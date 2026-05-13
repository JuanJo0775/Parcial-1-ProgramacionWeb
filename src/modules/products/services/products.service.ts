import type { ApiResponse } from '../../../core/api/types/api-response.types';
import type { Book, ProductFilters } from '../types';
import { api } from '../../../core/api';

export const getProducts = (filters?: ProductFilters): Promise<ApiResponse<Book[]>> =>
  api.getProducts(filters);

export const getProductById = (id: string): Promise<ApiResponse<Book>> =>
  api.getProductById(id);