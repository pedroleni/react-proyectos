import { useActionState, useId, useRef } from 'react'
import { avanzar, ESTADO_INICIAL } from './accion'
import BotonesPaso from './BotonesPaso'
import PasoConfirmar from './PasoConfirmar'
import PasoGrupo from './PasoGrupo'
import PasoRefugio from './PasoRefugio'
import Pasos from './Pasos'
import ReservaHecha from './ReservaHecha'
import type { DatosResumen } from './ResumenReserva'
import type { Paso } from './tipos'
import TuReserva from './TuReserva'

const TITULOS: Record<Paso, { antetitulo?: string; titulo: string }> = {
  refugio: { antetitulo: 'Paso 1 de 3', titulo: 'Refugio y fechas' },
  grupo: { antetitulo: 'Paso 2 de 3', titulo: 'Quién viene' },
  confirmar: { antetitulo: 'Paso 3 de 3', titulo: 'Revisar y confirmar' },
  hecha: { titulo: 'Reserva confirmada' },
}

// TODO (paso 5): retenerPlazas(noches, personas), una función pura que
// devuelve las noches con las plazas de la reserva ya restadas de libres y
// marcadas con retenidas: personas. Será la que use useOptimistic.

export default function Reserva() {
  const [estado, accion, isPending] = useActionState(avanzar, ESTADO_INICIAL)

  // TODO (paso 5): encima de las plazas de verdad, las que se ven mientras
  // se confirma. Cambia esta línea por useOptimistic(estado.noches,
  // retenerPlazas), que devuelve las noches y la función para retenerlas.
  const noches = estado.noches

  const idTitulo = useId()
  const titulo = useRef<HTMLHeadingElement>(null)
  const formulario = useRef<HTMLFormElement>(null)
  const avisos = useRef<HTMLDivElement>(null)

  // TODO (paso 4): el foco, siempre en un sitio con sentido. Un efecto que
  // se ejecute cada vez que cambie estado y lleve el foco:
  // 1. al primer campo del formulario con aria-invalid="true", si lo hay;
  // 2. si no, y el paso ha cambiado, al título (titulo.current). Para saber
  //    si ha cambiado, guarda el paso anterior en una ref (empieza con
  //    estado.paso, para no mover el foco al cargar la página);
  // 3. si no, y hay un aviso, a la caja de avisos (avisos.current).

  // TODO (paso 5): la acción del formulario, enviar(formData). Si se está
  // confirmando (paso 'confirmar' y no se ha pulsado «Atrás») y la casilla
  // pasa esquemaConfirmacion, retén las plazas de Number(estado.valores.personas)
  // con la función de useOptimistic. Después, siempre, accion(formData).
  // Y pon enviar en el action del <form> en vez de accion.

  const reteniendo = noches.some((noche) => noche.retenidas)
  const mensajeDeEstado = !isPending
    ? ''
    : estado.paso === 'refugio'
      ? 'Buscando plazas libres…'
      : reteniendo
        ? 'Plazas retenidas. Confirmando tu reserva…'
        : ''

  const { antetitulo, titulo: textoTitulo } = TITULOS[estado.paso]
  const cuantosErrores = Object.keys(estado.errores).length
  // Desde el paso 2, los datos del paso 1 ya están validados
  const datos = estado.datos as DatosResumen

  return (
    <div className="reserva">
      <title>{`${antetitulo ? `${antetitulo}: ` : ''}${textoTitulo} · Reserva de refugios`}</title>
      <Pasos actual={estado.paso} />

      <div className="reserva-columnas">
        <section className="paso" aria-labelledby={idTitulo}>
          <h2 id={idTitulo} ref={titulo} tabIndex={-1}>
            {antetitulo && (
              <span className="antetitulo">
                {antetitulo}
                <span className="solo-lectores">:</span>
              </span>
            )}{' '}
            {textoTitulo}
          </h2>

          {/* La región existe desde el principio, vacía: lo que cambia es su
              texto, y por eso se anuncia (lección 37). Se vacía mientras se
              envía para que el mismo error, si se repite, se vuelva a oír. */}
          <div ref={avisos} className="avisos" role="alert" tabIndex={-1}>
            {!isPending && cuantosErrores > 0 && (
              <p>{cuantosErrores === 1 ? 'Hay 1 campo por corregir.' : `Hay ${cuantosErrores} campos por corregir.`}</p>
            )}
            {!isPending && estado.aviso && <p>{estado.aviso}</p>}
          </div>

          {/* Una key por paso: cada paso es un formulario nuevo, con sus
              valores iniciales (lección 26). */}
          <form key={estado.paso} ref={formulario} action={accion} noValidate className="formulario">
            {estado.paso === 'refugio' && <PasoRefugio valores={estado.valores} errores={estado.errores} />}
            {estado.paso === 'grupo' && <PasoGrupo valores={estado.valores} errores={estado.errores} />}
            {estado.paso === 'confirmar' && (
              <PasoConfirmar datos={datos} valores={estado.valores} errores={estado.errores} />
            )}
            {estado.paso === 'hecha' && estado.reserva && <ReservaHecha reserva={estado.reserva} />}
            <BotonesPaso paso={estado.paso} />
          </form>

          <p className="estado-envio" role="status">
            {mensajeDeEstado}
          </p>
        </section>

        {estado.paso !== 'refugio' && <TuReserva datos={datos} noches={noches} />}
      </div>
    </div>
  )
}
