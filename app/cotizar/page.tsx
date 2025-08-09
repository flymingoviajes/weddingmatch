'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabaseClient } from '@/utils/supabase/client'

import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Chip } from '@heroui/chip'
import { Image } from '@heroui/image'
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs'
import { Divider } from '@heroui/divider'
import { DatePicker } from '@heroui/date-picker'
import { Tabs, Tab } from '@heroui/tabs'

import { calcularEstimado } from '@/lib/estimate'
import { getCompareIds } from '@/utils/compare'

export default function CotizarPage() {
  const supabase = useMemo(() => supabaseClient(), [])
  const search = useSearchParams()
  const router = useRouter()

  const [step, setStep] = useState<1 | 2 | 3>(1)

  const [paquetes, setPaquetes] = useState<any[]>([])
  const [principalId, setPrincipalId] = useState<number | null>(null)

  // Datos del evento
  const [fechaTentativa, setFechaTentativa] = useState<string>('') // YYYY-MM-DD
  const [destino, setDestino] = useState<string>('')
  const [adultos, setAdultos] = useState<number>(50)
  const [ninos, setNinos] = useState<number>(0)
  const [passes, setPasses] = useState<number>(0)
  const [proveedorExt, setProveedorExt] = useState<boolean>(false)

  // Contacto
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const qPaquete = search.get('paquete')
    const qIds = search.get('ids')
    let ids: number[] = []
    if (qPaquete) ids = [Number(qPaquete)]
    else if (qIds) ids = qIds.split(',').map((x) => Number(x.trim())).filter(Boolean)
    else ids = getCompareIds()

    if (!ids.length) return

    const fetchPaquetes = async () => {
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
          imagenes,
          hotel:hoteles_boda ( id, nombre, ubicacion, imagen_principal )
        `)
        .in('id', ids)

      if (!error && data) {
        // Ordenar como ids de entrada
        const order = new Map(ids.map((v, i) => [v, i]))
        const sorted = [...data].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
        setPaquetes(sorted)
        setPrincipalId(sorted[0]?.id ?? null)

        // NORMALIZAR hotel (puede venir como arreglo)
        const h0 = Array.isArray(sorted[0]?.hotel) ? sorted[0].hotel[0] : sorted[0]?.hotel
        setDestino(h0?.ubicacion || '')
        if (sorted[0]?.invitados_incluidos) setAdultos(sorted[0].invitados_incluidos)
      }
    }

    fetchPaquetes()
  }, [search, supabase])

  const principal = paquetes.find((p) => p.id === principalId) || paquetes[0]
  const hotelPrincipal = principal ? (Array.isArray(principal.hotel) ? principal.hotel[0] : principal.hotel) : null

  const { total, breakdown } = principal
    ? calcularEstimado(principal, adultos, ninos, passes, proveedorExt)
    : { total: 0, breakdown: {} }

  const whatsappLink = (() => {
    const base = 'https://wa.me/52TU_NUMERO' // TODO: reemplazar con tu número
    const text = encodeURIComponent(
      `Hola, quiero una cotización.\n` +
      `Nombre: ${nombre}\n` +
      `Email: ${email}\n` +
      `Tel: ${telefono}\n` +
      `Paquete: ${principal?.nombre || ''}\n` +
      `Hotel: ${hotelPrincipal?.nombre || ''}\n` +
      `Destino: ${destino || hotelPrincipal?.ubicacion || ''}\n` +
      `Fecha tentativa: ${fechaTentativa || 'por definir'}\n` +
      `Adultos: ${adultos}  Niños: ${ninos}\n` +
      (passes ? `Wedding passes: ${passes}\n` : '') +
      (proveedorExt ? `Proveedor externo: Sí\n` : '') +
      `Estimado (referencial): $${total.toLocaleString()}`
    )
    return `${base}?text=${text}`
  })()

  const onSubmit = async () => {
    if (!nombre || !email || !telefono) {
      alert('Por favor completa nombre, email y teléfono.')
      return
    }
    if (!principal) {
      alert('Selecciona al menos un paquete.')
      return
    }

    setSaving(true)

    const { data: lead, error: leadErr } = await supabase
      .from('leads')
      .insert({
        nombre,
        email,
        telefono,
        mensaje,
        origen: 'wizard',
        paquete_id: principal.id,
        hotel_id: hotelPrincipal?.id || null,
        invitados: adultos + ninos,
        fecha_evento: fechaTentativa || null,
      })
      .select('*')
      .single()

    if (leadErr) {
      console.error('lead error', leadErr)
      setSaving(false)
      alert('No fue posible guardar tu solicitud. Inténtalo de nuevo.')
      return
    }

    await supabase.from('cotizaciones').insert({
      lead_id: lead.id,
      paquete_id: principal.id,
      adultos,
      ninos,
      estimado_total: total,
      breakdown,
    })

    setSaving(false)
    router.push(`/cotizar/gracias?id=${lead.id}`)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Breadcrumbs>
        <BreadcrumbItem href="/">Inicio</BreadcrumbItem>
        <BreadcrumbItem href="/explorar">Explorar</BreadcrumbItem>
        <BreadcrumbItem>Cotizar</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main */}
        <div className="md:col-span-2 space-y-6">
          <Tabs selectedKey={String(step)} onSelectionChange={(k) => setStep(Number(k) as any)} color="primary">
            <Tab key="1" title="1. Paquete" />
            <Tab key="2" title="2. Invitados" />
            <Tab key="3" title="3. Contacto" />
          </Tabs>

          {step === 1 && (
            <Card className="border rounded-2xl">
              <CardBody className="p-4 space-y-4">
                {!paquetes.length && (
                  <div className="text-default-500">
                    No hay paquetes seleccionados. Vuelve a <a href="/explorar" className="text-primary">Explorar</a>.
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paquetes.map((p) => {
                    const h = Array.isArray(p.hotel) ? p.hotel[0] : p.hotel
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPrincipalId(p.id)}
                        className={`text-left rounded-xl border overflow-hidden hover:shadow ${principalId===p.id?'ring-2 ring-primary':''}`}
                      >
                        <div className="h-28 relative">
                          <Image
                            src={h?.imagen_principal || 'https://images.unsplash.com/photo-1598953680797-d4c92b961d3f'}
                            alt={h?.nombre || p.nombre}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-3 space-y-1">
                          <div className="font-semibold">{p.nombre}</div>
                          <div className="text-xs text-default-500">{h?.nombre || 'Hotel'} · {h?.ubicacion || 'Ubicación'}</div>
                          <div className="text-primary font-bold">${(p.precio_base||0).toLocaleString()}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="bordered" onPress={() => history.back()}>Cancelar</Button>
                  <Button color="primary" onPress={() => setStep(2)} isDisabled={!principal}>Continuar</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {step === 2 && (
            <Card className="border rounded-2xl">
              <CardBody className="p-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <DatePicker label="Fecha tentativa" onChange={(d: any) => setFechaTentativa(d?.toString?.() || '')} />
                    <Input label="Destino" placeholder="Ej. Riviera Maya" value={destino} onChange={(e) => setDestino(e.target.value)} />
                  </div>
                  <div className="space-y-3">
                    <Input
                      type="number"
                      label="Adultos"
                      min={0}
                      value={String(adultos)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdultos(Number(e.target.value || 0))}
                    />
                    <Input
                      type="number"
                      label="Niños"
                      min={0}
                      value={String(ninos)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNinos(Number(e.target.value || 0))}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      type="number"
                      label="Wedding passes (no hospedados)"
                      min={0}
                      value={String(passes)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasses(Number(e.target.value || 0))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant={proveedorExt ? 'shadow' : 'bordered'}
                      color={proveedorExt ? 'primary' : 'default'}
                      onPress={() => setProveedorExt(v => !v)}
                    >
                      {proveedorExt ? '✓ Proveedor externo' : 'Proveedor externo'}
                    </Button>
                  </div>
                </div>

                <Divider />
                <div className="flex justify-between">
                  <Button variant="bordered" onPress={() => setStep(1)}>Atrás</Button>
                  <Button color="primary" onPress={() => setStep(3)}>Continuar</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {step === 3 && (
            <Card className="border rounded-2xl">
              <CardBody className="p-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input label="WhatsApp / Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

                  {/* Textarea nativo (HeroUI no trae Textarea en @heroui/input) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-default-500">Mensaje</label>
                    <textarea
                      placeholder="Cuéntanos cualquier preferencia o duda"
                      className="w-full min-h-24 resize-y rounded-medium border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 bg-content1 text-foreground"
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                    />
                  </div>
                </div>

                <Divider />
                <div className="flex flex-wrap gap-2">
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    <Button color="success" variant="shadow">Hablar por WhatsApp</Button>
                  </a>
                  <Button color="primary" variant="shadow" onPress={onSubmit} isLoading={saving}>Enviar solicitud</Button>
                  <Button variant="bordered" onPress={() => setStep(2)}>Atrás</Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="border rounded-2xl sticky top-6">
            <CardBody className="p-4 space-y-4">
              <div className="font-semibold">Resumen</div>
              {principal ? (
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <div className="w-20 h-16 rounded overflow-hidden">
                      <img
                        src={hotelPrincipal?.imagen_principal || 'https://images.unsplash.com/photo-1598953680797-d4c92b961d3f'}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{principal.nombre}</div>
                      <div className="text-default-500">{hotelPrincipal?.nombre || 'Hotel'} · {hotelPrincipal?.ubicacion || 'Ubicación'}</div>
                    </div>
                  </div>
                  <Divider />
                  <KV k="Fecha" v={fechaTentativa || '—'} />
                  <KV k="Destino" v={destino || hotelPrincipal?.ubicacion || '—'} />
                  <KV k="Adultos" v={adultos} />
                  <KV k="Niños" v={ninos} />
                  {passes ? <KV k="Wedding passes" v={passes} /> : null}
                  {proveedorExt ? <KV k="Proveedor externo" v="Sí" /> : null}
                  <Divider />
                  <div className="flex items-center justify-between">
                    <div className="text-default-500 text-sm">Estimado referencial</div>
                    <div className="text-primary font-bold text-xl">${total.toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-default-400">Precio tentativo según tus datos. Sujeto a disponibilidad y cambios.</div>
                </div>
              ) : (
                <div className="text-default-500">Selecciona un paquete para ver el estimado.</div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

function KV({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-default-500">{k}</span>
      <span className="font-medium">{String(v)}</span>
    </div>
  )
}
