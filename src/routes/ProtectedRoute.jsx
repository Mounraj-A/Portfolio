import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { auth, ready } = useAuth()
  const location = useLocation()

  // Wait for Firebase Auth to resolve the session before redirecting.
  // Without this, onAuthStateChanged hasn't fired yet on refresh and the
  // user would be incorrectly redirected to login.
  if (!ready) return null

  if (!auth.isAuthed) {
    return <Navigate to="/admin-login" replace state={{ from: location.pathname }} />
  }

  return children
}
