import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, X } from 'lucide-react'
import { getIconByKey } from '../../utils/iconRegistry.js'
import { useAuth } from '../../context/AuthContext.jsx'

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', iconKey: 'dashboard' },
  { to: '/admin/projects', label: 'Projects', iconKey: 'projects' },
  { to: '/admin/certificates', label: 'Certificates', iconKey: 'certificates' },
  { to: '/admin/skills', label: 'Skills', iconKey: 'skills' },
  { to: '/admin/about', label: 'About', iconKey: 'about' },
  { to: '/admin/resume', label: 'Resume', iconKey: 'resume' },
  { to: '/admin/contact', label: 'Contact', iconKey: 'contact' },
  { to: '/admin/services', label: 'Services', iconKey: 'services' },
  { to: '/admin/achievements', label: 'Achievements', iconKey: 'achievements' },
  { to: '/admin/timeline', label: 'Timeline', iconKey: 'timeline' },
  { to: '/admin/settings', label: 'Settings', iconKey: 'settings' },
]

function Item({ to, label, iconKey, onNavigate }) {
  const Icon = getIconByKey(iconKey)
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold transition',
          'hover:border-white/10 hover:bg-white/5',
          isActive ? 'border-white/10 bg-white/5 text-text' : 'text-muted',
        ].join(' ')
      }
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <Icon className="h-5 w-5 text-accentCyan" />
      </span>
      <span className="flex-1">{label}</span>
      <span className="h-px w-0 bg-gradient-to-r from-accentCyan via-accentBlue to-accentPurple opacity-60 transition-all duration-300 group-hover:w-10" />
    </NavLink>
  )
}

export default function AdminSidebar({ mobileOpen, onClose }) {
  const { actions } = useAuth()
  const navigate = useNavigate()

  const sidebar = (
    <div className="glass h-screen w-[280px] border-r border-white/10 bg-base/60 p-4 backdrop-blur-xl flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="group inline-flex items-center gap-2"
          aria-label="Go to portfolio"
        >
          <span className="font-poppins text-base font-bold tracking-wide">
            <span className="gradient-text">Admin</span>
            <span className="text-muted">.panel</span>
          </span>
        </button>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto -mx-4 px-4">
        <div className="grid gap-2">
          {nav.map((i) => (
            <Item key={i.to} {...i} onNavigate={onClose} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => {
            actions.logout()
            navigate('/admin-login', { replace: true })
          }}
          className="btn-secondary w-full justify-center"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden md:block">{sidebar}</div>

      {mobileOpen ? (
        <motion.div
          className="fixed inset-0 z-[70] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="absolute left-0 top-0 h-full"
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -18, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {sidebar}
          </motion.div>
        </motion.div>
      ) : null}
    </>
  )
}
