import type { IApiAdapter } from './adapter/IApiAdapter';
import { mockAdapter } from './adapter/mock.adapter';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const api: IApiAdapter = useMock ? mockAdapter : mockAdapter;

export type { IApiAdapter } from './adapter/IApiAdapter';