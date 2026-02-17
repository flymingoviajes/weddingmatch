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
const FLYMINGO_WEDDINGS_CALL_NUMBER = '528716887385' // +52 871 688 7385
const FLYMINGO_WEDDINGS_CALL_LABEL = 'Llamar a Flymingo Weddings'
// ===== DEMO con los datos de Ana Karla & Alan =====
const DEMO: BodaData = {
  slug: 'ana-karla-y-alan-2026',
  nombresNovios: 'Ana Karla Moriel Lara & Alan Eduardo Torres Ocon',
  fechaEventoISO: '2026-07-04T14:00:00-05:00', // 2 pm Cancún (UTC-5)
  subtitulo: 'Moon Palace Cancun — 03 al 06 de julio de 2026',
  portadaUrl:
    'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/WhatsApp%20Image%202025-08-18%20at%202.30.35%20PM.jpeg',
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
    nota: 'Mínimo 3 noches. Tarifas sujetas a cambios y disponibilidad.'
  },
  tarifas: [
    { titulo: 'Superior Deluxe Garden View — Single', precioDesde: 10380, moneda: 'MXN', por: 'noche', ocupacion: '1 adulto', minNoches: 3 },
    { titulo: 'Superior Deluxe Garden View — Doble', precioDesde: 5190, moneda: 'MXN', por: 'persona', ocupacion: '2 adultos', minNoches: 3 },
    { titulo: 'Superior Deluxe Garden View — Triple', precioDesde: 4806, moneda: 'MXN', por: 'persona', ocupacion: '3 adultos', minNoches: 3 },
    { titulo: 'Superior Deluxe Garden View — Cuádruple', precioDesde: 4614, moneda: 'MXN', por: 'persona', ocupacion: '4 adultos', minNoches: 3 },
    { titulo: 'Menor (0–17 años)', precioDesde: 0, moneda: 'MXN', por: 'persona', ocupacion: '0–17 gratis compartiendo', minNoches: 3 }
  ],
  agenda: [
    { hora: '14:00', titulo: 'Ceremonia Católica', icon: 'ceremonia' },
    { titulo: 'Coctel', detalle: 'Por definir', icon: 'otro' }
  ],
  faq: [
    { q: '¿Incluye vuelos?', a: 'En este cotizador solo se incluyen las tarifas del hospedaje, si requieres vuelo, puedes solicitarlo con tu agente.' },
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
      {
        src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/moon%20palace/all-inclusive-vacay-moon-palace-cancun_0d3c6d24cb.webp',
        caption: 'Moon Palace'
      },
      { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/moon%20palace/ice-83880-72745021_3XL-718223.jpg', caption: 'Swim Bar' },
      {
        src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/moon%20palace/superior_deluxe_garden_view_moon_palace_nizuc_cancun_6b4dd931ab.webp',
        caption: 'Habitaciones'
      }
    ]
  },
  hotelOverview: {
    descripcion:
      'Moon Palace Cancún es un resort 5★ all-inclusive con varias secciones (Sunrise, Nizuc y The Grand 16+). Experiencia completa y sin preocupaciones.',
    secciones: [
      {
        titulo: 'Bares y Antros',
        bullets: ['12 bares y lounges', '9 bares de piscina', 'Noir Night Club (capacidad ~300)', 'Sky Bar y bar de deportes']
      },
      {
        titulo: 'Amenidades detalladas',
        bullets: [
          'Suites con jacuzzi doble, minibar y dispensador de licores',
          'Room service 24/7 y Wi-Fi de alta velocidad',
          '7 piscinas, parque acuático y FlowRider®',
          'Campo de golf de 27 hoyos (Jack Nicklaus)',
          'Tenis, pickleball, gimnasio, kayak y paddleboard'
        ]
      },
      {
        titulo: 'Entretenimiento y familia',
        bullets: ['Shows nocturnos (Michael Jackson, fuego, breakdance)', 'Salón de videojuegos Wired']
      },
      {
        titulo: 'Awe Spa',
        bullets: ['Faciales, corporales, masajes', 'Circuito de hidroterapia']
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
        ]
      }
    ]
  }
}

