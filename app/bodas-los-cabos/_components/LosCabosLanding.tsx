import HeroCabos from './Hero'
import BenefitsFlymingo from './Beneficios'
import PackagesInfoCabos from './Packageinfo'
import PackagesCarouselCabos from './Carrusel'

export default function Page() {
  return (
    <>
      <HeroCabos />
      <BenefitsFlymingo />
      <PackagesInfoCabos
        // opcional: personaliza la nota del mínimo de habitaciones
        // minRoomsNote="Gratis al reservar 12 habitaciones por 3 noches (puede variar por hotel)."
      />
      
    </>
  )
}
