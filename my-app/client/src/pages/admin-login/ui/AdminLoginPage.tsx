
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { isAuthenticated } from '@/shared/lib/auth'
import { Navigate } from 'react-router'

export const AdminLoginPage = () => {
  if (isAuthenticated()) {
    return <Navigate to="/admin/stands" replace />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 16
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <h1 className="sectionTitle">Вход в админку</h1>
        <LoginForm />
      </div>
    </div>
  )
}