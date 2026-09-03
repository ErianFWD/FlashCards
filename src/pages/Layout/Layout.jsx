import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'

function Layout({ cerrarSesion, sesion }) {
  return (
    <div className="aplicacion">
      <Header cerrarSesion={cerrarSesion} sesion={sesion} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
