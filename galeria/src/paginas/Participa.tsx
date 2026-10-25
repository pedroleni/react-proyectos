import { useLayoutEffect, useState } from 'react'

interface Propuesta {
  nombre: string
  titulo: string
}

export default function Participa() {
  const [recibida, setRecibida] = useState<Propuesta | null>(null)

  // Cada vez que la pestaña aparece, arriba del todo.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Una acción de formulario (lección 57). En la muestra de verdad iría a un
  // servidor; aquí solo da las gracias. Al terminar, React vacía el formulario.
  function enviar(datos: FormData) {
    setRecibida({
      nombre: String(datos.get('nombre')),
      titulo: String(datos.get('titulo')),
    })
  }

  return (
    <section className="participa" aria-labelledby="titulo-participa">
      <h1 id="titulo-participa">Participa en la muestra de 2027</h1>
      <p className="participa-intro">
        Cuéntanos qué foto de este invierno te gustaría colgar el año que viene. Puedes ir y venir
        de la galería mientras la escribes: lo que lleves escrito te espera aquí.
      </p>

      {recibida && (
        <p className="aviso" role="status">
          Gracias, {recibida.nombre}. Hemos recibido «{recibida.titulo}».
        </p>
      )}

      <form action={enviar} className="formulario">
        <label>
          Nombre
          <input name="nombre" autoComplete="name" required />
        </label>
        <label>
          Correo electrónico
          <input name="correo" type="email" autoComplete="email" required />
        </label>
        <label>
          Título de la foto
          <input name="titulo" required />
        </label>
        <label>
          Categoría
          <select name="categoria" defaultValue="Costa">
            <option>Costa</option>
            <option>Montaña</option>
            <option>Pueblo</option>
          </select>
        </label>
        <label className="formulario-ancho">
          Cuéntanos la foto
          <textarea name="historia" rows={5} />
        </label>
        <label className="formulario-ancho casilla">
          <input name="bases" type="checkbox" required />
          He leído las bases de la convocatoria
        </label>
        <button className="boton boton-principal">Enviar propuesta</button>
      </form>
    </section>
  )
}
