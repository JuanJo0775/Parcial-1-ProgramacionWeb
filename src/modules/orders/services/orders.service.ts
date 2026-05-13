import type { ApiResponse } from '../../../core/api/types/api-response.types';
import type { CreateOrderPayload } from '../types';
import type { OrderReceipt } from '../types';
import { api } from '../../../core/api';

export const createOrder = (payload: CreateOrderPayload): Promise<ApiResponse<OrderReceipt>> =>
  api.createOrder(payload);