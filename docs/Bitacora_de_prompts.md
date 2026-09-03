# Bitácora de prompts — Flashcard

## Fase 0: intención

**¿Quién usará la solución y qué problema resuelve?**

La usarán estudiantes de una academia y el personal que prepara el material.
Resuelve la dispersión de preguntas y apuntes: centraliza flashcards por materia
y permite medir el avance de cada sesión.

**Única cosa que el MVP debe hacer bien**

Permitir que un estudiante repase flashcards, compruebe la respuesta y guarde
cuántas domina y cuántas necesita repasar.

**Criterios de éxito**

1. El administrador puede crear, editar y eliminar una flashcard en `db.json`.
2. El estudiante puede completar una sesión y ver el resultado guardado en su panel.
3. Una entrada inválida muestra un mensaje claro y las acciones sensibles piden confirmación.

## Iteraciones Describe → Genera → Revisa → Prueba → Refina

| Prompt que se escribió | ¿Qué generó la IA? | ¿Qué se revisó o corrigió? |
| --- | --- | --- |
| Actúa como desarrollador React. Crea solamente el esqueleto visual de un MVP de flashcards para una academia, con beige y amarillo como colores principales, sin emojis. Separa components, pages, routes y services. Criterios: Vite abre, hay rutas y la interfaz es responsive. | Estructura inicial, rutas, encabezado, inicio y estilos globales. | Se comprobó el flujo `components → pages → App.jsx → main.jsx → index.html`. Se ajustó el menú móvil y se sustituyeron símbolos de texto por iconos SVG. |
| Agrega una base simulada `db.json` con usuarios, flashcards y sesiones. Implementa servicios GET, POST, PATCH y DELETE; no coloques `fetch()` dentro de los componentes visuales. | Servicios para autenticación, flashcards, sesiones y usuarios; datos de ejemplo. | La primera base conservó nombres de productos de una cafetería provenientes del prototipo anterior. Se detectó buscando referencias a Cafébee y se reemplazó todo el modelo por preguntas, respuestas, materias y progreso. |
| Implementa login con dos roles y rutas protegidas. El administrador debe entrar a `/admin` y el estudiante a `/panel`. Criterios: credenciales válidas redirigen, inválidas muestran error y una ruta administrativa rechaza usuarios normales. | Formulario controlado, sesión en localStorage y `RutaProtegida`. | Se eliminó la contraseña del objeto guardado en localStorage. Se añadió manejo del error cuando JSON Server no está activo y se documentó que la autenticación es solamente educativa. |
| Crea el CRUD de flashcards una función a la vez: listar y filtrar; luego crear; después editar; por último eliminar. Valida preguntas y respuestas vacías. | Biblioteca, tarjeta que se voltea y formulario administrativo. | Se probaron textos menores a cinco caracteres, filtros sin resultados y tarjetas inactivas. Se agregó una nueva consulta después de cada cambio para mantener la interfaz sincronizada con `db.json`. |
| Construye una sesión de estudio por materia. El usuario debe intentar responder, voltear la tarjeta y elegir “La sabía” o “Necesito repasar”. Guarda un resumen final. | Flujo de estudio, conteos, porcentaje e historial por usuario. | Se evitó evaluar antes de mostrar la respuesta, se controló el caso sin tarjetas y se añadió confirmación antes de finalizar para no cerrar la sesión accidentalmente. |
| Agrega una ventana 3D de Aceptar o Cancelar antes de cerrar sesión, eliminar, desactivar, cerrar formularios, cerrar el asistente o terminar el estudio. Usa rojo solo como alerta. | `ModalConfirmacion` reutilizable con `role="alertdialog"`. | Se verificó el enfoque inicial en Cancelar, el cierre con Escape y el bloqueo del desplazamiento del fondo. Se ajustó el contraste y la vista móvil. |
| Integra un asistente de estudio que use las flashcards disponibles. La clave debe permanecer en el servidor y la app debe funcionar sin ella. | Servidor Express con Responses API y respuesta local de demostración. | Se limitaron tamaño, historial y campos enviados; se indicó no inventar datos ni resolver tareas evaluadas completas. Se añadió confirmación antes de cerrar la ventana. |
| Genera un panel de negocio con estadísticas reales y dos gráficos. No escribas manualmente los valores de los gráficos. | Métricas, barras por materia y gráfico de disponibilidad. | Se comprobó que los datos se calculan desde `db.json`, se añadió estado de carga y se adaptaron los gráficos a pantallas pequeñas. |

## Resultado de la verificación humana

- Se entendió la responsabilidad de cada servicio y componente antes de aceptar el código.
- Se probaron el caso normal y casos raros: credenciales inválidas, campo corto,
  búsqueda sin coincidencias, servidor JSON apagado y sesión sin respuestas.
- Se detectaron y eliminaron referencias del prototipo de cafetería.
- No se conservaron funciones ni librerías inexistentes.
- Se ejecutaron el análisis estático y la compilación de producción.
