/** «Alemán» y «aleman» son lo mismo para buscar: sin tildes ni mayúsculas. */
export function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
}
