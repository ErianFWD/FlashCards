import { useCallback, useEffect, useMemo, useState } from 'react'
import AsistenteEstudio from '../../components/AsistenteEstudio/AsistenteEstudio'
import Icono from '../../components/Icono/Icono'
import ModalConfirmacion from '../../components/ModalConfirmacion/ModalConfirmacion'
import ModalFlashcard from '../../components/ModalFlashcard/ModalFlashcard'
import TarjetaFlashcard from '../../components/TarjetaFlashcard/TarjetaFlashcard'
import {
  actualizarFlashcard,
  crearFlashcard,
  eliminarFlashcard,
  obtenerFlashcards,
} from '../../services/flashcardsService'
import { consultarAsistente } from '../../services/iaService'
import './Biblioteca.css'

function Biblioteca({ sesion }) {
  const [flashcards, setFlashcards] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [materia, setMateria] = useState('Todas')
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [flashcardEditando, setFlashcardEditando] = useState(null)
  const [flashcardAEliminar, setFlashcardAEliminar] = useState(null)
  const [flashcardACambiar, setFlashcardACambiar] = useState(null)
  const [confirmarCierreFormulario, setConfirmarCierreFormulario] = useState(false)
  const [asistenteAbierto, setAsistenteAbierto] = useState(false)
  const [confirmarCierreAsistente, setConfirmarCierreAsistente] = useState(false)
  const esAdmin = sesion.rol === 'administrador'

  const cargarFlashcards = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      setFlashcards(await obtenerFlashcards())
    } catch {
      setError('No se pudo conectar con db.json. Comprueba que JSON Server esté ejecutándose.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarFlashcards()
  }, [cargarFlashcards])

  const materias = useMemo(
    () => ['Todas', ...new Set(flashcards.map((item) => item.materia))],
    [flashcards],
  )

  const visibles = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es')
    return flashcards.filter((item) => {
      if (!esAdmin && !item.activa) return false
      const coincideMateria = materia === 'Todas' || item.materia === materia
      const coincideTexto = !termino || `${item.pregunta} ${item.respuesta}`.toLocaleLowerCase('es').includes(termino)
      return coincideMateria && coincideTexto
    })
  }, [busqueda, esAdmin, flashcards, materia])

  function abrirNueva() {
    setFlashcardEditando(null)
    setModalAbierto(true)
  }

  function abrirEdicion(flashcard) {
    setFlashcardEditando(flashcard)
    setModalAbierto(true)
  }

  async function guardar(datos) {
    setError('')
    try {
      if (flashcardEditando) {
        await actualizarFlashcard(flashcardEditando.id, datos)
        setMensaje('La flashcard se actualizó correctamente en db.json.')
      } else {
        await crearFlashcard({ ...datos, creadaPor: sesion.id })
        setMensaje('La nueva flashcard se guardó correctamente en db.json.')
      }
      setModalAbierto(false)
      setFlashcardEditando(null)
      await cargarFlashcards()
    } catch {
      setError('No se pudo guardar la flashcard. Revisa JSON Server.')
    }
  }

  async function confirmarEliminacion() {
    try {
      await eliminarFlashcard(flashcardAEliminar.id)
      setMensaje('La flashcard fue eliminada de db.json.')
      setFlashcardAEliminar(null)
      await cargarFlashcards()
    } catch {
      setError('No se pudo eliminar la flashcard.')
      setFlashcardAEliminar(null)
    }
  }

  async function confirmarCambioEstado() {
    try {
      await actualizarFlashcard(flashcardACambiar.id, { activa: !flashcardACambiar.activa })
      setMensaje(`La flashcard quedó ${flashcardACambiar.activa ? 'inactiva' : 'activa'}.`)
      setFlashcardACambiar(null)
      await cargarFlashcards()
    } catch {
      setError('No se pudo cambiar la disponibilidad de la flashcard.')
      setFlashcardACambiar(null)
    }
  }

  function cerrarFormularioConfirmado() {
    setConfirmarCierreFormulario(false)
    setModalAbierto(false)
    setFlashcardEditando(null)
  }

  return (
    <section className="pagina seccion">
      <div className="contenedor">
        <div className="pagina__cabecera pagina__cabecera--acciones">
          <div>
            <span className="sobrelinea">Biblioteca compartida</span>
            <h1>Flashcards para aprender</h1>
            <p>{esAdmin ? 'Crea, edita y controla el material que verán los estudiantes.' : 'Busca una materia y voltea las tarjetas para comprobar lo que recuerdas.'}</p>
          </div>
          {esAdmin && (
            <button className="boton" onClick={abrirNueva} type="button">
              <Icono nombre="mas" size={18} />
              Nueva flashcard
            </button>
          )}
        </div>

        {mensaje && <div className="aviso" role="status">{mensaje}</div>}
        {error && (
          <div className="aviso mensaje-error" role="alert">
            <span>{error}</span>
            <button className="boton boton--peligro boton--pequeno" onClick={cargarFlashcards} type="button">Reintentar</button>
          </div>
        )}

        <div className="filtros tarjeta">
          <label className="campo-busqueda">
            <span className="sr-only">Buscar flashcards</span>
            <Icono nombre="buscar" size={18} />
            <input onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Buscar por pregunta o respuesta" value={busqueda} />
          </label>
          <label>
            <span className="sr-only">Filtrar por materia</span>
            <select onChange={(evento) => setMateria(evento.target.value)} value={materia}>
              {materias.map((nombre) => <option key={nombre}>{nombre}</option>)}
            </select>
          </label>
          <span className="filtros__resultado">{visibles.length} tarjetas</span>
        </div>

        {cargando ? (
          <div className="estado-vacio">Cargando flashcards...</div>
        ) : visibles.length === 0 ? (
          <div className="estado-vacio">
            <Icono nombre="tarjeta" size={29} />
            <strong>No hay resultados</strong>
            <span>Cambia los filtros o agrega una flashcard nueva.</span>
          </div>
        ) : (
          <div className="flashcards-grid">
            {visibles.map((flashcard) => (
              <TarjetaFlashcard
                esAdmin={esAdmin}
                flashcard={flashcard}
                key={flashcard.id}
                onEditar={abrirEdicion}
                onEliminar={setFlashcardAEliminar}
                onEstado={setFlashcardACambiar}
              />
            ))}
          </div>
        )}
      </div>

      <AsistenteEstudio
        abierto={asistenteAbierto}
        onAbrir={() => setAsistenteAbierto(true)}
        onCerrarSolicitado={() => setConfirmarCierreAsistente(true)}
        onEnviar={(texto, historial) => consultarAsistente(texto, historial, flashcards.filter((item) => item.activa))}
      />

      <ModalFlashcard
        abierto={modalAbierto}
        flashcard={flashcardEditando}
        onCerrarSolicitado={() => setConfirmarCierreFormulario(true)}
        onGuardar={guardar}
      />

      <ModalConfirmacion
        abierto={confirmarCierreFormulario}
        mensaje="Los cambios que no hayas guardado se perderán."
        onAceptar={cerrarFormularioConfirmado}
        onCancelar={() => setConfirmarCierreFormulario(false)}
        textoAceptar="Cerrar formulario"
        titulo="¿Cerrar el formulario?"
      />
      <ModalConfirmacion
        abierto={Boolean(flashcardAEliminar)}
        mensaje={`Se eliminará “${flashcardAEliminar?.pregunta ?? ''}” de forma permanente.`}
        onAceptar={confirmarEliminacion}
        onCancelar={() => setFlashcardAEliminar(null)}
        textoAceptar="Eliminar"
        titulo="¿Eliminar esta flashcard?"
      />
      <ModalConfirmacion
        abierto={Boolean(flashcardACambiar)}
        mensaje={`La tarjeta dejará de estar ${flashcardACambiar?.activa ? 'disponible para estudiantes' : 'oculta para estudiantes'}.`}
        onAceptar={confirmarCambioEstado}
        onCancelar={() => setFlashcardACambiar(null)}
        textoAceptar={flashcardACambiar?.activa ? 'Desactivar' : 'Activar'}
        titulo={`¿${flashcardACambiar?.activa ? 'Desactivar' : 'Activar'} esta flashcard?`}
      />
      <ModalConfirmacion
        abierto={confirmarCierreAsistente}
        mensaje="La ventana del asistente se cerrará. Podrás volver a abrirla cuando quieras."
        onAceptar={() => {
          setConfirmarCierreAsistente(false)
          setAsistenteAbierto(false)
        }}
        onCancelar={() => setConfirmarCierreAsistente(false)}
        textoAceptar="Cerrar asistente"
        titulo="¿Cerrar el asistente?"
      />
    </section>
  )
}

export default Biblioteca
