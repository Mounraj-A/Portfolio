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

      <div className="container-x mt-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a, idx) => {
            const Icon = getIconByKey(a.iconKey || 'trophy', 'trophy')
            return (
              <MotionReveal key={a.title} delay={0.05 * idx}>
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.18 }}>
                  <GlassCard className="h-full p-6 hover:border-white/20">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-6 w-6 text-accentCyan" />
                    </div>
                    <h3 className="mt-4 font-poppins text-lg font-bold">{a.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{a.desc}</p>
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
