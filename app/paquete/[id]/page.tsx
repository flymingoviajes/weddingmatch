'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabaseClient } from '@/utils/supabase/client'

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/react'
import { Image } from '@heroui/react'
import { Breadcrumbs, BreadcrumbItem } from '@heroui/react'
import { Divider } from '@heroui/divider'
import { Link } from '@heroui/react'
import { Tabs, Tab } from '@heroui/react'
import { Tooltip } from '@heroui/tooltip'
import { Skeleton } from '@heroui/react'
import { Heart, Share2, MapPin, Users, BedDouble, BadgeCheck, Info as InfoIcon } from 'lucide-react'
import { motion } from 'framer-motion'

// --- helper: parsea "a,b,c" -> ["a","b","c"] y filtra URLs válidas
function parseImagenes(raw: any): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.filter(Boolean).filter((u) => /^https?:\/\//i.test(u))
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((u) => /^https?:\/\//i.test(u))
  }
  return []
}

export default function PaqueteDetallePagePro() {
  const supabase = useMemo(() => supabaseClient(), [])
  const params = useParams() as { id?: string }
  const router = useRouter()
  const [item, setItem] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  const fetchData = async (id: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('paquetes_boda')
      .select(`
        id,
        nombre,
        descripcion,
        precio_base,
        invitados_incluidos,
        precio_persona_extra,
        precio_nino,
        precio_wedding_pass,
        precio_proveedor_externo,
        condiciones,
        beneficios,
        restricciones,
        numero_minimo,
        numero_maximo,
        inclusiva,
        minimo_habitaciones,
        petfriendly,
        imagenes,
        locacion,
        amenidades_incluidas,
        hotel:hoteles_boda (
          id, nombre, ubicacion, categoria, tipo, imagen_principal
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Detalle paquete error:', error)
      setItem(null)
    } else {
      setItem(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (params?.id) fetchData(String(params.id))
  }, [params?.id])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Skeleton className="h-6 w-64 rounded" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-default-500 mb-4">No encontramos este paquete.</p>
        <Button as={Link} href="/explorar" color="primary" variant="shadow">Volver a explorar</Button>
      </div>
    )
  }

  // imágenes: primero paquete.imagenes (coma), si no, hotel.imagen_principal
  const paqueteImgs = parseImagenes(item.imagenes)
  const fallbackHotel = item.hotel?.imagen_principal && /^https?:\/\//i.test(item.hotel.imagen_principal)
    ? [item.hotel.imagen_principal]
    : []
  const images: string[] = paqueteImgs.length ? paqueteImgs : fallbackHotel
  const mainImg = selectedImg || images[0] || null

  const amenidades = (item.amenidades_incluidas || '').split(',').map((s: string) => s.trim()).filter(Boolean)
  const locaciones = (item.locacion || '').split(',').map((s: string) => s.trim()).filter(Boolean)

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
      {/* Migas */}
      <Breadcrumbs>
        <BreadcrumbItem href="/">Inicio</BreadcrumbItem>
        <BreadcrumbItem href="/explorar">Explorar</BreadcrumbItem>
        <BreadcrumbItem>{item.nombre}</BreadcrumbItem>
      </Breadcrumbs>

      {/* Hero compacto con overlay + motion y borde degradado */}
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        whileHover={{ scale: 1.002 }}
      >
        <div className="h-60 w-full relative">
          {mainImg ? (
            <Image src={mainImg} alt={item.hotel?.nombre || item.nombre} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-default-400">
              Sin imagen
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold drop-shadow-sm">{item.nombre}</h1>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <MapPin size={16} />
                <span>{item.hotel?.nombre || 'Hotel por asignar'} · {item.hotel?.ubicacion || 'Ubicación por confirmar'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.inclusiva && <Chip className="bg-white/90" variant="flat" color="success">Inclusiva</Chip>}
              {item.petfriendly && <Chip className="bg-white/90" variant="flat">Petfriendly</Chip>}
            </div>
          </div>
          {/* Acciones */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Tooltip content="Guardar">
              <Button isIconOnly radius="full" className="bg-white/80 hover:bg-white"><Heart size={18} /></Button>
            </Tooltip>
            <Tooltip content="Compartir">
              <Button isIconOnly radius="full" className="bg-white/80 hover:bg-white"><Share2 size={18} /></Button>
            </Tooltip>
          </div>
        </div>
        {/* Thumbs */}
        {images.length > 1 && (
          <div className="px-4 py-3 bg-white/70 backdrop-blur">
            <div className="flex gap-2 overflow-x-auto">
              {images.map((src) => (
                <motion.button
                  key={src}
                  onClick={() => setSelectedImg(src)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden border ring-offset-2 transition ${
                    selectedImg === src || (!selectedImg && src === images[0]) ? 'ring-2 ring-primary' : 'hover:border-primary'
                  }`}
                  aria-label="Ver imagen"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna izquierda */}
        <div className="md:col-span-2 space-y-6">
          {/* Resumen / highlights con glass + hover */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-pink-200/60 via-violet-200/50 to-indigo-200/60">
            <Card className="rounded-[15px] bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-md ring-1 ring-black/5">
              <CardBody className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[{ icon: <Users size={18} />, label: 'Incluye', value: `${item.invitados_incluidos ?? 0} pax` },
                    { icon: <BadgeCheck size={18} />, label: 'Tipo', value: item.hotel?.tipo || '—' },
                    { icon: <BedDouble size={18} />, label: 'Mín. habitaciones', value: item.minimo_habitaciones ?? '—' },
                    { icon: <InfoIcon size={18} />, label: 'Categoría', value: item.hotel?.categoria || '—' }]
                    .map((s, i) => (
                      <motion.div key={i} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 240, damping: 18 }}>
                        <div className="flex items-center gap-3 p-3 rounded-xl border bg-white/60 backdrop-blur-sm shadow-sm">
                          <div className="p-2 rounded-lg border bg-white shadow-sm">{s.icon}</div>
                          <div>
                            <div className="text-xs text-default-500">{s.label}</div>
                            <div className="font-medium">{s.value}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Tabs con descripción y lista de amenidades/locaciones */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-pink-200/60 via-violet-200/50 to-indigo-200/60">
            <Card className="rounded-[15px] bg-white/80 backdrop-blur shadow-md ring-1 ring-black/5">
              <CardBody className="p-0">
                <Tabs aria-label="Detalles del paquete" color="primary" variant="underlined" fullWidth>
                  <Tab key="descripcion" title="Descripción">
                    <div className="p-4 text-sm text-default-600 whitespace-pre-line">{item.descripcion || '—'}</div>
                  </Tab>
                  <Tab key="amenidades" title="Amenidades">
                    <div className="p-4">
                      {amenidades.length ? (
                        <div className="flex flex-wrap gap-2">
                          {amenidades.map((a: string) => (
                            <Chip key={`am-${a}`} variant="flat" color="primary" className="hover:shadow-sm hover:-translate-y-0.5 transition">{a}</Chip>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-default-500">—</div>
                      )}
                    </div>
                  </Tab>
                  <Tab key="locaciones" title="Locaciones">
                    <div className="p-4">
                      {locaciones.length ? (
                        <div className="flex flex-wrap gap-2">
                          {locaciones.map((l: string) => (
                            <Chip key={`loc-${l}`} variant="flat" className="hover:shadow-sm hover:-translate-y-0.5 transition">{l}</Chip>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-default-500">—</div>
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </div>

          {/* Condiciones y Restricciones */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border rounded-2xl bg-white/90 backdrop-blur ring-1 ring-black/5">
              <CardHeader className="px-4 py-3 font-semibold">Condiciones</CardHeader>
              <CardBody className="px-4 pb-4 text-sm whitespace-pre-line">{item.condiciones || '—'}</CardBody>
            </Card>
            <Card className="border rounded-2xl bg-white/90 backdrop-blur ring-1 ring-black/5">
              <CardHeader className="px-4 py-3 font-semibold">Restricciones</CardHeader>
              <CardBody className="px-4 pb-4 text-sm whitespace-pre-line">{item.restricciones || '—'}</CardBody>
            </Card>
          </div>

          {/* Beneficios */}
          <Card className="border rounded-2xl bg-white/90 backdrop-blur ring-1 ring-black/5">
            <CardHeader className="px-4 py-3 font-semibold">Beneficios</CardHeader>
            <CardBody className="px-4 pb-4 text-sm whitespace-pre-line">{item.beneficios || '—'}</CardBody>
          </Card>
        </div>

        {/* Columna derecha: CTA pegajoso con glass y motion */}
        <div className="md:col-span-1">
          <motion.div
            className="sticky top-6"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
          >
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-pink-200/60 via-violet-200/50 to-indigo-200/60">
              <Card className="rounded-[15px] bg-white/80 backdrop-blur shadow-md ring-1 ring-black/5">
                <CardBody className="p-4 space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs text-default-500">Desde</div>
                      <div className="text-primary font-bold text-2xl">${(item.precio_base ?? 0).toLocaleString()}</div>
                    </div>
                    <Chip variant="flat" color="primary">{item.invitados_incluidos ?? 0} invitados</Chip>
                  </div>

                  <Divider />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Info label="Persona extra" value={`$${(item.precio_persona_extra ?? 0).toLocaleString()}`} />
                    <Info label="Niño" value={`$${(item.precio_nino ?? 0).toLocaleString()}`} />
                    <Info label="Wedding pass" value={`$${(item.precio_wedding_pass ?? 0).toLocaleString()}`} />
                    <Info label="Proveedor externo" value={`$${(item.precio_proveedor_externo ?? 0).toLocaleString()}`} />
                  </div>

                  <Button color="primary" variant="shadow" size="lg" onPress={() => router.push(`/cotizar?paquete=${item.id}`)}>
                    Cotizar mi boda
                  </Button>
                  <Button variant="bordered" onPress={() => router.push('/explorar')}>Seguir explorando</Button>
                </CardBody>
                <CardFooter className="text-xs text-default-400 px-4 pb-4">
                  Tarifas sujetas a disponibilidad y cambios sin previo aviso.
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer de navegación */}
      <div className="flex justify-between items-center">
        <Button as={Link} href="/explorar" variant="bordered">← Volver a explorar</Button>
        <Button color="primary" onPress={() => router.push(`/cotizar?paquete=${item.id}`)}>Cotizar ahora</Button>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-default-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
