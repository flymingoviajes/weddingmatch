'use client'
import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Snippet } from '@heroui/react'
import { Link } from '@heroui/react'
import { Phone } from 'lucide-react'
import { BodaData } from './types'

export default function RSVPModal({
  open,
  onOpenChange,
  boda,
  preset,
  callNumber,
  callLabel,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  boda: BodaData
  preset?: { adultos: number; menores: number; nights: number; total: number; occupancyLabel: string }
  callNumber?: string
  callLabel?: string
}) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    adultos: preset?.adultos ?? 2,
    menores: preset?.menores ?? 0,
    comentarios: '',
  })
  const onChange = (k: keyof typeof form, v: any) => setForm((s) => ({ ...s, [k]: v }))

  // WhatsApp solicitado (mensaje EXACTO)
  const waNumber = '528715816903'
  const waText = '/confirmar Hola, quiero confirmar mi lugar en la boda de: _________'
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`

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
                <Input
                  label="Nombre completo"
                  isRequired
                  value={form.nombre}
                  onChange={(e) => onChange('nombre', e.target.value)}
                />
                <Input
                  type="email"
                  label="Email"
                  isRequired
                  value={form.email}
                  onChange={(e) => onChange('email', e.target.value)}
                />
                <Input
                  label="Teléfono"
                  value={form.telefono}
                  onChange={(e) => onChange('telefono', e.target.value)}
                />
                <Input
                  type="number"
                  label="Adultos"
                  min={1}
                  max={4}
                  value={String(form.adultos)}
                  onChange={(e) => onChange('adultos', Number(e.target.value))}
                />
                <Input
                  type="number"
                  label="Menores"
                  min={0}
                  max={4}
                  value={String(form.menores)}
                  onChange={(e) => onChange('menores', Number(e.target.value))}
                />
                <Input
                  type="text"
                  label="Comentarios"
                  value={form.comentarios}
                  onChange={(e) => onChange('comentarios', e.target.value)}
                />
              </div>

              {boda.bloqueHabitaciones?.codigo && (
                <Snippet hideCopyButton variant="flat" symbol="#" className="mt-1" color="default">
                  Código de grupo: {boda.bloqueHabitaciones.codigo}
                </Snippet>
              )}
            </ModalBody>

            <ModalFooter className="flex flex-wrap gap-2">
              <Button
                as={Link}
                href={waHref}
                target="_blank"
                color="success"
                startContent={<Phone className="w-4 h-4" />}
              >
                Confirmar por WhatsApp
              </Button>

              {callNumber ? (
                <Button
                  as="a"
                  href={`tel:${callNumber}`}
                  variant="bordered"
                  startContent={<Phone className="w-4 h-4" />}
                >
                  {callLabel ?? 'Llamar'}
                </Button>
              ) : null}

              <Button variant="flat" onPress={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}