import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Sparkles } from 'lucide-react'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'
import TiltCard from '../TiltCard.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import ProjectModal from './ProjectModal.jsx'

function Badge({ children }) {
  return <span className="chip border-white/10 bg-white/5">{children}</span>
}

function ProjectCard({ project, onOpen }) {
  return (
    <TiltCard className="h-full">
      <motion.div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(project)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen(project)
          }
        }}
        className="group block h-full w-full cursor-pointer text-left outline-none"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.18 }}
      >
        <GlassCard className="relative h-full overflow-hidden p-4 hover:border-white/20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accentCyan/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-accentPurple/10 blur-3xl" />

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img
                src={project.image}
                alt={project.title}
                className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>

            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-poppins text-lg font-bold">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-muted">
                <Sparkles className="h-4 w-4 text-accentCyan" />
                Premium
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-secondary"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-primary"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </TiltCard>
  )
}

export default function Projects() {
  const [selected, setSelected] = useState(null)
  const { state } = usePortfolio()
  const items = useMemo(() => state.projects || [], [state.projects])

  return (
    <section id="projects" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Projects"
        title="Turning Ideas into Reality"
      // subtitle="A collection of scalable applications, intelligent systems, and impactful digital experiences."
      />

      <div className="container-x mt-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, idx) => (
            <MotionReveal key={p.id} delay={0.05 * idx}>
              <ProjectCard project={p} onOpen={setSelected} />
            </MotionReveal>
          ))}
        </div>


      </div>

      <AnimatePresence>
        {selected ? (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>

      <div className="container-x mt-16">
        <div className="neon-divider" />
      </div>
    </section>
  )
}
