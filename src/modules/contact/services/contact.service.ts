import type { ApiResponse } from '../../../core/api/types/api-response.types';
import type { ContactPayload, ContactConfirmation } from '../types';
import { api } from '../../../core/api';

export const sendContactMessage = (payload: ContactPayload): Promise<ApiResponse<ContactConfirmation>> =>
  api.sendContactMessage(payload);