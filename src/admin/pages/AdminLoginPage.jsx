import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import GlassCard from '../../components/GlassCard.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLoginPage() {
  const { auth, actions } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [show, setShow] = useState(false)
  const [status, setStatus] = useState('')
  const [form, setForm] = useState({ username: 'admin', password: '' })

  const from = useMemo(() => {
    const path = location.state?.from
    return typeof path === 'string' && path.startsWith('/admin') ? path : '/admin'
  }, [location.state])

  useEffect(() => {
    if (!auth.isAuthed) return
    navigate(from, { replace: true })
  }, [auth.isAuthed, from, navigate])

  function onSubmit(e) {
    e.preventDefault()
    setStatus('')
    const res = actions.login({ username: form.username, password: form.password })
    if (!res.ok) {
      setStatus(res.message || 'Login failed')
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-base">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero-radial" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.18] [background-size:48px_48px] bg-grid" />

      <div className="container-x flex min-h-screen items-center justify-center py-16">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <GlassCard className="relative overflow-hidden p-7 sm:p-8 hover:border-white/20">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accentCyan/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-accentPurple/10 blur-3xl" />

            <div className="relative">
              <div className="chip">Admin Login</div>
              <h1 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">Welcome back</span>
              </h1>
              <p className="mt-2 text-sm text-muted">
                Sign in to manage your portfolio content.
              </p>

              <form onSubmit={onSubmit} className="mt-7 grid gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted">Username</label>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <User className="h-5 w-5 text-accentCyan" />
                    <input
                      value={form.username}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, username: e.target.value }))
                      }
                      className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                      placeholder="admin"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted">Password</label>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <Lock className="h-5 w-5 text-accentCyan" />
                    <input
                      type={show ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, password: e.target.value }))
                      }
                      className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                      placeholder="admin123"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                      aria-label={show ? 'Hide password' : 'Show password'}
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary mt-2 w-full justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login
                </motion.button>

                {status ? <div className="text-xs text-red-300">{status}</div> : null}

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted">
                  Temporary credentials: <span className="text-text">admin</span> /{' '}
                  <span className="text-text">admin123</span>
                </div>
              </form>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
