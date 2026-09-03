import { useState } from 'react'
import Icono from '../Icono/Icono'
import './TarjetaFlashcard.css'

function TarjetaFlashcard({ esAdmin, flashcard, onEditar, onEliminar, onEstado }) {
  const [volteada, setVolteada] = useState(false)

  return (
    <article className={`flashcard-item${!flashcard.activa ? ' flashcard-item--inactiva' : ''}`}>
      <div className="flashcard-item__meta">
        <span>{flashcard.materia}</span>
        <span>{flashcard.nivel}</span>
        {!flashcard.activa && <span className="etiqueta-inactiva">Inactiva</span>}
      </div>

      <button
        aria-label={volteada ? 'Ver pregunta' : 'Ver respuesta'}
        className={`flashcard-cuerpo${volteada ? ' flashcard-cuerpo--volteada' : ''}`}
        onClick={() => setVolteada((valor) => !valor)}
        type="button"
      >
        <span className="flashcard-cuerpo__lado">{volteada ? 'Respuesta' : 'Pregunta'}</span>
        <strong>{volteada ? flashcard.respuesta : flashcard.pregunta}</strong>
        <span className="flashcard-cuerpo__giro">
          <Icono nombre="girar" size={16} />
          {volteada ? 'Volver a la pregunta' : 'Voltear tarjeta'}
        </span>
      </button>

      {esAdmin && (
        <div className="flashcard-item__acciones">
          <button className="boton boton--secundario boton--pequeno" onClick={() => onEditar(flashcard)} type="button">
            <Icono nombre="editar" size={16} />
            Editar
          </button>
          <button className="boton boton--fantasma boton--pequeno" onClick={() => onEstado(flashcard)} type="button">
            {flashcard.activa ? 'Desactivar' : 'Activar'}
          </button>
          <button
            aria-label={`Eliminar ${flashcard.pregunta}`}
            className="boton-icono boton-icono--peligro"
            onClick={() => onEliminar(flashcard)}
            title="Eliminar flashcard"
            type="button"
          >
            <Icono nombre="eliminar" size={17} />
          </button>
        </div>
      )}
    </article>
  )
}

export default TarjetaFlashcard
