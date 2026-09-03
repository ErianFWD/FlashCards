import { useEffect, useState } from 'react'
import Icono from '../Icono/Icono'
import './ModalFlashcard.css'

const VACIA = {
  pregunta: '',
  respuesta: '',
  materia: 'Biología',
  nivel: 'Básico',
  activa: true,
}

function ModalFlashcard({ abierto, flashcard, onCerrarSolicitado, onGuardar }) {
  const [formulario, setFormulario] = useState(VACIA)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!abierto) return
    setFormulario(flashcard ? { ...VACIA, ...flashcard } : VACIA)
    setError('')
  }, [abierto, flashcard])

  if (!abierto) return null

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  async function enviar(evento) {
    evento.preventDefault()
    if (formulario.pregunta.trim().length < 5 || formulario.respuesta.trim().length < 5) {
      setError('La pregunta y la respuesta deben tener al menos 5 caracteres.')
      return
    }
    await onGuardar({
      pregunta: formulario.pregunta.trim(),
      respuesta: formulario.respuesta.trim(),
      materia: formulario.materia.trim(),
      nivel: formulario.nivel,
      activa: formulario.activa,
    })
  }

  return (
    <div className="modal-fondo modal-fondo--formulario" role="presentation">
      <section aria-modal="true" className="modal-formulario" role="dialog" aria-labelledby="titulo-flashcard">
        <header className="modal-formulario__cabecera">
          <div>
            <span className="sobrelinea">Modo administrador</span>
            <h2 id="titulo-flashcard">{flashcard ? 'Editar flashcard' : 'Nueva flashcard'}</h2>
          </div>
          <button aria-label="Cerrar formulario" className="boton-icono" onClick={onCerrarSolicitado} type="button">
            <Icono nombre="cerrar" size={19} />
          </button>
        </header>

        <form className="formulario" onSubmit={enviar}>
          <label className="formulario__ancho-completo">
            Pregunta
            <textarea
              maxLength="220"
              onChange={(evento) => cambiar('pregunta', evento.target.value)}
              placeholder="Escribe el concepto que se debe recordar"
              rows="3"
              value={formulario.pregunta}
            />
          </label>
          <label className="formulario__ancho-completo">
            Respuesta
            <textarea
              maxLength="500"
              onChange={(evento) => cambiar('respuesta', evento.target.value)}
              placeholder="Escribe una respuesta breve y precisa"
              rows="5"
              value={formulario.respuesta}
            />
          </label>
          <label>
            Materia
            <input
              list="materias-sugeridas"
              maxLength="80"
              onChange={(evento) => cambiar('materia', evento.target.value)}
              required
              value={formulario.materia}
            />
            <datalist id="materias-sugeridas">
              <option value="Biología" />
              <option value="Matemáticas" />
              <option value="Historia" />
              <option value="Programación" />
              <option value="Inglés" />
            </datalist>
          </label>
          <label>
            Nivel
            <select onChange={(evento) => cambiar('nivel', evento.target.value)} value={formulario.nivel}>
              <option>Básico</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
          </label>
          <label className="interruptor formulario__ancho-completo">
            <input
              checked={formulario.activa}
              onChange={(evento) => cambiar('activa', evento.target.checked)}
              type="checkbox"
            />
            <span>Disponible para los estudiantes</span>
          </label>
          {error && <div className="aviso mensaje-error formulario__ancho-completo" role="alert">{error}</div>}
          <div className="modal-formulario__acciones formulario__ancho-completo">
            <button className="boton boton--secundario" onClick={onCerrarSolicitado} type="button">Cancelar</button>
            <button className="boton" type="submit">
              <Icono nombre="verificar" size={17} />
              Guardar
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ModalFlashcard
