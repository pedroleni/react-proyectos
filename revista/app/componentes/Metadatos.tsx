// El <head> de cada página, con las etiquetas de React (lección 81): React
// las sube al <head> esté donde esté el componente, y en el servidor van ya
// dentro del HTML que se envía.

type Props = {
  /** El título del artículo o de la página, sin el nombre de la revista. */
  titulo: string
  descripcion: string
  /** URL absoluta de la página: https://… */
  url: string
  /** URL absoluta de la imagen de la tarjeta, de 1200 × 630. */
  imagen: string
  tipo: 'website' | 'article'
  /** Solo en los artículos. */
  articulo?: { publicado: string; seccion: string; autoria: string }
  /** El <title> completo, si no es «titulo · Caja Baja». */
  tituloPagina?: string
}

export default function Metadatos({ titulo, descripcion, url, imagen, tipo, articulo, tituloPagina }: Props) {
  // TODO (paso 4): además del título, la descripción (name="description"),
  // la URL canónica (<link rel="canonical">) y las etiquetas Open Graph
  // (property="og:..."): site_name, locale, type, title, description, url,
  // image con su width, height y alt, las de article: si es un artículo y
  // twitter:card. React las sube todas al <head>.
  return <title>{tituloPagina ?? `${titulo} · Caja Baja`}</title>
}
