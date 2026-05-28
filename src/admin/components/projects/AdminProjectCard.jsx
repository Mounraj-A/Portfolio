import { motion } from 'framer-motion'
import { ExternalLink, Github, Pencil, Trash2, Eye } from 'lucide-react'

function Chip({ children }) {
  return <span className="chip border-white/10 bg-white/5">{children}</span>
}

export default function AdminProjectCard({ project, onEdit, onDelete, onPreview }) {
  const tech = project?.tech || []

  return (
    <motion.div
      className="glass group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accentCyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-accentPurple/10 blur-3xl" />

      <div className="relative">
        <div className="grid gap-4 sm:grid-cols-[170px_1fr] sm:items-stretch">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="aspect-[4/3] w-full">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                  No image
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="chip">Project</div>
                <h3 className="mt-2 truncate font-poppins text-lg font-extrabold">
                  {project.title || 'Untitled'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPreview(project)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                  aria-label="Preview"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(project)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(project)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="mt-2 line-clamp-2 text-sm text-muted">{project.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {tech.slice(0, 6).map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
              {tech.length > 6 ? <Chip>+{tech.length - 6}</Chip> : null}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
