// Una fuente de mentira para medir en igualdad de condiciones. El mercado real
// no se mueve igual dos minutos seguidos: unas veces cambian 45 pares en un
// segundo y otras 130. Para comparar el antes y el después de un cambio, los
// datos tienen que ser los mismos. Este simulador parte de una foto real de
// Binance (muestra.json, los 516 pares en USDT del 22 de octubre de 2026) y
// mueve cada segundo los mismos pares, en el mismo orden, gracias a una
// semilla fija. Se activa con ?fuente=simulada en la URL, y ?copias=10 lo
// multiplica todo por diez: 5160 pares y 700 cambios por segundo.

import type { AbrirFuente, Ticker } from './tipos'

interface OpcionesSimulador {
  copias?: number
  cambiosPorSegundo?: number
  intervalo?: number
  semilla?: number
}

// Un generador de números «al azar» que, con la misma semilla, da siempre la
// misma secuencia (mulberry32). Math.random no se puede repetir.
function crearAzar(semilla: number) {
  let estado = semilla >>> 0
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0
    let t = estado
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function crearSimulador({
  copias = 1,
  cambiosPorSegundo = 70 * copias,
  intervalo = 1000,
  semilla = 94,
}: OpcionesSimulador = {}): AbrirFuente {
  return ({ alRecibir, alCambiarEstado }) => {
    let cerrada = false
    let temporizador: ReturnType<typeof setInterval> | undefined
    const azar = crearAzar(semilla)

    // La muestra va en su propio archivo del build: solo se descarga al simular.
    void import('./muestra.json').then(({ default: muestra }) => {
      if (cerrada) return
      let hora = Date.now()
      const pares: Ticker[] = Array.from({ length: copias }, (_, copia) =>
        muestra.map((m) => ({
          // Las copias se llaman BTC2USDT, BTC3USDT...
          simbolo: copia === 0 ? m.s : m.s.replace(/USDT$/, `${copia + 1}USDT`),
          precio: m.c,
          apertura: m.o,
          maximo: m.h,
          minimo: m.l,
          volumen: m.q,
          hora,
        })),
      ).flat()
      alRecibir(pares)
      alCambiarEstado('en-directo')

      temporizador = setInterval(() => {
        hora += intervalo
        const elegidos = new Set<number>()
        while (elegidos.size < Math.min(cambiosPorSegundo, pares.length)) {
          elegidos.add(Math.floor(azar() * pares.length))
        }
        const lote: Ticker[] = []
        for (const i of elegidos) {
          const anterior = pares[i]
          // Un paso de hasta un 0,2 % arriba o abajo.
          const precio = anterior.precio * (1 + (azar() - 0.5) * 0.004)
          pares[i] = {
            ...anterior,
            precio,
            maximo: Math.max(anterior.maximo, precio),
            minimo: Math.min(anterior.minimo, precio),
            volumen: anterior.volumen * (1 + azar() * 0.0005),
            hora,
          }
          lote.push(pares[i])
        }
        alRecibir(lote)
      }, intervalo)
    })

    return () => {
      cerrada = true
      clearInterval(temporizador)
    }
  }
}
