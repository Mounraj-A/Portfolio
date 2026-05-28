import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { auth } = useAuth()
  const location = useLocation()

  if (!auth.isAuthed) {
    return <Navigate to="/admin-login" replace state={{ from: location.pathname }} />
  }

  return children
}
