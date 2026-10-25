import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { MensajeError, MensajeEstado } from '../componentes/Mensajes.jsx'
import TarjetaReceta from '../componentes/TarjetaReceta.jsx'
import { useBusquedaRecetas } from '../consultas.js'

export default function Buscar() {
  // TODO (paso 7): la búsqueda vive en la URL (/buscar?q=pasta).
  //   1. Lee q con useSearchParams (sin espacios sobrantes; '' si no hay).
  //   2. Guarda lo escrito en un estado propio, texto, que empiece valiendo q.
  //   3. Si la URL cambia por su cuenta (Atrás, el menú), el campo la sigue:
  //      guarda la q anterior en otro estado y, si cambia, ajusta texto durante
  //      el render (lección 39).
  //   4. Un efecto que, 400 ms después de la última tecla, escriba texto en la
  //      URL con setSearchParams(…, { replace: true }), y limpie su temporizador.
  const q = ''

  function manejarEnvio(evento) {
    evento.preventDefault()
    // TODO (paso 7): Intro o el botón «Buscar» escriben la búsqueda en la URL sin esperar.
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
        {/* TODO (paso 7): controla el campo con texto (value y onChange). */}
        <input id="busqueda" type="search" placeholder="Por ejemplo: curry, pasta, chicken…" autoComplete="off" />
        <button className="boton">Buscar</button>
      </form>

      <Resultados q={q} />
    </section>
  )
}

function Resultados({ q }) {
  // TODO (paso 7): pide la búsqueda con useBusquedaRecetas(q) y pinta, por este orden:
  //   - sin q: «Escribe un nombre para empezar.» (ya está abajo);
  //   - sin datos todavía: «Buscando recetas…»;
  //   - error: <MensajeError error={error} onReintentar={refetch} />;
  //   - datos de la búsqueda anterior (isPlaceholderData) que estaban vacíos: «Buscando recetas…»;
  //   - cero resultados: «No encontramos recetas para «{q}».»;
  //   - con resultados: un MensajeEstado con «N resultados para «q».» (o «Buscando «q»…»
  //     si son de la búsqueda anterior) y la rejilla
  //     <div className="rejilla-recetas" aria-busy={isPlaceholderData}> con una
  //     <TarjetaReceta> por receta.
  if (!q) return <MensajeEstado>Escribe un nombre para empezar.</MensajeEstado>
  return null
}
