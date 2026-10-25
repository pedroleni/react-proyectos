// No lo importa nadie: está para que tsc compruebe que src/radix exporta
// lo mismo que src/kit, con los mismos tipos. Si cambias una prop en un
// lado y no en el otro, npm run build falla aquí.
import * as propio from '../kit'
import * as conRadix from '.'

export const mismaApi: typeof propio = conRadix
