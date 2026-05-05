
import { HomePage } from '@/pages/home/ui/HomePage'
import { StandDetailsPage } from '@/pages/stand-details/ui/StandDetailsPage'
import { RequestPage } from '@/pages/request/ui/RequestPage'
import { AdminLoginPage } from '@/pages/admin-login/ui/AdminLoginPage'
import { AdminStandsPage } from '@/pages/admin-stands/ui/AdminStandsPage'
import { AdminStandCreatePage } from '@/pages/admin-stand-create/ui/AdminStandCreatePage'
import { AdminStandEditPage } from '@/pages/admin-stand-edit/ui/AdminStandEditPage'
import { ProtectedAdminRoute } from '@/processes/protected-admin-route/ui/ProtectedAdminRoute'
import { AdminLayout } from '@/widgets/admin-layout/ui/AdminLayout'
import { createBrowserRouter, Navigate } from 'react-router'
import { NotFoundPage } from '@/shared/ui/NotFoundPage'
import { AdminRequestsPage } from '@/pages/adnin-requests/ui/AdminRequestsPage'
import { AdminFAQPage } from '@/pages/admin-faq/ui/AdminFAQPage'
import { AdminProfilePage } from '@/pages/admin-profile/ui/AdminProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/stands/:slug',
    element: <StandDetailsPage />
  },
  {
    path: '/request',
    element: <RequestPage />
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />
  },
  
  {
    path: '/admin',
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="stands" replace />
          },
          {
            path: 'stands',
            element: <AdminStandsPage />
          },
          {
            path: 'stands/new',
            element: <AdminStandCreatePage />
          },
          {
            path: 'stands/:id/edit',
            element: <AdminStandEditPage />
          },
          {
            path: 'requests',
            element: <AdminRequestsPage />
          },
          {
           path: 'faq',
           element: <AdminFAQPage />
          },
          {
            path: 'profile',
            element: <AdminProfilePage />
          },
            {
          path: '*',
          element: <Navigate to="/admin/stands" replace />
        }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])