import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// jsdom conserva localStorage durante todo un archivo de tests: sin esto, los
// favoritos de un test aparecerían en el siguiente.
afterEach(() => {
  localStorage.clear()
})
