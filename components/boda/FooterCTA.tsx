'use client'
import { Button } from '@heroui/button'
import { Link } from '@heroui/react'
import { CalendarDays } from 'lucide-react'
import { BodaData } from './types'
import { icsFromEvent } from './utils'
import { emitOpenRSVP } from './rsvpBus'

export default function FooterCTA({ data }: { data: BodaData }) {
  const icsHref = icsFromEvent(
    data.slug,
    `Boda ${data.nombresNovios}`,
    data.fechaEventoISO,
    6
  )

  return (
    <section className="bg-content1 border-t border-divider">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg">¿Listo para confirmar tu asistencia?</p>
          <p className="text-foreground/60">Reserva con las tarifas del grupo y asegura tu lugar en la boda.</p>
        </div>
        <div className="flex gap-3">
          <Button color="success" onPress={() => emitOpenRSVP()}>
            Reservar mi lugar
          </Button>
          <Button
            as={Link}
            href={icsHref}
            target="_blank"
            variant="flat"
            startContent={<CalendarDays className="w-4 h-4" />}
          >
            Agregar al calendario
          </Button>
        </div>
      </div>
    </section>
  )
}
