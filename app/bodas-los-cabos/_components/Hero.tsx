'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Image as HeroImage } from '@heroui/image'

// ────────────────────────────────────────────────────────────────
// Helper: Calendly con UTMs
// ────────────────────────────────────────────────────────────────
const DEFAULT_CALENDLY = 'https://calendly.com/flymingo/flymingo-weddings'

function buildCalendlyUrl(
  base: string,
  utm?: { source?: string; medium?: string; campaign?: string; content?: string }
) {
  const url = new URL(base || DEFAULT_CALENDLY)
  url.searchParams.set('hide_landing_page_details', '1')
  url.searchParams.set('hide_gdpr_banner', '1')
  url.searchParams.set('utm_source', utm?.source ?? 'landing_cabos')
  url.searchParams.set('utm_medium', utm?.medium ?? 'cta')
  url.searchParams.set('utm_campaign', utm?.campaign ?? 'bodas_los_cabos')
  if (utm?.content) url.searchParams.set('utm_content', utm.content)
  return url.toString()
}

function openCalendly(url: string) {
  if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer')
}

// ────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────
export type HeroCabosProps = {
  title?: string
  highlight?: string
  tagline?: string
  badge?: string
  imageSrc?: string
  imageAlt?: string
  calendlyUrl?: string
  whatsapp?: string // E.164 sin +, ej: 528716887385
  viewPackagesHref?: string // ej: '#paquetes'
  utm?: { source?: string; medium?: string; campaign?: string; content?: string }
}

// ────────────────────────────────────────────────────────────────
// Componente
// ────────────────────────────────────────────────────────────────
export default function HeroCabos({
  title = 'Bodas en Los Cabos',
  highlight = 'Cásate en la playa, sin estrés.',
  tagline = 'Paquetes reales con hoteles de marca, coordinación completa y pagos flexibles. Somos agencia de Torreón: te acompañamos desde el primer “sí” hasta el último invitado.',
  badge = 'Desde Torreón → Los Cabos',
  imageSrc = 'https://images.unsplash.com/photo-1522673607200-7a70f24c0f83?q=80&w=1600&auto=format&fit=crop',
  imageAlt = 'Boda frente al mar en Los Cabos',
  calendlyUrl = DEFAULT_CALENDLY,
  whatsapp = '528716887385',
  viewPackagesHref = '#paquetes',
  utm,
}: HeroCabosProps) {
  const calendly = useMemo(() => buildCalendlyUrl(calendlyUrl, { ...utm, content: 'hero_primary' }), [calendlyUrl, utm])
  const wappUrl = useMemo(
    () => `https://wa.me/${whatsapp}?text=${encodeURIComponent('Quiero informes de Bodas en Los Cabos')}`,
    [whatsapp]
  )

  return (
    <section
      aria-label="Hero — Bodas en Los Cabos"
      className="relative overflow-hidden px-4 sm:px-6 md:px-8 pt-16 pb-12 md:pt-24 md:pb-20 bg-gradient-to-b from-white to-slate-50"
    >
      {/* Fondos suaves, optimizados a móvil */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-25 [mask-image:radial-gradient(ellipse_at_center,white,transparent_65%)]">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200 blur-3xl" />
        <div className="absolute top-24 -right-16 h-72 w-72 rounded-full bg-indigo-200 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl grid md:grid-cols-2 items-center gap-6">
        {/* Columna contenido — arriba en móvil */}
        <div className="order-2 md:order-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {badge && (
              <Chip radius="sm" className="mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200">
                {badge}
              </Chip>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-[-0.02em]">
              {title}
              {highlight && <span className="block text-emerald-700">{highlight}</span>}
            </h1>

            {tagline && (
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-xl">{tagline}</p>
            )}

            {/* CTAs móviles primero */}
            <div className="mt-5 sm:mt-6 flex">
              <Button
                color="primary"
                radius="sm"
                size="lg"
                className="w-full sm:w-auto"
                onPress={() => openCalendly(calendly)}
                aria-label="Agendar cita gratis en Calendly"
              >
                Agenda tu cita gratis
              </Button>
            </div>

            {/* Chips de confianza compactos */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip size="sm" className="bg-slate-100 border border-slate-200">Asesoría local en Torreón</Chip>
              <Chip size="sm" className="bg-slate-100 border border-slate-200">Diseño del evento</Chip>
              <Chip size="sm" className="bg-slate-100 border border-slate-200">Logística de invitados</Chip>
              <Chip size="sm" className="bg-slate-100 border border-slate-200\">Pagos flexibles </Chip>
            </div>
          </motion.div>
        </div>

        {/* Columna imagen — arriba visual en móvil */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="order-1 md:order-2"
        >
          <Card radius="lg" shadow="sm" className="overflow-hidden">
            <HeroImage alt={imageAlt} src={imageSrc} className="h-[260px] sm:h-[300px] w-full object-cover" />
            <CardFooter className="justify-between">
              <div className="text-sm text-slate-600">Planeación integral · Hoteles all‑inclusive · Locaciones frente al mar</div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
