export function calcularEstimado(p: any, adultos: number, ninos: number, passes: number, proveedorExt: boolean) {
  const incluidos = Number(p?.invitados_incluidos || 0)
  const base = Number(p?.precio_base || 0)
  const extraAdulto = Number(p?.precio_persona_extra || 0)
  const precioNino = Number(p?.precio_nino || 0)
  const weddingPass = Number(p?.precio_wedding_pass || 0)
  const proveedor = proveedorExt ? Number(p?.precio_proveedor_externo || 0) : 0

  const extrasAdulto = Math.max(0, Number(adultos) - incluidos)
  const total = base + extrasAdulto * extraAdulto + Number(ninos) * precioNino + Number(passes) * weddingPass + proveedor

  return {
    total,
    breakdown: { incluidos, extrasAdulto, ninos: Number(ninos), passes: Number(passes), proveedorExt }
  }
}