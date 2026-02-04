'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react'
import { Image } from '@heroui/react'
import { Button } from '@heroui/button'
import { supabaseClient } from '@/utils/supabase/client'

export default function FeaturedPackages({ limit = 6 }: { limit?: number }) {
  const supabase = useMemo(() => supabaseClient(), [])
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('paquetes_boda')
      .select(`
        id,
        nombre,
        descripcion,
        precio_base,
        invitados_incluidos,
        hotel:hoteles_boda ( id, nombre, ubicacion, imagen_principal )
      `)
      .order('precio_base', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('FeaturedPackages error:', error)
      setItems([])
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="h-64 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!items.length) {
    return <div className="text-sm text-default-500">Aún no hay paquetes destacados.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((p) => (
        <Card key={p.id} className="border">
          <CardHeader className="p-0 relative h-40 overflow-hidden">
            <Image
              src={p.hotel?.imagen_principal || 'https://images.unsplash.com/photo-1598953680797-d4c92b961d3f'}
              alt={p.hotel?.nombre || p.nombre}
              className="object-cover w-full h-full"
            />
          </CardHeader>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{p.nombre}</div>
              <div className="text-primary font-bold">${p.precio_base?.toLocaleString()}</div>
            </div>
            <div className="text-sm text-default-500">{p.hotel?.ubicacion || 'Ubicación por confirmar'}</div>
            <div className="text-xs text-default-400 mt-1">Incluye {p.invitados_incluidos} invitados</div>
          </CardBody>
          <CardFooter className="px-4 pb-4 flex justify-end">
            <Button as={"a"} href={`/paquete/${p.id}`} size="sm" color="primary" variant="shadow">Ver detalle</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
