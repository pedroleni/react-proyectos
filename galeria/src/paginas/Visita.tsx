import { useLayoutEffect } from 'react'

export default function Visita() {
  // Cada vez que la pestaña aparece, arriba del todo.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className="visita" aria-labelledby="titulo-visita">
      <h1 id="titulo-visita">Visita la exposición</h1>
      <p className="visita-intro">
        Luz del Norte se puede ver en la sala de la asociación, en Gijón, del 7 de noviembre de 2026
        al 10 de enero de 2027. La entrada es libre.
      </p>

      <dl className="visita-datos">
        <div>
          <dt>Horario</dt>
          <dd>De martes a sábado, de 11:00 a 14:00 y de 17:00 a 20:30. Domingos, de 11:00 a 14:00.</dd>
        </div>
        <div>
          <dt>Visitas guiadas</dt>
          <dd>Los sábados a las 12:00, con alguno de los autores. Sin reserva.</dd>
        </div>
        <div>
          <dt>Cerrado</dt>
          <dd>Los lunes, el 25 de diciembre y el 1 de enero.</dd>
        </div>
      </dl>
    </section>
  )
}
