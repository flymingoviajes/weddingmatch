'use client'
import { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { Divider } from '@heroui/divider'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { AlertCircle, Calculator, ChevronRight, Phone, Plus, Trash2, TriangleAlert, Wallet } from 'lucide-react'
import { BodaData } from './types'
import { formatCurrency, nightsBetween, isVencido } from './utils'
import { emitOpenRSVP } from './rsvpBus'

type CotizadorHabitacionProps = {
  data: BodaData
  callNumber?: string
  callLabel?: string
}

type Room = { id: number; adultos: number; menores: number; adultosStr: string; menoresStr: string }

const OCCUPANCY_LABEL = ['Single', 'Doble', 'Triple', 'Cuádruple']

let nextRoomId = 1
function makeRoom(adultos = 2, menores = 0): Room {
  return { id: nextRoomId++, adultos, menores, adultosStr: String(adultos), menoresStr: String(menores) }
}

export default function CotizadorHabitacion({ data, callNumber, callLabel }: CotizadorHabitacionProps) {
  const [rooms, setRooms] = useState<Room[]>([makeRoom(2, 0)])

  const vencido = isVencido(data.bloqueHabitaciones?.fechaLimite)
  const nights = useMemo(() => nightsBetween(data.hospedaje.inicioISO, data.hospedaje.finISO), [data.hospedaje])
  const maxOccupancy = data.cotizador.maxOccupancy

  const rateForOccupancy = (occupancyAdults: number) => {
    if (occupancyAdults === 1) return null
    if (occupancyAdults === 2) return data.cotizador.doublePerAdultPerNight
    if (occupancyAdults === 3) return data.cotizador.triplePerAdultPerNight
    return data.cotizador.quadPerAdultPerNight
  }

  const roomsComputed = rooms.map((room) => {
    const occupancyAdults = Math.min(4, Math.max(1, room.adultos))
    const maxMenores = Math.max(0, maxOccupancy - occupancyAdults)
    const perAdultRate = rateForOccupancy(occupancyAdults)
    const subtotal =
      nights < data.cotizador.minNights
        ? 0
        : occupancyAdults === 1
          ? data.cotizador.singlePerRoomPerNight * nights
          : occupancyAdults * (perAdultRate ?? 0) * nights

    const warnings: string[] = []
    if (room.adultos < 1) warnings.push('Debe haber al menos 1 adulto por habitación.')
    if (room.adultos + room.menores > maxOccupancy)
      warnings.push(`Máximo ${maxOccupancy} personas por habitación (adultos + menores).`)

    return { room, occupancyAdults, maxMenores, perAdultRate, subtotal, warnings }
  })

  const totalAdultos = rooms.reduce((s, r) => s + r.adultos, 0)
  const totalMenores = rooms.reduce((s, r) => s + r.menores, 0)
  const granTotal = roomsComputed.reduce((s, r) => s + r.subtotal, 0)

  const APARTA_MXN = 1000
  const deposito = totalAdultos * APARTA_MXN

  const globalWarnings: string[] = []
  if (nights < data.cotizador.minNights) globalWarnings.push(`Mínimo ${data.cotizador.minNights} noches para esta tarifa.`)
  const allWarnings = [...globalWarnings, ...roomsComputed.flatMap((r) => r.warnings)]
  const disabled = allWarnings.length > 0

  const updateRoom = (id: number, patch: Partial<Room>) =>
    setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const handleAdultosChange = (id: number, raw: string) => {
    if (/^\d*$/.test(raw)) updateRoom(id, { adultosStr: raw })
  }
  const handleAdultosBlur = (id: number) => {
    setRooms((rs) =>
      rs.map((r) => {
        if (r.id !== id) return r
        const parsed = parseInt(r.adultosStr || '0', 10)
        const clamped = Math.min(4, Math.max(1, isNaN(parsed) ? 1 : parsed))
        const newMaxMenores = Math.max(0, maxOccupancy - clamped)
        const clampedMenores = Math.min(r.menores, newMaxMenores)
        return { ...r, adultos: clamped, adultosStr: String(clamped), menores: clampedMenores, menoresStr: String(clampedMenores) }
      })
    )
  }
  const handleMenoresChange = (id: number, raw: string) => {
    if (/^\d*$/.test(raw)) updateRoom(id, { menoresStr: raw })
  }
  const handleMenoresBlur = (id: number) => {
    setRooms((rs) =>
      rs.map((r) => {
        if (r.id !== id) return r
        const maxMenores = Math.max(0, maxOccupancy - r.adultos)
        const parsed = parseInt(r.menoresStr || '0', 10)
        const clamped = Math.min(maxMenores, Math.max(0, isNaN(parsed) ? 0 : parsed))
        return { ...r, menores: clamped, menoresStr: String(clamped) }
      })
    )
  }

  const addRoom = () => setRooms((rs) => (rs.length >= 6 ? rs : [...rs, makeRoom(2, 0)]))
  const removeRoom = (id: number) => setRooms((rs) => (rs.length <= 1 ? rs : rs.filter((r) => r.id !== id)))

  const resumen = `${rooms.length} habitación(es) · ${totalAdultos} adulto(s)${totalMenores > 0 ? ` · ${totalMenores} menor(es)` : ''} · ${nights} noches · Total estimado ${formatCurrency(granTotal, 'MXN')}`

  return (
    <Card shadow="sm" className="border border-divider">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl">Cotiza tus habitaciones</h2>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-4">
        {vencido && (
          <div className="rounded-xl border border-danger-300 bg-danger-50 dark:bg-danger-100/10 p-4 flex items-start gap-3">
            <TriangleAlert className="w-5 h-5 text-danger-600 mt-0.5 shrink-0" />
            <p className="text-base font-medium text-danger-700 dark:text-danger-400">
              Esta cotización usa tarifas de grupo vencidas — el total de abajo es solo referencial. Contáctanos para obtener el precio actualizado.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {roomsComputed.map(({ room, occupancyAdults, maxMenores, perAdultRate, subtotal, warnings }, i) => (
            <div key={room.id} className="rounded-xl border border-divider p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">Habitación {i + 1}</p>
                {rooms.length > 1 && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label={`Quitar habitación ${i + 1}`}
                    onPress={() => removeRoom(room.id)}
                  >
                    <Trash2 className="w-4 h-4 text-foreground/50" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  label="Adultos"
                  value={room.adultosStr}
                  onChange={(e) => handleAdultosChange(room.id, e.target.value)}
                  onBlur={() => handleAdultosBlur(room.id)}
                  placeholder="1–4"
                />
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  label="Menores (0–17)"
                  value={room.menoresStr}
                  onChange={(e) => handleMenoresChange(room.id, e.target.value)}
                  onBlur={() => handleMenoresBlur(room.id)}
                  placeholder={`0–${maxMenores}`}
                />
                <Input isReadOnly label="Noches" value={String(nights)} />
              </div>

              <p className="mt-3 text-sm text-foreground/60">
                Ocupación <span className="font-medium text-foreground">{OCCUPANCY_LABEL[occupancyAdults - 1]}</span> ({room.adultos} adulto(s)
                {room.menores > 0 ? ` + ${room.menores} menor(es)` : ''})
              </p>

              {occupancyAdults === 1 ? (
                <p className="mt-1 text-sm text-foreground/70">
                  Tarifa: {formatCurrency(data.cotizador.singlePerRoomPerNight, 'MXN')} / noche (habitación)
                </p>
              ) : (
                <p className="mt-1 text-sm text-foreground/70">
                  Tarifa: {formatCurrency(perAdultRate ?? 0, 'MXN')} / noche / adulto • Menores {data.cotizador.childPolicy.minAge}-
                  {data.cotizador.childPolicy.maxAge} años:{' '}
                  <strong>
                    {data.cotizador.childPolicy.pricePerNight === 0
                      ? 'GRATIS'
                      : formatCurrency(data.cotizador.childPolicy.pricePerNight, 'MXN')}
                  </strong>
                </p>
              )}

              <p className="mt-2 font-medium">Subtotal: {formatCurrency(subtotal, 'MXN')}</p>

              {warnings.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  {warnings.map((w, wi) => (
                    <p key={wi} className="text-danger-600 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {w}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {rooms.length < 6 && (
          <Button variant="flat" startContent={<Plus className="w-4 h-4" />} onPress={addRoom}>
            Agregar habitación
          </Button>
        )}

        <div className="rounded-xl border border-divider p-4 bg-content2/40">
          <p className="text-sm text-foreground/60">
            Estancia: {new Date(data.hospedaje.inicioISO).toLocaleDateString('es-MX')} –{' '}
            {new Date(data.hospedaje.finISO).toLocaleDateString('es-MX')} ({nights} noches)
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            {rooms.length} habitación(es) · {totalAdultos} adulto(s){totalMenores > 0 ? ` + ${totalMenores} menor(es)` : ''}
          </p>

          <Divider className="my-3" />
          <p className={`font-display text-2xl ${vencido ? 'text-foreground/40 line-through' : 'text-primary'}`}>
            Total estimado: {formatCurrency(granTotal, 'MXN')}
          </p>
          {vencido && <p className="text-sm text-danger-600 font-medium mt-1">Tarifa vencida — solo referencial</p>}

          <div className="mt-2 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            <p className="text-sm text-foreground/70">
              Aparta hoy con <strong>{formatCurrency(deposito, 'MXN')}</strong>{' '}
              <span className="text-foreground/50">(MXN $1,000 por adulto)</span>
            </p>
          </div>

          <p className="text-sm text-foreground/50 mt-1">
            * Estimado basado en ocupación de adultos. Menores sin costo, pero cuentan para el aforo máximo de cada habitación.
          </p>
        </div>

        {globalWarnings.length > 0 && (
          <div className="flex flex-col gap-2">
            {globalWarnings.map((w, i) => (
              <p key={i} className="text-danger-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {w}
              </p>
            ))}
          </div>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <Button
            color={vencido ? 'danger' : 'success'}
            variant={vencido ? 'flat' : 'solid'}
            endContent={<ChevronRight className="w-4 h-4" />}
            isDisabled={disabled}
            onPress={() =>
              emitOpenRSVP({
                adultos: totalAdultos,
                menores: totalMenores,
                nights,
                total: granTotal,
                habitaciones: rooms.length,
                resumen: vencido ? `${resumen} (tarifa vencida, requiere recotización)` : resumen,
              })
            }
          >
            {vencido ? 'Solicitar cotización actualizada' : 'Reservar estas habitaciones'}
          </Button>

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
