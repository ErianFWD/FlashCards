import { solicitar } from './api'

export function obtenerSesiones() {
  return solicitar('/sesiones')
}

export function obtenerSesionesDeUsuario(usuarioId) {
  return solicitar(`/sesiones?usuarioId=${encodeURIComponent(usuarioId)}`)
}

export function crearSesion(datos) {
  return solicitar('/sesiones', {
    method: 'POST',
    body: JSON.stringify({
      id: `sesion-${crypto.randomUUID()}`,
      ...datos,
      fecha: new Date().toISOString(),
    }),
  })
}
