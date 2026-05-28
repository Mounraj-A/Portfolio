import { motion } from 'framer-motion'
import GlassCard from '../../components/GlassCard.jsx'

export default function AdminStatCard({ label, value, Icon }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.18 }}>
      <GlassCard className="relative overflow-hidden p-6 hover:border-white/20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accentCyan/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-accentPurple/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-muted">{label}</div>
            <div className="mt-2 font-poppins text-3xl font-extrabold">{value}</div>
          </div>

          {Icon ? (
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Icon className="h-6 w-6 text-accentCyan" />
            </div>
          ) : null}
        </div>
      </GlassCard>
    </motion.div>
  )
}
