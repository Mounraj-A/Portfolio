import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, X } from 'lucide-react'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

function CertificateModal({ cert, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        type="button"
        aria-label="Close certificate preview"
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
                  <span className="chip">Certificate</span>
                  <h3 className="mt-3 font-poppins text-2xl font-extrabold">
                    {cert.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                    {cert.description || cert.note}
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
                <img
                  src={cert.image}
                  alt={`${cert.title} certificate preview`}
                  className="h-[240px] w-full object-cover sm:h-[420px]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Certifications() {
  const [selected, setSelected] = useState(null)
  const { state } = usePortfolio()
  const certs = state.certificates || []

  return (
    <section id="certifications" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Certifications"
        title="Knowledge & Growth"
      // subtitle="Certifications and workshops that showcase my dedication to skill development."
      />

      <div className="container-x mt-12">
        <MotionReveal>
          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {certs.map((c, idx) => (
              <motion.div
                key={c.id || c.title}
                className="min-w-[260px] sm:min-w-[320px]"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <GlassCard className="h-full p-6 hover:border-white/20">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <Award className="h-6 w-6 text-accentCyan" />
                      </div>
                      <span className="chip">Certification</span>
                    </div>

                    <h3 className="mt-4 font-poppins text-lg font-bold">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{c.description || c.note}</p>

                    <motion.button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="btn-primary mt-5 w-full justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Certificate
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </MotionReveal>
      </div>

      <AnimatePresence>
        {selected ? (
          <CertificateModal cert={selected} onClose={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>

      <div className="container-x mt-16">
        <div className="neon-divider" />
      </div>
    </section>
  )
}
