import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchSettings, updateSettings } from '../services/settingsService.js'

const AuthContext = createContext(null)

const TEMP_ADMIN_PASSWORD = 'admin123'

function loadPasswordFromEnv() {
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD
  if (typeof envPassword === 'string' && envPassword.length) return envPassword
  return ''
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ isAuthed: false, username: '' })
  const [password, setPassword] = useState(loadPasswordFromEnv() || TEMP_ADMIN_PASSWORD)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const settings = await fetchSettings()
        const fromDb = settings?.adminPassword
        const fromEnv = loadPasswordFromEnv()
        if (!active) return
        setPassword(fromDb || fromEnv || TEMP_ADMIN_PASSWORD)
      } catch {
        if (!active) return
        const fromEnv = loadPasswordFromEnv()
        setPassword(fromEnv || TEMP_ADMIN_PASSWORD)
      } finally {
        if (active) setReady(true)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const actions = useMemo(() => {
    return {
      login({ username, password: inputPassword }) {
        if (!ready) {
          return { ok: false, message: 'Loading admin settings…' }
        }
        if (!password) {
          return { ok: false, message: 'Admin password is not configured' }
        }
        const isOk = username === 'admin' && inputPassword === password
        if (!isOk) return { ok: false, message: 'Invalid credentials' }
        setAuth({ isAuthed: true, username })
        return { ok: true }
      },
      logout() {
        setAuth({ isAuthed: false, username: '' })
      },
      async changePassword({ currentPassword, newPassword }) {
        if (!ready) {
          return { ok: false, message: 'Loading admin settings…' }
        }
        if (currentPassword !== password) {
          return { ok: false, message: 'Current password is incorrect' }
        }
        if (!newPassword || newPassword.length < 6) {
          return { ok: false, message: 'New password must be at least 6 characters' }
        }
        try {
          const updated = await updateSettings({ adminPassword: newPassword })
          setPassword(updated.adminPassword || newPassword)
          return { ok: true }
        } catch (e) {
          return { ok: false, message: e?.message || 'Failed to update password' }
        }
      },
    }
  }, [password, ready])

  const value = useMemo(() => ({ auth, actions, ready }), [auth, actions, ready])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
