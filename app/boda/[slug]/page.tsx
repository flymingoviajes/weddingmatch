// app/boda/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import BodaHero from '@/components/boda/BodaHero'
import TarifasGrid from '@/components/boda/TarifasGrid'
import CotizadorHabitacion from '@/components/boda/CotizadorHabitacion'
import AgendaGrid from '@/components/boda/AgendaGrid'
import HotelCard from '@/components/boda/HotelCard'
import FAQList from '@/components/boda/FAQList'
import FooterCTA from '@/components/boda/FooterCTA'
import ClientRSVPMount from '@/components/boda/ClientRSVPMount'
import { BodaData } from '@/components/boda/types'

import GalleryCarousel from '@/components/boda/GalleryCarousel'
import HotelOverview from '@/components/boda/HotelOverview'

export const dynamic = 'force-dynamic'
export const revalidate = 30

// ===== DEMO con los datos de Ana Karla & Alan =====
const DEMO: BodaData = {
  slug: 'ana-karla-y-alan-2026',
  nombresNovios: 'Ana Karla Moriel Lara & Alan Eduardo Torres Ocon',
  fechaEventoISO: '2026-07-04T14:00:00-05:00', // 2 pm Cancún (UTC-5)
  subtitulo: 'Moon Palace Cancun — 03 al 06 de julio de 2026',
  portadaUrl: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/WhatsApp%20Image%202025-08-18%20at%202.30.35%20PM.jpeg',
  hospedaje: { inicioISO: '2026-07-03T15:00:00-05:00', finISO: '2026-07-06T12:00:00-05:00' },
  hotel: {
    nombre: 'Moon Palace Cancun',
    direccion: 'Carretera Cancún - Tulum Km 340, Riviera Maya, Q.R.',
    web: '',
    telefono: '',
    mapaIframe: ''
  },
  bloqueHabitaciones: {
    codigo: '',
    fechaLimite: '',
    nochesMin: 3,
    nota: 'Mínimo 3 noches. Tarifas sujetas a cambios y disponibilidad.',
  },
  tarifas: [
    { titulo: 'Superior Deluxe Garden View — Single', precioDesde: 10380, moneda: 'MXN', por: 'noche',   ocupacion: '1 adulto',  minNoches: 3 },
    { titulo: 'Superior Deluxe Garden View — Doble',  precioDesde: 5190,  moneda: 'MXN', por: 'persona', ocupacion: '2 adultos', minNoches: 3 },
    { titulo: 'Superior Deluxe Garden View — Triple', precioDesde: 4806,  moneda: 'MXN', por: 'persona', ocupacion: '3 adultos', minNoches: 3 },
    { titulo: 'Superior Deluxe Garden View — Cuádruple', precioDesde: 4614, moneda: 'MXN', por: 'persona', ocupacion: '4 adultos', minNoches: 3 },
    { titulo: 'Menor (0–17 años)', precioDesde: 0, moneda: 'MXN', por: 'persona', ocupacion: '0–17 gratis compartiendo', minNoches: 3 }
  ],
  agenda: [
    { hora: '14:00', titulo: 'Ceremonia Católica', icon: 'ceremonia' },
    { titulo: 'Coctel', detalle: 'Por definir', icon: 'otro' }
  ],
  faq: [
    { q: '¿Mínimo de noches?', a: '3 noches (03–06 julio 2026).' },
    { q: '¿Capacidad por habitación?', a: 'Máximo 4 personas entre adultos y menores.' },
    { q: '¿Menores?', a: '0–17 años gratis compartiendo con adultos, sujetos a política del hotel.' }
  ],
  links: { whatsapp: '', pago: '', terminosPDF: '', infoHotel: '' },
  rsvpMode: 'form',
  cotizador: {
    singlePerRoomPerNight: 10380,
    doublePerAdultPerNight: 5190,
    triplePerAdultPerNight: 4806,
    quadPerAdultPerNight: 4614,
    childPolicy: { minAge: 0, maxAge: 17, pricePerNight: 0 },
    minNights: 3,
    maxOccupancy: 4
  },
  
galeria: {
  images: [
    { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/moon%20palace/448117768.jpg', caption: 'Piscinas espectaculares' },
    { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/moon%20palace/all-inclusive-vacay-moon-palace-cancun_0d3c6d24cb.webp', caption: 'Moon Palace' },
    { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/moon%20palace/ice-83880-72745021_3XL-718223.jpg', caption: 'Swim Bar' },
    { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/moon%20palace/superior_deluxe_garden_view_moon_palace_nizuc_cancun_6b4dd931ab.webp', caption: 'Habitaciones' }
  ]
},
hotelOverview: {
  descripcion:
    'Moon Palace Cancún es un resort 5★ all-inclusive con varias secciones (Sunrise, Nizuc y The Grand 16+). Experiencia completa y sin preocupaciones.',
  secciones: [
    {
      titulo: 'Bares y Antros',
      bullets: [
        '12 bares y lounges',
        '9 bares de piscina',
        'Noir Night Club (capacidad ~300)',
        'Sky Bar y bar de deportes'
      ],
    },
    {
      titulo: 'Amenidades detalladas',
      bullets: [
        'Suites con jacuzzi doble, minibar y dispensador de licores',
        'Room service 24/7 y Wi-Fi de alta velocidad',
        '7 piscinas, parque acuático y FlowRider®',
        'Campo de golf de 27 hoyos (Jack Nicklaus)',
        'Tenis, pickleball, gimnasio, kayak y paddleboard'
      ],
    },
    {
      titulo: 'Entretenimiento y familia',
      bullets: [
        'Shows nocturnos (Michael Jackson, fuego, breakdance)',
        'Salón de videojuegos Wired',
      ],
    },
    {
      titulo: 'Awe Spa',
      bullets: [
        'Faciales, corporales, masajes',
        'Circuito de hidroterapia'
      ],
    },
    {
      titulo: '¿Qué incluye el Todo Incluido?',
      bullets: [
        'Comidas y bebidas ilimitadas en +16 restaurantes',
        'Bebidas premium incluidas',
        'Servicio a la habitación 24/7',
        'Shows, actividades y deportes incluidos',
        'Resort Credit para spa, golf, excursiones (según promo)',
        'Wi-Fi de alta velocidad y llamadas a MX/USA/CAN'
      ],
    },
  ],
},
  }


// ===== Data loader local (reemplaza luego por Supabase) =====
async function getBodaData(slug: string): Promise<BodaData | null> {
  if (slug === DEMO.slug) return DEMO
  return null
}

type Params = { slug: string }

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const data = await getBodaData(slug)
  if (!data) return { title: 'Boda • Invitados', description: 'Información para invitados' }
  const title = `${data.nombresNovios} • Información para invitados`
  const description = data.subtitulo ?? 'Tarifas, hotel, agenda y RSVP'
  const image = data.portadaUrl
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [{ url: image }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined }
  }
}

export default async function Page(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const data = await getBodaData(slug)
  if (!data) return notFound()

  return (
    <Suspense>
      <BodaHero data={data} />

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             {/* Galería */}
      {data.galeria?.images?.length ? <GalleryCarousel images={data.galeria.images} /> : null}
      {/* Overview del hotel */}
      {data.hotelOverview ? (
        <HotelOverview hotelName={data.hotel.nombre} data={data.hotelOverview} />
      ) : null}
            <TarifasGrid data={data} />
            <CotizadorHabitacion data={data} />
            <AgendaGrid data={data} />
            <FAQList data={data} />
          </div>
          <div className="space-y-6">
            <HotelCard data={data} />
          </div>
        </div>
      </section>

      <FooterCTA data={data} />
      <ClientRSVPMount data={data} />
    </Suspense>
  )
}
