import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

type ApiError = {
  status?: number | string
  data?: {
    message?: string
  }
}

export const rtkQueryErrorMiddleware: Middleware =
  () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const payload = action.payload as ApiError

      const message =
        payload.data?.message ||
        getDefaultErrorMessage(payload.status)

      toast.error(message)
    }

    return next(action)
  }

function getDefaultErrorMessage(status?: number | string) {
  if (status === 400) return 'Некорректный запрос'
  if (status === 401) return 'Нужно войти в аккаунт'
  if (status === 403) return 'Нет доступа'
  if (status === 404) return 'Данные не найдены'
  if (status === 500) return 'Ошибка сервера'

  return 'Ошибка запроса'
}