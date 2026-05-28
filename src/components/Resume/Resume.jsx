import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import SectionHeader from '../SectionHeader.jsx'
import MotionReveal from '../MotionReveal.jsx'
import GlassCard from '../GlassCard.jsx'
import resumePreview from '../../assets/images/resume-preview.svg'

export default function Resume() {
  return (
    <section id="resume" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Resume"
        title="A premium overview"
        subtitle="Preview the resume section and download the full PDF." 
      />

      <div className="container-x mt-12">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <MotionReveal>
            <GlassCard className="overflow-hidden p-4 sm:p-5 hover:border-white/20">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <img
                  src={resumePreview}
                  alt="Resume preview"
                  className="w-full object-cover"
                />
              </div>
              <div className="mt-4 text-xs text-muted">
                Replace preview art in <span className="text-text">src/assets/images/resume-preview.svg</span>
              </div>
            </GlassCard>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <GlassCard className="p-6 sm:p-7 hover:border-white/20">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <FileText className="h-6 w-6 text-accentCyan" />
              </div>
              <h3 className="mt-4 font-poppins text-lg font-bold">Download Resume</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Get the full PDF version for details on projects, skills, and experience.
              </p>

              <motion.a
                href="/resume.pdf"
                download
                className="btn-primary mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </motion.a>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted">
                Replace the placeholder file at <span className="text-text">public/resume.pdf</span>
              </div>
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
