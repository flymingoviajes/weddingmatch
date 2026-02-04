'use client'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { Divider } from '@heroui/divider'
import { CalendarDays, Users, Clock } from 'lucide-react'
import { BodaData, AgendaItem } from './types'

function Icono({ type }: { type?: AgendaItem['icon'] }) {
  switch (type) {
    case 'ceremonia':
      return <CalendarDays className="w-5 h-5" />
    case 'recepcion':
      return <Users className="w-5 h-5" />
    default:
      return <Clock className="w-5 h-5" />
  }
}

export default function AgendaGrid({ data }: { data: BodaData }) {
  if (!data.agenda?.length) return null
  return (
    <Card shadow="sm" className="border border-neutral-200">
      <CardHeader><h2 className="text-xl font-semibold">Agenda del gran día</h2></CardHeader>
      <Divider />
      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.agenda.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-neutral-200">
              <div className="mt-0.5 text-success-600"><Icono type={a.icon} /></div>
              <div>
                {a.hora && <p className="text-sm text-neutral-500">{a.hora}</p>}
                <p className="font-medium">{a.titulo}</p>
                {a.detalle && <p className="text-sm text-neutral-600">{a.detalle}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
