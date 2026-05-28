import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, X } from 'lucide-react'

export default function CertificatePreviewModal({ open, cert, onClose }) {
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

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close preview"
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
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accentCyan/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-accentPurple/10 blur-3xl" />

                <div className="relative p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="chip">Preview</span>
                      <h3 className="mt-3 font-poppins text-2xl font-extrabold">
                        {cert?.title}
                      </h3>
                      <div className="mt-2 text-sm text-muted">
                        {cert?.organization ? cert.organization : '—'}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                        {cert?.description || cert?.note}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    {cert?.image ? (
                      <img
                        src={cert.image}
                        alt={`${cert.title} certificate preview`}
                        className="h-[240px] w-full object-cover sm:h-[420px]"
                      />
                    ) : (
                      <div className="flex h-[240px] w-full items-center justify-center text-xs text-muted sm:h-[420px]">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-accentCyan" />
                      This preview uses the same data shape as the portfolio Certifications section.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
