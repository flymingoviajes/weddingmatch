'use client'

import { motion } from 'framer-motion'
import { Link } from '@heroui/link'
import { Divider } from '@heroui/divider'
import { Instagram, Facebook, MessageCircle } from 'lucide-react'

const navLinks = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/explorar', label: 'Explorar' },
  { href: '/cotizar', label: 'Cotizar' },
]

const legalLinks = [
  { href: '/terminos', label: 'Términos' },
  { href: '/privacidad', label: 'Privacidad' },
]

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-content1/60 backdrop-blur supports-[backdrop-filter]:bg-content1/50">
      <motion.div
        className="max-w-7xl mx-auto px-6 py-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* Top */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold">Flymingo Weddings</h3>
            <p className="text-sm text-default-500 mt-2 max-w-sm">
              Tu boda soñada, planeada con amor. Compara y cotiza paquetes en los mejores destinos de playa en México.
            </p>
          </div>

          {/* Navegación */}
          <div className="grid grid-cols-2 gap-6 sm:max-md:order-3">
            <div>
              <div className="font-semibold mb-2">Navegación</div>
              <nav className="flex flex-col gap-1 text-sm">
                {navLinks.map(l => (
                  <Link key={l.href} href={l.href} className="text-default-600 hover:text-primary">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <div className="font-semibold mb-2">Legal</div>
              <nav className="flex flex-col gap-1 text-sm">
                {legalLinks.map(l => (
                  <Link key={l.href} href={l.href} className="text-default-600 hover:text-primary">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Contacto / Redes */}
          <div className="flex md:justify-end">
            <div className="space-y-3">
              <div className="font-semibold">Hablemos</div>
              <div className="flex gap-3">
                <Link
                  href="https://wa.me/5218715816903"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-default-600 hover:text-primary"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </Link>
              </div>
              <div className="font-semibold pt-1">Síguenos</div>
              <div className="flex gap-4">
                <Link href="https://instagram.com/flymingoviajes" target="_blank" aria-label="Instagram">
                  <Instagram size={20} className="text-default-600 hover:text-primary" />
                </Link>
                <Link href="https://facebook.com/flymingoviajes" target="_blank" aria-label="Facebook">
                  <Facebook size={20} className="text-default-600 hover:text-primary" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-default-500">
          <div>© {new Date().getFullYear()} Flymingo Weddings · Todos los derechos reservados</div>
          <div className="flex items-center gap-4">
            <span className="text-default-400">Una empresa de Flymingo Viajes</span>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
