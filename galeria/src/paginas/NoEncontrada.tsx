import { Link } from 'react-router'

export default function NoEncontrada({ mensaje = 'Esta página no existe.' }: { mensaje?: string }) {
  return (
    <section className="no-encontrada" aria-labelledby="titulo-no-encontrada">
      <h1 id="titulo-no-encontrada">{mensaje}</h1>
      <p>
        <Link to="/">Ver las doce fotos de la muestra</Link>
      </p>
    </section>
  )
}
