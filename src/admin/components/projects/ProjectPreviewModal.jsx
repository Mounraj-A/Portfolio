import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Github, Sparkles, X, CheckCircle2 } from 'lucide-react'

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
            aria-label="Close modal"
            className="absolute inset-0 bg-black/60"
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
                      <div className="chip">Preview</div>
                      <h3 className="mt-3 font-poppins text-2xl font-extrabold">
                        {project?.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                        {project?.longDescription || project?.description}
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
                    {project?.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-[240px] w-full object-cover sm:h-[320px]"
                      />
                    ) : (
                      <div className="flex h-[240px] w-full items-center justify-center text-xs text-muted">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="h-4 w-4 text-accentCyan" />
                        Tech Stack
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(project?.tech || []).map((t) => (
                          <span key={t} className="chip">
                            {t}
                          </span>
                        ))}
                      </div>

                      {(project?.highlights || []).length ? (
                        <>
                          <div className="mt-6 text-sm font-semibold">Key Highlights</div>
                          <ul className="mt-3 space-y-2 text-sm text-muted">
                            {project.highlights.map((h) => (
                              <li key={h} className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-accentCyan" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </div>

                    <div className="glass rounded-2xl p-5">
                      <div className="text-sm font-semibold">Links</div>
                      <div className="mt-4 grid gap-3">
                        <a
                          href={project?.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary"
                        >
                          <Github className="h-4 w-4" />
                          GitHub Repository
                        </a>
                        <a
                          href={project?.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Live Demo
                        </a>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted">
                          This preview matches the data used by your existing portfolio Projects UI.
                        </div>
                      </div>
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
