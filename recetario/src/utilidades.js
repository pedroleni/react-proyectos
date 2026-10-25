// Funciones puras, sin React, sin DOM y sin red. Es la misma función de la
// versión en JavaScript: lo que no depende de la interfaz no cambia.

/**
 * Convierte los veinte pares de campos de TheMealDB en una lista útil.
 * Un ingrediente válido se conserva aunque la API no indique su medida.
 * @param {object} receta
 * @returns {Array<{ ingrediente: string, medida: string }>}
 */
export function normalizarIngredientes(receta = {}) {
  const ingredientes = []

  for (let indice = 1; indice <= 20; indice += 1) {
    const ingrediente = String(receta[`strIngredient${indice}`] ?? '').trim()
    const medida = String(receta[`strMeasure${indice}`] ?? '').trim()

    if (ingrediente) ingredientes.push({ ingrediente, medida })
  }

  return ingredientes
}