// ===== DEMO con los datos de María Teresa & Jorge Emilio =====
const DEMO2: BodaData = {
  slug: 'maria-teresa-y-jorge-emilio-2026',
  nombresNovios: 'María Teresa & Jorge Emilio',
  fechaEventoISO: '2026-10-17T17:00:00-07:00', // 5 pm Cabo (UTC-7 aprox)
  subtitulo: 'Hard Rock Los Cabos — 16 al 19 de octubre de 2026',
  portadaUrl: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/boda%20emilio/emilio.jpeg',
  hospedaje: { inicioISO: '2026-10-16T15:00:00-07:00', finISO: '2026-10-19T12:00:00-07:00' },
  hotel: {
    nombre: 'Hard Rock Hotel Los Cabos',
    direccion: 'Carretera Transpeninsular Km 47, Cabo San Lucas, B.C.S.',
    web: '',
    telefono: '',
    mapaIframe: ''
  },
  bloqueHabitaciones: {
    codigo: 'FLY HLC 161026',
    fechaLimite: '',
    nochesMin: 3,
    nota: 'Mínimo 3 noches. Tarifas sujetas a cambios y disponibilidad.'
  },
  // IMPORTANTE: estas tarifas son POR HABITACIÓN POR NOCHE (SGL/DBL/TPL)
  tarifas: [
    { titulo: 'Deluxe Partial Ocean View — SGL', precioDesde: 10831, moneda: 'MXN', por: 'noche', ocupacion: '1 adulto', minNoches: 3 },
    { titulo: 'Deluxe Partial Ocean View — DBL', precioDesde: 10831, moneda: 'MXN', por: 'noche', ocupacion: '2 adultos', minNoches: 3 },
    { titulo: 'Deluxe Partial Ocean View — TPL', precioDesde: 13902, moneda: 'MXN', por: 'noche', ocupacion: '3 adultos', minNoches: 3 },
    { titulo: 'Menor (4–12 años)', precioDesde: 0, moneda: 'MXN', por: 'persona', ocupacion: 'Gratis compartiendo', minNoches: 3 },
    { titulo: 'Junior (13–17 años)', precioDesde: 3071, moneda: 'MXN', por: 'persona', ocupacion: 'Adolescentes 13–17', minNoches: 3 }
  ],
  agenda: [
    { hora: '17:00', titulo: 'Ceremonia', icon: 'ceremonia' },
    { titulo: 'Recepción & Fiesta', detalle: 'Detalles por definir', icon: 'otro' }
  ],
  faq: [
    { q: '¿Incluye vuelos?', a: 'No, solo hospedaje. Puedes cotizar vuelos con tu agente Flymingo.' },
    { q: '¿Mínimo de noches?', a: '3 noches (16–19 octubre 2026).' },
    { q: '¿Capacidad por habitación?', a: 'Máximo 4 personas (adultos y menores).' },
    { q: '¿Menores?', a: '0–12 años gratis compartiendo con adultos (según políticas del hotel).' }
  ],
  links: {
    whatsapp:
      'https://wa.me/528716887385?text=%2Fconfirmar%20Quiero%20ir%20a%20la%20boda%20de%20Mar%C3%ADa%20Teresa%20%26%20Jorge%20Emilio%20%28Hard%20Rock%20Hotel%20Los%20Cabos%2C%2016%E2%80%9319%20oct%202026%29.%20Somos%20___%20adultos%20y%20___%20menores.%20Mi%20nombre%20es%20______.%20Ref%3A%20maria-teresa-y-jorge-emilio-2026',
    pago: '',
    terminosPDF: '',
    infoHotel: ''
  },
  rsvpMode: 'form',
  // Para el cotizador: convertir tarifas por habitación a precio por adulto/noche
  // DBL: 10831 / 2 = 5415.5; TPL: 13902 / 3 = 4634
  cotizador: {
    singlePerRoomPerNight: 10831,
    doublePerAdultPerNight: 5415.5,
    triplePerAdultPerNight: 4634,
    quadPerAdultPerNight: 0,
    childPolicy: { minAge: 4, maxAge: 12, pricePerNight: 0 },
    minNights: 3,
    maxOccupancy: 4
  },
  galeria: {
    images: [
      { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/boda%20emilio/hardrock_1.jpeg', caption: 'Piscinas y vistas al mar' },
      { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/boda%20emilio/hardrock_2.jpeg', caption: 'Habitaciones modernas' },
      { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/boda%20emilio/hardrock_3.jpeg', caption: 'Restaurantes y bares' },
      { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/boda%20emilio/hardrock_4.jpeg', caption: 'Restaurantes y bares' }
    ]
  },
  hotelOverview: {
    descripcion:
      'Hard Rock Los Cabos es un resort 5★ todo incluido con vibra rockera, ideal para familias, parejas y grupos. Gastronomía variada, entretenimiento para todas las edades y experiencias musicales únicas.',
    secciones: [
      {
        titulo: '¿Qué incluye?',
        bullets: [
          'Comida y bebidas ilimitadas (restaurantes a la carta, bares nacionales e importados)',
          'Shows nocturnos, fiestas temáticas y música en vivo',
          'Piscinas, Body Rock® Gym, canchas deportivas, kayaks y paddle boards',
          'Roxity Kids Club™ y Teen Club',
          'Wi‑Fi y propinas incluidas'
        ]
      },
      {
        titulo: 'Restaurantes y Bares',
        bullets: [
          'The Market — buffet internacional',
          'Los Gallos — cocina mexicana',
          'Zen — asiática con sushi y teppanyaki',
          'Ciao — italiana',
          'Toro — steakhouse',
          'Ipanema — rodizio brasileño',
          'Pizzeto — pizzas al horno de leña',
          'Cafetto — desayunos, snacks, café y té',
          'Bares y swim‑up bars (Sunlight Bar, Moonlight Bar & Lounge)'
        ]
      },
      {
        titulo: 'Entretenimiento para todas las edades',
        bullets: [
          'Roxity Kids Club™ con actividades y conciertos para peques',
          'Teen Club con air hockey, billar, Xbox y arcade',
          'Boliche en propiedad (con costo)',
          'The Sound of Your Stay™: guitarras Fender, vinilos y playlists',
          'Music Lab: banda de rock, DJ y grabación de video musical'
        ]
      },
      {
        titulo: 'Bienestar',
        bullets: ['Rock Spa® con tratamientos inspirados en la música', 'Gimnasio Body Rock®']
      }
    ]
  }
}

// ===== DEMO con los datos de Marina Guízar & René Sierra (AVA Resort Cancún) =====
const DEMO3: BodaData = {
  slug: 'marina-guizar-y-rene-sierra-2026',
  nombresNovios: 'Marina Guízar & René Sierra',
  // Hora no especificada: dejo 5 pm como placeholder (ajustable)
  fechaEventoISO: '2026-11-07T17:00:00-05:00', // Cancún (UTC-5)
  subtitulo: 'AVA Resort Cancún — 06 al 09 de noviembre de 2026',
  portadaUrl: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/boda%20marina/WhatsApp%20Image%202026-02-04%20at%2011.28.56%20AM.jpeg',

  hospedaje: { inicioISO: '2026-11-06T15:00:00-05:00', finISO: '2026-11-09T12:00:00-05:00' },

  hotel: {
    nombre: 'AVA Resort Cancún',
    direccion: 'Zona Hotelera Sur, Cancún, Quintana Roo, México',
    web: '',
    telefono: '',
    mapaIframe: ''
  },

  bloqueHabitaciones: {
    codigo: 'FLY AVC 061126',
    fechaLimite: '',
    nochesMin: 3,
    nota: 'Mínimo 3 noches. Tarifas por habitación por noche. OJO: las tarifas cambian según el día (DOM–MIE vs JUE–SAB). Sujetas a cambios y disponibilidad.'
  },

  // Tarifas POR HABITACIÓN POR NOCHE (según la tabla que compartiste)
  tarifas: [
    { titulo: 'Ocean Front Two Queen Beds (JUE–SAB) — DOBLE', precioDesde: 12055, moneda: 'MXN', por: 'noche', ocupacion: '2 adulto', minNoches: 3 },

  ],

  agenda: [
    { titulo: 'Ceremonia', detalle: 'Por definir', icon: 'ceremonia' },
    { titulo: 'Coctel / Recepción', detalle: 'Por definir', icon: 'otro' }
  ],

  faq: [
    { q: '¿Incluye vuelos?', a: 'En este cotizador solo se incluyen las tarifas del hospedaje. Si requieres vuelo, puedes solicitarlo con tu agente.' },
    { q: '¿Mínimo de noches?', a: '3 noches (06–09 noviembre 2026).' },
    { q: '¿Capacidad por habitación?', a: 'Máximo 4 personas entre adultos y menores (según categoría/políticas del hotel).' },
    { q: '¿Tarifas por noche?', a: 'Sí. Las tarifas mostradas son por habitación por noche y cambian según el día (DOM–MIE vs JUE–SAB).' },
    { q: '¿Junior 13–17?', a: 'Gratis (según la tabla compartida). Se valida al reservar.' }
  ],

  links: {
    whatsapp:
      'https://wa.me/528716887385?text=%2Fconfirmar%20Quiero%20ir%20a%20la%20boda%20de%20Marina%20Gu%C3%ADzar%20%26%20Ren%C3%A9%20Sierra%20%28AVA%20Resort%20Canc%C3%BAn%2C%2006%E2%80%9309%20nov%202026%29.%20Somos%20___%20adultos%20y%20___%20menores.%20Mi%20nombre%20es%20______.%20Ref%3A%20marina-guizar-y-rene-sierra-2026',
    pago: '',
    terminosPDF: '',
    infoHotel: ''
  },

  rsvpMode: 'form',

  // Cotizador actual NO soporta precios por día de semana.
  // Para que funcione sin cambiar componentes, dejamos como base DOM–MIE (más bajo) convertido a precio por adulto/noche.
  cotizador: {
    singlePerRoomPerNight: 11222,
    doublePerAdultPerNight: 12055 / 2, // 5611
    triplePerAdultPerNight: 13867 / 3, // 4345
    quadPerAdultPerNight: 0,
    childPolicy: { minAge: 13, maxAge: 17, pricePerNight: 0 },
    minNights: 3,
    maxOccupancy: 4
  },

  galeria: {
    images: [
       { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/bodaava/WhatsApp%20Image%202026-02-17%20at%2011.04.58%20AM%20(1).jpeg', caption: 'Hotel AVA Cancun' },
        { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/bodaava/WhatsApp%20Image%202026-02-17%20at%2011.04.58%20AM%20(2).jpeg', caption: 'Instalaciones' },
        { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/bodaava/WhatsApp%20Image%202026-02-17%20at%2011.04.58%20AM%20(3).jpeg', caption: 'Instalaciones' },
        { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/bodaava/WhatsApp%20Image%202026-02-17%20at%2011.04.58%20AM.jpeg', caption: 'Instalaciones' },
          { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/bodaava/WhatsApp%20Image%202026-02-17%20at%2011.04.58%20AM.jpeg', caption: 'Instalaciones' },
            { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/bodaava/WhatsApp%20Image%202026-02-17%20at%2011.05.05%20AM.jpeg', caption: 'Instalaciones' },
            { src: 'https://rqlfmdoptoodaqkxidyi.supabase.co/storage/v1/object/public/media/bodaava/WhatsApp%20Image%202026-02-17%20at%2011.05.14%20AM.jpeg', caption: 'Piscinas' }
    ]
  },

  hotelOverview: {
    descripcion:
      'AVA Resort Cancún es un resort de lujo todo incluido de nueva generación (apertura 2024), diseñado para una experiencia premium frente al mar Caribe, con enfoque en gastronomía de alto nivel, entretenimiento, wellness y amenidades exclusivas. Ideal para bodas destino, parejas y grupos.',

    secciones: [
      {
        titulo: 'Habitaciones • Oceanfront Promise™',
        bullets: [
          'Todas las habitaciones con vista frontal al mar',
          'Terraza privada con área lounge',
          'Tina tipo spa o jacuzzi para dos personas en terraza',
          'Minibar con bebidas premium',
          'Room service (según categoría)',
          'En suites seleccionadas: servicio de mayordomo'
        ]
      },
      {
        titulo: 'Gastronomía y Bebidas • Todo Incluido',
        bullets: [
          'Más de 17 bares y restaurantes entre fine dining y casual',
          'Copal — Mexicano',
          'Chez Moi — Francés',
          'Veranda — Italiano',
          'Ají — Peruano',
          'Livo — Mediterráneo',
          'Black Iron — Grill / Steakhouse',
          'Food District (mercado gastronómico internacional)',
          'Bebidas ilimitadas alcohólicas y no alcohólicas premium incluidas'
        ]
      },
      {
        titulo: 'Albercas, Playa y AVA Bay',
        bullets: [
          'Aproximadamente 6 albercas (familiar, swim-up, solo adultos, hydro-pool tipo cenote, central y kids + parque acuático)',
          'Playa privada',
          'AVA Bay: laguna artificial gigante tipo Crystal Lagoon para kayak, paddle board, sailing y más (sin motor)'
        ]
      },
      {
        titulo: 'Bares & Night Club • Incluido',
        bullets: [
          'Digit Bar — bar moderno con arte digital interactivo',
          'The Cocktail Bar — lounge de mixología avanzada',
          'CJ Cantina by Casa Jugadores — cantina mexicana tradicional',
          '3 Swim-Up Bars dentro de albercas',
          'Adult-Only Pool Bar — bar exclusivo para adultos',
          'DEZ Nightclub (+18) con DJs, eventos y pista de baile (hasta aprox. 2:00 am)'
        ]
      },
      {
        titulo: 'Entretenimiento y Actividades',
        bullets: [
          'Shows en vivo, música en vivo y DJs',
          'Teatro, performances y eventos pop-up',
          'Deportes acuáticos en AVA Bay (sin motor)',
          'Actividades diarias para adultos y familias',
          'Gimnasio FIIT Wellness Center y fitness classes',
          'Eventos temáticos y programación diaria'
        ]
      },
      {
        titulo: 'Familias, Niños y Teens',
        bullets: [
          'Kids Club (4–10): manualidades, juegos interactivos, áreas interior/exterior, toboganes y juegos de agua',
          'Teens Lounge (11–17): videojuegos, basketball, ping pong y snack bar'
        ]
      },
      {
        titulo: 'Wellness y Servicios',
        bullets: [
          'Acceso al gimnasio de última generación y clases grupales fitness',
          'Spa, salón de belleza y tratamientos: con costo adicional',
          'WiFi, concierge, servicio de playa y alberca',
          'Camastros y sombrillas',
          'Boutiques y tiendas dentro del resort',
          'Espacios para eventos y bodas'
        ]
      }
    ]
  }
}

// ===== Data loader local (reemplaza luego por Supabase) =====
async function getBodaData(slug: string): Promise<BodaData | null> {
  if (slug === DEMO.slug) return DEMO
  if (slug === DEMO2.slug) return DEMO2
  if (slug === DEMO3.slug) return DEMO3
  return null
}

type Params = { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
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

export default async function Page({ params }: { params: Promise<Params> }) {
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
            {data.hotelOverview ? <HotelOverview hotelName={data.hotel.nombre} data={data.hotelOverview} /> : null}
             {/* CTA: Llamar a Flymingo Weddings */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <a
          href={`tel:${FLYMINGO_WEDDINGS_CALL_NUMBER}`}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold shadow-sm border border-neutral-200 bg-white hover:bg-neutral-50"
        >
          <span aria-hidden>📞</span>
          {FLYMINGO_WEDDINGS_CALL_LABEL}
        </a>
        <p className="mt-2 text-sm text-neutral-500 text-center">
          Atención Flymingo Weddings
        </p>
      </section>
            <TarifasGrid data={data} />
            <CotizadorHabitacion
              data={data}
              callNumber={FLYMINGO_WEDDINGS_CALL_NUMBER}
              callLabel={FLYMINGO_WEDDINGS_CALL_LABEL}
            />
            <AgendaGrid data={data} />
            <FAQList data={data} />
          </div>
          <div className="space-y-6">
            <HotelCard data={data} />
          </div>
        </div>
      </section>

      <FooterCTA data={data} />
      <ClientRSVPMount
  data={data}
  callNumber={FLYMINGO_WEDDINGS_CALL_NUMBER}
  callLabel={FLYMINGO_WEDDINGS_CALL_LABEL}
/>
    </Suspense>
  )
}
