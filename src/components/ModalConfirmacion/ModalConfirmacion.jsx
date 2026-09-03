import { useEffect, useRef } from 'react'
import Icono from '../Icono/Icono'
import './ModalConfirmacion.css'

function ModalConfirmacion({
  abierto,
  mensaje,
  onAceptar,
  onCancelar,
  textoAceptar = 'Aceptar',
  titulo = '¿Confirmas esta acción?',
}) {
  const botonCancelar = useRef(null)

  useEffect(() => {
    if (!abierto) return undefined
    botonCancelar.current?.focus()

    function manejarTecla(evento) {
      if (evento.key === 'Escape') onCancelar()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', manejarTecla)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', manejarTecla)
    }
  }, [abierto, onCancelar])

  if (!abierto) return null

  return (
    <div className="modal-fondo" role="presentation">
      <section
        aria-describedby="mensaje-confirmacion"
        aria-labelledby="titulo-confirmacion"
        aria-modal="true"
        className="confirmacion-3d"
        role="alertdialog"
      >
        <div className="confirmacion-3d__icono">
          <Icono nombre="alerta" size={31} />
        </div>
        <span className="confirmacion-3d__etiqueta">Confirmación requerida</span>
        <h2 id="titulo-confirmacion">{titulo}</h2>
        <p id="mensaje-confirmacion">{mensaje}</p>
        <div className="confirmacion-3d__acciones">
          <button
            className="boton boton--secundario"
            onClick={onCancelar}
            ref={botonCancelar}
            type="button"
          >
            Cancelar
          </button>
          <button className="boton boton--peligro" onClick={onAceptar} type="button">
            {textoAceptar}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ModalConfirmacion
