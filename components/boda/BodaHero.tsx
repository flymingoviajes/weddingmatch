'use client'
import Image from 'next/image'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Link } from '@heroui/link'
import { Copy, CalendarDays, MapPin, ChevronRight } from 'lucide-react'
import { BodaData } from './types'
import { formatDateLong, icsFromEvent } from './utils'
import { emitOpenRSVP } from './rsvpBus'

export default function BodaHero({ data }: { data: BodaData }) {
  const icsHref = icsFromEvent(
    data.slug,
    `Boda ${data.nombresNovios}`,
    data.fechaEventoISO,
    6
  )

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {}
  }

  return (
    <section className="relative">
      <div className="absolute inset-0 overflow-hidden">
        {data.portadaUrl && (
          <Image
            src={data.portadaUrl}
            alt={data.nombresNovios}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-28 text-white">
        <Chip variant="shadow" color="success" className="mb-4 backdrop-blur">
          Información para invitados
        </Chip>

        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight drop-shadow">
          {data.nombresNovios}
        </h1>

        <p className="mt-3 text-lg sm:text-xl opacity-95 max-w-2xl">
          {data.subtitulo ?? 'Tarifas, hotel, agenda y RSVP en un mismo lugar.'}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Chip
            startContent={<CalendarDays className="w-4 h-4" />}
            className="backdrop-blur bg-white/10 border-white/20"
          >
            {formatDateLong(data.fechaEventoISO)}
          </Chip>
          <Chip
            startContent={<MapPin className="w-4 h-4" />}
            className="backdrop-blur bg-white/10 border-white/20"
          >
            {data.hotel.nombre}
          </Chip>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            color="success"
            radius="lg"
            onPress={() => emitOpenRSVP()}
            endContent={<ChevronRight className="w-4 h-4" />}
          >
            Reservar mi lugar
          </Button>

          <Button
            as={Link}
            href={icsHref}
            target="_blank"
            rel="noopener"
            radius="lg"
            variant="flat"
            startContent={<CalendarDays className="w-4 h-4" />}
          >
            Agregar al calendario
          </Button>

          <Button
            radius="lg"
            variant="flat"
            onPress={copyLink}
            startContent={<Copy className="w-4 h-4" />}
          >
            Copiar link
          </Button>
        </div>
      </div>
    </section>
  )
}
