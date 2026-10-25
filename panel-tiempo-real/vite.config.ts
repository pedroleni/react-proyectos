/// <reference types="vitest/config" />
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// Los modos que usa package.json:
//   npm run dev                   desarrollo, con el compilador
//   npm run dev:sin-compilador    desarrollo, sin el compilador
//   npm run medir                 build de profiling, con el compilador
//   npm run medir:sin-compilador  build de profiling, sin el compilador
export default defineConfig(({ mode }) => {
  // TODO (paso 6): activa el React Compiler. conCompilador tiene que ser true en
  // todos los modos menos en los que acaban en 'sin-compilador' (mira mode), y
  // cuando lo sea, babel({ presets: [reactCompilerPreset()] }) va en plugins,
  // detrás de react().
  const conCompilador = false
  const perfil = mode.startsWith('perfil')
  // El build de profiling de React: llama a onRender y escribe las Performance
  // tracks, como el de desarrollo, pero sin sus comprobaciones extra (lección 65).
  const alias: Record<string, string> = perfil ? { 'react-dom/client': 'react-dom/profiling' } : {}

  return {
    plugins: [react()],
    resolve: { alias },
    define: {
      __COMPILADOR__: JSON.stringify(conCompilador),
    },
    build: {
      // Cada modo de medir construye en su carpeta, para que los dos builds convivan.
      outDir: perfil ? `dist-${mode}` : 'dist',
      // Al medir, los componentes conservan su nombre: sin esto, el minificador
      // los acorta y en las Performance tracks FilaPar sale con dos letras.
      rolldownOptions: perfil ? { output: { keepNames: true } } : {},
    },
    test: {
      environment: 'jsdom',
      // Con globals, Testing Library desmonta lo de cada test al terminar (lección 83).
      globals: true,
      setupFiles: './src/pruebas/preparacion.ts',
    },
  }
})
