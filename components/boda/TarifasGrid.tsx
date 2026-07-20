'use client'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/react'
import { Divider } from '@heroui/divider'
import { AlertCircle, Hotel, TriangleAlert, Users, Link as LinkIcon, Phone } from 'lucide-react'
import { BodaData, Tarifa } from './types'
import { formatCurrency, daysUntil, isVencido } from './utils'
import { Link } from '@heroui/react'
import { emitOpenRSVP } from './rsvpBus'

export default function TarifasGrid({ data }: { data: BodaData }) {
  const fechaLimite = data.bloqueHabitaciones?.fechaLimite
  const diasLimite = fechaLimite ? daysUntil(fechaLimite) : null
  const vencido = isVencido(fechaLimite)

  return (
    <Card shadow="sm" className="border border-divider">
      <CardHeader className="flex justify-between items-center">
        <div>
          <p className="text-sm text-foreground/50">Bloque de habitaciones</p>
          <h2 className="font-display text-xl">Tarifas oficiales para invitados</h2>
        </div>
        {fechaLimite && (
          <Chip color={vencido ? 'danger' : 'warning'} variant="flat">
            {vencido ? 'Tarifas vencidas' : `Hasta ${new Date(fechaLimite).toLocaleDateString('es-MX')}`}
          </Chip>
        )}
      </CardHeader>
      <Divider />
      <CardBody className="space-y-4">
        {fechaLimite && diasLimite !== null && (
          <div
            className={`rounded-xl border p-4 flex items-start gap-3 ${
              vencido
                ? 'border-danger-300 bg-danger-50 dark:bg-danger-100/10'
                : 'border-warning-300 bg-warning-50 dark:bg-warning-100/10'
            }`}
          >
            {vencido ? (
              <TriangleAlert className="w-5 h-5 text-danger-600 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-warning-600 mt-0.5 shrink-0" />
            )}
            <div>
              <p className={`font-semibold text-base ${vencido ? 'text-danger-700 dark:text-danger-400' : ''}`}>
                {vencido
                  ? 'Estas tarifas ya vencieron — es necesario recotizar'
                  : `Quedan ${diasLimite} ${diasLimite === 1 ? 'día' : 'días'} para pagar y confirmar con tarifa de grupo`}
              </p>
              <p className="mt-1 text-base font-medium text-foreground/80">
                {vencido
                  ? `El beneficio de precio de grupo de esta boda venció el ${new Date(fechaLimite).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}. Los precios que ves abajo ya no son válidos — contáctanos para obtener la tarifa actualizada.`
                  : `Después del ${new Date(fechaLimite).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })} será necesario recotizar las tarifas, ya que vence el beneficio de precio de grupo de esta boda.`}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.tarifas.map((t: Tarifa, i: number) => (
            <Card key={i} shadow="none" className={`border ${vencido ? 'border-danger-200' : 'border-divider'}`}>
              <CardHeader className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold leading-tight">{t.titulo}</h3>
                  {t.descripcion && <p className="text-sm text-foreground/50">{t.descripcion}</p>}
                </div>
                {vencido ? (
                  <Chip size="sm" color="danger" variant="flat">Vencida</Chip>
                ) : (
                  t.ocupacion && (
                    <Chip size="sm" variant="flat" startContent={<Users className="w-3.5 h-3.5" />}>
                      {t.ocupacion}
                    </Chip>
                  )
                )}
              </CardHeader>
              <CardBody className="pt-0">
                <p className={`font-display text-2xl ${vencido ? 'text-foreground/40 line-through' : 'text-primary'}`}>
                  {formatCurrency(t.precioDesde, t.moneda)}
                  <span className="text-sm text-foreground/50 font-sans font-normal"> / {t.por}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.minNoches && <Chip size="sm" variant="flat">Mín. {t.minNoches} noches</Chip>}
                  {t.incluye?.map((x, idx) => (
                    <Chip key={idx} size="sm" variant="flat">{x}</Chip>
                  ))}
                </div>
                {t.notas && <p className="mt-3 text-sm text-foreground/50">{t.notas}</p>}
                <div className="mt-5">
                  {vencido ? (
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() => emitOpenRSVP()}
                      startContent={<TriangleAlert className="w-4 h-4" />}
                    >
                      Solicitar tarifa actualizada
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      variant="flat"
                      onPress={() => emitOpenRSVP()}
                      startContent={<Hotel className="w-4 h-4" />}
                    >
                      Quiero estas tarifas
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {data.bloqueHabitaciones?.nota && (
          <p className="text-sm text-foreground/50">{data.bloqueHabitaciones.nota}</p>
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
