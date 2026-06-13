import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react'
import emailjs from '@emailjs/browser'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

function parseRetryAfter(text) {
  if (typeof text !== 'string') return null
  const m = text.match(/Retry after\s+([^\s]+)\s*\(Mail sending\)/i)
  if (!m?.[1]) return null
  const d = new Date(m[1])
  return Number.isNaN(d.getTime()) ? null : d
}

function toMailto({ toEmail, name, email, message }) {
  const subject = `Portfolio Contact — ${name || 'New message'}`
  const body = [
    `Name: ${name || ''}`,
    `Email: ${email || ''}`,
    '',
    message || '',
  ].join('\n')

  const to = toEmail || 'mounraj9025@gmail.com'
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function Contact() {
  const { state } = usePortfolio()
  const contact = state.contact

  const [status, setStatus] = useState('')
  const [retryAt, setRetryAt] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [isSending, setIsSending] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const emailConfig = useMemo(() => {
    return {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      toEmail: import.meta.env.VITE_CONTACT_TO_EMAIL,
    }
  }, [])

  const isConfigured = Boolean(
    emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey
  )

  const isCoolingDown = Boolean(retryAt && retryAt.getTime() > now)

  useEffect(() => {
    if (!retryAt) return
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [retryAt])

  async function onSubmit(e) {
    e.preventDefault()

    if (isCoolingDown) {
      setStatus('Please wait a moment and try again.')
      return
    }

    if (!isConfigured) {
      setStatus('Email service not configured yet. Please add EmailJS keys.')
      return
    }

    setIsSending(true)
    setStatus('Sending...')
    setRetryAt(null)
    try {
      const templateParams = {
        name: form.name,
        email: form.email,
        message: form.message,
        ...(emailConfig.toEmail ? { to_email: emailConfig.toEmail } : {}),
      }

      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        { publicKey: emailConfig.publicKey }
      )

      setStatus('Message sent successfully!')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus(''), 3500)
    } catch (err) {
      const details =
        typeof err?.text === 'string'
          ? err.text
          : typeof err?.message === 'string'
            ? err.message
            : ''

      const parsedRetry = parseRetryAfter(details)
      if (details && /user-rate limit exceeded/i.test(details)) {
        setRetryAt(parsedRetry)
        setStatus(
          parsedRetry
            ? `Email is temporarily rate-limited. Try again after ${parsedRetry.toLocaleString()}.`
            : 'Email is temporarily rate-limited. Please try again later.'
        )
        return
      }

      setStatus(details ? `Failed to send: ${details}` : 'Failed to send. Please try again.')
      setTimeout(() => setStatus(''), 3500)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="contact" className="section scroll-mt-24">
      <SectionHeader
        eyebrow={contact?.sectionHeader?.eyebrow || 'Contact'}
        title={contact?.sectionHeader?.title || 'Let’s build something premium'}
        subtitle={
          contact?.sectionHeader?.subtitle ||
          ''
        }
      />

      <div className="container-x mt-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <MotionReveal>
            <GlassCard className="p-6 sm:p-7 hover:border-white/20">
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-muted">Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text placeholder:text-muted/60 outline-none transition focus:border-accentCyan/60 focus:shadow-glowCyan"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text placeholder:text-muted/60 outline-none transition focus:border-accentCyan/60 focus:shadow-glowCyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell me about your idea..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text placeholder:text-muted/60 outline-none transition focus:border-accentCyan/60 focus:shadow-glowCyan"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <motion.button
                    type="submit"
                    disabled={isSending || isCoolingDown}
                    className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="h-4 w-4" />
                    {isSending
                      ? 'Sending...'
                      : isCoolingDown
                        ? `Try again in ${Math.max(1, Math.ceil((retryAt.getTime() - now) / 1000))}s`
                        : 'Send Message'}
                  </motion.button>

                  <div className="text-xs text-muted">{status}</div>
                </div>

                {retryAt ? (
                  <a
                    className="btn-secondary w-full justify-center"
                    href={toMailto({
                      toEmail: emailConfig.toEmail || contact?.direct?.email,
                      name: form.name,
                      email: form.email,
                      message: form.message,
                    })}
                  >
                    <Mail className="h-4 w-4" />
                    Open Email App Instead
                  </a>
                ) : null}
              </form>
            </GlassCard>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <GlassCard className="p-6 sm:p-7 hover:border-white/20">
              <div className="text-sm font-semibold">Direct</div>

              <div className="mt-4 grid gap-3 text-sm">
                <a
                  className="glass flex items-center gap-3 rounded-2xl p-4 hover:border-white/20 hover:bg-white/10"
                  href={`mailto:${contact?.direct?.email || 'mounraj9025@gmail.com'}`}
                >
                  <Mail className="h-5 w-5 text-accentCyan" />
                  <div>
                    <div className="text-xs text-muted">Email</div>
                    <div className="font-semibold">{contact?.direct?.email || 'mounraj9025@gmail.com'}</div>
                  </div>
                </a>
                <a
                  className="glass flex items-center gap-3 rounded-2xl p-4 hover:border-white/20 hover:bg-white/10"
                  href={`tel:${(contact?.direct?.phone || '+919025982858').replace(/\s+/g, '')}`}
                >
                  <Phone className="h-5 w-5 text-accentCyan" />
                  <div>
                    <div className="text-xs text-muted">Phone</div>
                    <div className="font-semibold">{contact?.direct?.phone || '+91 90259 82858'}</div>
                  </div>
                </a>
                <div className="glass flex items-center gap-3 rounded-2xl p-4">
                  <MapPin className="h-5 w-5 text-accentCyan" />
                  <div>
                    <div className="text-xs text-muted">Location</div>
                    <div className="font-semibold">{contact?.direct?.location || 'India'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm font-semibold">Social</div>
              <div className="mt-3 flex items-center gap-3">
                <motion.a
                  href={contact?.social?.github || 'https://github.com/Mounraj-A'}
                  target="_blank"
                  rel="noreferrer"
                  className="glass inline-flex h-12 w-12 items-center justify-center rounded-2xl hover:border-white/20 hover:bg-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href={contact?.social?.linkedin || 'https://www.linkedin.com/in/mounraj-a-9a5258328/'}
                  target="_blank"
                  rel="noreferrer"
                  className="glass inline-flex h-12 w-12 items-center justify-center rounded-2xl hover:border-white/20 hover:bg-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
              </div>

              {/* <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted"> 
                Swap placeholders with your real email/phone/links.
              </div> */}
            </GlassCard>
          </MotionReveal>
        </div>
      </div>

      <div className="container-x mt-16">
        <div className="neon-divider" />
      </div>
    </section>
  )
}
