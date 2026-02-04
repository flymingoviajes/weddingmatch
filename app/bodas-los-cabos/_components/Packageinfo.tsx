'use client'

import { motion } from 'framer-motion'
import { Card, CardBody } from '@heroui/react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/react'
import { Gift, Wallet, PlaneTakeoff, CalendarClock } from 'lucide-react'

export type PackagesInfoCabosProps = {
  heading?: string
  subheading?: string
  exploreHref?: string
  minRoomsNote?: string // texto libre para aclarar el # de habitaciones requerido
}

export default function PackagesInfoCabos({
  heading = 'Sobre los paquetes de Los Cabos',
  subheading = 'Opciones para distintos presupuestos y con beneficios reales para novios e invitados.',
  exploreHref = '/explorar?destino=Los%20Cabos',
  minRoomsNote = 'Gratis para novios al reservar un bloque mínimo de habitaciones (p.ej., 10–15 habitaciones por 3 noches).',
}: PackagesInfoCabosProps) {
  return (
    <section aria-label="Información sobre paquetes en Los Cabos" className="px-4 sm:px-6 md:px-8 mt-10 md:mt-14">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-bold tracking-tight"
        >
          {heading}
        </motion.h2>
        {subheading ? (
          <p className="mt-2 text-slate-600 max-w-2xl">{subheading}</p>
        ) : null}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Beneficio 1: Paquetes GRATIS para novios */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl p-[1px] bg-gradient-to-br from-emerald-200/40 via-sky-200/40 to-indigo-200/40"
          >
            <Card className="rounded-[16px] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 ring-1 ring-black/5">
              <CardBody className="p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <Gift className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base md:text-lg leading-tight">Paquetes GRATIS para los novios</h3>
                      <Chip size="sm" className="bg-emerald-50 text-emerald-700 border border-emerald-200">Bloque de habitaciones</Chip>
                    </div>
                    <p className="mt-1 text-[13px] md:text-sm text-slate-600 leading-relaxed">
                      Muchos hoteles ofrecen ceremonia y beneficios sin costo al garantizar un bloque mínimo de habitaciones.
                      Eso reduce tu gasto fijo y te permite destinar presupuesto a lo que más impacta la experiencia (música,
                      decoración, photo & video).
                    </p>
                    <p className="mt-2 text-[12px] text-slate-500">{minRoomsNote}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Beneficio 2: Paquetes a módicos precios */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-2xl p-[1px] bg-gradient-to-br from-rose-200/40 via-violet-200/40 to-indigo-200/40"
          >
            <Card className="rounded-[16px] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 ring-1 ring-black/5">
              <CardBody className="p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 md:h-6 md:w-6 text-rose-600 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base md:text-lg leading-tight">Paquetes a módicos precios</h3>
                    <p className="mt-1 text-[13px] md:text-sm text-slate-600 leading-relaxed">
                      Si tu grupo es pequeño o buscas algo muy concreto, hay opciones con tarifa accesible y claridad de
                      inclusiones. Beneficio real: controlas el presupuesto desde el inicio y evitas costos sorpresa.
                      Todo se personaliza con upgrades opcionales.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Beneficio 3: Vuelos directos TORREÓN ⇄ LOS CABOS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-2xl p-[1px] bg-gradient-to-br from-amber-200/40 via-lime-200/40 to-teal-200/40"
          >
            <Card className="rounded-[16px] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 ring-1 ring-black/5">
              <CardBody className="p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <PlaneTakeoff className="h-5 w-5 md:h-6 md:w-6 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base md:text-lg leading-tight">Salidas ideales desde Torreón</h3>
                      <Chip size="sm" className="bg-amber-50 text-amber-700 border border-amber-200">Viernes & Lunes</Chip>
                    </div>
                    <p className="mt-1 text-[13px] md:text-sm text-slate-600 leading-relaxed">
                      Con vuelos directos los <strong>viernes</strong> y <strong>lunes</strong>, puedes armar escapadas
                      smart: <em>viernes → lunes</em> para fines de semana extendidos o <em>lunes → viernes</em> para una
                      semana relajada. Beneficio: logística sencilla para tus invitados y mejores tarifas al optimizar días.
                    </p>
                    <p className="mt-2 text-[12px] text-slate-500">Sujeto a disponibilidad y temporada. Verificamos horarios al momento de cotizar.</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* CTA único: Explorar paquetes */}
        <div className="mt-6 flex">
          <Button as="a" href={exploreHref} color="primary" radius="sm" size="lg" className="w-full sm:w-auto">
            Explorar paquetes de Los Cabos
          </Button>
        </div>
      </div>
    </section>
  )
}

