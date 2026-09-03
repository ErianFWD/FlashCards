# Pruebas y criterios de éxito

## Criterios definidos en la Fase 0

| Criterio | Evidencia | Resultado |
| --- | --- | --- |
| El administrador gestiona flashcards en JSON. | CRUD mediante `flashcardsService.js` y colección `flashcards`. | Cumple |
| El estudiante termina una sesión y ve su avance. | POST en `sesiones`, resumen final y `PanelUsuario`. | Cumple |
| Los errores son claros y las acciones sensibles se confirman. | Validaciones, avisos y `ModalConfirmacion`. | Cumple |

## Prueba final

| Prueba | Resultado esperado | Resultado obtenido |
| --- | --- | --- |
| Iniciar con `estudiante / estudiar2026`. | Abre la biblioteca como usuario. | Pasa |
| Iniciar con `admin / flashadmin2026`. | Abre el panel administrador. | Pasa |
| Intentar credenciales incorrectas. | Muestra error y no crea sesión. | Pasa |
| Abrir `/admin` como estudiante. | Redirige al panel permitido. | Pasa |
| Crear una flashcard válida. | Aparece en la lista y en `db.json`. | Pasa |
| Guardar pregunta o respuesta con menos de 5 caracteres. | Muestra validación y no envía. | Pasa |
| Editar, activar o desactivar una tarjeta. | Solicita confirmación cuando corresponde y actualiza JSON. | Pasa |
| Eliminar una tarjeta. | Muestra Aceptar/Cancelar y elimina solo al aceptar. | Pasa |
| Terminar una sesión de estudio. | Solicita confirmación, guarda resultados y muestra resumen. | Pasa |
| Cerrar sesión. | Solicita confirmación antes de volver al inicio. | Pasa |
| Ejecutar sin clave de OpenAI. | El asistente responde en modo demostración local. | Pasa |
| Apagar JSON Server y recargar datos. | La app muestra un error comprensible y permite reintentar. | Pasa |
| Ejecutar análisis estático. | No reporta errores ni advertencias. | Pasa |
| Compilar para producción. | Vite termina correctamente. | Pasa |

## Verificación técnica ejecutada

```bash
npm run lint
npm run build
```

## Seguridad revisada

- No hay claves privadas dentro de React ni de `db.json`.
- `.env` está excluido del ZIP y del control de versiones.
- La API de IA limita el tamaño del mensaje, el historial y las flashcards.
- Las contraseñas en JSON son datos de demostración; el README explica que no
  representan una autenticación adecuada para producción.
