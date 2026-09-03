import { solicitar } from './api'

export function obtenerUsuarios() {
  return solicitar('/usuarios')
}

export function actualizarUsuario(id, datos) {
  return solicitar(`/usuarios/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}

export function eliminarUsuario(id) {
  return solicitar(`/usuarios/${id}`, { method: 'DELETE' })
}
