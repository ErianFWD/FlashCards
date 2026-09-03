import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Icono from '../../components/Icono/Icono'
import { obtenerFlashcards } from '../../services/flashcardsService'
import { obtenerSesiones } from '../../services/sesionesService'
import { obtenerUsuarios } from '../../services/usuariosService'
import { RUTAS } from '../../routes/rutas'
import './PanelAnalisis.css'

const COLORES = ['#e7b62d', '#f1dfb8']

function PanelAnalisis() {
  const [flashcards, setFlashcards] = useState([])
  const [sesiones, setSesiones] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const [datosFlashcards, datosSesiones, datosUsuarios] = await Promise.all([
          obtenerFlashcards(),
          obtenerSesiones(),
          obtenerUsuarios(),
        ])
        setFlashcards(datosFlashcards)
        setSesiones(datosSesiones)
        setUsuarios(datosUsuarios)
      } catch {
        setError('No se pudieron preparar los gráficos desde db.json.')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const tarjetasPorMateria = useMemo(() => {
    const conteo = flashcards.reduce((acumulado, item) => {
      acumulado[item.materia] = (acumulado[item.materia] ?? 0) + 1
      return acumulado
    }, {})
    return Object.entries(conteo).map(([materia, cantidad]) => ({ materia, cantidad }))
  }, [flashcards])

  const disponibilidad = useMemo(
    () => [
      { nombre: 'Activas', cantidad: flashcards.filter((item) => item.activa).length },
      { nombre: 'Inactivas', cantidad: flashcards.filter((item) => !item.activa).length },
    ],
    [flashcards],
  )

  const promedioDominio = sesiones.length
    ? Math.round(sesiones.reduce((suma, item) => suma + Number(item.porcentaje || 0), 0) / sesiones.length)
    : 0
  const tarjetasEstudiadas = sesiones.reduce((suma, item) => suma + Number(item.total || 0), 0)
  const estudiantesActivos = usuarios.filter((item) => item.rol === 'usuario' && item.activo).length

  return (
    <section className="pagina seccion">
      <div className="contenedor">
        <div className="pagina__cabecera pagina__cabecera--acciones">
          <div>
            <span className="sobrelinea">Dato útil para el negocio</span>
            <h1>Análisis de Flashcard</h1>
            <p>Los indicadores y gráficos se calculan con información real de db.json.</p>
          </div>
          <Link className="boton boton--secundario" to={RUTAS.administrador}>Volver al panel</Link>
        </div>

        {error && <div className="aviso mensaje-error" role="alert">{error}</div>}

        {cargando ? (
          <div className="estado-vacio">Preparando análisis...</div>
        ) : (
          <>
            <div className="analisis-resumen">
              <article className="tarjeta"><span>Estudiantes activos</span><strong>{estudiantesActivos}</strong></article>
              <article className="tarjeta"><span>Tarjetas estudiadas</span><strong>{tarjetasEstudiadas}</strong></article>
              <article className="tarjeta"><span>Dominio promedio</span><strong>{promedioDominio}%</strong></article>
            </div>

            <div className="analisis-graficos">
              <article className="tarjeta grafico-tarjeta">
                <div className="tarjeta__titulo">
                  <span className="tarjeta__numero"><Icono nombre="estadistica" size={18} /></span>
                  <div><h2>Flashcards por materia</h2><p>Permite detectar áreas con poco contenido.</p></div>
                </div>
                <div className="grafico-contenedor">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tarjetasPorMateria} margin={{ top: 20, right: 12, left: -16, bottom: 48 }}>
                      <CartesianGrid stroke="#eadac2" strokeDasharray="4 4" />
                      <XAxis angle={-20} dataKey="materia" height={72} textAnchor="end" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#e7b62d" name="Tarjetas" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="tarjeta grafico-tarjeta">
                <div className="tarjeta__titulo">
                  <span className="tarjeta__numero"><Icono nombre="tarjeta" size={18} /></span>
                  <div><h2>Disponibilidad</h2><p>Compara el material visible y oculto.</p></div>
                </div>
                <div className="grafico-contenedor">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={disponibilidad} dataKey="cantidad" innerRadius={62} nameKey="nombre" outerRadius={100} paddingAngle={3}>
                        {disponibilidad.map((item, indiceColor) => <Cell fill={COLORES[indiceColor]} key={item.nombre} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default PanelAnalisis
