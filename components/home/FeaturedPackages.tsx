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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="h-72 rounded-xl bg-content2 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!items.length) {
    return <div className="text-sm text-foreground/60">Aún no hay paquetes destacados.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p) => (
        <Card key={p.id} shadow="sm" className="border border-divider bg-content1">
          <CardHeader className="p-0 relative h-48 overflow-hidden">
            <Image
              src={p.hotel?.imagen_principal || 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=800&auto=format&fit=crop'}
              alt={p.hotel?.nombre || p.nombre}
              className="object-cover w-full h-full"
            />
          </CardHeader>
          <CardBody className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="font-display text-lg leading-snug">{p.nombre}</div>
              <div className="font-display text-primary font-medium whitespace-nowrap">
                ${p.precio_base?.toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-foreground/60 mt-1">{p.hotel?.ubicacion || 'Ubicación por confirmar'}</div>
            <div className="text-xs text-foreground/40 mt-1">Incluye {p.invitados_incluidos} invitados</div>
          </CardBody>
          <CardFooter className="px-5 pb-5 pt-0 flex justify-end">
            <Button as={"a"} href={`/paquete/${p.id}`} size="sm" color="primary" variant="shadow" radius="full">Ver detalle</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
