import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const INACTIVITY_MS = 15 * 60 * 1000 // 15 minutes

const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart']

/**
 * Automatically logs the admin out after INACTIVITY_MS of no activity.
 * Must be called inside a component that is only mounted when the user is authed
 * (i.e. inside AdminLayout).
 */
export function useInactivityLogout() {
  const { auth, actions } = useAuth()
  const navigate = useNavigate()
  const timerRef = useRef(null)

  useEffect(() => {
    if (!auth.isAuthed) return

    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(async () => {
        console.info('[Admin] Auto-logout due to inactivity')
        await actions.logout()
        navigate('/admin-login', { replace: true })
      }, INACTIVITY_MS)
    }

    // Start on mount
    resetTimer()

    // Reset on any user activity
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, resetTimer))
    }
  }, [auth.isAuthed, actions, navigate])
}
