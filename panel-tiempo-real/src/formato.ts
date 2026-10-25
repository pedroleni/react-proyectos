// Formatear números con Intl, creando cada formateador una sola vez y no en
// cada fila: con quinientas filas por segundo, se nota (lección 66).

const precioGrande = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const precioPequeno = new Intl.NumberFormat('es-ES', { maximumSignificantDigits: 4 })
const porcentaje = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
})
const compacto = new Intl.NumberFormat('es-ES', { notation: 'compact', maximumFractionDigits: 1 })
const hora = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

// Un precio de 0,00001234 no se puede enseñar con dos decimales: por debajo
// de 1, se enseñan cuatro cifras significativas.
export function formatoPrecio(precio: number): string {
  return precio >= 1 ? precioGrande.format(precio) : precioPequeno.format(precio)
}

export function formatoVariacion(variacion: number): string {
  return `${porcentaje.format(variacion)} %`
}

export function formatoVolumen(volumen: number): string {
  return compacto.format(volumen)
}

export function formatoHora(milisegundos: number): string {
  return hora.format(milisegundos)
}
