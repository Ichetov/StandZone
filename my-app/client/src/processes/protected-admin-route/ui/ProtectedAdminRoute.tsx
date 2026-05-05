
import { isAuthenticated } from '@/shared/lib/auth'
import { Navigate, Outlet } from 'react-router'

export const ProtectedAdminRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}