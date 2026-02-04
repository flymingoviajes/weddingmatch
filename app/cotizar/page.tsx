'use client'

import { Suspense, useEffect, useMemo, useState } from 'react' // <-- agrega Suspense
import { useSearchParams, useRouter } from 'next/navigation'
import { supabaseClient } from '@/utils/supabase/client'

import { Card, CardBody } from '@heroui/react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Chip } from '@heroui/react'
import { Image } from '@heroui/react'
import { Breadcrumbs, BreadcrumbItem } from '@heroui/react'
import { Divider } from '@heroui/divider'
import { DatePicker } from '@heroui/react'
import { Tabs, Tab } from '@heroui/react'

import { calcularEstimado } from '@/lib/estimate'
import { getCompareIds } from '@/utils/compare'

// (opcional) evita el prerender estático y simplifica el build en Vercel
export const dynamic = 'force-dynamic'

// ⬇️ Mueve tu página a un componente interno
function CotizarInner() {
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
        const order = new Map(ids.map((v, i) => [v, i]))
        const sorted = [...data].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
        setPaquetes(sorted)
        setPrincipalId(sorted[0]?.id ?? null)

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
    const base = 'https://wa.me/52TU_NUMERO'
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

  // —— JSX original de tu página (sin cambios) ——
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Breadcrumbs>
        <BreadcrumbItem href="/">Inicio</BreadcrumbItem>
        <BreadcrumbItem href="/explorar">Explorar</BreadcrumbItem>
        <BreadcrumbItem>Cotizar</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... resto tal cual lo tienes ... */}
      </div>
    </div>
  )
}

// ⬇️ Exporta un wrapper que ponga el Suspense
export default function CotizarPage() {
  return (
    <Suspense fallback={<div className="p-6 text-default-500">Cargando…</div>}>
      <CotizarInner />
    </Suspense>
  )
}

// helpers
function KV({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-default-500">{k}</span>
      <span className="font-medium">{String(v)}</span>
    </div>
  )
}
