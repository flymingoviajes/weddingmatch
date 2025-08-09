'use client'
import { useEffect, useState } from 'react'
import { getCompareIds, onCompareChange, toggleCompareId, clearCompare, setCompareIds } from '@/utils/compare'

export function useCompare() {
  const [ids, setIds] = useState<number[]>([])

  const refresh = () => setIds(getCompareIds())

  useEffect(() => {
    refresh()
    return onCompareChange(refresh)
  }, [])

  return {
    ids,
    count: ids.length,
    refresh,
    toggle: (id: number) => toggleCompareId(id),
    remove: (id: number) => setCompareIds(ids.filter(x => x !== id)),
    clear: () => clearCompare(),
  }
}
