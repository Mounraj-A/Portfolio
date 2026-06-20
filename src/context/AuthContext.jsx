import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { auth } from '../firebase/firebase.js'

/* ─── Admin email — must match VITE_ADMIN_EMAIL in .env ─────────────────── */
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL ?? '').trim().toLowerCase()
console.log("ADMIN_EMAIL =", ADMIN_EMAIL)
/* ─── Rate limiting ──────────────────────────────────────────────────────── */
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 30_000 // 30 seconds

const rateState = {
  attempts: 0,
  lockedUntil: 0,
}

function isLockedOut() {
  return rateState.lockedUntil > Date.now()
}

function lockoutSecondsRemaining() {
  return Math.ceil((rateState.lockedUntil - Date.now()) / 1000)
}

function recordFailedAttempt() {
  rateState.attempts += 1
  if (rateState.attempts >= MAX_ATTEMPTS) {
    rateState.lockedUntil = Date.now() + LOCKOUT_MS
    rateState.attempts = 0
  }
}

function clearAttempts() {
  rateState.attempts = 0
  rateState.lockedUntil = 0
}

/* ─── Context ────────────────────────────────────────────────────────────── */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth_state, setAuthState] = useState({ isAuthed: false, username: '', email: '' })
  const [ready, setReady] = useState(false)

  /* Firebase Auth state observer — persists session across refreshes */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email?.toLowerCase() === ADMIN_EMAIL) {
        setAuthState({ isAuthed: true, username: 'Admin', email: firebaseUser.email })
      } else {
        setAuthState({ isAuthed: false, username: '', email: '' })
        // Sign out any non-admin account silently
        if (firebaseUser) signOut(auth).catch(() => { })
      }
      setReady(true)
    })
    return unsubscribe
  }, [])

  const actions = useMemo(() => {
    return {
      /* ── Login ─────────────────────────────────────────────────────────── */
      async login({ username: emailInput, password }) {
        if (!ready) return { ok: false, message: 'Loading, please wait…' }

        // Rate limiting check
        if (isLockedOut()) {
          return {
            ok: false,
            message: `Too many failed attempts. Try again in ${lockoutSecondsRemaining()} seconds.`,
          }
        }

        // Validate admin email — use entered email or fallback to env email
        const email = (emailInput || '').trim().toLowerCase() || ADMIN_EMAIL
        if (!ADMIN_EMAIL) {
          return { ok: false, message: 'Admin email not configured. Contact the administrator.' }
        }

        try {
          const credential = await signInWithEmailAndPassword(auth, email, password)
          const loggedInEmail = credential.user.email?.toLowerCase()

          // Verify only the configured admin email is allowed
          if (loggedInEmail !== ADMIN_EMAIL) {
            await signOut(auth)
            recordFailedAttempt()
            return { ok: false, message: 'Unauthorized Access. This account is not permitted.' }
          }

          clearAttempts()
          console.info(`[Admin] Login: ${loggedInEmail} at ${new Date().toISOString()}`)
          return { ok: true }
        } catch (e) {
          recordFailedAttempt()

          const code = e?.code ?? ''
          if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
            const remaining = MAX_ATTEMPTS - rateState.attempts
            return {
              ok: false,
              message: remaining > 0
                ? `Invalid credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
                : `Too many failed attempts. Try again in ${lockoutSecondsRemaining()} seconds.`,
            }
          }
          if (code === 'auth/too-many-requests') {
            return { ok: false, message: 'Too many requests. Please try again later.' }
          }
          return { ok: false, message: 'Login failed. Please try again.' }
        }
      },

      /* ── Logout ────────────────────────────────────────────────────────── */
      async logout() {
        const email = auth.currentUser?.email ?? ''
        console.info(`[Admin] Logout: ${email} at ${new Date().toISOString()}`)
        await signOut(auth).catch(() => { })
        setAuthState({ isAuthed: false, username: '', email: '' })
      },

      /* ── Change Password ───────────────────────────────────────────────── */
      async changePassword({ currentPassword, newPassword }) {
        if (!ready) return { ok: false, message: 'Loading, please wait…' }

        const user = auth.currentUser
        if (!user) return { ok: false, message: 'Not authenticated' }

        if (!newPassword || newPassword.length < 6) {
          return { ok: false, message: 'New password must be at least 6 characters' }
        }

        try {
          // Re-authenticate before changing password (Firebase security requirement)
          const credential = EmailAuthProvider.credential(user.email, currentPassword)
          await reauthenticateWithCredential(user, credential)
          await updatePassword(user, newPassword)
          console.info(`[Admin] Password changed at ${new Date().toISOString()}`)
          return { ok: true }
        } catch (e) {
          const code = e?.code ?? ''
          if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
            return { ok: false, message: 'Current password is incorrect' }
          }
          if (code === 'auth/requires-recent-login') {
            return { ok: false, message: 'Please log out and log back in, then try again.' }
          }
          return { ok: false, message: e?.message || 'Failed to update password' }
        }
      },

      /* ── Log CRUD action ───────────────────────────────────────────────── */
      logAction(action, details = '') {
        const email = auth.currentUser?.email ?? 'unknown'
        console.info(`[Admin] ${action}${details ? ': ' + details : ''} by ${email} at ${new Date().toISOString()}`)
      },
    }
  }, [ready])

  const value = useMemo(() => ({ auth: auth_state, actions, ready }), [auth_state, actions, ready])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
