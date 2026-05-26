import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'

import { getToken, removeToken } from '@/shared/lib/auth'

const API_URL = import.meta.env.VITE_API_URL

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,

  prepareHeaders: (headers) => {
    const token = getToken()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    removeToken()

    const isAdminPage = window.location.pathname.startsWith('/admin')
    const isLoginPage = window.location.pathname === '/admin/login'

    if (isAdminPage && !isLoginPage) {
      window.location.replace('/admin/login')
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Stand', 'StandDetails', 'Mall', 'Request', 'FAQ'],
  endpoints: () => ({}),
})