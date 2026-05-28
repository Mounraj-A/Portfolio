import { useMemo, useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AdminSidebar from '../components/AdminSidebar.jsx'
import AdminTopbar from '../components/AdminTopbar.jsx'

function titleFromPath(pathname) {
  const key = pathname.split('/').filter(Boolean).slice(1)[0] || 'dashboard'
  const map = {
    dashboard: 'Dashboard',
    projects: 'Projects',
    certificates: 'Certificates',
    skills: 'Skills',
    about: 'About',
    resume: 'Resume',
    contact: 'Contact',
    settings: 'Settings',
  }
  return map[key] || 'Dashboard'
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const title = useMemo(() => titleFromPath(location.pathname), [location.pathname])

  // Lock body scroll when mobile sidebar is open (prevents background scroll on small screens)
  useEffect(() => {
    if (typeof document === 'undefined') return
    const prev = document.body.style.overflow
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prev || ''
    }
    return () => {
      document.body.style.overflow = prev || ''
    }
  }, [mobileOpen])

  return (
    <div className="h-screen bg-base">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero-radial" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.18] [background-size:48px_48px] bg-grid" />

      <div className="flex h-full overflow-hidden">
        <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar title={title} onOpenSidebar={() => setMobileOpen(true)} />

          <main className="flex-1 overflow-y-auto">
            <div className="container-x py-8">
              <AnimatePresence mode="wait" initial={false}>
                <div key={location.pathname}>
                  <Outlet />
                </div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
