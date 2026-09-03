import { Link } from 'react-router-dom'
import Icono from '../../components/Icono/Icono'
import { RUTAS } from '../../routes/rutas'
import './Inicio.css'

function Inicio({ sesion }) {
  const destino = sesion ? RUTAS.biblioteca : RUTAS.login

  return (
    <>
      <section className="hero">
        <div className="contenedor hero__interior">
          <div className="hero__contenido">
            <span className="sobrelinea">Estudio activo y organizado</span>
            <h1>Convierte conceptos difíciles en recuerdos claros.</h1>
            <p>
              Flashcard ayuda a estudiantes y centros de tutoría a organizar
              contenidos, practicar con flashcards y medir el progreso real.
            </p>
            <div className="hero__acciones">
              <Link className="boton" to={destino}>
                {sesion ? 'Abrir mis flashcards' : 'Comenzar a estudiar'}
                <Icono nombre="flecha" size={18} />
              </Link>
              <a className="boton boton--secundario" href="#como-funciona">Cómo funciona</a>
            </div>
            <div className="hero__confianza">
              <span><Icono nombre="verificar" size={16} /> Sesiones medibles</span>
              <span><Icono nombre="verificar" size={16} /> Contenido administrable</span>
            </div>
          </div>

          <div className="hero__visual" aria-label="Ejemplo de flashcard">
            <div className="hero-tarjeta hero-tarjeta--atras" />
            <div className="hero-tarjeta hero-tarjeta--medio" />
            <article className="hero-tarjeta hero-tarjeta--principal">
              <span>Biología</span>
              <Icono nombre="cerebro" size={45} />
              <strong>¿Cuál es la función principal de la mitocondria?</strong>
              <small>Voltea la tarjeta para descubrir la respuesta</small>
            </article>
          </div>
        </div>
      </section>

      <section className="seccion" id="como-funciona">
        <div className="contenedor">
          <div className="seccion__cabecera">
            <span className="sobrelinea">Un problema, una solución clara</span>
            <h2>Estudiar con intención</h2>
            <p>El MVP se concentra en crear, consultar y repasar tarjetas sin perder el avance.</p>
          </div>
          <div className="pasos-grid">
            <article className="tarjeta paso">
              <span className="tarjeta__numero">1</span>
              <Icono nombre="libro" size={26} />
              <h3>Elige una materia</h3>
              <p>Filtra el contenido disponible y enfoca cada sesión.</p>
            </article>
            <article className="tarjeta paso">
              <span className="tarjeta__numero">2</span>
              <Icono nombre="girar" size={26} />
              <h3>Recuerda activamente</h3>
              <p>Piensa la respuesta antes de voltear cada flashcard.</p>
            </article>
            <article className="tarjeta paso">
              <span className="tarjeta__numero">3</span>
              <Icono nombre="estadistica" size={26} />
              <h3>Mide el progreso</h3>
              <p>Marca lo dominado y conserva un historial en JSON.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="seccion seccion--amarilla">
        <div className="contenedor bloque-negocio">
          <div>
            <span className="sobrelinea sobrelinea--clara">Valor para una academia</span>
            <h2>El administrador controla el material. El estudiante se concentra en aprender.</h2>
          </div>
          <div className="bloque-negocio__datos">
            <span><strong>2</strong> modos de acceso</span>
            <span><strong>1</strong> fuente de datos</span>
            <span><strong>100%</strong> enfocado en estudiar</span>
          </div>
        </div>
      </section>
    </>
  )
}

export default Inicio
