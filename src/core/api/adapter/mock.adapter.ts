import type { IApiAdapter } from './IApiAdapter';
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
import {
  getProductsHandler,
  getProductByIdHandler,
} from '../../../mock/handlers/products.handler';
import { getBranchesHandler, getNearestBranchHandler } from '../../../mock/handlers/branches.handler';
import { createOrderHandler } from '../../../mock/handlers/orders.handler';
import { sendContactMessageHandler } from '../../../mock/handlers/contact.handler';

export const mockAdapter: IApiAdapter = {
  getProducts: (filters?: ProductFilters): Promise<ApiResponse<Book[]>> =>
    getProductsHandler(filters),
  getProductById: (id: string): Promise<ApiResponse<Book>> =>
    getProductByIdHandler(id),
  getBranches: (): Promise<ApiResponse<Branch[]>> =>
    getBranchesHandler(),
  getNearestBranch: (coords: Coords): Promise<ApiResponse<Branch>> =>
    getNearestBranchHandler(coords),
  createOrder: (payload: CreateOrderPayload): Promise<ApiResponse<OrderReceipt>> =>
    createOrderHandler(payload),
  sendContactMessage: (payload: ContactPayload): Promise<ApiResponse<ContactConfirmation>> =>
    sendContactMessageHandler(payload),
};