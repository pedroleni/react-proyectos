// Capa de red: concentra la URL y la forma exacta de TheMealDB. No sabe nada
// de React ni de la caché; solo pide, comprueba y devuelve datos limpios.

const URL_BASE = 'https://www.themealdb.com/api/json/v1/1'

async function pedirJson(ruta, parametros, signal) {
  const url = new URL(`${URL_BASE}${ruta}`)
  for (const [nombre, valor] of Object.entries(parametros)) {
    url.searchParams.set(nombre, String(valor))
  }

  // La signal la pone TanStack Query: si la consulta deja de interesar, aborta.
  const respuesta = await fetch(url, { signal })
  if (!respuesta.ok) {
    throw new Error(`La API respondió con un error (${respuesta.status})`)
  }
  return respuesta.json()
}

export async function buscarPorNombre(texto, signal) {
  const datos = await pedirJson('/search.php', { s: texto }, signal)
  return datos.meals ?? []
}

export async function obtenerReceta(id, signal) {
  const datos = await pedirJson('/lookup.php', { i: id }, signal)
  return datos.meals?.[0] ?? null
}

export async function obtenerCategorias(signal) {
  const datos = await pedirJson('/categories.php', {}, signal)
  return datos.categories ?? []
}

export async function filtrarPorCategoria(nombre, signal) {
  const datos = await pedirJson('/filter.php', { c: nombre }, signal)
  return datos.meals ?? []
}

// Tres recetas al azar, en paralelo. Dos pueden salir repetidas: se quitan,
// porque en una lista de React dos elementos con la misma key se pisan.
export async function obtenerDestacadas(signal) {
  const respuestas = await Promise.all(
    [1, 2, 3].map(() => pedirJson('/random.php', {}, signal)),
  )
  const unicas = new Map()
  for (const datos of respuestas) {
    const receta = datos.meals?.[0]
    if (receta) unicas.set(receta.idMeal, receta)
  }
  return [...unicas.values()]
}
