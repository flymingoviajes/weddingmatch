// app/nosotros/page.tsx — About / Nosotros
'use client'

import { motion } from 'framer-motion'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/react'
import { Accordion, AccordionItem } from '@heroui/react'
import { Image } from '@heroui/react'
import { Divider } from '@heroui/divider'
import { Link } from '@heroui/link'
import { Breadcrumbs, BreadcrumbItem } from '@heroui/react'
import { Heart, CalendarDays, Users, MapPin, Shield, MessageCircle } from 'lucide-react'

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Migas */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Inicio</BreadcrumbItem>
          <BreadcrumbItem>Nosotros</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto px-6 pt-8">
        <motion.div
          className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="h-72 md:h-96 w-full relative">
            <Image
              src="https://images.unsplash.com/photo-1543599538-a6e0402e43a6?q=80&w=2000&auto=format&fit=crop"
              alt="Boda destino en la playa"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-6 px-6 md:px-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-sm">Flymingo Weddings</h1>
                <p className="text-white/90 max-w-2xl">
                  Somos la unidad de bodas destino de <strong>Flymingo Viajes</strong>. Diseñamos experiencias
                  memorables en los mejores resorts de México con asesoría creativa, transparente y cercana.
                </p>
              </div>
              <div className="flex gap-2">
                <Chip className="bg-white/90" variant="flat" color="primary">Bodas destino</Chip>
                <Chip className="bg-white/90" variant="flat">Riviera Maya · Los Cabos · Vallarta</Chip>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Misión / Visión / Valores */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid gap-6 md:grid-cols-3">
        {[{
          title: 'Nuestra misión',
          text: 'Hacer fácil, emocionante y confiable planear tu boda destino, con curaduría honesta y acompañamiento experto.'
        }, {
          title: 'Nuestra visión',
          text: 'Ser el aliado número uno en México para bodas destino, integrando tecnología, creatividad y servicio humano.'
        }, {
          title: 'Nuestros valores',
          text: 'Transparencia, empatía y excelencia operativa. Cuidamos tu presupuesto como si fuera el nuestro.'
        }].map((b, i) => (
          <motion.div key={b.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 * i }}>
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-pink-200/60 via-violet-200/50 to-indigo-200/60">
              <Card className="rounded-[15px] bg-white/80 backdrop-blur shadow-md ring-1 ring-black/5 h-full">
                <CardHeader className="px-4 pt-4 pb-1 font-semibold">{b.title}</CardHeader>
                <CardBody className="px-4 pb-4 text-default-600 text-sm">{b.text}</CardBody>
              </Card>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Cifras rápidas */}
      <section className="max-w-6xl mx-auto px-6 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Heart size={18} />, label: 'Bodas planeadas', value: '+120' },
            { icon: <CalendarDays size={18} />, label: 'Años de experiencia', value: '10+' },
            { icon: <Users size={18} />, label: 'Invitados felices', value: '+9,000' },
            { icon: <MapPin size={18} />, label: 'Destinos clave', value: '4' },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 240, damping: 18 }}>
              <div className="flex items-center gap-3 p-4 rounded-xl border bg-white/70 backdrop-blur shadow-sm">
                <div className="p-2 rounded-lg border bg-white shadow-sm">{s.icon}</div>
                <div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-default-500">{s.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Diferenciales */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {[{
            title: 'Curaduría honesta',
            text: 'Te recomendamos sólo lo que encaja con tu estilo y presupuesto. Sin humo.'
          },{
            title: 'Tecnología + humano',
            text: 'Herramientas como WeddingMatch para comparar y un equipo real para ejecutar.'
          },{
            title: 'Red de partners',
            text: 'Trabajamos con hoteles y proveedores verificados; menos sorpresas, más magia.'
          }].map((d, i) => (
            <Card key={i} className="border rounded-2xl">
              <CardBody className="p-4">
                <div className="font-semibold mb-1">{d.title}</div>
                <p className="text-sm text-default-600">{d.text}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Línea del tiempo */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Nuestra historia</h2>
          <p className="text-sm text-default-500">De agencia a especialistas en bodas destino, siempre con servicio 5⭐️.</p>
        </div>
        <div className="grid gap-4">
          {[
            { year: '2015', title: 'Nace Flymingo Viajes', body: 'Arrancamos como agencia boutique enfocada en experiencias a medida.' },
            { year: '2019', title: 'Primeras bodas destino', body: 'Formalizamos alianzas con hoteles all‑inclusive y proveedores locales.' },
            { year: '2023', title: 'Lanzamos WeddingMatch', body: 'Comparador de paquetes transparente para parejas exigentes.' },
            { year: '2025', title: 'Unidad Flymingo Weddings', body: 'Equipo dedicado + tecnología propia para elevar cada detalle.' },
          ].map((t, i) => (
            <motion.div key={t.year} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 * i }}>
              <div className="flex gap-4 items-start">
                <div className="shrink-0 mt-1 w-16 text-primary font-semibold">{t.year}</div>
                <div className="flex-1 p-4 rounded-xl border bg-white/70 backdrop-blur">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-default-600">{t.body}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Hoteles & partners</h2>
          <Chip variant="flat" startContent={<Shield size={14} />}>Certificados</Chip>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl border bg-white/60 backdrop-blur flex items-center justify-center text-default-400 text-sm">
              Logo #{i + 1}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-pink-200/60 via-violet-200/50 to-indigo-200/60">
          <Card className="rounded-[15px] bg-white/85 backdrop-blur shadow-md ring-1 ring-black/5">
            <CardBody className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-xl font-semibold">¿Listos para empezar?</div>
                <div className="text-sm text-default-600">Agenda una videollamada o escríbenos por WhatsApp. Planeemos algo inolvidable.</div>
              </div>
              <div className="flex gap-2">
                <Button as={Link} href="/cotizar" color="primary" variant="shadow">Cotizar mi boda</Button>
                <Button as={Link} href="https://wa.me/52TU_NUMERO" target="_blank" startContent={<MessageCircle size={16} />}>WhatsApp</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold mb-3">Preguntas frecuentes</h2>
        <Accordion variant="splitted" selectionMode="multiple" defaultExpandedKeys={["1","2"]}>
          <AccordionItem key="1" title="¿Cuánto cuesta una boda destino?">
            Los paquetes inician desde el precio base del hotel y varían según la fecha, número de invitados y proveedores extra. En nuestra página de cada paquete verás un estimado referencial.
          </AccordionItem>
          <AccordionItem key="2" title="¿Pueden ayudar con invitados que no se hospedan?">
            Sí. Algunos hoteles requieren <em>wedding pass</em> para no hospedados. Te asesoramos para optimizar costos y cumplir políticas.
          </AccordionItem>
          <AccordionItem key="3" title="¿Trabajan bodas inclusivas o simbólicas?">
            Absolutamente. Muchos paquetes admiten ceremonias simbólicas, civiles y religiosas; además tenemos opciones inclusivas y pet‑friendly.
          </AccordionItem>
          <AccordionItem key="4" title="¿Con cuánta anticipación debo reservar?">
            Idealmente 9–12 meses. Para fechas muy demandadas (temporada alta) conviene apartar cuanto antes.
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}
