import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { PropsWithChildren } from 'react'
import { baseApi } from '@/shared/api/baseApi'
import { rtkQueryErrorMiddleware } from './rtkQueryErrorMiddleware'

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(rtkQueryErrorMiddleware),
    
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const StoreProvider = ({ children }: PropsWithChildren) => {
  return <Provider store={store}>{children}</Provider>
}