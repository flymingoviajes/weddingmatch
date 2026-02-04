'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/react";

export function SearchHeader({ total }: { total: number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
      <div>
        <h2 className="text-xl font-semibold">Explora {total} paquetes disponibles</h2>
        <p className="text-sm text-gray-500">Basado en tu búsqueda y filtros seleccionados</p>
      </div>

      <div className="flex items-center gap-4">
        <Chip variant="flat" color="primary">
          2 filtros activos
        </Chip>

        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Ordenar por</Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="popular">Más populares</DropdownItem>
            <DropdownItem key="price-low">Precio: menor a mayor</DropdownItem>
            <DropdownItem key="price-high">Precio: mayor a menor</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
