import { create } from 'zustand';
import { createOrder } from '../services/orders.service';
import type { CreateOrderPayload } from '../../../shared/types';
import type { OrdersState } from '../types';
export type { OrdersState };

export const useOrdersStore = create<OrdersState>((set, get) => ({
  draft: {},
  selectedBranchId: null,
  receipt: null,
  isLoading: false,
  error: null,

  setDraft: (partial) => set((state) => ({ draft: { ...state.draft, ...partial } })),

  setSelectedBranchId: (branchId) => {
    set((state) => ({
      selectedBranchId: branchId,
      draft: {
        ...state.draft,
        delivery: {
          type: state.draft.delivery?.type ?? 'pickup',
          branchId,
          address: state.draft.delivery?.address,
          city: state.draft.delivery?.city,
        },
      },
    }));
  },

  submitOrder: async () => {
    set({ isLoading: true, error: null });
    const response = await createOrder(get().draft as CreateOrderPayload);
    if (response.success) {
      set({ receipt: response.data, isLoading: false });
      return true;
    } else {
      set({ error: response.error.message, isLoading: false });
      return false;
    }
  },

  clearReceipt: () => set({ receipt: null }),

  reset: () =>
    set({ draft: {}, selectedBranchId: null, receipt: null, isLoading: false, error: null }),
}));