import '@testing-library/jest-dom/vitest'
import { servidor } from './servidor.js'

// Una petición sin manejador falla en vez de salir a internet.
beforeAll(() => servidor.listen({ onUnhandledFrame: 'error' }))
afterEach(() => servidor.resetHandlers())
afterAll(() => servidor.close())

// jsdom no pinta ni hace scroll: sin esto, cada navegación avisa
// «Not implemented: Window's scrollTo() method».
window.scrollTo = () => {}
