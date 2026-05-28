import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, X } from 'lucide-react'
import { fileToDataUrl } from '../../../storage/storage.js'

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

export default function CertificateFormModal({
  open,
  mode,
  initialCert,
  onClose,
  onSubmit,
}) {
  const fileRef = useRef(null)

  const header = mode === 'edit' ? 'Edit Certificate' : 'Add Certificate'
  const cta = mode === 'edit' ? 'Save Changes' : 'Add Certificate'

  const initial = useMemo(() => {
    const c = initialCert && typeof initialCert === 'object' ? initialCert : {}
    return {
      id: c.id || '',
      title: c.title || '',
      organization: c.organization || '',
      description: c.description || c.note || '',
      image: c.image || '',
    }
  }, [initialCert])

  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(initial)
    setStatus('')
    setBusy(false)
  }, [open, initial])

  async function onPickFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('')
    try {
      setBusy(true)
      const dataUrl = await fileToDataUrl(file)
      setForm((p) => ({ ...p, image: dataUrl }))
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to read file')
    } finally {
      setBusy(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('')

    const payload = {
      ...form,
      title: String(form.title || '').trim(),
      organization: String(form.organization || '').trim(),
      description: String(form.description || '').trim(),
      image: String(form.image || '').trim(),
    }

    if (!payload.title) {
      setStatus('Title is required')
      return
    }

    if (!payload.description) {
      setStatus('Description is required')
      return
    }

    if (!payload.image) {
      setStatus('Certificate image is required')
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
                      <div className="chip">Certificates</div>
                      <h3 className="mt-3 font-poppins text-2xl font-extrabold">
                        <span className="gradient-text">{header}</span>
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Manage your Certifications section. Changes reflect instantly.
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
                      <Field label="Certificate title" hint="Required">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <input
                            value={form.title}
                            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                            placeholder="e.g. Coursera"
                            required
                          />
                        </div>
                      </Field>

                      <Field label="Organization" hint="Optional">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <input
                            value={form.organization}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, organization: e.target.value }))
                            }
                            className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
                            placeholder="e.g. Coursera"
                          />
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
                          placeholder="A short summary of the certification..."
                          required
                        />
                      </div>
                    </Field>

                    <Field label="Certificate image" hint="Base64 + LocalStorage">
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
                              className="h-44 w-full object-cover sm:h-56"
                            />
                          ) : (
                            <div className="flex h-44 items-center justify-center text-xs text-muted sm:h-56">
                              Image preview appears here
                            </div>
                          )}
                        </div>
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
