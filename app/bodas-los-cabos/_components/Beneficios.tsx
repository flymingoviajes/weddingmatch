'use client'

import { Card, CardBody } from '@heroui/react'
import { Chip } from '@heroui/react'
import { motion } from 'framer-motion'
import { UserCheck, QrCode, Users } from 'lucide-react'

export type Benefit = {
  title: string
  body: string
  badge?: string
  Icon?: React.ComponentType<{ className?: string }>
}

export type BenefitsFlymingoProps = {
  heading?: string
  subheading?: string
  items?: Benefit[]
  className?: string
}

const DEFAULT_ITEMS: Benefit[] = [
  {
    title: 'Wedding planner presente en tu evento',
    badge: 'ÚNICO EN TORREÓN',
    Icon: UserCheck,
    body:
      'El día de tu boda no te dejamos sola: una planner de Flymingo coordina en sitio a proveedores, timeline y contingencias. Resultado: menos estrés, mejores decisiones y ejecución puntual sin que tu familia “trabaje”.',
  },
  {
    title: 'Invitaciones digitales con QR y RSVP',
    badge: 'INCLUIDO',
    Icon: QrCode,
    body:
      'Envío por WhatsApp/email, landing del evento, confirmación en 1 clic y recordatorios automáticos. Evitas impresión, controlas asistencia en tiempo real y actualizas cambios al instante.',
  },
  {
    title: 'Gestión integral de invitados',
    badge: 'ONBOARDING FÁCIL',
    Icon: Users,
    body:
      'Nosotros centralizamos dudas, reservaciones de vuelo y hotel, traslados y pagos. A cada invitado le llega información clara; tú ahorras horas de logística y evitas mensajes dispersos.',
  },
]

export default function BenefitsFlymingo({
  heading = 'Beneficios de reservar con Flymingo Weddings',
  subheading = 'Más acompañamiento, menos estrés y herramientas digitales que sí resuelven.',
  items = DEFAULT_ITEMS,
  className,
}: BenefitsFlymingoProps) {
  return (
    <section
      aria-label="Beneficios Flymingo Weddings"
      className={`px-4 sm:px-6 md:px-8 mt-10 md:mt-14 ${className ?? ''}`}
    >
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

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(({ title, body, badge, Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-2xl p-[1px] bg-gradient-to-br from-rose-200/40 via-violet-200/40 to-indigo-200/40"
            >
              <Card className="rounded-[15px] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm ring-1 ring-black/5">
                <CardBody className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    {Icon ? <Icon className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 shrink-0" /> : null}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base md:text-lg leading-tight">{title}</h3>
                        {badge ? (
                          <Chip size="sm" className="bg-emerald-50 text-emerald-700 border border-emerald-200">{badge}</Chip>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[13px] md:text-sm text-slate-600 leading-relaxed">{body}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Uso sugerido bajo el Hero:
// <HeroCabos />
// <BenefitsFlymingo />
