import { solicitar } from './api'

export function obtenerFlashcards() {
  return solicitar('/flashcards')
}

export function crearFlashcard(datos) {
  return solicitar('/flashcards', {
    method: 'POST',
    body: JSON.stringify({
      id: `card-${crypto.randomUUID()}`,
      ...datos,
      fechaCreacion: new Date().toISOString(),
    }),
  })
}

export function actualizarFlashcard(id, datos) {
  return solicitar(`/flashcards/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}

export function eliminarFlashcard(id) {
  return solicitar(`/flashcards/${id}`, { method: 'DELETE' })
}
