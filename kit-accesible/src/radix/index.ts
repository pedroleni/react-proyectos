// La misma API que src/kit, hecha con Radix. Con --mode radix, '@kit'
// apunta aquí (vite.config.ts) y la app y los tests no se enteran.
import '../kit/kit.css'

// Radix no tiene combobox: se queda el tuyo.
export { Combobox } from '../kit/Combobox'
export { Dialogo } from './Dialogo'
export { Menu, OpcionMenu } from './Menu'
export { Pestanas } from './Pestanas'
export type { Pestana } from '../kit/Pestanas'
