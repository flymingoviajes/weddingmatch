export interface Tarifa {
  titulo: string
  descripcion?: string
  precioDesde: number
  moneda: 'MXN' | 'USD'
  por: 'noche' | 'persona' | 'paquete'
  ocupacion?: string
  minNoches?: number
  incluye?: string[]
  notas?: string
}

export interface AgendaItem {
  hora?: string // opcional por si hay "Por definir"
  titulo: string
  detalle?: string
  icon?: 'ceremonia' | 'recepcion' | 'cocktail' | 'bienvenida' | 'brunch' | 'otro'
}

export interface HotelInfo {
  nombre: string
  direccion?: string
  telefono?: string
  mapaIframe?: string
  web?: string
}

export interface CotizadorRules {
  singlePerRoomPerNight: number
  doublePerAdultPerNight: number
  triplePerAdultPerNight: number
  quadPerAdultPerNight: number
  childPolicy: { minAge: number; maxAge: number; pricePerNight: number }
  minNights: number
  maxOccupancy: number
}

export interface BodaData {
  slug: string
  nombresNovios: string
  fechaEventoISO: string // ej. '2026-07-04T14:00:00-05:00' (America/Cancun)
  subtitulo?: string
  portadaUrl?: string

  // Rango de hospedaje del bloque
  hospedaje: { inicioISO: string; finISO: string }

  hotel: HotelInfo
  bloqueHabitaciones?: {
    codigo?: string
    fechaLimite?: string
    nochesMin?: number
    nota?: string
  }
  tarifas: Tarifa[]
  agenda?: AgendaItem[]
  faq?: { q: string; a: string }[]
  links?: {
    whatsapp?: string
    pago?: string
    terminosPDF?: string
    infoHotel?: string
  }
  rsvpMode?: 'form' | 'whatsapp'
  cotizador: CotizadorRules
}
