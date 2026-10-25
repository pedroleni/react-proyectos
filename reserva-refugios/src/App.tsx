import Reserva from './reserva/Reserva'

export default function App() {
  return (
    <>
      <header className="cabecera">
        <div className="cabecera-contenido">
          <p className="cabecera-marca">Refugios del Pirineo</p>
          <h1>Reserva tu plaza en un refugio</h1>
          <p className="cabecera-entradilla">
            Cinco refugios guardados del Pirineo aragonés. Elige uno, di cuántos subís y confirma: las plazas se
            comprueban en el momento.
          </p>
        </div>
      </header>
      <main className="principal">
        <Reserva />
      </main>
      <footer className="pie">
        Proyecto 95 del temario de React de Tech Study Tracker. Los nombres, las zonas y las altitudes de los
        refugios son reales; las plazas, los precios y las reservas son inventados, y las imágenes están
        generadas con IA: no son fotos de los refugios reales. Para reservar de verdad, usa los canales de cada
        refugio.
      </footer>
    </>
  )
}
