'use client'

import { useEffect, useMemo, useState } from "react";
import { supabaseClient } from "@/utils/supabase/client";

import { FilterSidebar } from "./components/FilterSidebar";
import { PackageCard } from "./components/PackageCard";
import { ComparisonBar } from "./components/ComparisonBar";
import { SearchHeader } from "./components/SearchHeader";

export default function ExplorePage() {
  const supabase = useMemo(() => supabaseClient(), []);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtros controlados
  const [filters, setFilters] = useState<any>({
    q: '',
    destino: '',
    destinoTexto: '',
    minPrecio: null,
    maxPrecio: null,
    inclusiva: '',
    invitados: null,
    categoria: '',
    tipo: '',
  });

  const activeCount = [
    filters.q,
    filters.destino,
    filters.minPrecio,
    filters.maxPrecio,
    filters.inclusiva,
    filters.invitados,
    filters.categoria,
    filters.tipo,
  ].filter((v) => v !== '' && v !== null && v !== undefined).length

  const fetchPaquetes = async () => {
    setLoading(true);

    // Base query
    let query = supabase
      .from("paquetes_boda")
      .select(`
        id,
        nombre,
        descripcion,
        precio_base,
        invitados_incluidos,
        inclusiva,
        hotel:hoteles_boda (
          id, nombre, ubicacion, categoria, tipo, imagen_principal
        )
      `)
      .order("precio_base", { ascending: true });

    // Texto libre (por ahora solo por nombre del paquete)
    if (filters.q && filters.q.trim()) {
      query = query.ilike('nombre', `%${filters.q.trim()}%`)
    }

    // Inclusiva (en paquetes)
    if (filters.inclusiva === 'si') query = query.eq('inclusiva', true)
    if (filters.inclusiva === 'no') query = query.eq('inclusiva', false)

    // Invitados mínimos (en paquetes)
    if (typeof filters.invitados === 'number') {
      query = query.gte('invitados_incluidos', filters.invitados)
    }

    // Precio (en paquetes)
    if (typeof filters.minPrecio === 'number') query = query.gte('precio_base', filters.minPrecio)
    if (typeof filters.maxPrecio === 'number') query = query.lte('precio_base', filters.maxPrecio)

    const { data, error } = await query
    if (error) {
      console.error("Error cargando paquetes:", error);
      setItems([]);
      setLoading(false);
      return
    }

    // Filtros por hotel en cliente (rápido para comenzar)
    let result = (data || []) as any[]

    if (filters.destino && filters.destino.trim()) {
      const d = filters.destino.trim().toLowerCase()
      result = result.filter(r => r.hotel?.ubicacion?.toLowerCase().includes(d))
    }

    if (filters.categoria && filters.categoria.trim()) {
      const c = filters.categoria.trim().toLowerCase()
      result = result.filter(r => (r.hotel?.categoria || '').toLowerCase() === c)
    }

    if (filters.tipo && filters.tipo.trim()) {
      const t = filters.tipo.trim().toLowerCase()
      result = result.filter(r => (r.hotel?.tipo || '').toLowerCase() === t)
    }

    setItems(result);
    setLoading(false);
  };

  // Cargar al entrar y cuando cambien filtros
  useEffect(() => {
    fetchPaquetes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <section className="flex min-h-screen">
      {/* Filtros laterales */}
      <aside className="hidden lg:block w-1/4 border-r px-6 py-8">
        <FilterSidebar
          value={filters}
          onChange={(next) => setFilters((prev: any) => ({ ...prev, ...next }))}
          isLoading={loading}
        />
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 px-6 py-8">
        <SearchHeader total={items.length} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-lg animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {items.map((p) => (
              <PackageCard key={p.id} paquete={p} />
            ))}
          </div>
        )}
      </main>

      {/* Barra de comparación */}
      <ComparisonBar />
    </section>
  );
}
