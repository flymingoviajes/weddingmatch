'use client'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Link } from '@heroui/link'
import { useSearchParams } from 'next/navigation'

export default function GraciasCotizacion() {
  const sp = useSearchParams()
  const id = sp.get('id')
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border rounded-2xl">
        <CardBody className="p-6 space-y-4 text-center">
          <h1 className="text-2xl font-bold">¡Gracias! 🎉</h1>
          <p className="text-default-600">Tu solicitud fue recibida. Un asesor se pondrá en contacto contigo muy pronto.</p>
          {id ? <p className="text-xs text-default-400">ID de referencia: {id}</p> : null}
          <div className="flex justify-center gap-2">
            <Button as={Link} href="/explorar" variant="bordered">Seguir explorando</Button>
            <Button as={Link} href="/" color="primary" variant="shadow">Volver al inicio</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}