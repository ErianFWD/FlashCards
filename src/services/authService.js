import { solicitar } from './api'

export async function iniciarSesion(identificador, contrasena) {
  const usuarios = await solicitar('/usuarios')
  const dato = identificador.trim().toLowerCase()
  const usuario = usuarios.find(
    (item) =>
      item.activo &&
      (item.usuario.toLowerCase() === dato || item.correo.toLowerCase() === dato) &&
      item.contrasena === contrasena,
  )

  if (!usuario) {
    throw new Error('Usuario o contraseña incorrectos, o la cuenta está inactiva.')
  }

  const { contrasena: _contrasena, ...sesionSegura } = usuario
  return sesionSegura
}
