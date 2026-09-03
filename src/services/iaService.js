const IA_URL = import.meta.env.VITE_AI_URL ?? 'http://localhost:3002'

export async function consultarAsistente(mensaje, historial, flashcards) {
  const respuesta = await fetch(`${IA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensaje, historial, flashcards }),
  })

  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    throw new Error(datos.error ?? 'No se pudo consultar al asistente de estudio.')
  }

  return datos
}
