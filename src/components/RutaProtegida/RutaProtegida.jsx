import { Navigate, useLocation } from 'react-router-dom'
import { RUTAS } from '../../routes/rutas'

function RutaProtegida({ children, rol, sesion }) {
  const location = useLocation()

  if (!sesion) {
    return <Navigate replace state={{ desde: location.pathname }} to={RUTAS.login} />
  }

  if (rol && sesion.rol !== rol) {
    return <Navigate replace to={RUTAS.panel} />
  }

  return children
}

export default RutaProtegida
