import { baseApi } from '@/shared/api/baseApi'
import type { MallOption, Stand, StandPayload, StandsResponse } from '@/entities/stand/model/types'

export const standApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStands: builder.query<StandsResponse, {page?: number, mall?: string; search?: string; admin?: boolean } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams()

        if (params?.mall) searchParams.set('mall', params.mall)
        if (params?.search) searchParams.set('search', params.search)
        if (params?.admin) searchParams.set('admin', '1')
        if (params?.page) searchParams.set('page', String(params.page))

        const queryString = searchParams.toString()
        return `/stands${queryString ? `?${queryString}` : ''}`
      },
      providesTags: ['Stand']
    }),

    getMalls: builder.query<MallOption[], void>({
      query: () => '/stands/malls',
      providesTags: ['Mall']
    }),

    getStandBySlug: builder.query<Stand, string>({
      query: (slug) => `/stands/${slug}`,
      providesTags: ['StandDetails']
    }),

    getAdminStandById: builder.query<Stand, string>({
      query: (id) => `/stands/admin/by-id/${id}`,
      providesTags: ['StandDetails']
    }),

    createStand: builder.mutation<Stand, StandPayload>({
      query: (body) => ({
        url: '/stands',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Stand', 'StandDetails', 'Mall']
    }),

    updateStand: builder.mutation<Stand, { id: string; body: StandPayload }>({
      query: ({ id, body }) => ({
        url: `/stands/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Stand', 'StandDetails', 'Mall']
    }),

    deleteStand: builder.mutation<{ success: true }, string>({
      query: (id) => ({
        url: `/stands/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Stand', 'StandDetails', 'Mall']
    }),

    uploadImages: builder.mutation<{ urls: string[] }, FormData>({
      query: (body) => ({
        url: '/uploads',
        method: 'POST',
        body
      })
    })
  })
})

export const {
  useGetStandsQuery,
  useGetMallsQuery,
  useGetStandBySlugQuery,
  useGetAdminStandByIdQuery,
  useCreateStandMutation,
  useUpdateStandMutation,
  useDeleteStandMutation,
  useUploadImagesMutation
} = standApi