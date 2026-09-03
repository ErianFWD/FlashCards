export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers,
    },
  })

  if (!respuesta.ok) {
    const error = new Error(`La API respondió con estado ${respuesta.status}.`)
    error.estado = respuesta.status
    throw error
  }

  if (respuesta.status === 204) return null
  return respuesta.json()
}
