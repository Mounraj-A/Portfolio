import { motion } from 'framer-motion'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

export default function Timeline() {
  const { state } = usePortfolio()
  const timeline = state.timeline || []

  return (
    <section id="timeline" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Experience Timeline"
        title="Journey of Innovation"
      // subtitle="From foundational learning to developing scalable applications and intelligent systems."
      />

      <div className="container-x mt-12">
        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-2 h-full w-px bg-gradient-to-b from-accentCyan/60 via-white/10 to-accentPurple/60 sm:left-1/2" />

          <div className="grid gap-6">
            {timeline.map((t, idx) => {
              const left = idx % 2 === 0
              return (
                <MotionReveal key={t.title} delay={0.05 * idx}>
                  <div className="relative grid gap-4 sm:grid-cols-2">
                    <div className={`${left ? 'sm:pr-10' : 'sm:order-2 sm:pl-10'}`}>
                      <GlassCard className="p-6 hover:border-white/20">
                        <div className="flex items-center justify-between gap-3">
                          <span className="chip">{t.year}</span>
                          <span className="text-xs font-semibold text-muted">Milestone</span>
                        </div>
                        <h3 className="mt-3 font-poppins text-lg font-bold">{t.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{t.desc}</p>
                      </GlassCard>
                    </div>

                    <div className={`${left ? 'sm:order-2 sm:pl-10' : 'sm:pr-10'}`}>
                      <div className="hidden sm:block" />
                    </div>

                    <motion.div
                      className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-accentCyan shadow-glowCyan sm:left-1/2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.15 }}
                    />
                  </div>
                </MotionReveal>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container-x mt-16">
        <div className="neon-divider" />
      </div>
    </section>
  )
}
