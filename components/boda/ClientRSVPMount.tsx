'use client'
import { useEffect, useState } from 'react'
import RSVPModal from './RSVPModal'
import { BodaData } from './types'

export default function ClientRSVPMount({ data }: { data: BodaData }) {
  const [open, setOpen] = useState(false)
  const [preset, setPreset] = useState<any>(undefined)

  useEffect(() => {
    const handler = (e: Event) => {
      // @ts-ignore detalle del CustomEvent
      setPreset(e.detail)
      setOpen(true)
    }
    window.addEventListener('rsvp:open', handler as EventListener)
    return () => window.removeEventListener('rsvp:open', handler as EventListener)
  }, [])

  return <RSVPModal open={open} onOpenChange={setOpen} boda={data} preset={preset} />
}
