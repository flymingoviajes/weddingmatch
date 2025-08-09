const KEY = 'wm_compare_ids'
const EVT = 'wm_compare_change'

export function getCompareIds(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function setCompareIds(ids: number[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(ids))
  window.dispatchEvent(new CustomEvent(EVT))
}

export function toggleCompareId(id: number) {
  const ids = getCompareIds()
  const exists = ids.includes(id)
  const next = exists ? ids.filter(x => x !== id) : [...ids, id]
  setCompareIds(next)
}

export function clearCompare() {
  setCompareIds([])
}

export function onCompareChange(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => cb()
  window.addEventListener(EVT, handler)
  window.addEventListener('storage', handler) // sincroniza entre tabs
  return () => {
    window.removeEventListener(EVT, handler)
    window.removeEventListener('storage', handler)
  }
}
