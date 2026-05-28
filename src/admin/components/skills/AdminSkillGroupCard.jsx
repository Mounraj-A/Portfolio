import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getIconByKey } from '../../../utils/iconRegistry.js'

export default function AdminSkillGroupCard({
  group,
  onAddSkill,
  onEditGroup,
  onDeleteGroup,
  onEditSkill,
  onDeleteSkill,
}) {
  const GroupIcon = getIconByKey(group.groupIconKey, 'react')

  return (
    <motion.div
      className="glass relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accentCyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-accentPurple/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <GroupIcon className="h-6 w-6 text-accentCyan" />
            </div>
            <div>
              <div className="chip">Skill Group</div>
              <div className="mt-2 font-poppins text-lg font-extrabold">{group.title}</div>
              <div className="mt-1 text-xs text-muted">{group.items?.length || 0} skills</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => onAddSkill(group)}
              aria-label="Add skill"
              title="Add skill"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => onEditGroup(group)}
              aria-label="Edit group"
              title="Edit group"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => onDeleteGroup(group)}
              aria-label="Delete group"
              title="Delete group"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {(group.items || []).length ? (
            (group.items || []).map((s) => {
              const SkillIcon = getIconByKey(s.iconKey, 'code2')
              return (
                <motion.div
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <SkillIcon className="h-5 w-5 text-text" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{s.name}</div>
                      <div className="mt-1 text-xs text-muted">Level: {s.level}%</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditSkill(group, s)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                      aria-label="Edit skill"
                      title="Edit skill"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSkill(group, s)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                      aria-label="Delete skill"
                      title="Delete skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted">
              No skills in this group yet.
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-2 sm:hidden">
          <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => onAddSkill(group)}>
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
          <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => onEditGroup(group)}>
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => onDeleteGroup(group)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  )
}
