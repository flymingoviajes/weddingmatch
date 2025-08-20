// =============================================
// app/bodas-los-cabos/page.tsx  (Server Component)
// =============================================
import type { Metadata } from 'next'
import LosCabosLanding from './_components/LosCabosLanding'

export const metadata: Metadata = {
  title: 'Bodas en Los Cabos desde Torreón | Flymingo Weddings',
  description:
    'Cásate en la playa en Los Cabos con organización integral desde Torreón. Asesoría sin costo, pagos flexibles y paquetes reales de hoteles. Agenda tu cita en línea.',
  keywords: [
    'bodas en Los Cabos',
    'boda destino Los Cabos',
    'casarse en la playa',
    'wedding planner Los Cabos',
    'boda en México',
    'Flymingo Weddings',
    'Torreón',
  ],
  openGraph: {
    title: 'Bodas en Los Cabos | Agenda tu cita',
    description:
      'Paquetes reales, asesoría local en Torreón y pagos flexibles. Vive tu boda destino en Los Cabos.',
    type: 'website',
    url: 'https://flymingoweddings.com/bodas-los-cabos',
  },
  alternates: {
    canonical: 'https://flymingoweddings.com/bodas-los-cabos',
  },
}

export default function Page() {
  return <LosCabosLanding />
}
