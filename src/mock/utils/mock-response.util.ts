import type { ApiResponse } from '../../core/api/types/api-response.types';

export const mockSuccess = <T>(data: T, status = 200): ApiResponse<T> =>
  ({ success: true, status, data });

export const mockError = (status: number, code: string, message: string): ApiResponse<never> =>
  ({ success: false, status, error: { code, message } });

export const MOCK_ERROR_RATE = 0.1;

export const shouldSimulateError = (): boolean => Math.random() < MOCK_ERROR_RATE;