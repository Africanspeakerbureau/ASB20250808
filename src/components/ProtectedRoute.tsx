import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'

export default function ProtectedRoute({ children }: { children?: React.ReactElement }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/speaker/signin" replace />
  }
  return children || <Outlet />
}
