import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Plus, X } from 'lucide-react'
import { uploadImage } from '../../../api/cloudinary.js'
import { PROJECT_ICON_OPTIONS, getProjectIcon } from '../../../utils/projectIconRegistry.js'

function uniq(list) {
  const out = []
  for (const item of list) {
    if (!item) continue
    if (!out.includes(item)) out.push(item)
  }
  return out
}

function splitTech(value) {
  return uniq(
    String(value || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  )
}

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

export default function ProjectFormModal({
  open,
  mode,
  initialProject,
  onClose,
  onSubmit,
}) {
  const fileRef = useRef(null)

  const header = mode === 'edit' ? 'Edit Project' : 'Add Project'
  const cta = mode === 'edit' ? 'Save Changes' : 'Add Project'

  const initial = useMemo(() => {
    const p = initialProject && typeof initialProject === 'object' ? initialProject : {}
    return {
      id: p.id || '',
      title: p.title || '',
      description: p.description || '',
      tech: Array.isArray(p.tech) ? p.tech : [],
      githubUrl: p.githubUrl || '',
      liveUrl: p.liveUrl || '',
      image: p.image || '',
      iconKey: p.iconKey || 'code',
    }
  }, [initialProject])

  const [form, setForm] = useState(initial)
  const [techInput, setTechInput] = useState('')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(initial)
    setTechInput('')
    setStatus('')
    setBusy(false)
  }, [open, initial])

  async function onPickFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('')
    try {
      setBusy(true)
      const secureUrl = await uploadImage(file)
      setForm((p) => ({ ...p, image: secureUrl }))
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to read file')
    } finally {
      setBusy(false)
    }
  }

  function addTechFromInput() {
    const next = splitTech(techInput)
    if (!next.length) return
    setForm((p) => ({ ...p, tech: uniq([...(p.tech || []), ...next]) }))
    setTechInput('')
  }

  function removeTech(tag) {
    setForm((p) => ({ ...p, tech: (p.tech || []).filter((t) => t !== tag) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('')

    const payload = {
      ...form,
      title: String(form.title || '').trim(),
      description: String(form.description || '').trim(),
      githubUrl: String(form.githubUrl || '').trim(),
      liveUrl: String(form.liveUrl || '').trim(),
      tech: uniq((form.tech || []).map((t) => String(t).trim()).filter(Boolean)),
      iconKey: form.iconKey || 'code',
    }

    if (!payload.title || !payload.description) {
      setStatus('Title and description are required')
      return
    }

    if (!payload.tech.length) {
      setStatus('Add at least one technology')
      return
    }

    if (!payload.githubUrl || !payload.liveUrl) {
      setStatus('GitHub and Live Demo URLs are required')
      return
    }

    if (!payload.image) {
      setStatus('Project image is required')
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
              className="mx-auto w-full max-w-3xl"
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
                      <div className="chip">Projects</div>
                      <h3 className="mt-3 font-poppins text-2xl font-extrabold">
                        <span className="gradient-text">{header}</span>
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Add premium project cards to your portfolio. Changes reflect instantly.
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
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Project title" hint="Required">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <input
                            value={form.title}
                            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                            placeholder="e.g. Smart Inventory"
                            required
                          />
                        </div>
                      </Field>

                      {/* ── Icon picker ── */}
                      <Field label="Project Icon" hint="Displayed on card">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <div className="flex items-center gap-3">
                            {/* Live icon preview */}
                            {(() => {
                              const PreviewIcon = getProjectIcon(form.iconKey)
                              return (
                                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accentCyan/25 to-accentBlue/15 border border-white/10">
                                  <PreviewIcon className="h-5 w-5 text-accentCyan" />
                                </span>
                              )
                            })()}
                            <select
                              value={form.iconKey}
                              onChange={(e) => setForm((p) => ({ ...p, iconKey: e.target.value }))}
                              className="flex-1 bg-transparent text-sm text-text outline-none cursor-pointer"
                            >
                              {PROJECT_ICON_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-[#0f1117] text-white">
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </Field>

                      <Field label="Project image" hint="Cloudinary Upload">
                        <div className="grid gap-3">
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onPickFile}
                          />

                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="btn-secondary w-full justify-center"
                            disabled={busy}
                          >
                            <ImagePlus className="h-4 w-4" />
                            {form.image ? 'Replace image' : 'Upload image'}
                          </button>

                          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                            {form.image ? (
                              <img
                                src={form.image}
                                alt="Preview"
                                className="h-40 w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-40 items-center justify-center text-xs text-muted">
                                Image preview appears here
                              </div>
                            )}
                          </div>
                        </div>
                      </Field>
                    </div>

                    <Field label="Description" hint="Required">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <textarea
                          value={form.description}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, description: e.target.value }))
                          }
                          className="min-h-[110px] w-full resize-y bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                          placeholder="A short premium summary of what you built..."
                          required
                        />
                      </div>
                    </Field>

                    <Field label="Technologies" hint="Add tags (comma-separated)">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex flex-wrap gap-2">
                          {(form.tech || []).length ? (
                            form.tech.map((t) => (
                              <button
                                type="button"
                                key={t}
                                onClick={() => removeTech(t)}
                                className="chip hover:border-white/20"
                                aria-label={`Remove ${t}`}
                                title="Click to remove"
                              >
                                {t}
                                <span className="ml-1 text-muted/80">×</span>
                              </button>
                            ))
                          ) : (
                            <div className="text-xs text-muted">No technologies added yet.</div>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <input
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addTechFromInput()
                              }
                            }}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text placeholder:text-muted/60 outline-none"
                            placeholder="React, Tailwind, Node..."
                          />
                          <button
                            type="button"
                            onClick={addTechFromInput}
                            className="btn-secondary"
                          >
                            <Plus className="h-4 w-4" />
                            Add
                          </button>
                        </div>
                      </div>
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="GitHub URL" hint="Required">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <input
                            value={form.githubUrl}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, githubUrl: e.target.value }))
                            }
                            className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                            placeholder="https://github.com/..."
                            required
                          />
                        </div>
                      </Field>

                      <Field label="Live demo URL" hint="Required">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <input
                            value={form.liveUrl}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, liveUrl: e.target.value }))
                            }
                            className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                            placeholder="https://..."
                            required
                          />
                        </div>
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
                        disabled={busy}
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
