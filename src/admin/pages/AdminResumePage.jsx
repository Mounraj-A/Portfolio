import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Save, RotateCcw, Trash2 } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { fileToDataUrl } from '../../storage/storage.js'

function Field({ label, hint, children }) {
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

function Input({ value, onChange, placeholder }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <input
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
        placeholder={placeholder}
      />
    </div>
  )
}

function formatBytes(bytes) {
  const n = Number(bytes)
  if (!Number.isFinite(n) || n <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const idx = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)))
  const val = n / 1024 ** idx
  return `${val.toFixed(val >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`
}

export default function AdminResumePage() {
  const { state, actions } = usePortfolio()

  const resume = useMemo(() => state.resume || {}, [state.resume])

  const initial = useMemo(() => {
    return {
      previewImage: resume.previewImage || '',
      pdfUrl: resume.pdfUrl || '',
    }
  }, [resume.pdfUrl, resume.previewImage])

  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setForm(initial)
    setStatus('')
  }, [initial])

  async function handleUploadPreview(file) {
    if (!file) return
    setStatus('')
    setBusy(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      setForm((p) => ({ ...p, previewImage: dataUrl }))
      setStatus(`Preview image set (${formatBytes(file.size)})`)
    } catch (e) {
      setStatus(e?.message || 'Failed to read image')
    } finally {
      setBusy(false)
      window.setTimeout(() => setStatus(''), 1500)
    }
  }

  async function handleUploadPdf(file) {
    if (!file) return
    setStatus('')
    setBusy(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      setForm((p) => ({ ...p, pdfUrl: dataUrl }))
      setStatus(`PDF set (${formatBytes(file.size)})`)
    } catch (e) {
      setStatus(e?.message || 'Failed to read PDF')
    } finally {
      setBusy(false)
      window.setTimeout(() => setStatus(''), 1500)
    }
  }

  function handleSave() {
    setStatus('')
    const payload = {
      ...(state.resume || {}),
      previewImage: String(form.previewImage || '').trim(),
      pdfUrl: String(form.pdfUrl || '').trim(),
    }

    actions.setResume(payload)
    setStatus('Saved')
    window.setTimeout(() => setStatus(''), 1500)
  }

  function handleReset() {
    setForm(initial)
    setStatus('Reset')
    window.setTimeout(() => setStatus(''), 1000)
  }

  return (
    <AdminPageTransition>
      <div className="grid gap-5">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="chip">Resume</div>
              <h2 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">Resume Management</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Update the resume preview image and the PDF link used by your portfolio Resume section.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={handleReset} className="btn-secondary" disabled={busy}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <motion.button
                type="button"
                onClick={handleSave}
                className="btn-primary justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={busy}
              >
                <Save className="h-4 w-4" />
                Save
              </motion.button>
            </div>
          </div>

          {status ? (
            <div className={`mt-4 text-xs ${status === 'Saved' || status === 'Reset' ? 'text-emerald-300' : 'text-muted'}`}>
              {status}
            </div>
          ) : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">Preview image</div>
            <p className="mt-2 text-sm text-muted">This is shown on the left card in the Resume section.</p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img
                src={form.previewImage || resume.previewImage || ''}
                alt="Resume preview"
                className="w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.opacity = '0.25'
                }}
              />
            </div>

            <div className="mt-4 grid gap-4">
              <Field label="Preview image URL / Data URL" hint="Leave empty to use default">
                <Input
                  value={form.previewImage}
                  onChange={(e) => setForm((p) => ({ ...p, previewImage: e.target.value }))}
                  placeholder="https://... or data:image/..."
                />
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="btn-secondary inline-flex cursor-pointer items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={busy}
                    onChange={(e) => handleUploadPreview(e.target.files?.[0])}
                  />
                </label>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setForm((p) => ({ ...p, previewImage: '' }))}
                  disabled={busy}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">PDF</div>
            <p className="mt-2 text-sm text-muted">
              Set the PDF URL used by the “Download PDF” button. You can paste a URL (recommended) or upload a PDF to store as a data URL.
            </p>

            <div className="mt-5 grid gap-4">
              <Field label="PDF URL / Data URL" hint="Leave empty to use /resume.pdf">
                <Input
                  value={form.pdfUrl}
                  onChange={(e) => setForm((p) => ({ ...p, pdfUrl: e.target.value }))}
                  placeholder="/resume.pdf or https://..."
                />
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="btn-secondary inline-flex cursor-pointer items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    disabled={busy}
                    onChange={(e) => handleUploadPdf(e.target.files?.[0])}
                  />
                </label>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setForm((p) => ({ ...p, pdfUrl: '' }))}
                  disabled={busy}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted">
                Storing a PDF as a data URL can be large and may hit LocalStorage limits. For best reliability, replace
                <span className="text-text"> public/resume.pdf</span> and keep this field empty.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageTransition>
  )
}
