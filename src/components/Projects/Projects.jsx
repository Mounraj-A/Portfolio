import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Eye } from 'lucide-react'
import SectionHeader from '../SectionHeader.jsx'
import GlassCard from '../GlassCard.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import ProjectModal from './ProjectModal.jsx'
import { getProjectIcon } from '../../utils/projectIconRegistry.js'

/* ─── Tech chip color map ─────────────────────────────────────────────── */
const TECH_COLORS = {
  // JavaScript ecosystem
  react: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/25',
  nextjs: 'bg-white/10 text-white/80 border-white/15',
  'next.js': 'bg-white/10 text-white/80 border-white/15',
  vue: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25',
  angular: 'bg-red-500/15 text-red-300 border-red-400/25',
  svelte: 'bg-orange-500/15 text-orange-300 border-orange-400/25',
  typescript: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
  javascript: 'bg-yellow-500/15 text-yellow-300 border-yellow-400/25',
  js: 'bg-yellow-500/15 text-yellow-300 border-yellow-400/25',
  ts: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
  // Backend
  'node.js': 'bg-green-500/15 text-green-300 border-green-400/25',
  nodejs: 'bg-green-500/15 text-green-300 border-green-400/25',
  node: 'bg-green-500/15 text-green-300 border-green-400/25',
  express: 'bg-gray-500/15 text-gray-300 border-gray-400/25',
  django: 'bg-green-600/15 text-green-400 border-green-500/25',
  flask: 'bg-gray-500/15 text-gray-300 border-gray-400/25',
  fastapi: 'bg-teal-500/15 text-teal-300 border-teal-400/25',
  // Languages
  python: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
  java: 'bg-orange-600/15 text-orange-300 border-orange-400/25',
  'c++': 'bg-blue-600/15 text-blue-300 border-blue-400/25',
  'c#': 'bg-purple-600/15 text-purple-300 border-purple-400/25',
  go: 'bg-cyan-600/15 text-cyan-300 border-cyan-400/25',
  rust: 'bg-orange-700/15 text-orange-400 border-orange-500/25',
  // Databases
  mongodb: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25',
  postgresql: 'bg-blue-600/15 text-blue-300 border-blue-400/25',
  postgres: 'bg-blue-600/15 text-blue-300 border-blue-400/25',
  mysql: 'bg-orange-500/15 text-orange-300 border-orange-400/25',
  redis: 'bg-red-500/15 text-red-300 border-red-400/25',
  sqlite: 'bg-sky-500/15 text-sky-300 border-sky-400/25',
  supabase: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25',
  // Cloud & Infra
  firebase: 'bg-amber-500/15 text-amber-300 border-amber-400/25',
  aws: 'bg-orange-500/15 text-orange-300 border-orange-400/25',
  gcp: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
  azure: 'bg-sky-500/15 text-sky-300 border-sky-400/25',
  docker: 'bg-sky-500/15 text-sky-300 border-sky-400/25',
  kubernetes: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
  // Styling
  tailwind: 'bg-sky-500/15 text-sky-300 border-sky-400/25',
  tailwindcss: 'bg-sky-500/15 text-sky-300 border-sky-400/25',
  css: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
  sass: 'bg-pink-500/15 text-pink-300 border-pink-400/25',
  // Payments & APIs
  stripe: 'bg-violet-500/15 text-violet-300 border-violet-400/25',
  // AI / ML
  tensorflow: 'bg-orange-500/15 text-orange-300 border-orange-400/25',
  pytorch: 'bg-red-500/15 text-red-300 border-red-400/25',
  openai: 'bg-teal-500/15 text-teal-300 border-teal-400/25',
  // Other
  graphql: 'bg-pink-500/15 text-pink-300 border-pink-400/25',
  rest: 'bg-indigo-500/15 text-indigo-300 border-indigo-400/25',
  socket: 'bg-purple-500/15 text-purple-300 border-purple-400/25',
}

