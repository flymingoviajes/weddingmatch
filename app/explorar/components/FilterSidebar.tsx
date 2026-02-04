'use client';

import { useEffect, useMemo, useState } from 'react'
import { supabaseClient } from '@/utils/supabase/client'
import { Checkbox } from "@heroui/react";
import { Slider } from "@heroui/react";
import { Accordion, AccordionItem } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { RadioGroup, Radio } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";

export function FilterSidebar({
  value,
  onChange,
  isLoading
}: {
  value: any
  onChange: (next: any) => void
  isLoading?: boolean
}) {
  const supabase = useMemo(() => supabaseClient(), [])
  const [opciones, setOpciones] = useState({
    categorias: [] as string[],
    tipos: [] as string[],
    destinos: [] as string[],
  })

  // Cargar opciones únicas desde hoteles_boda (categoría, tipo, ubicacion)
  useEffect(() => {
    const cargarOpciones = async () => {
      // Traemos algunos campos y los uniquificamos en cliente (rápido y sencillo)
      const { data, error } = await supabase
        .from('hoteles_boda')
        .select('categoria, tipo, ubicacion')
      if (error) {
        console.error('Opciones filtros (hoteles_boda):', error)
        return
      }
      const cats = new Set<string>()
      const tipos = new Set<string>()
      const destinos = new Set<string>()
      ;(data || []).forEach((h: any) => {
        if (h?.categoria) cats.add(h.categoria)
        if (h?.tipo) tipos.add(h.tipo)
        if (h?.ubicacion) destinos.add(h.ubicacion)
      })
      setOpciones({
        categorias: Array.from(cats),
        tipos: Array.from(tipos),
        destinos: Array.from(destinos),
      })
    }
    cargarOpciones()
  }, [supabase])

  const min = value.minPrecio ?? 50000
  const max = value.maxPrecio ?? 300000

  return (
    <aside className="w-full sm:w-64 p-4 bg-white border rounded-lg shadow-sm sticky top-6 h-fit">
      <h2 className="font-semibold text-xl mb-4">Filtrar resultados</h2>

      <Accordion defaultExpandedKeys={['precio','destino','opciones','capacidad']}>
        {/* PRECIO */}
        <AccordionItem key="precio" aria-label="Precio" title="Precio">
          <Slider
            step={1000}
            minValue={50000}
            maxValue={300000}
            defaultValue={[min, max]}
            onChange={(range: number | number[]) => {
              if (Array.isArray(range)) {
                onChange({ minPrecio: range[0], maxPrecio: range[1] })
              }
            }}
            formatOptions={{ style: "currency", currency: "MXN" }}
          />
        </AccordionItem>

        {/* DESTINO / UBICACIÓN (hotel) */}
        <AccordionItem key="destino" aria-label="Ubicación" title="Ubicación">
          <Select
            label="Destino"
            selectedKeys={value.destino ? [value.destino] : []}
            onSelectionChange={(keys) => {
              const v = Array.from(keys)[0] as string | undefined
              onChange({ destino: v ?? '' })
            }}
            placeholder="Selecciona o escribe…"
            className="mb-3"
          >
            {opciones.destinos.map((d) => (
              <SelectItem key={d}>{d}</SelectItem>
            ))}
          </Select>
          <Input
            label="Otro destino"
            placeholder="Ej. Los Cabos"
            value={value.destinoTexto || ''}
            onChange={(e) => onChange({ destino: e.target.value, destinoTexto: e.target.value })}
          />
        </AccordionItem>

        {/* OPCIONES (inclusiva, categoría, tipo) */}
        <AccordionItem key="opciones" aria-label="Opciones" title="Opciones">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Inclusiva (LGBT)</p>
              <RadioGroup
                orientation="horizontal"
                value={value.inclusiva ?? ''}
                onValueChange={(v) => onChange({ inclusiva: v })}
              >
                <Radio value="">Todas</Radio>
                <Radio value="si">Sí</Radio>
                <Radio value="no">No</Radio>
              </RadioGroup>
            </div>

            <Select
              label="Categoría (hotel)"
              selectedKeys={value.categoria ? [value.categoria] : []}
              onSelectionChange={(keys) => {
                const v = Array.from(keys)[0] as string | undefined
                onChange({ categoria: v ?? '' })
              }}
              placeholder="Todas"
            >
              {opciones.categorias.map((c) => (
                <SelectItem key={c}>{c}</SelectItem>
              ))}
            </Select>

            <Select
              label="Tipo (hotel)"
              selectedKeys={value.tipo ? [value.tipo] : []}
              onSelectionChange={(keys) => {
                const v = Array.from(keys)[0] as string | undefined
                onChange({ tipo: v ?? '' })
              }}
              placeholder="Todos"
            >
              {opciones.tipos.map((t) => (
                <SelectItem key={t}>{t}</SelectItem>
              ))}
            </Select>
          </div>
        </AccordionItem>

        {/* CAPACIDAD */}
        <AccordionItem key="capacidad" aria-label="Capacidad" title="Invitados incluidos (mínimo)">
          <Input
            type="number"
            min={0}
            placeholder="Ej. 50"
            value={value.invitados ?? ''}
            onChange={(e) => onChange({ invitados: e.target.value ? Number(e.target.value) : null })}
          />
        </AccordionItem>
      </Accordion>

      <div className="flex gap-2 mt-6">
        <Button
          className="flex-1"
          variant="flat"
          onPress={() =>
            onChange({
              q: '',
              destino: '',
              destinoTexto: '',
              minPrecio: null,
              maxPrecio: null,
              inclusiva: '',
              invitados: null,
              categoria: '',
              tipo: '',
            })
          }
          isDisabled={isLoading}
        >
          Limpiar
        </Button>
        <Button className="flex-1" color="primary" variant="shadow" isLoading={isLoading}>
          Aplicar
        </Button>
      </div>
    </aside>
  )
}
