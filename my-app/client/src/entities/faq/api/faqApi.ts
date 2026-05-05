import { baseApi } from '@/shared/api/baseApi'

export type FAQ = {
  id: number
  question: string
  answer: string
  sortOrder: number
  isActive: boolean
}

export type FAQPayload = {
  question: string
  answer: string
  sortOrder?: number
  isActive?: boolean
}

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<FAQ[], { admin?: boolean } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams()

        if (params?.admin) {
          searchParams.set('admin', '1')
        }

        return `/faqs?${searchParams.toString()}`
      },
      providesTags: ['FAQ'],
    }),

    createFaq: builder.mutation<FAQ, FAQPayload>({
      query: (body) => ({
        url: '/faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FAQ'],
    }),

    updateFaq: builder.mutation<FAQ, { id: number; body: FAQPayload }>({
      query: ({ id, body }) => ({
        url: `/faqs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['FAQ'],
    }),

    deleteFaq: builder.mutation<{ success: true }, number>({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FAQ'],
    }),
  }),
})

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi