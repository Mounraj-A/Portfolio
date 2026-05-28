import { motion } from 'framer-motion'
import { Code2, Database, Brain, Palette } from 'lucide-react'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

const roles = [
  {
    title: 'Frontend Developer',
    desc: 'Crafting crisp, responsive interfaces with React and modern UI patterns.',
    Icon: Code2,
  },
  {
    title: 'Backend Developer',
    desc: 'Building reliable APIs and scalable server-side logic with clean architecture.',
    Icon: Database,
  },
  {
    title: 'AI Enthusiast',
    desc: 'Exploring ML systems, chatbots, and data-driven features that feel magical.',
    Icon: Brain,
  },
  {
    title: 'UI/UX Designer',
    desc: 'Designing premium flows with elegant spacing, hierarchy, and motion.',
    Icon: Palette,
  },
]

export default function About() {
  const { state } = usePortfolio()
  const about = state.about

  return (
    <section id="about" className="section scroll-mt-24">
      <SectionHeader
        eyebrow={about?.sectionHeader?.eyebrow || 'About'}
        title={about?.sectionHeader?.title || 'Building products with clarity and craft'}
        subtitle={
          about?.sectionHeader?.subtitle ||
          'Computer Science Engineering student and full stack developer focused on clean UI, scalable systems, and AI-powered experiences.'
        }
      />

      <div className="container-x mt-12">
        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <MotionReveal>
            <GlassCard className="p-6 sm:p-8 relative overflow-hidden">

              {/* Glow Effects */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accentCyan/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accentPurple/10 blur-3xl" />

              <div className="relative">

                {/* Heading */}
                <h3 className="font-poppins text-2xl font-bold bg-gradient-to-r from-accentCyan to-accentPurple bg-clip-text text-transparent">
                  Hello, I’m {about?.heroName || 'Mounraj'}
                </h3>
               {/* Paragraph */}
                <p className="mt-4 text-sm leading-relaxed !text-gray-400 sm:text-base">
                  {about?.paragraph ||
                    'I’m a Computer Science Engineering student passionate about building modern web applications with clean UI, responsive design, and scalable backend systems. I enjoy working with React, Tailwind CSS, Java, and AI-based technologies to create fast and user-friendly digital experiences.'}
                </p>
                {/* Info Cards */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">

                  <div className="glass rounded-3xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-accentCyan/30 hover:bg-white/10">
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      {about?.infoCards?.collegeLabel || 'College'}
                    </div>
                    <div className="mt-2 text-base font-bold text-white">
                      {about?.infoCards?.collegeValue || 'CSE (Engineering)'}
                    </div>
                  </div>

                  <div className="glass rounded-3xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-accentPurple/30 hover:bg-white/10">
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      {about?.infoCards?.careerGoalLabel || 'Career Goal'}
                    </div>
                    <div className="mt-2 text-base font-bold text-white">
                      {about?.infoCards?.careerGoalValue || 'Full Stack + AI Engineer'}
                    </div>
                  </div>

                  <div className="glass rounded-3xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-accentCyan/30 hover:bg-white/10">
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      {about?.infoCards?.interestsLabel || 'Interests'}
                    </div>
                    <div className="mt-2 text-base font-bold text-white">
                      {about?.infoCards?.interestsValue || 'UI/UX, Systems, ML'}
                    </div>
                  </div>

                  <div className="glass rounded-3xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-accentPurple/30 hover:bg-white/10">
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      {about?.infoCards?.mindsetLabel || 'Mindset'}
                    </div>
                    <div className="mt-2 text-base font-bold text-white">
                      {about?.infoCards?.mindsetValue || 'Learn → Build → Ship'}
                    </div>
                  </div>

                </div>
              </div>
            </GlassCard>
          </MotionReveal>

          {/* RIGHT SIDE */}
          <div className="grid gap-5 sm:grid-cols-2">

            {roles.map((r, idx) => (
              <MotionReveal key={r.title} delay={0.06 * idx}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard className="relative overflow-hidden p-6 border border-white/10 hover:border-white/20">

                    {/* Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-20" />

                    {/* Glow */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accentCyan/10 blur-3xl" />

                    <div className="relative">

                      {/* Icon */}
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg">
                        <r.Icon className="h-6 w-6 text-accentCyan" />
                      </div>

                      {/* Title */}
                      <h4 className="mt-5 font-poppins text-lg font-bold text-white">
                        {r.title}
                      </h4>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-white/75">
                        {r.desc}
                      </p>

                    </div>
                  </GlassCard>
                </motion.div>
              </MotionReveal>
            ))}

          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="container-x mt-16">
        <div className="neon-divider" />
      </div>
    </section>
  )
}