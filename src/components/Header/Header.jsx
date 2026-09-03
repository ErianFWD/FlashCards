import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icono from '../Icono/Icono'
import ModalConfirmacion from '../ModalConfirmacion/ModalConfirmacion'
import { RUTAS } from '../../routes/rutas'
import './Header.css'

function Header({ cerrarSesion, sesion }) {
  const [confirmarSalida, setConfirmarSalida] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const rutaPanel = sesion?.rol === 'administrador' ? RUTAS.administrador : RUTAS.panel
  const enlaces = sesion
    ? [
        { ruta: RUTAS.inicio, texto: 'Inicio' },
        { ruta: RUTAS.biblioteca, texto: 'Flashcards' },
        { ruta: RUTAS.estudiar, texto: 'Estudiar' },
        { ruta: rutaPanel, texto: 'Panel' },
      ]
    : [{ ruta: RUTAS.inicio, texto: 'Inicio' }]

  function estaActivo(ruta) {
    if (ruta === RUTAS.inicio) return location.pathname === ruta
    if (ruta === rutaPanel && location.pathname.startsWith('/admin')) return true
    return location.pathname === ruta
  }

  function aceptarCierreSesion() {
    cerrarSesion()
    setConfirmarSalida(false)
    navigate(RUTAS.inicio)
  }

  return (
    <>
      <header className="encabezado">
        <div className="contenedor encabezado__interior">
          <Link className="marca" to={RUTAS.inicio} aria-label="Flashcard, inicio">
            <span className="marca__simbolo" aria-hidden="true">FC</span>
            <span>
              <strong>Flashcard</strong>
              <small>Aprende una tarjeta a la vez</small>
            </span>
          </Link>

          <nav className="navegacion" aria-label="Navegación principal">
            {enlaces.map((enlace) => (
              <Link
                className={`navegacion__enlace${estaActivo(enlace.ruta) ? ' navegacion__enlace--activo' : ''}`}
                key={enlace.ruta}
                to={enlace.ruta}
              >
                {enlace.texto}
              </Link>
            ))}
          </nav>

          <div className="encabezado__acciones">
            {sesion && (
              <span className="rol-indicador">
                <Icono nombre="usuario" size={16} />
                {sesion.rol === 'administrador' ? 'Administrador' : 'Estudiante'}
              </span>
            )}
            {sesion ? (
              <button
                className="boton-icono boton-icono--salir"
                onClick={() => setConfirmarSalida(true)}
                type="button"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <Icono nombre="salir" size={19} />
              </button>
            ) : (
              <Link className="boton boton--pequeno" to={RUTAS.login}>Ingresar</Link>
            )}
          </div>
        </div>
      </header>

      <ModalConfirmacion
        abierto={confirmarSalida}
        mensaje="La sesión actual se cerrará y volverás a la página de inicio."
        onAceptar={aceptarCierreSesion}
        onCancelar={() => setConfirmarSalida(false)}
        textoAceptar="Cerrar sesión"
        titulo="¿Deseas cerrar sesión?"
      />
    </>
  )
}

export default Header
