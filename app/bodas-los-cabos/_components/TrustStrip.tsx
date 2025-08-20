'use client'

import { Card, CardBody } from '@heroui/card'

import { ShieldCheck, CalendarClock, Hotel, Users } from 'lucide-react'

export type TrustItem = {
  label: string
  sub?: string
  Icon?: React.ComponentType<{ className?: string }>
}

export type TrustStripProps = {
  items?: TrustItem[]
  className?: string
}

const DEFAULT_ITEMS: TrustItem[] = [
  { label: 'Agencia en Torreón', sub: 'Atención local y cercana', Icon: ShieldCheck },
  { label: 'Pagos flexibles', sub: 'A tu ritmo y presupuesto', Icon: CalendarClock },
  { label: 'Hoteles certificados', sub: 'Marcas confiables', Icon: Hotel },
  { label: 'Invitados felices', sub: 'Gestión de vuelos y hotel', Icon: Users },
]

export default function TrustStrip({ items = DEFAULT_ITEMS, className }: TrustStripProps) {
  return (
    <section aria-label="Confianza y beneficios" className={cn?.('px-4 sm:px-6 md:px-8', className) || 'px-4 sm:px-6 md:px-8'}>
      <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(({ label, sub, Icon }, idx) => (
          <Card key={idx} shadow="none" className="border border-slate-200 bg-white">
            <CardBody className="py-3 md:py-4 flex items-center gap-2">
              {Icon ? <Icon className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" /> : null}
              <div className="min-w-0">
                <p className="text-[13px] md:text-sm font-semibold text-slate-800 leading-tight truncate">{label}</p>
                {sub ? (
                  <p className="text-[11px] md:text-xs text-slate-500 leading-tight truncate">{sub}</p>
                ) : null}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  )
}

// Uso sugerido:
// <HeroCabos />
// <TrustStrip />
