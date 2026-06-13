import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Eye, FileText, X } from 'lucide-react'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'

const PDF_PATH = '/resume.pdf'

/**
 * Force-download the resume PDF. Works for same-origin /public files.
 */
async function forceDownload(url, filename) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('fetch failed')
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

export default function Resume() {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    await forceDownload(PDF_PATH, 'resume.pdf')
    setDownloading(false)
  }

  return (
    <section id="resume" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Resume"
        title="Career Highlights Collection"
      // subtitle="Preview the resume and download the full PDF."
      />

      <div className="container-x mt-12 flex justify-center">
        <MotionReveal className="w-full max-w-xl">
          <GlassCard className="relative p-6 sm:p-8 hover:border-white/20">

            {/* Eye preview button — top-right */}
            <motion.button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Preview resume"
            >
              <Eye className="h-4 w-4 text-accentCyan" />
            </motion.button>

            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <FileText className="h-6 w-6 text-accentCyan" />
            </div>
            <h3 className="mt-4 font-poppins text-lg font-bold">Resume</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A complete snapshot of my skills, projects, certifications, and professional growth.
            </p>

            <motion.button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-4 w-4" />
              {downloading ? 'Downloading…' : 'Download PDF'}
            </motion.button>
          </GlassCard>
        </MotionReveal>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setPreviewOpen(false)}
              aria-label="Close preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative z-10 flex h-[90vh] w-full max-w-4xl flex-col"
              initial={{ y: 20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="glass flex h-full flex-col overflow-hidden rounded-3xl border border-white/10">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accentCyan/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-accentPurple/10 blur-3xl" />

                {/* Header */}
                <div className="relative flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
                  <div>
                    <span className="chip">Preview</span>
                    <h3 className="mt-2 font-poppins text-lg font-extrabold">Resume Preview</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      type="button"
                      onClick={handleDownload}
                      disabled={downloading}
                      className="btn-primary disabled:opacity-60"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="h-4 w-4" />
                      {downloading ? 'Downloading…' : 'Download'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setPreviewOpen(false)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {/* PDF embed — same-origin public file, works directly */}
                <div className="relative flex-1 p-4 sm:p-5">
                  <iframe
                    src={PDF_PATH}
                    className="h-full w-full rounded-2xl border border-white/10 bg-white/5"
                    title="Resume PDF preview"
                    allow="fullscreen"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-x mt-16">
        <div className="neon-divider" />
      </div>
    </section>
  )
}
