import { useState } from 'react';
import { sendContactMessage } from '../services/contact.service';
import type { ContactPayload, ContactConfirmation } from '../../../shared/types';

export const useContact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ContactConfirmation | null>(null);

  const send = async (payload: ContactPayload) => {
    setIsLoading(true);
    setError(null);
    const response = await sendContactMessage(payload);
    setIsLoading(false);
    if (response.success) {
      setConfirmation(response.data);
    } else {
      setError(response.error.message);
    }
  };

  return { isLoading, error, confirmation, send };
};