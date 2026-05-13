export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface OrderItem {
  bookId: string;
  quantity: number;
}

export interface DeliveryInfo {
  type: 'pickup' | 'home_delivery';
  branchId: string;
  address?: string;
  city?: string;
}

export interface CreateOrderPayload {
  customer: CustomerInfo;
  items: OrderItem[];
  delivery: DeliveryInfo;
}

export interface OrderLineItem {
  bookId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderTotals {
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface OrderReceipt {
  orderId: string;
  status: 'confirmed';
  createdAt: string;
  customer: CustomerInfo;
  items: OrderLineItem[];
  delivery: DeliveryInfo;
  totals: OrderTotals;
  paymentMethod: 'cash_on_delivery';
  instructions: string;
}