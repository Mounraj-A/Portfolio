import MotionReveal from './MotionReveal.jsx'

export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="container-x">
      <MotionReveal>
        <div className="mx-auto max-w-4xl lg:max-w-7xl text-center">
          {eyebrow ? (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold tracking-wide text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accentCyan shadow-glowCyan" />
              {eyebrow}
            </div>
          ) : null}
          <h2 className="font-poppins text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="gradient-text">{title}</span>
          </h2>
          {subtitle ? (
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
      </MotionReveal>
    </div>
  )
}
