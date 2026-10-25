// La API del kit. La app y los tests importan de '@kit', no de aquí:
// vite.config.ts decide si '@kit' es esta carpeta o src/radix (paso 7).
import './kit.css'

export { Combobox } from './Combobox'
export { Dialogo } from './Dialogo'
export { Menu, OpcionMenu } from './Menu'
export { Pestanas } from './Pestanas'
export type { Pestana } from './Pestanas'
