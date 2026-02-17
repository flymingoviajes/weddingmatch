'use client'
import { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { Divider } from '@heroui/divider'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { AlertCircle, Calculator, ChevronRight, Phone, Wallet } from 'lucide-react'
import { BodaData } from './types'
import { formatCurrency, nightsBetween } from './utils'
import { emitOpenRSVP } from './rsvpBus'

type CotizadorHabitacionProps = {
  data: BodaData
  callNumber?: string
  callLabel?: string
}

export default function CotizadorHabitacion({ data, callNumber, callLabel }: CotizadorHabitacionProps) {
  // Estados numéricos
  const [adultos, setAdultos] = useState(2)
  const [menores, setMenores] = useState(0)
  // Estados de texto para edición libre (evita “salto a 4” al tipear)
  const [adultosStr, setAdultosStr] = useState('2')
  const [menoresStr, setMenoresStr] = useState('0')

  const nights = useMemo(() => nightsBetween(data.hospedaje.inicioISO, data.hospedaje.finISO), [data.hospedaje])

  const occupancyAdults = Math.min(4, Math.max(1, adultos))
  const maxMenores = Math.max(0, data.cotizador.maxOccupancy - occupancyAdults)
  const occupancyLabel = ['Single', 'Doble', 'Triple', 'Cuádruple'][occupancyAdults - 1]

  const perAdultRate = (() => {
    if (occupancyAdults === 1) return null
    if (occupancyAdults === 2) return data.cotizador.doublePerAdultPerNight
    if (occupancyAdults === 3) return data.cotizador.triplePerAdultPerNight
    return data.cotizador.quadPerAdultPerNight
  })()

  const total = (() => {
    if (nights < data.cotizador.minNights) return 0
    if (occupancyAdults === 1) {
      return data.cotizador.singlePerRoomPerNight * nights
    }
    const payingAdults = occupancyAdults
    return payingAdults * (perAdultRate ?? 0) * nights
  })()

  // —— Apartado ——
  const APARTA_MXN = 1000
  const deposito = adultos * APARTA_MXN

  // Handlers con edición libre y clamp en blur
  const handleAdultosChange = (raw: string) => {
    if (/^\d*$/.test(raw)) setAdultosStr(raw)
  }
  const handleAdultosBlur = () => {
    const parsed = parseInt(adultosStr || '0', 10)
    const clamped = Math.min(4, Math.max(1, isNaN(parsed) ? 1 : parsed))
    setAdultos(clamped)
    setAdultosStr(String(clamped))
    const newMaxMenores = Math.max(0, data.cotizador.maxOccupancy - clamped)
    if (menores > newMaxMenores) {
      setMenores(newMaxMenores)
      setMenoresStr(String(newMaxMenores))
    }
  }
  const handleMenoresChange = (raw: string) => {
    if (/^\d*$/.test(raw)) setMenoresStr(raw)
  }
  const handleMenoresBlur = () => {
    const parsed = parseInt(menoresStr || '0', 10)
    const clamped = Math.min(maxMenores, Math.max(0, isNaN(parsed) ? 0 : parsed))
    setMenores(clamped)
    setMenoresStr(String(clamped))
  }

  const warnings: string[] = []
  if (adultos < 1) warnings.push('Debe haber al menos 1 adulto por habitación.')
  if (adultos + menores > data.cotizador.maxOccupancy)
    warnings.push(`Máximo ${data.cotizador.maxOccupancy} personas por habitación (adultos + menores).`)
  if (nights < data.cotizador.minNights) warnings.push(`Mínimo ${data.cotizador.minNights} noches para esta tarifa.`)

  const disabled = warnings.length > 0

  return (
    <Card shadow="sm" className="border border-neutral-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Cotiza tu habitación</h2>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            label="Adultos"
            value={adultosStr}
            onChange={(e) => handleAdultosChange(e.target.value)}
            onBlur={handleAdultosBlur}
            placeholder="1–4"
          />
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            label={`Menores (0–17)`}
            value={menoresStr}
            onChange={(e) => handleMenoresChange(e.target.value)}
            onBlur={handleMenoresBlur}
            placeholder={`0–${maxMenores}`}
          />
          <Input isReadOnly label="Noches" value={String(nights)} />
        </div>

        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-600">
            Ocupación seleccionada <span className="font-medium">{occupancyLabel}</span> ({adultos} adulto(s)
            {menores > 0 ? ` + ${menores} menor(es)` : ''})
          </p>

          {occupancyAdults === 1 ? (
            <p className="mt-2">Tarifa: {formatCurrency(data.cotizador.singlePerRoomPerNight, 'MXN')} / noche (habitación)</p>
          ) : (
            <p className="mt-2">
              Tarifa: {formatCurrency(perAdultRate ?? 0, 'MXN')} / noche / adulto • Menores {data.cotizador.childPolicy.minAge}-
              {data.cotizador.childPolicy.maxAge} años:{' '}
              <strong>
                {data.cotizador.childPolicy.pricePerNight === 0
                  ? 'GRATIS'
                  : formatCurrency(data.cotizador.childPolicy.pricePerNight, 'MXN')}
              </strong>
            </p>
          )}

          <p className="mt-1 text-sm text-neutral-600">
            Estancia: {new Date(data.hospedaje.inicioISO).toLocaleDateString('es-MX')} –{' '}
            {new Date(data.hospedaje.finISO).toLocaleDateString('es-MX')} ({nights} noches)
          </p>

          <Divider className="my-3" />
          <p className="text-lg font-semibold">Total estimado: {formatCurrency(total, 'MXN')}</p>

          {/* Apartado (sin botón extra) */}
          <div className="mt-2 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            <p className="text-sm text-neutral-700">
              Aparta hoy con <strong>{formatCurrency(deposito, 'MXN')}</strong>{' '}
              <span className="text-neutral-600">(MXN $1,000 por adulto)</span>
            </p>
          </div>

          <p className="text-sm text-neutral-500 mt-1">
            * Estimado basado en ocupación de adultos. Menores sin costo, pero cuentan para el aforo máximo.
          </p>
        </div>

        {warnings.length > 0 && (
          <div className="flex flex-col gap-2">
            {warnings.map((w, i) => (
              <p key={i} className="text-danger-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {w}
              </p>
            ))}
          </div>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <Button
            color="success"
            endContent={<ChevronRight className="w-4 h-4" />}
            isDisabled={disabled}
            onPress={() => emitOpenRSVP({ adultos, menores, nights, total, occupancyLabel })}
          >
            Reservar esta opción
          </Button>

          {/* Botón llamar (dentro del wizard) */}
          {callNumber ? (
            <Button
              as="a"
              href={`tel:${callNumber}`}
              variant="bordered"
              startContent={<Phone className="w-4 h-4" />}
              className="w-full"
            >
              {callLabel ?? 'Llamar'}
            </Button>
          ) : null}
        </div>
      </CardBody>
    </Card>
  )
}