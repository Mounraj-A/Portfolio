/**
 * useSecurity — Global client-side security hook
 *
 * Protections applied:
 *  1. Disable context menu (right-click)
 *  2. Block dangerous keyboard shortcuts
 *  3. Disable image / text dragging
 *
 * IMPORTANT: These are deterrents for casual users.
 * Determined developers can always bypass client-side restrictions.
 * True content protection requires server-side DRM.
 */

import { useEffect } from 'react'

// Keyboard shortcuts to block on the user-facing portfolio only.
// The admin panel is excluded — see usage in Root.jsx / App.jsx.
const BLOCKED_KEYS = new Set([
  'F12',
  'F11',
])

const BLOCKED_CTRL = new Set([
  'u', // View source
  's', // Save page
  'p', // Print
  'a', // Select all (blocked on non-input elements)
])

const BLOCKED_CTRL_SHIFT = new Set([
  // DevTools (Inspector)
  'j', // DevTools (Console)
  'c', // DevTools (Element picker)
  'k', // DevTools (Network / Console in Firefox)
])

function isEditable(el) {
  if (!el) return false
  const tag = el.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
  if (el.isContentEditable) return true
  return false
}

export function useSecurity({ enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return

    // 1. Disable right-click context menu
    function onContextMenu(e) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // 2. Block keyboard shortcuts
    function onKeyDown(e) {
      const key = e.key?.toLowerCase()

      // Block bare F-keys
      if (BLOCKED_KEYS.has(e.key)) {
        e.preventDefault()
        return
      }

      // Block Ctrl + <key>
      if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        if (BLOCKED_CTRL.has(key)) {
          e.preventDefault()
          return
        }
        // Block Ctrl+C and Ctrl+X on non-editable elements
        if ((key === 'c' || key === 'x') && !isEditable(e.target)) {
          e.preventDefault()
          return
        }
      }

      // Block Ctrl + Shift + <key>
      if (e.ctrlKey && e.shiftKey && !e.altKey) {
        if (BLOCKED_CTRL_SHIFT.has(key)) {
          e.preventDefault()
          return
        }
      }
    }

    // 3. Disable drag on images and non-input elements
    function onDragStart(e) {
      if (isEditable(e.target)) return
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', onContextMenu, { capture: true })
    document.addEventListener('keydown', onKeyDown, { capture: true })
    document.addEventListener('dragstart', onDragStart, { capture: true })

    return () => {
      document.removeEventListener('contextmenu', onContextMenu, { capture: true })
      document.removeEventListener('keydown', onKeyDown, { capture: true })
      document.removeEventListener('dragstart', onDragStart, { capture: true })
    }
  }, [enabled])
}
