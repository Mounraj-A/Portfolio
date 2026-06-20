import { motion } from 'framer-motion'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { getIconByKey } from '../../utils/iconRegistry.js'

export default function Services() {
  const { state } = usePortfolio()
  const services = state.services || []

  return (
    <section id="services" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Services"
        title="Crafting Digital Solutions"
      //subtitle="Building responsive, scalable, and user-focused digital experiences."
      />

      <div className="container-x mt-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {services.map((s, idx) => {
            const Icon = getIconByKey(s.iconKey || 'layout', 'layout')
            return (
              <MotionReveal key={s.title} delay={0.05 * idx} className="flex flex-col">
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="flex flex-col flex-1">
                  <GlassCard className="relative flex flex-col flex-1 min-h-[280px] overflow-hidden p-6 hover:border-white/20">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accentCyan/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-accentPurple/10 blur-3xl" />

                    <div className="relative flex h-full flex-col">
                      <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <Icon className="h-6 w-6 text-accentCyan" />
                      </div>
                      <h3 className="mt-4 line-clamp-2 font-poppins text-lg font-bold">{s.title}</h3>
                      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">{s.desc}</p>

                      <div className="flex-grow" />

                      {Array.isArray(s.tags) && s.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-4">
                          {s.tags.map((tag) => (
                            <span key={tag} className="chip">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              </MotionReveal>
            )
          })}
        </div>
      </div>

      <div className="container-x mt-16">
        <div className="neon-divider" />
      </div>
    </section>
  )
}
