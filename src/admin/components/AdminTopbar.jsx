import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'

export default function AdminTopbar({ title, onOpenSidebar }) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-base/50 backdrop-blur-xl">
      <div className="container-x py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
              onClick={onOpenSidebar}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <div className="text-xs font-semibold text-muted">Admin</div>
              <div className="font-poppins text-lg font-extrabold">
                <span className="gradient-text">{title}</span>
              </div>
            </div>
          </div>

          <motion.div
            className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-muted"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            Live preview updates the portfolio instantly
          </motion.div>
        </div>
      </div>
    </div>
  )
}
