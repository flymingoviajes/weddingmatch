'use client'
import Image from "next/image";
import { Link } from "@heroui/link";
import { Input } from "@heroui/react";
import { Chip } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { ShieldCheck, CreditCard, HeartHandshake, Sparkles } from "lucide-react";
import { title, subtitle } from "@/components/primitives";
import FeaturedPackages from "@/components/home/FeaturedPackages";

const DESTINOS = [
  { label: "Cancún", q: "Cancún" },
  { label: "Riviera Maya", q: "Riviera Maya" },
  { label: "Los Cabos", q: "Los Cabos" },
  { label: "Puerto Vallarta", q: "Puerto Vallarta" },
];

const CONFIANZA = [
  { icon: ShieldCheck, label: "Hoteles certificados" },
  { icon: CreditCard, label: "Pagos a 6 MSI" },
  { icon: HeartHandshake, label: "Asesoría personalizada" },
  { icon: Sparkles, label: "+100 bodas planeadas" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative -mx-6 -mt-16 flex min-h-[92vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1920&auto=format&fit=crop"
            alt="Playa en un destino de bodas en México"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
          <Chip
            variant="bordered"
            className="mb-6 border-white/30 bg-white/10 text-white backdrop-blur"
          >
            Destinos de playa en México
          </Chip>

          <h1 className={title({ color: "white", size: "xl" })}>
            Tu boda soñada,{" "}
            <span className={title({ color: "white", size: "xl", italic: true, weight: "normal" })}>
              a un clic de distancia
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-sans text-lg text-white/80 sm:text-xl">
            Encuentra, compara y cotiza paquetes de boda en los mejores destinos de playa de
            México, con acompañamiento personalizado de principio a fin.
          </p>

          <form
            action="/explorar"
            className="mx-auto mt-8 flex max-w-xl flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Input
              name="q"
              type="text"
              placeholder="Busca: Cancún, Xcaret, Los Cabos…"
              classNames={{ inputWrapper: "bg-white/95" }}
              className="w-full"
            />
            <button
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                class: "w-full shrink-0 px-8 py-3 sm:w-auto",
              })}
              type="submit"
            >
              Buscar
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/explorar"
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                class: "px-6 py-3 text-base",
              })}
            >
              Explorar paquetes
            </Link>
            <Link
              href="/cotizar"
              className={buttonStyles({
                radius: "full",
                class: "border border-white/30 bg-white/10 px-6 py-3 text-base text-white backdrop-blur hover:bg-white/20",
              })}
            >
              Quiero cotizar mi boda
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {DESTINOS.map((d) => (
              <a key={d.label} href={`/explorar?destino=${encodeURIComponent(d.q)}`}>
                <Chip variant="bordered" className="border-white/30 text-white hover:bg-white/10">
                  {d.label}
                </Chip>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-2 text-primary">Selección curada</div>
            <h2 className={title({ size: "sm" })}>Paquetes destacados</h2>
          </div>
          <Link href="/explorar" className="hidden font-medium text-primary sm:block">
            Ver todos →
          </Link>
        </div>
        <FeaturedPackages limit={6} />
        <div className="mt-6 text-center sm:hidden">
          <Link href="/explorar" className="font-medium text-primary">
            Ver todos los paquetes →
          </Link>
        </div>
      </section>

      {/* FRANJA DE CONFIANZA */}
      <section className="w-full border-t border-divider bg-content1/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          {CONFIANZA.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon className="text-primary" size={22} />
              <span className="text-sm text-foreground/70">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
