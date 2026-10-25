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
  return (
    <>
      <title>{tituloPagina ?? `${titulo} · Caja Baja`}</title>
      <meta name="description" content={descripcion} />
      <link rel="canonical" href={url} />

      {/* Open Graph (lección 4 de HTML): con property, no con name */}
      <meta property="og:site_name" content="Caja Baja" />
      <meta property="og:locale" content="es_ES" />
      <meta property="og:type" content={tipo} />
      <meta property="og:title" content={titulo} />
      <meta property="og:description" content={descripcion} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imagen} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${titulo}. Caja Baja, revista de tipografía e imprenta.`} />
      {articulo && (
        <>
          <meta property="article:published_time" content={articulo.publicado} />
          <meta property="article:section" content={articulo.seccion} />
          <meta name="author" content={articulo.autoria} />
        </>
      )}
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}
