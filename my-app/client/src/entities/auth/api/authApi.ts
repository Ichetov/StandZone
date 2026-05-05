import { baseApi } from '@/shared/api/baseApi'

export type Admin = {
  id: number
  login: string
  email: string
}

export type LoginPayload = {
  login: string
  password: string
}

export type LoginResponse = {
  token: string
  admin: Admin
}

export type UpdateProfilePayload = {
  login: string
  email: string
  currentPassword?: string
  newPassword?: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    

    getMe: builder.query<Admin, void>({
      query: () => '/auth/me',
    }),

    updateMe: builder.mutation<LoginResponse, UpdateProfilePayload>({
      query: (body) => ({
        url: '/auth/me',
        method: 'PUT',
        body,
      }),
    }),

    forgotPassword: builder.mutation<{ success: true }, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<
      { success: true },
      { token: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi