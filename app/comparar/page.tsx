'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabaseClient } from '@/utils/supabase/client'
import { useCompare } from '@/hooks/useCompare'
import { Card, CardHeader, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Image } from '@heroui/image'
import { Divider } from '@heroui/divider'
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs'
import { Trash2 } from 'lucide-react'

export default function CompararPage() {
  const supabase = useMemo(() => supabaseClient(), [])
  const { ids, remove, clear } = useCompare()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    if (ids.length === 0) { setItems([]); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('paquetes_boda')
      .select(`
        id,
        nombre,
        descripcion,
        precio_base,
        invitados_incluidos,
        inclusiva,
        minimo_habitaciones,
        precio_persona_extra,
        precio_nino,
        precio_wedding_pass,
        precio_proveedor_externo,
        locacion,
        amenidades_incluidas,
        hotel:hoteles_boda ( id, nombre, ubicacion, categoria, tipo, imagen_principal )
      `)
      .in('id', ids)

    if (error) {
      console.error('comparar error:', error)
      setItems([])
    } else {
      // Ordenar según ids
      const orderMap = new Map(ids.map((v, i) => [v, i]))
      setItems((data || []).sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)))
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [ids.join(',')]) // refresca al cambiar selección

  const parseCSV = (s: any) =>
    String(s || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Breadcrumbs>
        <BreadcrumbItem href="/">Inicio</BreadcrumbItem>
        <BreadcrumbItem href="/explorar">Explorar</BreadcrumbItem>
        <BreadcrumbItem>Comparar</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comparar paquetes</h1>
        <div className="flex gap-2">
          <Button variant="bordered" onPress={fetchData} isLoading={loading}>Refrescar</Button>
          <Button variant="flat" color="danger" onPress={clear} isDisabled={!ids.length}>Limpiar</Button>
        </div>
      </div>

      {ids.length === 0 && (
        <div className="text-default-500">No tienes paquetes seleccionados. Ve a <a className="text-primary" href="/explorar">Explorar</a> y agrega algunos.</div>
      )}

      {ids.length > 0 && (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[900px]">
            {items.map((p) => {
              const amen = parseCSV(p.amenidades_incluidas)
              const locs = parseCSV(p.locacion)
              return (
                <Card key={p.id} className="border rounded-2xl">
                  <CardHeader className="p-0 relative h-32 overflow-hidden">
                    <Image
                      src={p.hotel?.imagen_principal || 'https://images.unsplash.com/photo-1598953680797-d4c92b961d3f'}
                      alt={p.hotel?.nombre || p.nombre}
                      className="object-cover w-full h-full"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="absolute top-2 right-2 bg-white/90"
                      onPress={() => remove(p.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </CardHeader>
                  <CardBody className="p-4 space-y-3">
                    <div>
                      <div className="font-semibold">{p.nombre}</div>
                      <div className="text-xs text-default-500">{p.hotel?.nombre || 'Hotel'} · {p.hotel?.ubicacion || 'Ubicación'}</div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-default-500">Desde</div>
                        <div className="text-primary font-bold text-lg">${(p.precio_base ?? 0).toLocaleString()}</div>
                      </div>
                      <Chip variant="flat" color="primary">{p.invitados_incluidos ?? 0} pax</Chip>
                    </div>

                    <Divider />

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <KV k="Categoría" v={p.hotel?.categoria || '—'} />
                      <KV k="Tipo" v={p.hotel?.tipo || '—'} />
                      <KV k="Inclusiva" v={p.inclusiva ? 'Sí' : 'No'} />
                      <KV k="Mín. habs" v={p.minimo_habitaciones ?? '—'} />
                      <KV k="Pers. extra" v={`$${(p.precio_persona_extra ?? 0).toLocaleString()}`} />
                      <KV k="Niño" v={`$${(p.precio_nino ?? 0).toLocaleString()}`} />
                      <KV k="Pass" v={`$${(p.precio_wedding_pass ?? 0).toLocaleString()}`} />
                      <KV k="Proveedor ext." v={`$${(p.precio_proveedor_externo ?? 0).toLocaleString()}`} />
                    </div>

                    {!!locs.length && (
                      <div>
                        <div className="text-xs text-default-500 mb-1">Locaciones</div>
                        <div className="flex flex-wrap gap-1">
                          {locs.slice(0, 6).map((x) => <Chip key={x} size="sm" variant="flat">{x}</Chip>)}
                        </div>
                      </div>
                    )}

                    {!!amen.length && (
                      <div>
                        <div className="text-xs text-default-500 mb-1">Amenidades</div>
                        <div className="flex flex-wrap gap-1">
                          {amen.slice(0, 6).map((x) => <Chip key={x} size="sm" variant="flat" color="primary">{x}</Chip>)}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button as={'a'} href={`/paquete/${p.id}`} size="sm" color="primary" variant="shadow" fullWidth>
                        Ver detalle
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function KV({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex flex-col">
      <span className="text-default-400">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  )
}
