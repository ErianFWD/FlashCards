import { lazy, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import RutaProtegida from '../components/RutaProtegida/RutaProtegida'
import Biblioteca from '../pages/Biblioteca/Biblioteca'
import Estudiar from '../pages/Estudiar/Estudiar'
import Inicio from '../pages/Inicio/Inicio'
import Layout from '../pages/Layout/Layout'
import Login from '../pages/Login/Login'
import PanelAdmin from '../pages/PanelAdmin/PanelAdmin'
import PanelUsuario from '../pages/PanelUsuario/PanelUsuario'
import { RUTAS } from './rutas'

const PanelAnalisis = lazy(() => import('../pages/PanelAnalisis/PanelAnalisis'))

function Routing({ sesion, alCambiarSesion }) {
  return (
    <Router>
      <Routes>
        <Route
          element={
            <Layout
              cerrarSesion={() => alCambiarSesion(null)}
              sesion={sesion}
            />
          }
        >
          <Route path={RUTAS.inicio} element={<Inicio sesion={sesion} />} />
          <Route
            path={RUTAS.login}
            element={
              <Login alIniciarSesion={alCambiarSesion} sesion={sesion} />
            }
          />
          <Route
            path={RUTAS.biblioteca}
            element={
              <RutaProtegida sesion={sesion}>
                <Biblioteca sesion={sesion} />
              </RutaProtegida>
            }
          />
          <Route
            path={RUTAS.estudiar}
            element={
              <RutaProtegida sesion={sesion}>
                <Estudiar sesion={sesion} />
              </RutaProtegida>
            }
          />
          <Route
            path={RUTAS.panel}
            element={
              <RutaProtegida sesion={sesion}>
                {sesion?.rol === 'administrador' ? (
                  <Navigate replace to={RUTAS.administrador} />
                ) : (
                  <PanelUsuario sesion={sesion} />
                )}
              </RutaProtegida>
            }
          />
          <Route
            path={RUTAS.administrador}
            element={
              <RutaProtegida rol="administrador" sesion={sesion}>
                <PanelAdmin />
              </RutaProtegida>
            }
          />
          <Route
            path={RUTAS.analisis}
            element={
              <RutaProtegida rol="administrador" sesion={sesion}>
                <Suspense
                  fallback={
                    <div className="estado-vacio">Cargando análisis...</div>
                  }
                >
                  <PanelAnalisis />
                </Suspense>
              </RutaProtegida>
            }
          />
          <Route path="*" element={<Navigate replace to={RUTAS.inicio} />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default Routing
