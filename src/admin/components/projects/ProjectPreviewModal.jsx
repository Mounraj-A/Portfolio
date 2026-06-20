import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Layers } from 'lucide-react'

export default function ProjectPreviewModal({ open, project, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const hasImage = Boolean(project?.image)
  const hasTech = Array.isArray(project?.tech) && project.tech.length > 0
  const fullDesc = (project?.description && project.description.trim())
    ? project.description.trim()
    : (project?.longDescription || '').trim()

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <motion.button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="absolute inset-0 overflow-y-auto p-4 sm:p-8">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="mx-auto w-full max-w-4xl"
              initial={{ y: 18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 14, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="glass relative overflow-hidden rounded-3xl border-white/10">
                {/* ambient glows */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accentCyan/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-accentPurple/10 blur-3xl" />

                <div className="relative p-5 sm:p-7">

                  {/* ── 1. Header: eyebrow + title + close ── */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="chip">Preview</div>
                      <h3 className="mt-3 font-poppins text-2xl font-extrabold leading-snug text-white">
                        {project?.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* ── 2. Project image (object-contain, no cropping) ── */}
                  {hasImage && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <img
                        src={project.image}
                        alt={project?.title}
                        className="w-full object-contain"
                        style={{ maxHeight: '360px' }}
                      />
                    </div>
                  )}

                  {/* ── 3. Tech Stack ── */}
                  {hasTech && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Layers className="h-4 w-4 text-accentCyan" />
                        Tech Stack
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span key={t} className="chip">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── 4. Full description ── */}
                  {fullDesc && (
                    <div className="mt-6">
                      <div className="text-sm font-semibold">About this project</div>
                      <p
                        style={{ color: '#9CA3AF', position: 'relative', zIndex: 20 }}
                        className="mt-3 text-sm leading-relaxed sm:text-base"
                      >
                        {fullDesc}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
