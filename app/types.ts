import { store } from './app';

export interface RequestActions {
  onStart?: () => void;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
  onFetchEnd?: () => void;
}
export type DispatchType = typeof store.dispatch;
