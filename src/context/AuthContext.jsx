import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '../storage/keys.js'
import { loadJson, removeKey, saveJson } from '../storage/storage.js'

const AuthContext = createContext(null)

function loadInitialAuth() {
  const stored = loadJson(STORAGE_KEYS.auth, null)
  if (!stored || typeof stored !== 'object') return { isAuthed: false, username: '' }
  return {
    isAuthed: Boolean(stored.isAuthed),
    username: typeof stored.username === 'string' ? stored.username : '',
  }
}

function loadPassword() {
  const stored = loadJson(STORAGE_KEYS.adminPassword, null)
  return typeof stored === 'string' && stored.length ? stored : 'admin123'
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadInitialAuth)
  const [password, setPassword] = useState(loadPassword)

  useEffect(() => {
    saveJson(STORAGE_KEYS.auth, auth)
  }, [auth])

  useEffect(() => {
    saveJson(STORAGE_KEYS.adminPassword, password)
  }, [password])

  const actions = useMemo(() => {
    return {
      login({ username, password: inputPassword }) {
        const isOk = username === 'admin' && inputPassword === password
        if (!isOk) return { ok: false, message: 'Invalid credentials' }
        setAuth({ isAuthed: true, username })
        return { ok: true }
      },
      logout() {
        setAuth({ isAuthed: false, username: '' })
        removeKey(STORAGE_KEYS.auth)
      },
      changePassword({ currentPassword, newPassword }) {
        if (currentPassword !== password) {
          return { ok: false, message: 'Current password is incorrect' }
        }
        if (!newPassword || newPassword.length < 6) {
          return { ok: false, message: 'New password must be at least 6 characters' }
        }
        setPassword(newPassword)
        return { ok: true }
      },
    }
  }, [password])

  const value = useMemo(() => ({ auth, actions }), [auth, actions])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
