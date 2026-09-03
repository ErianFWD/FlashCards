import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icono from '../../components/Icono/Icono'
import { obtenerSesionesDeUsuario } from '../../services/sesionesService'
import { RUTAS } from '../../routes/rutas'
import './PanelUsuario.css'

function PanelUsuario({ sesion }) {
  const [sesiones, setSesiones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerSesionesDeUsuario(sesion.id)
        setSesiones(datos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
      } catch {
        setError('No se pudo cargar tu progreso desde db.json.')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [sesion.id])

  const resumen = useMemo(() => {
    const total = sesiones.reduce((suma, item) => suma + Number(item.total || 0), 0)
    const dominadas = sesiones.reduce((suma, item) => suma + Number(item.dominadas || 0), 0)
    return {
      total,
      dominadas,
      promedio: total ? Math.round((dominadas / total) * 100) : 0,
    }
  }, [sesiones])

  return (
    <section className="pagina seccion">
      <div className="contenedor">
        <div className="pagina__cabecera pagina__cabecera--acciones">
          <div>
            <span className="sobrelinea">Panel de estudiante</span>
            <h1>Hola, {sesion.nombre}</h1>
            <p>Consulta el avance guardado después de cada sesión de flashcards.</p>
          </div>
          <Link className="boton" to={RUTAS.estudiar}>
            Estudiar ahora
            <Icono nombre="flecha" size={18} />
          </Link>
        </div>

        {error && <div className="aviso mensaje-error" role="alert">{error}</div>}

        <div className="metricas">
          <article className="metrica"><span>Sesiones</span><strong>{sesiones.length}</strong><small>prácticas guardadas</small></article>
          <article className="metrica"><span>Tarjetas vistas</span><strong>{resumen.total}</strong><small>respuestas evaluadas</small></article>
          <article className="metrica"><span>Dominio general</span><strong>{resumen.promedio}%</strong><small>{resumen.dominadas} dominadas</small></article>
        </div>

        <section className="tarjeta historial-panel">
          <div className="tarjeta__titulo">
            <span className="tarjeta__numero"><Icono nombre="estadistica" size={18} /></span>
            <div><h2>Historial de estudio</h2><p>Información obtenida desde la colección sesiones de db.json.</p></div>
          </div>

          {cargando ? (
            <div className="estado-vacio">Cargando historial...</div>
          ) : sesiones.length === 0 ? (
            <div className="estado-vacio"><Icono nombre="libro" size={28} /><strong>Todavía no hay sesiones</strong><span>Completa tu primera práctica para ver resultados.</span></div>
          ) : (
            <div className="tabla-responsive">
              <table>
                <thead><tr><th>Fecha</th><th>Materia</th><th>Tarjetas</th><th>Dominio</th></tr></thead>
                <tbody>
                  {sesiones.map((item) => (
                    <tr key={item.id}>
                      <td>{new Date(item.fecha).toLocaleDateString('es-CR')}</td>
                      <td>{item.materia}</td>
                      <td>{item.total}</td>
                      <td><span className="porcentaje-tabla">{item.porcentaje}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default PanelUsuario
