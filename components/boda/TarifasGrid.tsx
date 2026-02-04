'use client'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/react'
import { Divider } from '@heroui/divider'
import { Hotel, Users, Link as LinkIcon, Phone } from 'lucide-react'
import { BodaData, Tarifa } from './types'
import { formatCurrency } from './utils'
import { Link } from '@heroui/link'
import { emitOpenRSVP } from './rsvpBus'

export default function TarifasGrid({ data }: { data: BodaData }) {
  return (
    <Card shadow="sm" className="border border-neutral-200">
      <CardHeader className="flex justify-between items-center">
        <div>
          <p className="text-sm text-neutral-500">Bloque de habitaciones</p>
          <h2 className="text-xl font-semibold">Tarifas oficiales para invitados</h2>
        </div>
        {data.bloqueHabitaciones?.fechaLimite && (
          <Chip color="warning" variant="flat">
            Hasta {new Date(data.bloqueHabitaciones.fechaLimite).toLocaleDateString('es-MX')}
          </Chip>
        )}
      </CardHeader>
      <Divider />
      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.tarifas.map((t: Tarifa, i: number) => (
            <Card key={i} shadow="none" className="border border-neutral-200">
              <CardHeader className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold leading-tight">{t.titulo}</h3>
                  {t.descripcion && <p className="text-sm text-neutral-500">{t.descripcion}</p>}
                </div>
                {t.ocupacion && (
                  <Chip size="sm" variant="flat" startContent={<Users className="w-3.5 h-3.5" />}>
                    {t.ocupacion}
                  </Chip>
                )}
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-2xl font-semibold">
                  {formatCurrency(t.precioDesde, t.moneda)}
                  <span className="text-sm text-neutral-500 font-normal"> / {t.por}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.minNoches && <Chip size="sm" variant="flat">Mín. {t.minNoches} noches</Chip>}
                  {t.incluye?.map((x, idx) => (
                    <Chip key={idx} size="sm" variant="flat">{x}</Chip>
                  ))}
                </div>
                {t.notas && <p className="mt-3 text-sm text-neutral-500">{t.notas}</p>}
                <div className="mt-5">
                  <Button
                    color="success"
                    variant="flat"
                    onPress={() => emitOpenRSVP()}
                    startContent={<Hotel className="w-4 h-4" />}
                  >
                    Quiero estas tarifas
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {data.bloqueHabitaciones?.nota && (
          <p className="text-sm text-neutral-500">{data.bloqueHabitaciones.nota}</p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {data.links?.pago && (
            <Button
              as={Link}
              href={data.links.pago}
              target="_blank"
              color="primary"
              startContent={<LinkIcon className="w-4 h-4" />}
            >
              Pagar anticipo
            </Button>
          )}
          {data.links?.whatsapp && (
            <Button
              as={Link}
              href={data.links.whatsapp}
              target="_blank"
              variant="flat"
              startContent={<Phone className="w-4 h-4" />}
            >
              WhatsApp de atención
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
