import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '@/shared/config/env'
import { getToken } from '../lib/auth'


export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = getToken()

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    }
  }),
  tagTypes: ['Stand', 'StandDetails', 'Mall', 'Request', 'FAQ'],
  endpoints: () => ({})
})