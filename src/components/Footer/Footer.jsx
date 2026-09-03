import Icono from '../Icono/Icono'
import './Footer.css'

function Footer() {
  return (
    <footer className="pie">
      <div className="contenedor pie__interior">
        <div>
          <strong>Flashcard</strong>
          <span>Un MVP educativo construido aplicando Vibe Coding.</span>
        </div>
        <span className="pie__sello">
          <Icono nombre="verificar" size={17} />
          Datos guardados en db.json
        </span>
      </div>
    </footer>
  )
}

export default Footer
