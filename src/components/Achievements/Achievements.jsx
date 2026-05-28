import { motion } from 'framer-motion'
import { Trophy, GraduationCap, Users, Briefcase } from 'lucide-react'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'

const achievements = [
  {
    title: 'Hackathons',
    desc: 'Built fast prototypes under time constraints and learned to ship quickly.',
    Icon: Trophy,
  },
  {
    title: 'Workshops',
    desc: 'Participated in AI and development workshops to sharpen fundamentals.',
    Icon: Users,
  },
  {
    title: 'Certifications',
    desc: 'Completed structured courses to build strong, job-ready skills.',
    Icon: GraduationCap,
  },
  {
    title: 'Internships',
    desc: 'Explored real-world workflows in data science and applied learning.',
    Icon: Briefcase,
  },
]

export default function Achievements() {
  return (
    <section id="achievements" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Achievements"
        title="Consistency over time"
        subtitle="Highlights from projects, workshops, certifications, and practical experiences."
      />

      <div className="container-x mt-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a, idx) => (
            <MotionReveal key={a.title} delay={0.05 * idx}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.18 }}>
                <GlassCard className="h-full p-6 hover:border-white/20">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <a.Icon className="h-6 w-6 text-accentCyan" />
                  </div>
                  <h3 className="mt-4 font-poppins text-lg font-bold">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{a.desc}</p>
                </GlassCard>
              </motion.div>
            </MotionReveal>
          ))}
        </div>
      </div>

      <div className="container-x mt-16">
        <div className="neon-divider" />
      </div>
    </section>
  )
}
