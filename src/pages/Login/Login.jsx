import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Icono from '../../components/Icono/Icono'
import { iniciarSesion } from '../../services/authService'
import { RUTAS } from '../../routes/rutas'
import './Login.css'

function Login({ alIniciarSesion, sesion }) {
  const [identificador, setIdentificador] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  if (sesion) return <Navigate replace to={sesion.rol === 'administrador' ? RUTAS.administrador : RUTAS.panel} />

  async function enviar(evento) {
    evento.preventDefault()
    setError('')
    setCargando(true)
    try {
      const nuevaSesion = await iniciarSesion(identificador, contrasena)
      alIniciarSesion(nuevaSesion)
      const destino = nuevaSesion.rol === 'administrador'
        ? RUTAS.administrador
        : location.state?.desde ?? RUTAS.biblioteca
      navigate(destino, { replace: true })
    } catch (fallo) {
      setError(fallo.message.includes('fetch') ? 'No se pudo conectar con db.json. Ejecuta npm start.' : fallo.message)
    } finally {
      setCargando(false)
    }
  }

  function usarDemo(tipo) {
    if (tipo === 'admin') {
      setIdentificador('admin')
      setContrasena('flashadmin2026')
    } else {
      setIdentificador('estudiante')
      setContrasena('estudiar2026')
    }
    setError('')
  }

  return (
    <section className="pagina login-pagina">
      <div className="contenedor login-layout">
        <div className="login-presentacion">
          <span className="sobrelinea">Acceso por roles</span>
          <h1>Tu espacio para aprender y administrar.</h1>
          <p>Un mismo sistema ofrece una experiencia distinta según el rol guardado en db.json.</p>
          <div className="login-roles">
            <article><Icono nombre="cerebro" size={24} /><div><strong>Estudiante</strong><span>Estudia tarjetas y consulta su progreso.</span></div></article>
            <article><Icono nombre="panel" size={24} /><div><strong>Administrador</strong><span>Gestiona contenido, usuarios y análisis.</span></div></article>
          </div>
        </div>

        <form className="tarjeta login-formulario" onSubmit={enviar}>
          <div className="login-formulario__icono"><Icono nombre="usuario" size={25} /></div>
          <h2>Iniciar sesión</h2>
          <p>Escribe tu usuario o correo y la contraseña.</p>
          <label>
            Usuario o correo
            <input autoComplete="username" onChange={(evento) => setIdentificador(evento.target.value)} required value={identificador} />
          </label>
          <label>
            Contraseña
            <input autoComplete="current-password" minLength="6" onChange={(evento) => setContrasena(evento.target.value)} required type="password" value={contrasena} />
          </label>
          {error && <div className="aviso mensaje-error" role="alert">{error}</div>}
          <button className="boton" disabled={cargando} type="submit">
            {cargando ? 'Verificando...' : 'Ingresar'}
            {!cargando && <Icono nombre="flecha" size={17} />}
          </button>
          <div className="login-demo">
            <span>Completar acceso de demostración</span>
            <div>
              <button onClick={() => usarDemo('usuario')} type="button">Usuario</button>
              <button onClick={() => usarDemo('admin')} type="button">Administrador</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Login
