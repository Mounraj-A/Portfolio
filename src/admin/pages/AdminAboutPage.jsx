import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, RotateCcw } from 'lucide-react'
import AdminPageTransition from '../components/AdminPageTransition.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

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

export default function AdminAboutPage() {
  const { state, actions } = usePortfolio()

  const about = useMemo(() => state.about || {}, [state.about])

  const initial = useMemo(() => {
    const sh = about.sectionHeader || {}
    const cards = about.infoCards || {}

    return {
      sectionHeader: {
        eyebrow: sh.eyebrow || '',
        title: sh.title || '',
        subtitle: sh.subtitle || '',
      },
      heroName: about.heroName || '',
      paragraph: about.paragraph || '',
      infoCards: {
        collegeLabel: cards.collegeLabel || '',
        collegeValue: cards.collegeValue || '',
        careerGoalLabel: cards.careerGoalLabel || '',
        careerGoalValue: cards.careerGoalValue || '',
        interestsLabel: cards.interestsLabel || '',
        interestsValue: cards.interestsValue || '',
        mindsetLabel: cards.mindsetLabel || '',
        mindsetValue: cards.mindsetValue || '',
      },
    }
  }, [about])

  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('')

  useEffect(() => {
    setForm(initial)
    setStatus('')
  }, [initial])

  function setSectionHeader(key, value) {
    setForm((p) => ({
      ...p,
      sectionHeader: { ...p.sectionHeader, [key]: value },
    }))
  }

  function setInfoCard(key, value) {
    setForm((p) => ({
      ...p,
      infoCards: { ...p.infoCards, [key]: value },
    }))
  }

  function handleSave() {
    setStatus('')

    const payload = {
      ...(state.about || {}),
      heroName: String(form.heroName || '').trim(),
      paragraph: String(form.paragraph || '').trim(),
      sectionHeader: {
        ...(state.about?.sectionHeader || {}),
        eyebrow: String(form.sectionHeader.eyebrow || '').trim(),
        title: String(form.sectionHeader.title || '').trim(),
        subtitle: String(form.sectionHeader.subtitle || '').trim(),
      },
      infoCards: {
        ...(state.about?.infoCards || {}),
        collegeLabel: String(form.infoCards.collegeLabel || '').trim(),
        collegeValue: String(form.infoCards.collegeValue || '').trim(),
        careerGoalLabel: String(form.infoCards.careerGoalLabel || '').trim(),
        careerGoalValue: String(form.infoCards.careerGoalValue || '').trim(),
        interestsLabel: String(form.infoCards.interestsLabel || '').trim(),
        interestsValue: String(form.infoCards.interestsValue || '').trim(),
        mindsetLabel: String(form.infoCards.mindsetLabel || '').trim(),
        mindsetValue: String(form.infoCards.mindsetValue || '').trim(),
      },
    }

    actions.setAbout(payload)
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
              <div className="chip">About</div>
              <h2 className="mt-4 font-poppins text-2xl font-extrabold">
                <span className="gradient-text">About Management</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Edit the content used by your portfolio About section. The public UI stays unchanged; only the data updates.
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
                  placeholder="About"
                />
              </Field>
              <Field label="Title" hint="Main heading">
                <Input
                  value={form.sectionHeader.title}
                  onChange={(e) => setSectionHeader('title', e.target.value)}
                  placeholder="Building products with clarity and craft"
                />
              </Field>
              <Field label="Subtitle" hint="Short description">
                <Textarea
                  value={form.sectionHeader.subtitle}
                  onChange={(e) => setSectionHeader('subtitle', e.target.value)}
                  placeholder="Computer Science Engineering student..."
                  rows={4}
                />
              </Field>
            </div>
          </div>

          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
            <div className="text-sm font-semibold">Hero + paragraph</div>
            <div className="mt-5 grid gap-5">
              <Field label="Hero name" hint="Shown as 'Hello, I’m …'">
                <Input
                  value={form.heroName}
                  onChange={(e) => setForm((p) => ({ ...p, heroName: e.target.value }))}
                  placeholder="Mounraj"
                />
              </Field>
              <Field label="Paragraph" hint="Main About text">
                <Textarea
                  value={form.paragraph}
                  onChange={(e) => setForm((p) => ({ ...p, paragraph: e.target.value }))}
                  placeholder="I’m a Computer Science Engineering student..."
                  rows={7}
                />
              </Field>
            </div>
          </div>

          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7 lg:col-span-2">
            <div className="text-sm font-semibold">Info cards</div>
            <p className="mt-2 text-sm text-muted">
              These map to the four cards in the About section (label + value).
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="grid gap-4">
                <Field label="Card 1 label">
                  <Input
                    value={form.infoCards.collegeLabel}
                    onChange={(e) => setInfoCard('collegeLabel', e.target.value)}
                    placeholder="College"
                  />
                </Field>
                <Field label="Card 1 value">
                  <Input
                    value={form.infoCards.collegeValue}
                    onChange={(e) => setInfoCard('collegeValue', e.target.value)}
                    placeholder="CSE (Engineering)"
                  />
                </Field>
              </div>

              <div className="grid gap-4">
                <Field label="Card 2 label">
                  <Input
                    value={form.infoCards.careerGoalLabel}
                    onChange={(e) => setInfoCard('careerGoalLabel', e.target.value)}
                    placeholder="Career Goal"
                  />
                </Field>
                <Field label="Card 2 value">
                  <Input
                    value={form.infoCards.careerGoalValue}
                    onChange={(e) => setInfoCard('careerGoalValue', e.target.value)}
                    placeholder="Full Stack + AI Engineer"
                  />
                </Field>
              </div>

              <div className="grid gap-4">
                <Field label="Card 3 label">
                  <Input
                    value={form.infoCards.interestsLabel}
                    onChange={(e) => setInfoCard('interestsLabel', e.target.value)}
                    placeholder="Interests"
                  />
                </Field>
                <Field label="Card 3 value">
                  <Input
                    value={form.infoCards.interestsValue}
                    onChange={(e) => setInfoCard('interestsValue', e.target.value)}
                    placeholder="UI/UX, Systems, ML"
                  />
                </Field>
              </div>

              <div className="grid gap-4">
                <Field label="Card 4 label">
                  <Input
                    value={form.infoCards.mindsetLabel}
                    onChange={(e) => setInfoCard('mindsetLabel', e.target.value)}
                    placeholder="Mindset"
                  />
                </Field>
                <Field label="Card 4 value">
                  <Input
                    value={form.infoCards.mindsetValue}
                    onChange={(e) => setInfoCard('mindsetValue', e.target.value)}
                    placeholder="Learn → Build → Ship"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="text-sm font-semibold">Note</div>
          <div className="mt-2 text-sm text-muted">
            The role cards (Frontend/Backend/AI/UIUX) are currently static in the portfolio UI; this page edits only the data-driven fields.
          </div>
        </div>
      </div>
    </AdminPageTransition>
  )
}
