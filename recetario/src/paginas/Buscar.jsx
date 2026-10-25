import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { MensajeError, MensajeEstado } from '../componentes/Mensajes.jsx'
import TarjetaReceta from '../componentes/TarjetaReceta.jsx'
import { useBusquedaRecetas } from '../consultas.js'

export default function Buscar() {
  const [searchParams, setSearchParams] = useSearchParams()
  // La búsqueda vive en la URL (/buscar?q=pasta): se comparte, se guarda y
  // sobrevive a una recarga.
  const q = (searchParams.get('q') ?? '').trim()

  // Lo que hay escrito en el campo, que va por delante de la URL mientras tecleas.
  const [texto, setTexto] = useState(q)

  // Si la URL cambia por su cuenta (Atrás, el menú), el campo la sigue.
  // Es el patrón de ajustar el estado durante el render de la lección 39.
  const [qAnterior, setQAnterior] = useState(q)
  if (q !== qAnterior) {
    setQAnterior(q)
    if (texto.trim() !== q) setTexto(q)
  }

  // Escribir también busca, 400 ms después de la última tecla. Con replace,
  // teclear no llena el historial: Atrás sale de la búsqueda, no la deshace letra a letra.
  useEffect(() => {
    const termino = texto.trim()
    if (termino === q) return
    const temporizador = setTimeout(() => {
      setSearchParams(termino ? { q: termino } : {}, { replace: true })
    }, 400)
    return () => clearTimeout(temporizador)
  }, [texto, q, setSearchParams])

  // Intro o el botón «Buscar»: sin esperar.
  function manejarEnvio(evento) {
    evento.preventDefault()
    const termino = texto.trim()
    if (termino !== q) setSearchParams(termino ? { q: termino } : {}, { replace: true })
  }

  return (
    <section className="pagina seccion-contenido">
      <title>{q ? `«${q}» · Recetario` : 'Buscar · Recetario'}</title>
      <p className="antetitulo">Elige qué cocinar</p>
      <h1>Buscar recetas</h1>

      <form className="buscador" role="search" onSubmit={manejarEnvio}>
        <label htmlFor="busqueda" className="solo-lectores">
          Nombre de la receta
        </label>
        <input
          id="busqueda"
          type="search"
          placeholder="Por ejemplo: curry, pasta, chicken…"
          autoComplete="off"
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
        />
        <button className="boton">Buscar</button>
      </form>

      <Resultados q={q} />
    </section>
  )
}

function Resultados({ q }) {
  const { data: recetas, isPending, isPlaceholderData, error, refetch } = useBusquedaRecetas(q)

  if (!q) return <MensajeEstado>Escribe un nombre para empezar.</MensajeEstado>
  if (isPending) return <MensajeEstado>Buscando recetas…</MensajeEstado>
  if (error) return <MensajeError error={error} onReintentar={refetch} />
  // Datos de la búsqueda anterior que no tenían resultados: aún no hay nada que enseñar.
  if (isPlaceholderData && recetas.length === 0) return <MensajeEstado>Buscando recetas…</MensajeEstado>
  if (recetas.length === 0) return <MensajeEstado>No encontramos recetas para «{q}».</MensajeEstado>

  return (
    <>
      <MensajeEstado>
        {isPlaceholderData
          ? `Buscando «${q}»…`
          : `${recetas.length} ${recetas.length === 1 ? 'resultado' : 'resultados'} para «${q}».`}
      </MensajeEstado>
      {/* Con los datos de la búsqueda anterior, la rejilla se atenúa: aún no es lo que has pedido */}
      <div className="rejilla-recetas" aria-busy={isPlaceholderData}>
        {recetas.map((receta) => (
          <TarjetaReceta key={receta.idMeal} receta={receta} />
        ))}
      </div>
    </>
  )
}
