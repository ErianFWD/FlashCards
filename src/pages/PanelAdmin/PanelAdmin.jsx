import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icono from '../../components/Icono/Icono'
import ModalConfirmacion from '../../components/ModalConfirmacion/ModalConfirmacion'
import { obtenerFlashcards } from '../../services/flashcardsService'
import { obtenerSesiones } from '../../services/sesionesService'
import { actualizarUsuario, eliminarUsuario, obtenerUsuarios } from '../../services/usuariosService'
import { RUTAS } from '../../routes/rutas'
import './PanelAdmin.css'

function PanelAdmin() {
  const [flashcards, setFlashcards] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [sesiones, setSesiones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [accionUsuario, setAccionUsuario] = useState(null)

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const [datosFlashcards, datosUsuarios, datosSesiones] = await Promise.all([
        obtenerFlashcards(),
        obtenerUsuarios(),
        obtenerSesiones(),
      ])
      setFlashcards(datosFlashcards)
      setUsuarios(datosUsuarios)
      setSesiones(datosSesiones)
    } catch {
      setError('No se pudo cargar el panel. Comprueba que JSON Server esté activo.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  async function confirmarAccionUsuario() {
    const { tipo, usuario } = accionUsuario
    try {
      if (tipo === 'eliminar') {
        await eliminarUsuario(usuario.id)
        setMensaje('El usuario fue eliminado de db.json.')
      } else {
        await actualizarUsuario(usuario.id, { activo: !usuario.activo })
        setMensaje(`La cuenta quedó ${usuario.activo ? 'inactiva' : 'activa'}.`)
      }
      setAccionUsuario(null)
      await cargarDatos()
    } catch {
      setError('No se pudo completar la acción sobre el usuario.')
      setAccionUsuario(null)
    }
  }

  const estudiantes = usuarios.filter((item) => item.rol === 'usuario')
  const promedio = sesiones.length
    ? Math.round(sesiones.reduce((suma, item) => suma + Number(item.porcentaje || 0), 0) / sesiones.length)
    : 0

  return (
    <section className="pagina seccion">
      <div className="contenedor">
        <div className="pagina__cabecera pagina__cabecera--acciones">
          <div>
            <span className="sobrelinea">Área protegida</span>
            <h1>Panel administrador</h1>
            <p>Gestiona el contenido académico, las cuentas y los datos del negocio.</p>
          </div>
          <div className="panel-acciones">
            <Link className="boton boton--secundario" to={RUTAS.biblioteca}>Administrar flashcards</Link>
            <Link className="boton" to={RUTAS.analisis}><Icono nombre="estadistica" size={18} />Ver análisis</Link>
          </div>
        </div>

        {mensaje && <div className="aviso" role="status">{mensaje}</div>}
        {error && <div className="aviso mensaje-error" role="alert">{error}</div>}

        <div className="metricas">
          <article className="metrica"><span>Flashcards</span><strong>{flashcards.length}</strong><small>{flashcards.filter((item) => item.activa).length} activas</small></article>
          <article className="metrica"><span>Estudiantes</span><strong>{estudiantes.length}</strong><small>{estudiantes.filter((item) => item.activo).length} activos</small></article>
          <article className="metrica"><span>Dominio promedio</span><strong>{promedio}%</strong><small>{sesiones.length} sesiones</small></article>
        </div>

        <section className="tarjeta usuarios-panel">
          <div className="tarjeta__titulo">
            <span className="tarjeta__numero"><Icono nombre="usuario" size={18} /></span>
            <div><h2>Usuarios registrados</h2><p>Activa, desactiva o elimina cuentas de estudiante.</p></div>
          </div>

          {cargando ? (
            <div className="estado-vacio">Cargando usuarios...</div>
          ) : (
            <div className="tabla-responsive">
              <table>
                <thead><tr><th>Nombre</th><th>Usuario</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {estudiantes.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.nombre}<small>{usuario.correo}</small></td>
                      <td>{usuario.usuario}</td>
                      <td><span className={`estado-cuenta estado-cuenta--${usuario.activo ? 'activo' : 'inactivo'}`}>{usuario.activo ? 'Activo' : 'Inactivo'}</span></td>
                      <td>
                        <div className="acciones-tabla">
                          <button className="enlace-accion" onClick={() => setAccionUsuario({ tipo: 'estado', usuario })} type="button">{usuario.activo ? 'Desactivar' : 'Activar'}</button>
                          <button className="boton-icono boton-icono--peligro" onClick={() => setAccionUsuario({ tipo: 'eliminar', usuario })} title="Eliminar usuario" type="button"><Icono nombre="eliminar" size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <ModalConfirmacion
        abierto={Boolean(accionUsuario)}
        mensaje={accionUsuario?.tipo === 'eliminar'
          ? `La cuenta de ${accionUsuario?.usuario.nombre ?? ''} se eliminará permanentemente.`
          : `La cuenta de ${accionUsuario?.usuario.nombre ?? ''} quedará ${accionUsuario?.usuario.activo ? 'inactiva' : 'activa'}.`}
        onAceptar={confirmarAccionUsuario}
        onCancelar={() => setAccionUsuario(null)}
        textoAceptar={accionUsuario?.tipo === 'eliminar' ? 'Eliminar usuario' : 'Cambiar estado'}
        titulo={accionUsuario?.tipo === 'eliminar' ? '¿Eliminar este usuario?' : '¿Cambiar el estado de la cuenta?'}
      />
    </section>
  )
}

export default PanelAdmin
