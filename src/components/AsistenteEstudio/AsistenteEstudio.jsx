import { useState } from 'react'
import Icono from '../Icono/Icono'
import './AsistenteEstudio.css'

const MENSAJE_INICIAL = {
  id: 'inicio',
  rol: 'asistente',
  texto: 'Soy el asistente de estudio de Flashcard. Puedo explicar una tarjeta, darte una pista o formular una pregunta de práctica.',
}

function AsistenteEstudio({ abierto, onAbrir, onCerrarSolicitado, onEnviar }) {
  const [mensajes, setMensajes] = useState([MENSAJE_INICIAL])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [modo, setModo] = useState('')

  async function enviar(evento) {
    evento.preventDefault()
    const mensaje = texto.trim()
    if (!mensaje || enviando) return

    const mensajeUsuario = { id: `usuario-${Date.now()}`, rol: 'usuario', texto: mensaje }
    const historialAnterior = mensajes.filter((item) => item.id !== 'inicio')
    setMensajes((actuales) => [...actuales, mensajeUsuario])
    setTexto('')
    setEnviando(true)

    try {
      const resultado = await onEnviar(mensaje, historialAnterior)
      setModo(resultado.modo)
      setMensajes((actuales) => [
        ...actuales,
        { id: `asistente-${Date.now()}`, rol: 'asistente', texto: resultado.respuesta },
      ])
    } catch (error) {
      setMensajes((actuales) => [
        ...actuales,
        { id: `error-${Date.now()}`, rol: 'error', texto: error.message },
      ])
    } finally {
      setEnviando(false)
    }
  }

  if (!abierto) {
    return (
      <button aria-label="Abrir asistente de estudio" className="asistente-activador" onClick={onAbrir} type="button">
        <Icono nombre="ia" size={22} />
        <span>Asistente IA</span>
      </button>
    )
  }

  return (
    <aside aria-label="Asistente de estudio" className="asistente-panel">
      <header className="asistente-panel__cabecera">
        <div className="asistente-panel__identidad">
          <span className="asistente-panel__icono"><Icono nombre="ia" size={21} /></span>
          <div>
            <strong>Asistente Flashcard</strong>
            <small>{modo === 'demostracion' ? 'Modo demostración local' : 'Apoyo para estudiar'}</small>
          </div>
        </div>
        <button aria-label="Cerrar asistente" className="boton-icono" onClick={onCerrarSolicitado} type="button">
          <Icono nombre="cerrar" size={18} />
        </button>
      </header>

      <div aria-live="polite" className="asistente-panel__mensajes">
        {mensajes.map((mensaje) => (
          <p className={`asistente-mensaje asistente-mensaje--${mensaje.rol}`} key={mensaje.id}>{mensaje.texto}</p>
        ))}
        {enviando && <p className="asistente-mensaje asistente-mensaje--asistente">Analizando las flashcards...</p>}
      </div>

      <div className="asistente-panel__sugerencias">
        <button onClick={() => setTexto('Dame una pista para recordar la fotosíntesis')} type="button">Pista de biología</button>
        <button onClick={() => setTexto('Hazme una pregunta de matemáticas')} type="button">Pregunta de práctica</button>
      </div>

      <form className="asistente-panel__formulario" onSubmit={enviar}>
        <label className="sr-only" htmlFor="mensaje-ia">Mensaje para el asistente</label>
        <input
          id="mensaje-ia"
          maxLength="600"
          onChange={(evento) => setTexto(evento.target.value)}
          placeholder="Pregunta sobre tus tarjetas..."
          value={texto}
        />
        <button aria-label="Enviar mensaje" disabled={enviando || !texto.trim()} type="submit">
          <Icono nombre="enviar" size={19} />
        </button>
      </form>
    </aside>
  )
}

export default AsistenteEstudio
