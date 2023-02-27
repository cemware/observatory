import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { IS_DEV } from '../env';
import { reducers } from './slices';

interface CreateStoreOption {
  log: boolean;
}
export const createStore = (option?: Partial<CreateStoreOption>) => {
  return configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => {
      const middlewares = getDefaultMiddleware({
        serializableCheck: false,
      });
      return middlewares;
    },
    devTools: option?.log && IS_DEV,
  });
};

export type IStoreState = ReturnType<ReturnType<typeof createStore>['getState']>;
export type PropsWithStore<P> = P & { store: ReturnType<typeof createStore> };
export const useTypedSelector: TypedUseSelectorHook<IStoreState> = useSelector;
export const useTypedDispatch = () => useDispatch<ReturnType<typeof createStore>['dispatch']>();
export const useStoreState = <K extends keyof IStoreState>(key: K) => {
  const storeState = useTypedSelector((state) => state[key]);
  return storeState as IStoreState[K];
};

export { ACTIONS } from './slices';
