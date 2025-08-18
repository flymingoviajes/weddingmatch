'use client'
import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Snippet } from '@heroui/snippet'
import { BodaData } from './types'

export default function RSVPModal({ open, onOpenChange, boda, preset }: { open: boolean; onOpenChange: (v: boolean) => void; boda: BodaData; preset?: { adultos: number; menores: number; nights: number; total: number; occupancyLabel: string } }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', llegada: '', salida: '', adultos: preset?.adultos ?? 2, menores: preset?.menores ?? 0, habitacion: preset?.occupancyLabel ?? '', comentarios: '' })
  const onChange = (k: keyof typeof form, v: any) => setForm((s) => ({ ...s, [k]: v }))

  const submit = async () => {
    try {
      setLoading(true)
      // TODO: conectar a Supabase -> invitados_boda
      await new Promise((r) => setTimeout(r, 600))
      onOpenChange(false)
      alert('¡Gracias! Hemos registrado tu interés. Te contactaremos para finalizar la reserva.')
    } catch {
      alert('No pudimos guardar tu RSVP. Intenta de nuevo o escríbenos por WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={open} onOpenChange={onOpenChange} size="lg" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-start gap-1">
              <span className="text-sm text-neutral-500">Boda {boda.nombresNovios}</span>
              <span className="text-xl font-semibold">Reservar mi lugar</span>
            </ModalHeader>
            <ModalBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nombre completo" isRequired value={form.nombre} onChange={(e) => onChange('nombre', e.target.value)} />
                <Input type="email" label="Email" isRequired value={form.email} onChange={(e) => onChange('email', e.target.value)} />
                <Input label="Teléfono" value={form.telefono} onChange={(e) => onChange('telefono', e.target.value)} />
                <Input type="date" label="Llegada" isRequired value={form.llegada} onChange={(e) => onChange('llegada', e.target.value)} />
                <Input type="date" label="Salida" isRequired value={form.salida} onChange={(e) => onChange('salida', e.target.value)} />
                <Input type="number" label="Adultos" min={1} max={4} value={String(form.adultos)} onChange={(e) => onChange('adultos', Number(e.target.value))} />
                <Input type="number" label="Menores" min={0} max={4} value={String(form.menores)} onChange={(e) => onChange('menores', Number(e.target.value))} />
                <Input type="text" label="Tipo de habitación" value={form.habitacion} onChange={(e) => onChange('habitacion', e.target.value)} />
                <Input type="text" label="Comentarios" value={form.comentarios} onChange={(e) => onChange('comentarios', e.target.value)} />
              </div>
              {boda.bloqueHabitaciones?.codigo && (
                <Snippet hideCopyButton variant="flat" symbol="#" className="mt-1" color="default">Código de grupo: {boda.bloqueHabitaciones.codigo}</Snippet>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>Cancelar</Button>
              <Button color="success" isLoading={loading} onPress={submit}>Enviar solicitud</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}