// Los avisos de carga, de lista vacía y de error, iguales en todas las páginas.

export function MensajeEstado({ children }) {
  return (
    <p className="mensaje-estado" role="status">
      {children}
    </p>
  )
}

export function MensajeError({ error, onReintentar }) {
  return (
    <div className="mensaje-estado mensaje-error" role="alert">
      <p>No se han podido cargar los datos: {error.message}</p>
      <button type="button" className="boton" onClick={onReintentar}>
        Reintentar
      </button>
    </div>
  )
}
