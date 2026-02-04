'use client';

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { Button } from "@heroui/button";
import { Image } from "@heroui/react";
import { Chip } from '@heroui/react'
import { Tooltip } from '@heroui/tooltip'
import { MapPin, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCompare } from '@/hooks/useCompare'

// favoritos (localStorage)
const FAV_KEY = 'wm_fav_ids'
const getFavs = () => {
  if (typeof window === 'undefined') return [] as number[]
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') } catch { return [] }
}
const setFavs = (ids: number[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(FAV_KEY, JSON.stringify(ids))
}

export function PackageCard({ paquete }: { paquete: any }) {
  const router = useRouter()

  const hotel = useMemo(() => {
    const h = paquete?.hotel
    return Array.isArray(h) ? h[0] : h
  }, [paquete?.hotel])

  const primaryImg = Array.isArray(paquete?.imagenes) && paquete.imagenes.length
    ? paquete.imagenes[0]
    : (hotel?.imagen_principal || 'https://images.unsplash.com/photo-1598953680797-d4c92b961d3f')

  const hotelNombre = hotel?.nombre || 'Hotel por asignar'
  const ubicacion = hotel?.ubicacion || 'Ubicación por confirmar'
  const precio = Number(paquete?.precio_base || 0)
  const paxIncluidos = Number(paquete?.invitados_incluidos || 0)

  const { ids, toggle } = useCompare()
  const selected = ids.includes(paquete.id)

  const [favs, setFavsState] = useState<number[]>([])
  const isFav = favs.includes(paquete?.id)
  useEffect(() => { setFavsState(getFavs()) }, [])

  const goDetail = () => router.push(`/paquete/${paquete.id}`)
  const onToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = isFav ? favs.filter(id => id !== paquete.id) : [...favs, paquete.id]
    setFavs(next); setFavsState(next)
  }
  const onToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggle(paquete.id)
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative rounded-2xl p-[1px] bg-gradient-to-br from-pink-200/40 via-violet-200/40 to-indigo-200/40"
    >
      <Card
        className="rounded-[15px] bg-content1/80 backdrop-blur supports-[backdrop-filter]:bg-content1/70 shadow-md ring-1 ring-black/5"
        // hace toda la card clickeable al detalle
        onClick={goDetail}
      >
        <CardHeader className="p-0 relative h-48 overflow-hidden">
          <Image src={primaryImg} alt={hotelNombre} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <Tooltip content={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
              <Button
                isIconOnly
                radius="full"
                size="sm"
                className={`bg-white/85 hover:bg-white ${isFav ? 'ring-2 ring-danger' : ''}`}
                // usar onClick para tener MouseEvent con stopPropagation
                onClick={onToggleFav}
              >
                <Heart size={16} className={isFav ? 'text-danger fill-danger' : 'text-default-700'} />
              </Button>
            </Tooltip>
          </div>

          <div className="absolute bottom-3 left-3 z-10 flex gap-2">
            {paxIncluidos > 0 && <Chip size="sm" variant="flat" color="primary">{paxIncluidos} pax incluidos</Chip>}
            {hotel?.tipo && <Chip size="sm" variant="flat">{hotel.tipo}</Chip>}
          </div>
        </CardHeader>

        <CardBody className="p-4">
          <h3 className="font-semibold text-base md:text-lg line-clamp-1">{paquete?.nombre}</h3>
          <p className="text-xs md:text-sm text-default-500 flex items-center gap-1">
            <MapPin size={14} /> {hotelNombre} · {ubicacion}
          </p>
          <p className="text-sm mt-2 line-clamp-2 text-default-600">
            {paquete?.descripcion || '—'}
          </p>
        </CardBody>

        <CardFooter className="px-4 pb-4 flex justify-between items-center gap-2">
          <div>
            <p className="text-[11px] text-default-400">Desde</p>
            <p className="font-bold text-primary text-lg">${precio.toLocaleString()}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={selected ? 'solid' : 'flat'}
              color={selected ? 'primary' : 'default'}
              onClick={onToggleCompare}
            >
              {selected ? 'Comparando' : 'Comparar'}
            </Button>
            <Button size="sm" variant="shadow" color="primary" onClick={(e) => { e.stopPropagation(); goDetail() }}>
              Ver más
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
