'use client'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { MapPin } from 'lucide-react'
import { BodaData } from './types'

export default function HotelCard({ data }: { data: BodaData }) {
  return (
    <Card shadow="sm" className="border border-neutral-200 overflow-hidden">
      <CardHeader><h2 className="text-xl font-semibold">Hotel sede</h2></CardHeader>
      <Divider />
      <CardBody className="space-y-3">
        <p className="text-lg font-medium">{data.hotel.nombre}</p>
        {data.hotel.direccion && (<p className="flex items-start gap-2 text-neutral-700"><MapPin className="w-4 h-4 mt-1" /> {data.hotel.direccion}</p>)}
        <div className="grid gap-2">
          {data.hotel.web && (<Button as={Link} href={data.hotel.web} target="_blank" variant="flat">Sitio del hotel</Button>)}
          {data.links?.infoHotel && (<Button as={Link} href={data.links.infoHotel} target="_blank" variant="flat">Más info</Button>)}
        </div>
        {data.hotel.mapaIframe && (
          <div className="mt-3 rounded-xl overflow-hidden border border-neutral-200">
            <iframe src={data.hotel.mapaIframe} style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-[280px]" title={`Mapa ${data.hotel.nombre}`} />
          </div>
        )}
      </CardBody>
    </Card>
  )
}
