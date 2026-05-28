import { useMemo, useRef } from 'react'

export default function TiltCard({ children, className = '', maxTilt = 10 }) {
  const ref = useRef(null)
  const state = useMemo(() => ({ rx: 0, ry: 0 }), [])

  function onMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    state.ry = (px - 0.5) * (maxTilt * 2)
    state.rx = -(py - 0.5) * (maxTilt * 2)
    el.style.transform = `perspective(900px) rotateX(${state.rx.toFixed(2)}deg) rotateY(${state.ry.toFixed(2)}deg)`
  }

  function onLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-200 will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}
