import { motion } from 'framer-motion'
import { Layout, Server, Layers3, Smartphone, Sparkles } from 'lucide-react'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'

const services = [
  {
    title: 'Frontend Development',
    desc: 'Premium UI with React + Tailwind, glassmorphism, and smooth interactions.',
    Icon: Layout,
  },
  {
    title: 'Backend APIs',
    desc: 'Clean REST APIs with structured layers, validation, and scalable patterns.',
    Icon: Server,
  },
  {
    title: 'Full Stack Applications',
    desc: 'End-to-end apps with modern architecture, responsive UX, and data flows.',
    Icon: Layers3,
  },
  {
    title: 'Responsive Web Design',
    desc: 'Mobile-first layouts that feel consistent on every screen size.',
    Icon: Smartphone,
  },
  {
    title: 'AI Integration',
    desc: 'AI-driven features like chatbots, recommendations, and automation.',
    Icon: Sparkles,
  },
]

export default function Services() {
  return (
    <section id="services" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Services"
        title="What I can help you build"
        subtitle="Modern, production-ready digital experiences with an AI-inspired premium finish."
      />

      <div className="container-x mt-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, idx) => (
            <MotionReveal key={s.title} delay={0.05 * idx}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <GlassCard className="relative h-full overflow-hidden p-6 hover:border-white/20">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accentCyan/10 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-accentPurple/10 blur-3xl" />

                  <div className="relative">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <s.Icon className="h-6 w-6 text-accentCyan" />
                    </div>
                    <h3 className="mt-4 font-poppins text-lg font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>

                    <div className="mt-6 flex items-center gap-2">
                      <span className="chip">Premium UI</span>
                      <span className="chip">Responsive</span>
                      <span className="chip">Animated</span>
                    </div>
                  </div>
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
