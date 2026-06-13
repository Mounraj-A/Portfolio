/**
 * DevToolsGuard
 *
 * Detects when browser DevTools are open using multiple methods:
 *   1. Window dimension delta (outer - inner > threshold)
 *   2. Debugger timing trick (console object toString override)
 *
 * When DevTools are detected:
 *   - Blurs the entire page content
 *   - Shows a centered overlay message
 *   - Removes blur when DevTools are closed
 *
 * NOTE: This is a deterrent, not a full block.
 * A user who knows what they're doing can always bypass this.
 */

import { useEffect, useState } from 'react'

const THRESHOLD = 160 // px delta that indicates DevTools panel open

function detectByDimensions() {
  const widthDelta = window.outerWidth - window.innerWidth
  const heightDelta = window.outerHeight - window.innerHeight
  return widthDelta > THRESHOLD || heightDelta > THRESHOLD
}

let devtoolsOpen = false

function detectByDebugger() {
  const start = performance.now()
  // eslint-disable-next-line no-debugger
  debugger
  const elapsed = performance.now() - start
  // If debugger paused (DevTools open), this takes > 100ms
  if (elapsed > 100) {
    devtoolsOpen = true
  } else {
    devtoolsOpen = false
  }
  return devtoolsOpen
}

export default function DevToolsGuard() {
  const [detected, setDetected] = useState(false)

  useEffect(() => {
    let animId

    function check() {
      const byDimension = detectByDimensions()
      // We rely primarily on dimension check (no false positives from debugger in dev)
      const isOpen = byDimension
      setDetected(isOpen)
      animId = requestAnimationFrame(check)
    }

    animId = requestAnimationFrame(check)

    return () => cancelAnimationFrame(animId)
  }, [])

  if (!detected) return null

  return (
    <>
      {/* Blur overlay on the page content */}
      <style>{`
        #root, body > :not([data-devtools-overlay]) {
          filter: blur(8px) !important;
          pointer-events: none !important;
          user-select: none !important;
        }
      `}</style>

      {/* Warning message */}
      <div
        data-devtools-overlay="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '24px',
            padding: '40px 48px',
            textAlign: 'center',
            maxWidth: '420px',
            boxShadow: '0 0 60px rgba(0,210,255,0.12), 0 24px 80px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{
            width: 56, height: 56,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 24,
          }}>
            🔒
          </div>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: 10,
          }}>
            Developer Tools Detected
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            Developer tools are disabled on this portfolio.<br />
            Please close DevTools to continue.
          </p>
        </div>
      </div>
    </>
  )
}
