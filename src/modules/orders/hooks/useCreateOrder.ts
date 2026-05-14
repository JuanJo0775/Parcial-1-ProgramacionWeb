import { useOrdersStore } from '../store';

export const useCreateOrder = () => {
  const store = useOrdersStore();
  return {
    draft: store.draft,
    receipt: store.receipt,
    isLoading: store.isLoading,
    error: store.error,
    setDraft: store.setDraft,
    setSelectedBranchId: store.setSelectedBranchId,
    submitOrder: store.submitOrder,
    clearReceipt: store.clearReceipt,
    reset: store.reset,
  };
};