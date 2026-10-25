import '@testing-library/jest-dom/vitest'

// jsdom no pinta ni hace scroll: sin esto, cada scrollTo avisa
// «Not implemented: Window's scrollTo() method».
window.scrollTo = () => {}

// Tampoco tiene scrollIntoView, que la cuadrícula usa al volver de una foto.
Element.prototype.scrollIntoView = () => {}
