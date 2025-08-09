'use client'

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { useRouter } from 'next/navigation'
import { useCompare } from "@/hooks/useCompare";

export function ComparisonBar() {
  const router = useRouter()
  const { count } = useCompare()

  if (count === 0) return null // ocultar si no hay nada seleccionado

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-5xl mx-auto">
      <Card className="p-4 flex items-center justify-between shadow-lg border bg-white rounded-xl">
        <div className="text-sm text-gray-700">
          <strong>{count} paquete{count>1?'s':''} seleccionado{count>1?'s':''}</strong> para comparar.
        </div>
        <Button color="primary" variant="shadow" onPress={() => router.push('/comparar')}>
          Comparar ahora
        </Button>
      </Card>
    </div>
  );
}
