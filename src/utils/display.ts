export function display(v: unknown, fallback = '—'): string {
  if (v == null) return fallback
  const s = String(v).trim()
  if (!s || s === 'N/A' || s === 'n/a') return fallback
  return s
}
