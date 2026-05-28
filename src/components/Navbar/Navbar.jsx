import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { scrollToId } from '../../utils/scrollToId.js'

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const chrome = useMemo(() => {
    if (!scrolled) return 'bg-transparent'
    return 'bg-base/60 backdrop-blur-xl border-b border-white/10'
  }, [scrolled])

  function onNav(id) {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header className={`sticky top-0 z-50 ${chrome}`}>
      <div className="container-x">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => onNav('home')}
            className="group inline-flex items-center gap-2"
            aria-label="Go to home"
          >
            <span className="relative text-sm font-bold tracking-wide">
              <span className="font-poppins text-base">
                <span className="gradient-text">Mounraj</span>
                <span className="text-muted">.dev</span>
              </span>
              <span className="pointer-events-none absolute -bottom-2 left-0 h-px w-0 bg-gradient-to-r from-accentCyan via-accentBlue to-accentPurple transition-all duration-300 group-hover:w-full" />
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNav(item.id)}
                className="relative rounded-xl px-4 py-2 text-sm font-semibold text-muted transition hover:text-text"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 rounded-xl bg-white/5 opacity-0 transition-opacity hover:opacity-100" />
              </button>
            ))}
            <a
              href="/resume.pdf"
              className="btn-secondary ml-2"
              download
            >
              Download Resume
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-text hover:bg-white/10"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-base/70 backdrop-blur-xl"
          >
            <div className="container-x py-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNav(item.id)}
                    className="glass rounded-xl px-4 py-3 text-left text-sm font-semibold text-text hover:border-white/20 hover:bg-white/10"
                  >
                    {item.label}
                  </button>
                ))}
                <a href="/resume.pdf" download className="btn-primary">
                  Download Resume
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