/* ─── Neon fallback palette for unknown tags ──────────────────────────── */
const FALLBACK_COLORS = [
  'bg-cyan-500/15 text-cyan-300 border-cyan-400/25',
  'bg-purple-500/15 text-purple-300 border-purple-400/25',
  'bg-pink-500/15 text-pink-300 border-pink-400/25',
  'bg-emerald-500/15 text-emerald-300 border-emerald-400/25',
  'bg-orange-500/15 text-orange-300 border-orange-400/25',
  'bg-indigo-500/15 text-indigo-300 border-indigo-400/25',
  'bg-red-500/15 text-red-300 border-red-400/25',
  'bg-teal-500/15 text-teal-300 border-teal-400/25',
  'bg-amber-500/15 text-amber-300 border-amber-400/25',
  'bg-violet-500/15 text-violet-300 border-violet-400/25',
  'bg-sky-500/15 text-sky-300 border-sky-400/25',
  'bg-lime-500/15 text-lime-300 border-lime-400/25',
]

/** Simple djb2-style hash → stable index into FALLBACK_COLORS */
function hashTag(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i)
    h = h >>> 0 // keep as unsigned 32-bit
  }
  return h % FALLBACK_COLORS.length
}

function getTechColor(tech) {
  const key = tech.toLowerCase().replace(/\s+/g, '')
  return (
    TECH_COLORS[key] ||
    TECH_COLORS[tech.toLowerCase()] ||
    FALLBACK_COLORS[hashTag(key)]
  )
}

/* ─── Project icon resolver (uses Firestore iconKey via registry) ─────── */
// Returns a consistent icon style regardless of key so the card always looks premium.
const ICON_STYLE = {
  glow: 'shadow-accentCyan/30',
  iconBg: 'from-accentCyan/25 to-accentBlue/15',
  iconColor: 'text-accentCyan',
}

/* ─── Project Card ───────────────────────────────────────────────────── */
function ProjectCard({ project, onOpen }) {
  // Resolve icon from Firestore iconKey; fallback to Code2 if missing/unknown
  const Icon = getProjectIcon(project.iconKey)
  const { glow, iconBg, iconColor } = ICON_STYLE

  return (
    <motion.div
      className="flex flex-col min-w-0"
      whileHover={{
        y: -6,
        boxShadow: '0 24px 64px rgba(0,212,255,0.12), 0 0 0 1px rgba(255,255,255,0.08)',
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Enhanced glass card */}
      <div className="relative flex flex-col min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-card backdrop-blur-xl p-5 transition-all duration-200 hover:border-white/20 hover:brightness-105">

        {/* ambient glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accentCyan/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accentPurple/8 blur-3xl" />

        {/* ── header: icon + preview button ── */}
        <div className="relative flex items-start justify-between gap-3">

          {/* Premium icon box */}
          <div className={`inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} border border-white/10 shadow-lg ${glow}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>

          {/* Preview eye button */}
          <button
            type="button"
            aria-label="Preview project"
            onClick={() => onOpen(project)}
            className="flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/20 hover:shadow-md hover:shadow-accentCyan/20 hover:brightness-125"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* ── title — exactly 1 line, truncates with … ── */}
        <h3 className="relative mt-3 w-full min-w-0 overflow-hidden font-poppins text-base font-bold leading-snug text-white line-clamp-1">
          {project.title}
        </h3>

        {/* ── description — exactly 2 lines, truncates with … ── */}
        <p className="relative mt-2 w-full min-w-0 overflow-hidden text-sm leading-relaxed text-white/50 line-clamp-2">
          {project.description}
        </p>

        {/* ── tech chips — always directly below description ── */}
        <div className="relative mt-3 flex flex-wrap gap-1.5 min-h-[1.5rem]">
          {project.tech?.length > 0
            ? project.tech.map((t) => (
              <span
                key={t}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getTechColor(t)}`}
              >
                {t}
              </span>
            ))
            : null}
        </div>

        {/* subtle divider */}
        {/* <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" /> */}

        {/* ── action buttons ── */}
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
    </motion.div>
  )
}

/* ─── Section ────────────────────────────────────────────────────────── */
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
        {/* Horizontal scroll container — snaps every card, shows ~3 cards */}
        <div
          className="hide-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory"
        >
          {items.map((p, idx) => (
            <motion.div
              key={p.id}
              className="snap-start flex-shrink-0 w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 * Math.min(idx, 5) }}
            >
              <ProjectCard project={p} onOpen={setSelected} />
            </motion.div>
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
