import { motion } from 'framer-motion'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { getIconByKey } from '../../utils/iconRegistry.js'

function Progress({ value }) {
  return (
    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-accentCyan via-accentBlue to-accentPurple"
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </div>
  )
}

export default function Skills() {
  const { state } = usePortfolio()
  const skillGroups = state.skills?.groups || []

  return (
    <section id="skills" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Skills"
        title="A modern full-stack toolkit"
        subtitle="Frontend, backend, databases, tools, and AI/ML — presented with a premium UI and smooth motion."
      />

      <div className="container-x mt-12">
        <div className="flex flex-col gap-5">
          {skillGroups.map((group, idx) => {
            const GroupIcon = getIconByKey(group.groupIconKey, 'react')
            const lgCols =
              group.items.length >= 4
                ? 'lg:grid-cols-4'
                : group.items.length === 3
                  ? 'lg:grid-cols-3'
                  : group.items.length === 2
                    ? 'lg:grid-cols-2'
                    : 'lg:grid-cols-1'

            const smCols = group.items.length === 1 ? 'sm:grid-cols-1' : 'sm:grid-cols-2'

            return (
              <MotionReveal key={group.title} delay={0.06 * idx}>
                <GlassCard className="w-full p-6 sm:p-7 hover:border-white/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <GroupIcon className="h-6 w-6 text-accentCyan" />
                    </div>
                    <div>
                      <h3 className="font-poppins text-lg font-bold">{group.title}</h3>
                      <p className="text-xs text-muted">Focused, practical experience</p>
                    </div>
                  </div>
                  <span className="chip">{group.items.length} skills</span>
                </div>

                <div className={`mt-6 grid gap-4 ${smCols} ${lgCols}`}>
                  {group.items.map((s) => {
                    const SkillIcon = getIconByKey(s.iconKey, 'code2')
                    return (
                      <motion.div
                        key={s.id || s.name}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                              <SkillIcon className="h-5 w-5 text-text" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold">{s.name}</div>
                              <div className="text-xs text-muted">Proficiency</div>
                            </div>
                          </div>
                          <div className="text-xs font-semibold text-muted">{s.level}%</div>
                        </div>
                        <Progress value={s.level} />
                      </motion.div>
                    )
                  })}
                </div>
                </GlassCard>
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
