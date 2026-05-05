import { baseApi } from '@/shared/api/baseApi'

export type RequestPayload = {
  standId?: number
  clientName: string
  phone: string
  email: string
  message?: string
}

export type ClientRequest = {
  id: number
  clientName: string
  phone: string
  email: string
  message: string
  isViewed: boolean
  createdAt: string
  standTitle: string | null
  mallName: string | null
}

export type RequestsResponse = {
  data: ClientRequest[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

type RequestsQuery = {
  page?: number
  limit?: number
  viewed?: 'all' | 'new' | 'viewed'
}

export const requestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
getRequests: builder.query<RequestsResponse, RequestsQuery | void>({
  query: (params) => {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))

    if (params?.viewed === 'new') {
      searchParams.set('viewed', '0')
    }

    if (params?.viewed === 'viewed') {
      searchParams.set('viewed', '1')
    }

    return `/requests?${searchParams.toString()}`
  },
  providesTags: ['Request'],
}),

    createRequest: builder.mutation<{ success: true }, RequestPayload>({
      query: (body) => ({
        url: '/requests',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Request'],
    }),

    markRequestViewed: builder.mutation<{ success: true }, number>({
      query: (id) => ({
        url: `/requests/${id}/viewed`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Request'],
    }),

    deleteRequest: builder.mutation<{ success: true }, number>({
      query: (id) => ({
        url: `/requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Request'],
    }),
  }),
})

export const {
  useGetRequestsQuery,
  useCreateRequestMutation,
  useMarkRequestViewedMutation,
  useDeleteRequestMutation,
} = requestApi