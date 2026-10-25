import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// jsdom conserva localStorage durante todo un archivo de tests: sin esto,
// lo que guarda un test lo encontraría el siguiente al montar la app.
afterEach(() => {
  localStorage.clear()
})
