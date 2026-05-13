import type { CreateOrderPayload, OrderReceipt } from '../../../shared/types';

export interface OrdersState {
  draft: Partial<CreateOrderPayload>;
  selectedBranchId: string | null;
  receipt: OrderReceipt | null;
  isLoading: boolean;
  error: string | null;
  setDraft: (partial: Partial<CreateOrderPayload>) => void;
  setSelectedBranchId: (branchId: string) => void;
  submitOrder: () => Promise<void>;
  clearReceipt: () => void;
  reset: () => void;
}

export type { CreateOrderPayload, OrderReceipt } from '../../../shared/types';