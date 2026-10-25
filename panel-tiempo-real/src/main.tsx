import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { crearAlmacenMercado } from './mercado/almacen.ts'
import { abrirBinance } from './mercado/binance.ts'
import { crearSimulador } from './mercado/simulador.ts'
import { MercadoContext } from './mercado/useMercado.ts'
import './estilos.css'

// Opciones en la URL, para medir:
//   ?fuente=simulada  datos inventados y siempre iguales en vez de Binance
//   &copias=10        con la fuente simulada, diez veces más pares
//   ?tabla=completa   empezar con la tabla sin virtualizar
const parametros = new URLSearchParams(window.location.search)
const fuente =
  parametros.get('fuente') === 'simulada'
    ? crearSimulador({ copias: Number(parametros.get('copias') ?? 1) })
    : abrirBinance

// Un solo almacén para toda la aplicación, creado fuera de cualquier componente.
const almacen = crearAlmacenMercado(fuente)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MercadoContext value={almacen}>
      <App virtualInicial={parametros.get('tabla') !== 'completa'} />
    </MercadoContext>
  </StrictMode>,
)
