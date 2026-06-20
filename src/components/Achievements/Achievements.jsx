import { motion } from 'framer-motion'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { getIconByKey } from '../../utils/iconRegistry.js'

export default function Achievements() {
  const { state } = usePortfolio()
  const achievements = state.achievements || []

  return (
    <section id="achievements" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Achievements"
        title="Growth Through Action"
      // subtitle="Showcasing accomplishments through projects, certifications, and practical experience."
      />

      {/* overflow-hidden clips the scroll viewport — card 5 hidden until scrolled */}
      <div className="container-x mt-12 overflow-hidden">
        {/* hide-scrollbar = existing CSS utility that hides bar cross-browser */}
        <div className="hide-scrollbar flex gap-5 overflow-x-auto">
          {achievements.map((a, idx) => {
            const Icon = getIconByKey(a.iconKey || 'trophy', 'trophy')
            return (
              /*
               * Width = (container - 3 gaps) / 4
               * gap-5 = 1.25rem → 3 gaps = 3.75rem → per-gap share = 0.9375rem
               * So each card = calc(25% - 0.9375rem)
               * MotionReveal carries the width so it is the flex child with correct sizing.
               */
              <MotionReveal
                key={a.id || a.title}
                delay={0.05 * Math.min(idx, 5)}
                className="w-[calc(25%-0.9375rem)] flex-none"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.18 }}
                >
                  {/* Fixed height — content NEVER changes card size */}
                  <GlassCard className="h-[220px] p-6 hover:border-white/20 flex flex-col overflow-hidden">

                    {/* Icon */}
                    <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-6 w-6 text-accentCyan" />
                    </div>

                    {/* Title — exactly 1 line */}
                    <h3 className="mt-4 w-full min-w-0 overflow-hidden font-poppins text-lg font-bold leading-snug line-clamp-1">
                      {a.title}
                    </h3>

                    {/* Description — exactly 3 lines */}
                    <p className="mt-2 w-full min-w-0 overflow-hidden text-sm leading-relaxed text-muted line-clamp-3">
                      {a.desc}
                    </p>

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
