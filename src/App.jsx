import { useEffect, useState } from 'react'
import Routing from './routes/Routing'
import './App.css'

function App() {
  const [sesion, setSesion] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flashcard-sesion')) ?? null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (sesion) {
      localStorage.setItem('flashcard-sesion', JSON.stringify(sesion))
    } else {
      localStorage.removeItem('flashcard-sesion')
    }
  }, [sesion])

  return <Routing alCambiarSesion={setSesion} sesion={sesion} />
}

export default App
