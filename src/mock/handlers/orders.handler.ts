import type { ApiResponse } from '../../core/api/types/api-response.types';
import type { CreateOrderPayload, OrderReceipt, OrderLineItem } from '../../shared/types';
import { booksData } from '../data/books.data';
import { branchesData } from '../data/branches.data';
import { delay } from '../utils/delay.util';
import { mockSuccess, mockError, shouldSimulateError } from '../utils/mock-response.util';

const DELIVERY_FEE = 8000;

const generateOrderId = (): string => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const counter = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${dateStr}-${counter}`;
};

const validatePayload = (payload: CreateOrderPayload): string | null => {
  if (!payload.customer?.fullName || !payload.customer?.email || !payload.customer?.phone) {
    return 'Faltan datos del cliente: nombre, email o teléfono.';
  }
  if (!payload.items || payload.items.length === 0) {
    return 'El pedido debe incluir al menos un libro.';
  }
  for (const item of payload.items) {
    if (!item.bookId || !item.quantity || item.quantity < 1) {
      return 'Cada ítem debe tener bookId válido y cantidad mínima de 1.';
    }
  }
  if (!payload.delivery?.branchId) {
    return 'Debe especificar una sucursal de entrega.';
  }
  if (payload.delivery.type === 'home_delivery') {
    if (!payload.delivery.address || !payload.delivery.city) {
      return 'La entrega a domicilio requiere dirección y ciudad.';
    }
  }
  return null;
};

export const createOrderHandler = async (payload: CreateOrderPayload): Promise<ApiResponse<OrderReceipt>> => {
  await delay();
  if (shouldSimulateError()) {
    console.error('500 Internal Server Error – createOrder');
    return mockError(500, 'INTERNAL_SERVER_ERROR', 'Error inesperado del servidor. Intenta de nuevo.');
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return mockError(400, 'BAD_REQUEST', validationError);
  }

  for (const item of payload.items) {
    const book = booksData.find((b) => b.id === item.bookId);
    if (!book || book.stock < item.quantity) {
      return mockError(409, 'INSUFFICIENT_STOCK', `Stock insuficiente para "${book?.title ?? item.bookId}".`);
    }
  }

  const branch = branchesData.find((b) => b.id === payload.delivery.branchId);
  if (!branch) {
    return mockError(400, 'BAD_REQUEST', 'Sucursal de entrega no encontrada.');
  }

  const lineItems: OrderLineItem[] = payload.items.map((item) => {
    const book = booksData.find((b) => b.id === item.bookId)!;
    return {
      bookId: item.bookId,
      title: book.title,
      quantity: item.quantity,
      unitPrice: book.price,
      subtotal: book.price * item.quantity,
    };
  });

  const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = payload.delivery.type === 'home_delivery' ? DELIVERY_FEE : 0;

  const receipt: OrderReceipt = {
    orderId: generateOrderId(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    customer: payload.customer,
    items: lineItems,
    delivery: payload.delivery,
    totals: { subtotal, deliveryFee, total: subtotal + deliveryFee },
    paymentMethod: 'cash_on_delivery',
    instructions:
      payload.delivery.type === 'pickup'
        ? `Paga al recoger tu pedido en ${branch.name}, ${branch.city}.`
        : 'Paga al recibir tu pedido en la dirección indicada.',
  };

  return mockSuccess(receipt, 201);
};