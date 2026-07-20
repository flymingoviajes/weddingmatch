'use client'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { Divider } from '@heroui/divider'
import { Utensils, Martini, Waves, Dumbbell, Gamepad2, Sparkles, Bath, Music4 } from 'lucide-react'
import { HotelOverviewData } from './types'

const iconFor = (titulo: string) => {
  const t = titulo.toLowerCase()
  if (t.includes('bares') || t.includes('antro')) return Martini
  if (t.includes('gastronom')) return Utensils
  if (t.includes('piscin') || t.includes('playa') || t.includes('flowrider')) return Waves
  if (t.includes('deporte') || t.includes('gimnas') || t.includes('tenis') || t.includes('golf')) return Dumbbell
  if (t.includes('entreten')) return Music4
  if (t.includes('videojuego') || t.includes('wired')) return Gamepad2
  if (t.includes('spa')) return Bath
  if (t.includes('incluido')) return Sparkles
  return Sparkles
}

export default function HotelOverview({ hotelName, data }: { hotelName: string; data: HotelOverviewData }) {
  return (
    <Card shadow="sm" className="border border-divider">
      <CardHeader className="flex flex-col items-start gap-1">
        <p className="text-sm text-foreground/50">Conoce el hotel</p>
        <h2 className="font-display text-xl">{hotelName}</h2>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-6">
        <p className="text-foreground/70 leading-relaxed">{data.descripcion}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.secciones.map((sec, i) => {
            const Icon = iconFor(sec.titulo)
            return (
              <div key={i} className="p-4 rounded-xl border border-divider">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">{sec.titulo}</h3>
                </div>
                <ul className="list-disc pl-5 text-foreground/70 space-y-1">
                  {sec.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}
