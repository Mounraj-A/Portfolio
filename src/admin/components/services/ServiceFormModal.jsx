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

export default function ServiceFormModal({ open, mode, initialService, onClose, onSubmit }) {
  const header = mode === 'edit' ? 'Edit Service' : 'Add Service'
  const cta = mode === 'edit' ? 'Save Changes' : 'Add Service'

  const iconKeys = useMemo(() => listIconKeys(), [])

  const initial = useMemo(() => {
    const s = initialService && typeof initialService === 'object' ? initialService : {}
    return {
      id: s.id || '',
      title: s.title || '',
      desc: s.desc || '',
      iconKey: s.iconKey || 'layout',
      tags: Array.isArray(s.tags) ? s.tags : [],
    }
  }, [initialService])

  const [form, setForm] = useState(initial)
  const [tagInput, setTagInput] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!open) return
    setForm(initial)
    setTagInput('')
    setStatus('')
  }, [open, initial])

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('')

    const payload = {
      ...form,
      title: String(form.title || '').trim(),
      desc: String(form.desc || '').trim(),
      iconKey: String(form.iconKey || 'layout').trim() || 'layout',
      tags: form.tags,
    }

    if (!payload.title) {
      setStatus('Title is required')
      return
    }
    if (!payload.desc) {
      setStatus('Description is required')
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
                      <div className="chip">Services</div>
                      <h3 className="mt-3 font-poppins text-2xl font-extrabold">
                        <span className="gradient-text">{header}</span>
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Manage Services shown in your portfolio Services section.
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
                    <Field label="Title" hint="Required · max 50 chars">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <input
                          value={form.title}
                          maxLength={50}
                          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value.slice(0, 50) }))}
                          className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                          placeholder="e.g. Frontend Development"
                          required
                        />
                      </div>
                      <div className={`mt-1 text-right text-[11px] ${form.title.length >= 45 ? 'text-red-400' : 'text-muted/50'}`}>
                        {form.title.length}/50
                      </div>
                    </Field>

                    <Field label="Description" hint="Required · max 160 chars">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <textarea
                          rows={4}
                          value={form.desc}
                          maxLength={160}
                          onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value.slice(0, 160) }))}
                          className="w-full resize-none bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                          placeholder="Write a short service description (max 160 characters)"
                          required
                        />
                      </div>
                      <div className={`mt-1 text-right text-[11px] ${form.desc.length >= 145 ? 'text-red-400' : 'text-muted/50'}`}>
                        {form.desc.length}/160
                      </div>
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

                    <Field label="Tags / Chips" hint={`Optional · max 5 tags`}>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        {form.tags.length > 0 && (
                          <div className="mb-2 flex flex-wrap gap-2">
                            {form.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-text"
                              >
                                {tag}
                                <button
                                  type="button"
                                  aria-label={`Remove ${tag}`}
                                  onClick={() =>
                                    setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }))
                                  }
                                  className="ml-0.5 opacity-60 hover:opacity-100"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <input
                          value={tagInput}
                          disabled={form.tags.length >= 5}
                          onChange={(e) => setTagInput(e.target.value.replace(/,/g, ''))}
                          onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                              e.preventDefault()
                              const tag = tagInput.trim().slice(0, 20)
                              if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
                                setForm((p) => ({ ...p, tags: [...p.tags, tag] }))
                              }
                              setTagInput('')
                            } else if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
                              setForm((p) => ({ ...p, tags: p.tags.slice(0, -1) }))
                            }
                          }}
                          className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none disabled:opacity-40"
                          placeholder={form.tags.length >= 5 ? 'Max 5 tags reached' : 'Type a tag and press Enter'}
                        />
                      </div>
                      <div className="mt-1 text-[11px] text-muted/50">
                        {form.tags.length}/5 tags · each max 20 chars · press Enter or comma to add
                      </div>
                    </Field>

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
