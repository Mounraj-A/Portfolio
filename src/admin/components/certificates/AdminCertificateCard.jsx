import { motion } from 'framer-motion'
import { Award, Eye, Pencil, Trash2 } from 'lucide-react'

export default function AdminCertificateCard({ cert, onPreview, onEdit, onDelete }) {
  return (
    <motion.div
      className="glass group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accentCyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-accentPurple/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-32 sm:w-32">
            {cert.image ? (
              <img
                src={cert.image}
                alt={cert.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-end">
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPreview(cert)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                  aria-label="Preview"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(cert)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(cert)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 min-w-0">
              <h3 className="truncate font-poppins text-lg font-extrabold">
                {cert.title || 'Untitled'}
              </h3>
              <div className="mt-1 text-xs text-muted">
                {cert.organization ? cert.organization : '—'}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted">
                {cert.description || cert.note}
              </p>
            </div>

            <div className="mt-4 flex justify-end gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => onPreview(cert)}
                className="btn-secondary"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                type="button"
                onClick={() => onEdit(cert)}
                className="btn-secondary"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(cert)}
                className="btn-secondary"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
