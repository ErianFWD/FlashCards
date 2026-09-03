import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icono from '../../components/Icono/Icono'
import ModalConfirmacion from '../../components/ModalConfirmacion/ModalConfirmacion'
import { obtenerFlashcards } from '../../services/flashcardsService'
import { crearSesion } from '../../services/sesionesService'
import { RUTAS } from '../../routes/rutas'
import './Estudiar.css'

function Estudiar({ sesion }) {
  const [flashcards, setFlashcards] = useState([])
  const [materia, setMateria] = useState('Todas')
  const [indice, setIndice] = useState(0)
  const [volteada, setVolteada] = useState(false)
  const [evaluaciones, setEvaluaciones] = useState([])
  const [enCurso, setEnCurso] = useState(false)
  const [guardada, setGuardada] = useState(false)
  const [confirmarFin, setConfirmarFin] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerFlashcards()
        setFlashcards(datos.filter((item) => item.activa))
      } catch {
        setError('No se pudieron cargar las flashcards. Ejecuta JSON Server.')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const materias = useMemo(
    () => ['Todas', ...new Set(flashcards.map((item) => item.materia))],
    [flashcards],
  )
  const tarjetasSesion = useMemo(
    () => flashcards.filter((item) => materia === 'Todas' || item.materia === materia),
    [flashcards, materia],
  )
  const actual = tarjetasSesion[indice]
  const completada = enCurso && tarjetasSesion.length > 0 && evaluaciones.length === tarjetasSesion.length
  const dominadas = evaluaciones.filter((item) => item.resultado === 'dominada').length
  const repasar = evaluaciones.filter((item) => item.resultado === 'repasar').length
  const porcentaje = evaluaciones.length ? Math.round((dominadas / evaluaciones.length) * 100) : 0

  function iniciar() {
    setIndice(0)
    setVolteada(false)
    setEvaluaciones([])
    setGuardada(false)
    setEnCurso(true)
    setError('')
  }

  function marcar(resultado) {
    if (!volteada || completada) return
    setEvaluaciones((actuales) => [...actuales, { flashcardId: actual.id, resultado }])
    if (indice < tarjetasSesion.length - 1) setIndice((valor) => valor + 1)
    setVolteada(false)
  }

  async function guardarYFinalizar() {
    setConfirmarFin(false)
    if (evaluaciones.length === 0) {
      setEnCurso(false)
      return
    }
    try {
      await crearSesion({
        usuarioId: sesion.id,
        usuarioNombre: sesion.nombre,
        materia,
        total: evaluaciones.length,
        dominadas,
        repasar,
        porcentaje,
      })
      setGuardada(true)
    } catch {
      setError('No se pudo guardar la sesión en db.json.')
    }
  }

  if (cargando) return <div className="estado-vacio">Preparando sesión de estudio...</div>

  return (
    <section className="pagina seccion estudiar-pagina">
      <div className="contenedor estudiar-contenedor">
        <div className="pagina__cabecera">
          <span className="sobrelinea">Modo estudiante</span>
          <h1>Sesión de estudio</h1>
          <p>Intenta recordar, voltea la tarjeta y evalúa tu respuesta con honestidad.</p>
        </div>

        {error && <div className="aviso mensaje-error" role="alert">{error}</div>}

        {!enCurso ? (
          <section className="tarjeta preparar-sesion">
            <div className="preparar-sesion__icono"><Icono nombre="cerebro" size={34} /></div>
            <h2>Prepara tu práctica</h2>
            <p>Selecciona una materia. Flashcard utilizará únicamente las tarjetas activas.</p>
            <label>
              Materia
              <select onChange={(evento) => setMateria(evento.target.value)} value={materia}>
                {materias.map((nombre) => <option key={nombre}>{nombre}</option>)}
              </select>
            </label>
            <div className="preparar-sesion__resumen">
              <strong>{tarjetasSesion.length}</strong>
              <span>flashcards disponibles</span>
            </div>
            <button className="boton" disabled={tarjetasSesion.length === 0} onClick={iniciar} type="button">
              Iniciar sesión
              <Icono nombre="flecha" size={18} />
            </button>
          </section>
        ) : guardada ? (
          <section className="tarjeta resultado-sesion">
            <div className="resultado-sesion__sello"><Icono nombre="verificar" size={36} /></div>
            <span className="sobrelinea">Sesión guardada en db.json</span>
            <h2>{porcentaje}% de dominio</h2>
            <p>Completaste {evaluaciones.length} tarjetas: {dominadas} dominadas y {repasar} para repasar.</p>
            <div className="resultado-sesion__acciones">
              <button className="boton" onClick={iniciar} type="button">Estudiar otra vez</button>
              <Link className="boton boton--secundario" to={RUTAS.panel}>Ver mi progreso</Link>
            </div>
          </section>
        ) : completada ? (
          <section className="tarjeta resultado-sesion">
            <div className="resultado-sesion__sello"><Icono nombre="estadistica" size={36} /></div>
            <span className="sobrelinea">Resumen listo</span>
            <h2>{porcentaje}% de dominio</h2>
            <p>Marcaste {dominadas} tarjetas como dominadas y {repasar} para repasar.</p>
            <button className="boton" onClick={() => setConfirmarFin(true)} type="button">Guardar y finalizar</button>
          </section>
        ) : (
          <div className="estudio-layout">
            <div className="estudio-principal">
              <div className="progreso-estudio">
                <span>Tarjeta {indice + 1} de {tarjetasSesion.length}</span>
                <div><span style={{ width: `${((indice + 1) / tarjetasSesion.length) * 100}%` }} /></div>
              </div>
              <button
                aria-label={volteada ? 'Mostrar pregunta' : 'Mostrar respuesta'}
                className={`tarjeta-estudio${volteada ? ' tarjeta-estudio--volteada' : ''}`}
                onClick={() => setVolteada((valor) => !valor)}
                type="button"
              >
                <span>{actual.materia} · {actual.nivel}</span>
                <small>{volteada ? 'Respuesta' : 'Pregunta'}</small>
                <strong>{volteada ? actual.respuesta : actual.pregunta}</strong>
                <em><Icono nombre="girar" size={17} /> {volteada ? 'Volver a la pregunta' : 'Voltear para comprobar'}</em>
              </button>

              <div className="evaluacion-estudio">
                <button className="boton boton--secundario" disabled={!volteada} onClick={() => marcar('repasar')} type="button">Necesito repasar</button>
                <button className="boton" disabled={!volteada} onClick={() => marcar('dominada')} type="button">
                  <Icono nombre="verificar" size={18} />
                  La sabía
                </button>
              </div>
            </div>

            <aside className="tarjeta resumen-en-vivo">
              <h2>Progreso actual</h2>
              <div><span>Respondidas</span><strong>{evaluaciones.length}</strong></div>
              <div><span>Dominadas</span><strong>{dominadas}</strong></div>
              <div><span>Por repasar</span><strong>{repasar}</strong></div>
              <button className="enlace-peligro" onClick={() => setConfirmarFin(true)} type="button">Terminar sesión</button>
            </aside>
          </div>
        )}
      </div>

      <ModalConfirmacion
        abierto={confirmarFin}
        mensaje={evaluaciones.length ? 'Se guardará el progreso actual y se cerrará esta sesión de estudio.' : 'La sesión se cerrará sin guardar resultados porque aún no respondiste tarjetas.'}
        onAceptar={guardarYFinalizar}
        onCancelar={() => setConfirmarFin(false)}
        textoAceptar="Finalizar sesión"
        titulo="¿Finalizar la sesión de estudio?"
      />
    </section>
  )
}

export default Estudiar
