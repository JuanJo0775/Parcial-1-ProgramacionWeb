import type { ApiResponse } from '../types/api-response.types';
import type {
  Book,
  ProductFilters,
  Branch,
  Coords,
  CreateOrderPayload,
  OrderReceipt,
  ContactPayload,
  ContactConfirmation,
} from '../../../shared/types';

export interface IApiAdapter {
  getProducts(filters?: ProductFilters): Promise<ApiResponse<Book[]>>;
  getProductById(id: string): Promise<ApiResponse<Book>>;
  getBranches(): Promise<ApiResponse<Branch[]>>;
  getNearestBranch(coords: Coords): Promise<ApiResponse<Branch>>;
  createOrder(payload: CreateOrderPayload): Promise<ApiResponse<OrderReceipt>>;
  sendContactMessage(payload: ContactPayload): Promise<ApiResponse<ContactConfirmation>>;
}