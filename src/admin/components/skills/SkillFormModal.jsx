import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { listIconKeys } from '../../../utils/iconRegistry.js'

function Field({ label, children, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-semibold text-muted">{label}</label>
        {hint ? <div className="text-[11px] text-muted/70">{hint}</div> : null}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

export default function SkillFormModal({ open, mode, groupTitle, initialSkill, onClose, onSubmit }) {
  const header = mode === 'edit' ? 'Edit Skill' : 'Add Skill'
  const cta = mode === 'edit' ? 'Save Changes' : 'Add Skill'

  const iconKeys = useMemo(() => listIconKeys(), [])

  const initial = useMemo(() => {
    const s = initialSkill && typeof initialSkill === 'object' ? initialSkill : {}
    return {
      id: s.id || '',
      name: s.name || '',
      level: typeof s.level === 'number' ? s.level : 70,
      iconKey: s.iconKey || 'code2',
    }
  }, [initialSkill])

  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!open) return
    setForm(initial)
    setStatus('')
  }, [open, initial])

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('')

    const level = Number(form.level)
    const payload = {
      ...form,
      name: String(form.name || '').trim(),
      level: Number.isFinite(level) ? Math.min(100, Math.max(0, level)) : 0,
      iconKey: String(form.iconKey || 'code2').trim() || 'code2',
    }

    if (!payload.name) {
      setStatus('Skill name is required')
      return
    }

    onSubmit(payload)
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="absolute inset-0 overflow-y-auto p-4 sm:p-8">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="mx-auto w-full max-w-2xl"
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 14, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <div className="glass relative overflow-hidden rounded-3xl border-white/10">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accentCyan/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-accentPurple/10 blur-3xl" />

                <div className="relative p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="chip">{groupTitle || 'Skills'}</div>
                      <h3 className="mt-3 font-poppins text-2xl font-extrabold">
                        <span className="gradient-text">{header}</span>
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Control skill name, level, and icon used on the portfolio.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                    <Field label="Skill name" hint="Required">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <input
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                          placeholder="e.g. React"
                          required
                        />
                      </div>
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Level" hint="0 - 100">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={form.level}
                            onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
                            className="w-full bg-transparent text-sm text-text outline-none"
                          />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={Number(form.level) || 0}
                          onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
                          className="mt-3 w-full accent-[currentColor]"
                        />
                      </Field>

                      <Field label="Icon" hint="Uses iconKey">
                        <select
                          value={form.iconKey}
                          onChange={(e) => setForm((p) => ({ ...p, iconKey: e.target.value }))}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text outline-none"
                        >
                          {iconKeys.map((k) => (
                            <option key={k} value={k}>
                              {k}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    {status ? <div className="text-xs text-red-300">{status}</div> : null}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                      <button type="button" onClick={onClose} className="btn-secondary">
                        Cancel
                      </button>
                      <motion.button
                        type="submit"
                        className="btn-primary justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {cta}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
