import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'

export default function AdminTimelineCard({ item, onEdit, onDelete }) {
  return (
    <motion.div
      className="glass group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accentCyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-accentPurple/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="chip">{item?.year || '—'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h3 className="mt-4 font-poppins text-lg font-extrabold">{item?.title || 'Untitled'}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{item?.desc || '—'}</p>

        <div className="mt-4 flex justify-end gap-2 sm:hidden">
          <button type="button" onClick={() => onEdit(item)} className="btn-secondary">
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button type="button" onClick={() => onDelete(item)} className="btn-secondary">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  )
}
