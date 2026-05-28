import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Save, RotateCcw, Pencil, Trash2 } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { getIconByKey } from '../../utils/iconRegistry.js'
import FooterSocialFormModal from '../components/contact/FooterSocialFormModal.jsx'
import SkillsDeleteModal from '../components/skills/SkillsDeleteModal.jsx'

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

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full resize-none bg-transparent text-sm text-text placeholder:text-muted/60 outline-none"
        placeholder={placeholder}
      />
    </div>
  )
}

export default function AdminContactPage() {
  const { state, actions } = usePortfolio()

  const contact = useMemo(() => state.contact || {}, [state.contact])

  const initial = useMemo(() => {
    const sh = contact.sectionHeader || {}
    const direct = contact.direct || {}
    const social = contact.social || {}
    const footerSocials = Array.isArray(contact.footerSocials) ? contact.footerSocials : []

    return {
      sectionHeader: {
        eyebrow: sh.eyebrow || '',
        title: sh.title || '',
        subtitle: sh.subtitle || '',
      },
      direct: {
        email: direct.email || '',
        phone: direct.phone || '',
        location: direct.location || '',
      },
      social: {
        github: social.github || '',
        linkedin: social.linkedin || '',
      },
      footerSocials,
    }
  }, [contact])

  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('')

  const [openAdd, setOpenAdd] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [deleteIndex, setDeleteIndex] = useState(null)

  useEffect(() => {
    setForm(initial)
    setStatus('')
  }, [initial])

  function setSectionHeader(key, value) {
    setForm((p) => ({ ...p, sectionHeader: { ...p.sectionHeader, [key]: value } }))
  }

  function setDirect(key, value) {
    setForm((p) => ({ ...p, direct: { ...p.direct, [key]: value } }))
  }

  function setSocial(key, value) {
    setForm((p) => ({ ...p, social: { ...p.social, [key]: value } }))
  }

  function handleSave() {
    setStatus('')

    const payload = {
      ...(state.contact || {}),
      sectionHeader: {
        ...(state.contact?.sectionHeader || {}),
        eyebrow: String(form.sectionHeader.eyebrow || '').trim(),
        title: String(form.sectionHeader.title || '').trim(),
        subtitle: String(form.sectionHeader.subtitle || '').trim(),
      },
      direct: {
        ...(state.contact?.direct || {}),
        email: String(form.direct.email || '').trim(),
        phone: String(form.direct.phone || '').trim(),
        location: String(form.direct.location || '').trim(),
      },
      social: {
        ...(state.contact?.social || {}),
        github: String(form.social.github || '').trim(),
        linkedin: String(form.social.linkedin || '').trim(),
      },
      footerSocials: (form.footerSocials || []).map((s) => ({
        label: String(s.label || '').trim(),
        href: String(s.href || '').trim(),
        iconKey: String(s.iconKey || 'mail').trim() || 'mail',
      })),
    }

    actions.setContact(payload)
    setStatus('Saved')
    window.setTimeout(() => setStatus(''), 1500)
  }

  function handleReset() {
    setForm(initial)
    setStatus('Reset')
    window.setTimeout(() => setStatus(''), 1000)
  }

  const socials = form.footerSocials || []
  const editItem = typeof editIndex === 'number' ? socials[editIndex] : null

  return (
    <AdminPageTransition>
      <div className="grid gap-5">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="chip">Contact</div>
              <h2 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">Contact Management</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Edit the content used by your portfolio Contact section and footer social icons.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={handleReset} className="btn-secondary">
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <motion.button
                type="button"
                onClick={handleSave}
                className="btn-primary justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="h-4 w-4" />
                Save
              </motion.button>
            </div>
          </div>

          {status ? <div className="mt-4 text-xs text-emerald-300">{status}</div> : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">Section header</div>
            <div className="mt-5 grid gap-5">
              <Field label="Eyebrow" hint="Small label">
                <Input
                  value={form.sectionHeader.eyebrow}
                  onChange={(e) => setSectionHeader('eyebrow', e.target.value)}
                  placeholder="Contact"
                />
              </Field>
              <Field label="Title" hint="Main heading">
                <Input
                  value={form.sectionHeader.title}
                  onChange={(e) => setSectionHeader('title', e.target.value)}
                  placeholder="Let’s build something premium"
                />
              </Field>
              <Field label="Subtitle" hint="Short description">
                <Textarea
                  value={form.sectionHeader.subtitle}
                  onChange={(e) => setSectionHeader('subtitle', e.target.value)}
                  placeholder="Send a message for collaborations..."
                  rows={4}
                />
              </Field>
            </div>
          </div>

          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">Direct</div>
            <p className="mt-2 text-sm text-muted">Used for the direct cards and mailto fallback.</p>
            <div className="mt-5 grid gap-5">
              <Field label="Email">
                <Input
                  value={form.direct.email}
                  onChange={(e) => setDirect('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={form.direct.phone}
                  onChange={(e) => setDirect('phone', e.target.value)}
                  placeholder="+91 ..."
                />
              </Field>
              <Field label="Location">
                <Input
                  value={form.direct.location}
                  onChange={(e) => setDirect('location', e.target.value)}
                  placeholder="India"
                />
              </Field>
            </div>

            <div className="mt-6 text-sm font-semibold">Social</div>
            <p className="mt-2 text-sm text-muted">Used by the GitHub/LinkedIn buttons in Contact.</p>
            <div className="mt-4 grid gap-5">
              <Field label="GitHub URL">
                <Input
                  value={form.social.github}
                  onChange={(e) => setSocial('github', e.target.value)}
                  placeholder="https://github.com/yourname"
                />
              </Field>
              <Field label="LinkedIn URL">
                <Input
                  value={form.social.linkedin}
                  onChange={(e) => setSocial('linkedin', e.target.value)}
                  placeholder="https://www.linkedin.com/in/..."
                />
              </Field>
            </div>
          </div>

          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7 lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold">Footer socials</div>
                <p className="mt-2 text-sm text-muted">These icons show in the footer. Labels should be unique.</p>
              </div>

              <motion.button
                type="button"
                onClick={() => setOpenAdd(true)}
                className="btn-primary justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-4 w-4" />
                Add link
              </motion.button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {socials.map((s, idx) => {
                const Icon = getIconByKey(s.iconKey, 'mail')
                return (
                  <div
                    key={`${s.label}-${idx}`}
                    className="glass rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-white/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <Icon className="h-5 w-5 text-accentCyan" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                          onClick={() => setEditIndex(idx)}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                          onClick={() => setDeleteIndex(idx)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 text-sm font-semibold">{s.label || 'Untitled'}</div>
                    <div className="mt-2 break-all text-xs text-muted">{s.href || ''}</div>
                    <div className="mt-3 text-[11px] text-muted/70">iconKey: {s.iconKey || ''}</div>
                  </div>
                )
              })}
            </div>

            {!socials.length ? (
              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-muted">
                No footer socials yet. Click <span className="text-text">Add link</span>.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <FooterSocialFormModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={(payload) => {
          setForm((p) => ({ ...p, footerSocials: [payload, ...(p.footerSocials || [])] }))
          setOpenAdd(false)
        }}
      />

      <FooterSocialFormModal
        open={typeof editIndex === 'number'}
        mode="edit"
        initialItem={editItem}
        onClose={() => setEditIndex(null)}
        onSubmit={(payload) => {
          setForm((p) => ({
            ...p,
            footerSocials: (p.footerSocials || []).map((s, idx) => (idx === editIndex ? payload : s)),
          }))
          setEditIndex(null)
        }}
      />

      <SkillsDeleteModal
        open={typeof deleteIndex === 'number'}
        title="Delete footer link"
        description={
          typeof deleteIndex === 'number'
            ? `This will remove “${socials?.[deleteIndex]?.label || 'this link'}” from your footer.`
            : ''
        }
        onClose={() => setDeleteIndex(null)}
        onConfirm={() => {
          setForm((p) => ({
            ...p,
            footerSocials: (p.footerSocials || []).filter((_, idx) => idx !== deleteIndex),
          }))
          setDeleteIndex(null)
        }}
      />
    </AdminPageTransition>
  )
}
