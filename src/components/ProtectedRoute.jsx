import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user } = useAuth()

  // Si pas connecté, redirection vers auth
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Si un rôle spécifique est requis et l'utilisateur n'a pas ce rôle
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}
