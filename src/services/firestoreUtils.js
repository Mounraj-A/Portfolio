export function cleanString(value) {
  return String(value ?? '').trim()
}

export function cleanStringArray(value) {
  if (!Array.isArray(value)) return []
  return value.map(cleanString).filter(Boolean)
}

export function cleanNumber(value, fallback = 0, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

export function cleanObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

export function toIsoString(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (value instanceof Date) return value.toISOString()
  if (typeof value?.toDate === 'function') return value.toDate().toISOString()
  return String(value)
}

export function withTimestamps(data, existing = {}) {
  const now = new Date().toISOString()
  return {
    ...data,
    createdAt: existing.createdAt || data.createdAt || now,
    updatedAt: now,
  }
}

export function sortByLatest(items) {
  return [...items].sort((a, b) => {
    const left = Date.parse(b.updatedAt || b.createdAt || 0)
    const right = Date.parse(a.updatedAt || a.createdAt || 0)
    return (left || 0) - (right || 0)
  })
}

export function cleanMap(value) {
  return cleanObject(value)
}
