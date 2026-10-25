import { Profiler, useState } from 'react'
import Controles from './componentes/Controles'
import EstadoConexion from './componentes/EstadoConexion'
import Medidor from './componentes/Medidor'
import TablaPares from './componentes/TablaPares'
import type { Orden } from './mercado/filtrar'
import { registrarRender } from './medidas'

interface AppProps {
  virtualInicial?: boolean
}

export default function App({ virtualInicial = true }: AppProps) {
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState<Orden>('volumen')
  const [soloFavoritos, setSoloFavoritos] = useState(false)
  const [virtual, setVirtual] = useState(virtualInicial)

  return (
    <>
      <header className="cabecera-sitio">
        <nav className="navbar" aria-label="Navegación principal">
          <a className="navbar-marca" href="/">
            Panel en tiempo real
          </a>
          <EstadoConexion />
        </nav>
      </header>

      <main className="pagina">
        <div className="cabecera-panel">
          <p className="antetitulo">Binance · USDT</p>
          <h1>Mercado en directo</h1>
          <p className="resumen-panel">
            Todos los pares que cotizan en USDT, el dólar digital de Binance. Cada segundo llegan por un WebSocket los
            que han cambiado.
          </p>
        </div>

        <Controles
          busqueda={busqueda}
          orden={orden}
          soloFavoritos={soloFavoritos}
          virtual={virtual}
          onCambiarBusqueda={setBusqueda}
          onCambiarOrden={setOrden}
          onAlternarFavoritos={() => setSoloFavoritos(!soloFavoritos)}
          onCambiarVirtual={setVirtual}
        />

        <div className="zona-tabla">
          <Profiler id="Tabla" onRender={registrarRender}>
            <TablaPares busqueda={busqueda} orden={orden} soloFavoritos={soloFavoritos} virtual={virtual} />
          </Profiler>
        </div>

        <Medidor />
      </main>
    </>
  )
}
