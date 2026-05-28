import { useEffect, useMemo, useState } from 'react'

export default function useTypewriter({
  words,
  typeSpeed = 55,
  deleteSpeed = 28,
  pauseMs = 1200,
}) {
  const list = useMemo(() => (Array.isArray(words) ? words : [String(words)]), [words])
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = list[wordIndex % list.length] || ''

    if (!isDeleting && text === current) {
      const t = setTimeout(() => setIsDeleting(true), pauseMs)
      return () => clearTimeout(t)
    }

    if (isDeleting && text === '') {
      setIsDeleting(false)
      setWordIndex((v) => (v + 1) % list.length)
      return
    }

    const next = isDeleting
      ? current.slice(0, Math.max(0, text.length - 1))
      : current.slice(0, Math.min(current.length, text.length + 1))

    const delay = isDeleting ? deleteSpeed : typeSpeed
    const t = setTimeout(() => setText(next), delay)
    return () => clearTimeout(t)
  }, [deleteSpeed, isDeleting, list, pauseMs, text, typeSpeed, wordIndex])

  return text
}
