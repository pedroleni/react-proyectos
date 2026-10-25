// La dirección pública de la revista, para las URL absolutas de Open Graph y la
// canónica. En producción se fija con la variable de entorno URL_PUBLICA (por
// ejemplo, https://cajabaja.example); sin ella, sale de la petición. Como este
// módulo es .server, process.env se lee en el servidor y nunca llega al
// navegador, a diferencia de las variables VITE_ de la lección 85.
export function origenPublico(request: Request): string {
  return process.env.URL_PUBLICA ?? new URL(request.url).origin
}
