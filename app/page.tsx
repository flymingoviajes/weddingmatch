import { Link } from "@heroui/react";
import { Snippet } from "@heroui/react";
import { Code } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { Input } from "@heroui/react";
import { Chip } from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import FeaturedPackages from "@/components/home/FeaturedPackages";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-10 py-10 md:py-16">
      {/* HERO */}
      <div className="inline-block max-w-3xl text-center justify-center">
        <span className={title()}>Tu boda soñada, </span>
        <span className={title({ color: "violet" })}>a un clic de distancia</span>
        <div className={subtitle({ class: "mt-4" })}>
          Encuentra, compara y cotiza paquetes de boda en los mejores destinos de playa de México con facilidad y estilo.
        </div>

        {/* Buscador simple que redirige a /explorar con query */}
        <form action="/explorar" className="mt-6 flex items-center justify-center gap-2">
          <Input
            name="q"
            type="text"
            placeholder="Busca: Cancún, Xcaret, Los Cabos…"
            className="max-w-xl"
          />
          <button
            className={buttonStyles({ color: "primary", radius: "full", variant: "shadow", class: "px-6 py-3" })}
            type="submit"
          >
            Buscar
          </button>
        </form>

        {/* Acciones rápidas */}
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Link
            href="/explorar"
            className={buttonStyles({ color: "primary", radius: "full", variant: "shadow", class: "text-lg px-6 py-3" })}
          >
            Explorar paquetes
          </Link>
          <Link
            href="/cotizar"
            className={buttonStyles({ variant: "bordered", radius: "full", class: "text-lg px-6 py-3" })}
          >
            💍 Quiero cotizar mi boda
          </Link>
        </div>

        {/* Chips de destinos rápidos (enlazan a /explorar con filtro destino) */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[
            { label: "Cancún", q: "Cancún" },
            { label: "Riviera Maya", q: "Riviera Maya" },
            { label: "Los Cabos", q: "Los Cabos" },
            { label: "Puerto Vallarta", q: "Puerto Vallarta" },
          ].map((d) => (
            <a key={d.label} href={`/explorar?destino=${encodeURIComponent(d.q)}`}>
              <Chip variant="flat" color="primary">{d.label}</Chip>
            </a>
          ))}
        </div>
      </div>

      {/* DESTACADOS (desde Supabase) */}
      <div className="w-full max-w-6xl px-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">Paquetes destacados</h3>
          <Link href="/explorar" className="text-primary">Ver todos</Link>
        </div>
        <FeaturedPackages limit={6} />
      </div>

      {/* Franja de confianza */}
      <div className="w-full max-w-6xl px-6 mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80">
        <div className="text-center text-sm text-default-500">Hoteles certificados</div>
        <div className="text-center text-sm text-default-500">Pagos a 6 MSI</div>
        <div className="text-center text-sm text-default-500">Asesoría personalizada</div>
        <div className="text-center text-sm text-default-500">+100 bodas planeadas</div>
      </div>

      {/* Snippet final */}
      <div className="mt-2">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Comienza creando tu historia con <Code color="primary">WeddingMatch</Code> ✨
          </span>
        </Snippet>
      </div>
    </section>
  );
}