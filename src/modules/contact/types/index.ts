import type { ContactPayload, ContactConfirmation } from '../../../shared/types';

export interface ContactState {
  isLoading: boolean;
  error: string | null;
  confirmation: ContactConfirmation | null;
  send: (payload: ContactPayload) => Promise<void>;
}

export type { ContactPayload, ContactConfirmation } from '../../../shared/types';