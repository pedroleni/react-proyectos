import { useId, useState } from 'react'
import { Combobox, Dialogo, Menu, OpcionMenu, Pestanas } from '@kit'
import { IDIOMAS, MODALIDADES } from './datos'
import type { Grupo, Modalidad } from './datos'

type Solicitud = { idioma: string; modalidad: Modalidad; grupo: Grupo }

const nombreGrupo = ({ idioma, modalidad, grupo }: Solicitud) =>
  `${idioma} ${grupo.nivel} (${modalidad.titulo.toLowerCase()})`

export default function App() {
  const [idioma, setIdioma] = useState<string | null>('Inglés')
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null)
  const [aviso, setAviso] = useState('')

  function enviar(datos: FormData) {
    if (!solicitud) return
    setAviso(`Solicitud enviada para ${nombreGrupo(solicitud)}. Te escribiremos a ${datos.get('correo')}.`)
    setSolicitud(null)
  }

  return (
    <>
      <header className="cabecera">
        <p className="marca">Escuela de idiomas Puente Nuevo</p>
        <p className="lema">Ronda · Matrícula abierta hasta el 30 de septiembre</p>
      </header>
      <main className="pagina">
        <h1>Matrícula del curso 2026-2027</h1>

        <section className="paso" aria-labelledby="paso-idioma">
          <h2 id="paso-idioma">1. Elige idioma</h2>
          <Combobox
            etiqueta="Idioma"
            opciones={IDIOMAS}
            valor={idioma}
            onCambiar={setIdioma}
            ayuda="Escribe para filtrar: «ale» encuentra Alemán. Las tildes dan igual."
          />
        </section>

        <section className="paso" aria-labelledby="paso-grupo">
          <h2 id="paso-grupo">2. Elige grupo</h2>
          {idioma ? (
            <Pestanas
              etiqueta="Modalidades"
              pestanas={MODALIDADES.map((modalidad) => ({
                id: modalidad.id,
                titulo: modalidad.titulo,
                contenido: (
                  <>
                    <p className="modalidad">{modalidad.descripcion}</p>
                    <div className="grupos">
                      {modalidad.grupos.map((grupo) => (
                        <TarjetaGrupo
                          key={grupo.id}
                          solicitud={{ idioma, modalidad, grupo }}
                          onPedirPlaza={setSolicitud}
                          onAvisar={setAviso}
                        />
                      ))}
                    </div>
                  </>
                ),
              }))}
            />
          ) : (
            <p>Elige un idioma para ver sus grupos.</p>
          )}
        </section>

        <p role="status" className="aviso">
          {aviso}
        </p>
      </main>

      <Dialogo
        abierto={solicitud !== null}
        onCerrar={() => setSolicitud(null)}
        titulo={solicitud ? `Pedir plaza en ${nombreGrupo(solicitud)}` : ''}
        descripcion={solicitud ? `${solicitud.grupo.horario}. Te escribiremos para confirmarla.` : undefined}
      >
        <form className="formulario" action={enviar}>
          <label>
            Nombre y apellidos
            <input name="nombre" autoComplete="name" required />
          </label>
          <label>
            Correo electrónico
            <input name="correo" type="email" autoComplete="email" required />
          </label>
          <label className="casilla">
            <input name="prueba" type="checkbox" />
            Quiero hacer una prueba de nivel
          </label>
          <div className="botones">
            <button type="submit" className="principal">
              Enviar solicitud
            </button>
            <button type="button" onClick={() => setSolicitud(null)}>
              Cancelar
            </button>
          </div>
        </form>
      </Dialogo>
    </>
  )
}

type PropsTarjetaGrupo = {
  solicitud: Solicitud
  onPedirPlaza: (solicitud: Solicitud) => void
  onAvisar: (texto: string) => void
}

function TarjetaGrupo({ solicitud, onPedirPlaza, onAvisar }: PropsTarjetaGrupo) {
  const idTitulo = useId()
  const { grupo } = solicitud
  const nombre = nombreGrupo(solicitud)

  return (
    <article className="grupo" aria-labelledby={idTitulo}>
      <div className="grupo-cabecera">
        <h3 id={idTitulo}>
          {solicitud.idioma} {grupo.nivel}
        </h3>
        <Menu etiqueta="Opciones" aria-label={`Opciones de ${nombre}`}>
          <OpcionMenu onSeleccionar={() => onPedirPlaza(solicitud)}>Pedir plaza</OpcionMenu>
          <OpcionMenu onSeleccionar={() => onAvisar(`Añadido a tu calendario: ${nombre}, ${grupo.horario.toLowerCase()}.`)}>
            Añadir al calendario
          </OpcionMenu>
          <OpcionMenu onSeleccionar={() => onAvisar(`Te avisaremos si cambia el horario de ${nombre}.`)}>
            Avisarme si cambia el horario
          </OpcionMenu>
        </Menu>
      </div>
      <p>{grupo.horario}</p>
      <p className="plazas">{grupo.plazas === 1 ? 'Queda 1 plaza' : `Quedan ${grupo.plazas} plazas`}</p>
    </article>
  )
}
