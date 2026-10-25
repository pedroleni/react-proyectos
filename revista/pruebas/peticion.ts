// Los argumentos que React Router pasa a un loader o a una action, para
// llamarlos en un test como los llamaría el servidor.
export function argumentos<A>(ruta: string, params: Record<string, string> = {}, init?: RequestInit): A {
  return {
    request: new Request(`http://localhost:5173${ruta}`, init),
    params,
    context: {},
  } as unknown as A
}

/** Un formulario enviado con POST, como lo enviaría el navegador. */
export function envio(campos: Record<string, string>): RequestInit {
  return { method: 'POST', body: new URLSearchParams(campos) }
}
