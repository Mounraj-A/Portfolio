import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'

import GlowButton from '../GlowButton.jsx'
import MotionReveal from '../MotionReveal.jsx'
import useTypewriter from '../../hooks/useTypewriter.js'
import heroIllustration from '../../assets/images/am.png'
import { scrollToId } from '../../utils/scrollToId.js'

function Orb({ className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: 'easeOut' }}
    />
  )
}

function Particles() {
  const dots = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    left: `${(i * 7) % 100}%`,
    top: `${(i * 11) % 100}%`,
    size: (i % 3) + 2,
    delay: (i % 6) * 0.3,
  }))

  return (
    <div className="pointer-events-none absolute inset-0">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
          }}
          animate={{
            y: [0, -14, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 6.2,
            repeat: Infinity,
            delay: d.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const [portraitError, setPortraitError] = useState(false)

  const typed = useTypewriter({
    words: ['Full Stack Developer & AI Enthusiast'],
    typeSpeed: 52,
    deleteSpeed: 26,
    pauseMs: 1500,
  })

  const heroPortrait = '/profile-photo.jpg'
  const heroVisual = portraitError ? heroIllustration : heroPortrait

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="container-x">
        <div className="min-h-[92vh] grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28">
          
          {/* LEFT CONTENT */}
          <div>
            <MotionReveal>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-muted backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-accentCyan shadow-glowCyan animate-pulseGlow" />
                WHO AM I
              </div>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <h1 className="mt-6 font-poppins text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                Hi, I&apos;m{' '}
                <span className="gradient-text">Mounraj</span>
              </h1>
            </MotionReveal>

            <MotionReveal delay={0.16}>
              <div className="mt-5 flex items-center gap-2 text-xl font-semibold text-muted sm:text-2xl">
                <span className="relative">
                  <span className="text-text">{typed}</span>

                  <span className="ml-1 inline-block h-6 w-[2px] translate-y-[2px] bg-accentCyan/80" />
                </span>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.22}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                I build modern web applications, AI-powered systems,
                and responsive digital experiences.
              </p>
            </MotionReveal>

            <MotionReveal delay={0.3}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <GlowButton
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId('projects')
                  }}
                  icon
                >
                  View Projects
                </GlowButton>

                <GlowButton
                  href="/resume.pdf"
                  variant="secondary"
                  download
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </GlowButton>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.38}>
              <button
                type="button"
                onClick={() => scrollToId('about')}
                className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-text"
              >
                <ArrowDown className="h-4 w-4" />
                Scroll to explore
              </button>
            </MotionReveal>
          </div>

          {/* RIGHT HERO CARD */}
          <MotionReveal delay={0.15}>
            <div className="relative mx-auto w-full max-w-[400px] lg:max-w-[420px]">
              
              <Particles />

              {/* OUTSIDE ORBS */}
              <Orb
                delay={0.2}
                className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-accentCyan/20 blur-3xl"
              />

              <Orb
                delay={0.35}
                className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-accentPurple/20 blur-3xl"
              />

              <Orb
                delay={0.5}
                className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-accentBlue/20 blur-3xl"
              />

              {/* MAIN CARD */}
              <motion.div
                className="glass relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-3 sm:p-4 shadow-[0_0_60px_rgba(59,130,246,0.18)] backdrop-blur-2xl"
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.7,
                  ease: 'easeOut',
                }}
                whileHover={{ y: -3 }}
              >
                {/* MAIN CARD GLOW */}
                <div className="pointer-events-none absolute inset-0">
                  
                  <div className="absolute left-[-10%] top-[-10%] h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

                  <div className="absolute bottom-[-10%] right-[-10%] h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />

                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-500/10" />
                </div>

                {/* EXTRA GLOW */}
                <div className="pointer-events-none absolute -top-14 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-accentCyan/20 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-10 right-6 h-28 w-28 rounded-full bg-accentPurple/20 blur-3xl" />

                {/* IMAGE */}
                <motion.img
                  src={heroVisual}
                  alt="Mounraj portrait"
                  onError={() => setPortraitError(true)}
                  className="relative z-10 h-[380px] w-full rounded-2xl object-cover object-top"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* CARD OVERLAY */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-60" />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/40 via-transparent to-cyan-400/10" />
              </motion.div>

              {/* BOTTOM BADGE */}
              <motion.div
                className="glass absolute -bottom-6 left-6 hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl sm:block"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 5.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="text-xs font-semibold text-muted">
                  Currently building
                </div>

                <div className="mt-1 text-sm font-bold text-text">
                  Full Stack + AI Projects
                </div>
              </motion.div>

              {/* TOP BADGE */}
              <motion.div
                className="glass absolute -right-2 top-10 hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl sm:block"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 6.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="text-xs font-semibold text-muted">
                  Focus
                </div>

                <div className="mt-1 text-sm font-bold text-text">
                  Clean UI + Performance
                </div>
              </motion.div>
            </div>
          </MotionReveal>
        </div>
      </div>

      <div className="neon-divider" />
    </section>
  )
}