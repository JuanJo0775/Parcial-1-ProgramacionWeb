import type { ApiResponse } from '../../core/api/types/api-response.types';
import type { ContactPayload, ContactConfirmation } from '../../shared/types';
import { delay } from '../utils/delay.util';
import { mockSuccess, mockError, shouldSimulateError } from '../utils/mock-response.util';

const MAX_CONTACTS_PER_SESSION = 3;
let contactCount = 0;

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const generateTicketId = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const counter = Math.floor(Math.random() * 9000) + 1000;
  return `TKT-${dateStr}-${counter}`;
};

export const sendContactMessageHandler = async (payload: ContactPayload): Promise<ApiResponse<ContactConfirmation>> => {
  await delay();
  if (shouldSimulateError()) {
    console.error('500 Internal Server Error – sendContactMessage');
    return mockError(500, 'INTERNAL_SERVER_ERROR', 'Error inesperado del servidor. Intenta de nuevo.');
  }

  if (!payload.fullName || !payload.email || !payload.subject || !payload.message) {
    return mockError(400, 'BAD_REQUEST', 'Todos los campos son requeridos.');
  }
  if (!isValidEmail(payload.email)) {
    return mockError(400, 'BAD_REQUEST', 'El email no es válido.');
  }
  if (payload.message.trim().length < 10) {
    return mockError(422, 'MESSAGE_TOO_SHORT', 'El mensaje debe tener al menos 10 caracteres.');
  }
  if (contactCount >= MAX_CONTACTS_PER_SESSION) {
    return mockError(429, 'TOO_MANY_REQUESTS', 'Has excedido el límite de 3 mensajes por sesión.');
  }

  contactCount++;

  const confirmation: ContactConfirmation = {
    ticketId: generateTicketId(),
    message: 'Tu mensaje fue recibido. Te contactaremos en menos de 24 horas.',
  };

  return mockSuccess(confirmation, 201);
};