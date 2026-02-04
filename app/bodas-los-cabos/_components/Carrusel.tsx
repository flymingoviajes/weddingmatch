'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@heroui/react'
import { Card, CardBody } from '@heroui/react'
import { Skeleton } from '@heroui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ────────────────────────────────────────────────────────────────
// Tipado compatible con tu PackageCard({ paquete })
// ────────────────────────────────────────────────────────────────
export type Paquete = {
  id: number
  slug?: string
  nombre: string
  descripcion?: string
  precio_base?: number
  invitados_incluidos?: number
  imagenes?: string[]
  hotel?: {
    id?: string | number
    nombre?: string
    ubicacion?: string
    imagen_principal?: string
    tipo?: string
  } | Array<{
    id?: string | number
    nombre?: string
    ubicacion?: string
    imagen_principal?: string
    tipo?: string
  }>
}

export type PackagesCarouselCabosProps = {
  title?: string
  subtitle?: string
  paquetes?: Paquete[] // si no se manda, usa fallback
  viewAllHref?: string
  className?: string
}

// Fallback — 100% compatible con PackageCard
const FALLBACK: Paquete[] = [
  {
    id: 101,
    slug: 'dreams-los-cabos-classic',
    nombre: 'Paquete Classic — Simbólica',
    descripcion: 'Ceremonia frente al mar, coordinación y amenidades.',
    precio_base: 39900,
    invitados_incluidos: 20,
    imagenes: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop'],
    hotel: { nombre: 'Dreams Los Cabos Suites Golf Resort & Spa', ubicacion: 'Los Cabos, BCS', tipo: 'All Inclusive' },
  },
  {
    id: 102,
    slug: 'pueblo-bonito-pacifica-intimate',
    nombre: 'Intimate — Adults Only',
    descripcion: 'Audio, ramo, cena semi‑privada; estilo íntimo.',
    precio_base: 54900,
    invitados_incluidos: 30,
    imagenes: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop'],
    hotel: { nombre: 'Pueblo Bonito Pacífica', ubicacion: 'Cabo San Lucas, BCS', tipo: 'Adults Only' },
  },
  {
    id: 103,
    slug: 'hyatt-ziva-los-cabos-classic',
    nombre: 'Ziva Classic — Familiar',
    descripcion: 'Decoración básica, pastel nupcial y coordinador on‑site.',
    precio_base: 62500,
    invitados_incluidos: 40,
    imagenes: ['https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1600&auto=format&fit=crop'],
    hotel: { nombre: 'Hyatt Ziva Los Cabos', ubicacion: 'San José del Cabo, BCS', tipo: 'Familiar' },
  },
]

// ────────────────────────────────────────────────────────────────
// Carrusel con scroll‑snap (sin dependencias externas)
// ────────────────────────────────────────────────────────────────
export default function PackagesCarouselCabos({
  title = 'Paquetes destacados en Los Cabos',
  subtitle = 'Seleccionados para diferentes estilos y tamaños de evento.',
  paquetes,
  viewAllHref,
  className,
}: PackagesCarouselCabosProps) {
  const [CardComp, setCardComp] = useState<null | React.ComponentType<{ paquete: Paquete }>>(null)
  const data = useMemo(() => (paquetes && paquetes.length ? paquetes : FALLBACK), [paquetes])

  // carga perezosa del PackageCard desde tu ruta real
  useEffect(() => {
    ;(async () => {
      try {
        const mod: any = await import('@/app/explorar/components/PackageCard')
        setCardComp(() => mod.PackageCard)
      } catch {
        setCardComp(null)
      }
    })()
  }, [])

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateArrows = () => {
    const el = viewportRef.current
    if (!el) return
    const { scrollLeft, clientWidth, scrollWidth } = el
    setCanPrev(scrollLeft > 0)
    setCanNext(scrollLeft + clientWidth < scrollWidth - 1)
  }

  useEffect(() => {
    updateArrows()
  }, [data.length])

  const scrollByCards = (dir: 1 | -1) => {
    const el = viewportRef.current
    if (!el) return
    const card = el.querySelector('[data-card]') as HTMLElement | null
    const delta = card ? card.offsetWidth + 16 : Math.floor(el.clientWidth * 0.9)
    el.scrollBy({ left: dir * delta, behavior: 'smooth' })
  }

  return (
    <section aria-label="Carrusel de paquetes — Los Cabos" className={`px-4 sm:px-6 md:px-8 mt-10 md:mt-14 ${className ?? ''}`}>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle ? <p className="text-slate-600 text-sm md:text-base">{subtitle}</p> : null}
          </div>
          {viewAllHref ? (
            <Button as="a" href={viewAllHref} size="sm" variant="flat">
              Ver todos
            </Button>
          ) : null}
        </div>

        {/* Controles */}
        <div className="relative">
          <div
            ref={viewportRef}
            onScroll={updateArrows}
            className="scroll-smooth overflow-x-auto snap-x snap-mandatory flex gap-4 pb-2 -mx-2 px-2"
            role="region"
            aria-label="Paquetes en carrusel"
          >
            {data.map((paquete) => (
              <div key={paquete.id} data-card className="snap-start min-w-[88%] sm:min-w-[46%] lg:min-w-[32%]">
                {CardComp ? (
                  <CardComp paquete={paquete} />
                ) : (
                  <Card shadow="sm" className="bg-white border border-slate-200 rounded-2xl">
                    <CardBody className="p-4">
                      <Skeleton className="h-40 w-full rounded-xl" />
                      <div className="mt-3 space-y-2">
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                        <Skeleton className="h-3 w-1/2 rounded-md" />
                        <Skeleton className="h-3 w-2/3 rounded-md" />
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            ))}
          </div>

          {/* Flechas flotantes (auto-ocultan si no hay scroll) */}
          <div className="pointer-events-none hidden sm:block">
            <Button
              isDisabled={!canPrev}
              onPress={() => scrollByCards(-1)}
              className="pointer-events-auto absolute -left-3 top-1/2 -translate-y-1/2 rounded-full shadow-md"
              isIconOnly
              variant="shadow"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              isDisabled={!canNext}
              onPress={() => scrollByCards(1)}
              className="pointer-events-auto absolute -right-3 top-1/2 -translate-y-1/2 rounded-full shadow-md"
              isIconOnly
              variant="shadow"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Uso sugerido (en la landing):
// <PackagesCarouselCabos viewAllHref="/explorar?destino=Los%20Cabos" paquetes={listaLosCabos} />
// Si no pasas `paquetes`, se mostrará el fallback para no romper el layout.
