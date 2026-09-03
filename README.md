# Flashcard — flashcards con React, JSON e IA

Flashcard es un producto mínimo viable para una academia o centro de tutorías.
Resuelve un problema central: organizar contenidos de estudio y permitir que los
estudiantes practiquen con flashcards mientras se registra su progreso.

El proyecto fue construido aplicando el ciclo de Vibe Coding:
`Describe → Genera → Revisa → Prueba → Refina`.

## Requisitos cumplidos

- React con Vite.
- Carpetas `components`, `pages`, `routes` y `services`.
- Flujo `components → pages → App.jsx → main.jsx → index.html`.
- Navegación con React Router DOM.
- `db.json` con usuarios, flashcards y sesiones de estudio.
- Acceso diferenciado para administrador y usuario.
- CRUD de flashcards mediante GET, POST, PATCH y DELETE.
- Rutas protegidas según la sesión y el rol.
- Confirmación 3D con Aceptar o Cancelar antes de cerrar sesión, cerrar
  formularios, cerrar el asistente, eliminar, desactivar o finalizar una sesión.
- Asistente de estudio con modo local y conexión opcional a OpenAI.
- Panel de estudiante con historial y panel de administrador con estadísticas.
- Gráficos calculados con los datos de `db.json`.
- Interfaz responsive con beige y amarillo como colores principales, café
  oscuro para los textos y rojo solamente para alertas.
- Iconos SVG, sin emojis.

## Instalación

Abre PowerShell o la terminal de Visual Studio Code dentro de la carpeta del
proyecto y ejecuta:

```bash
npm install
```

Ese comando crea la carpeta `node_modules`. No se incluye en el ZIP porque
puede regenerarse y ocupa mucho espacio.

## Ejecución recomendada

Inicia JSON Server, el servidor del asistente y React con un solo comando:

```bash
npm start
```

Después abre la dirección mostrada por Vite, normalmente:

```text
http://localhost:5173
```

Servicios:

| Servicio | Dirección |
| --- | --- |
| React y Vite | `http://localhost:5173` |
| JSON Server | `http://localhost:3001` |
| Asistente de estudio | `http://localhost:3002` |

También se pueden ejecutar en tres terminales:

```bash
npm run server
npm run ai
npm run dev
```

Si el puerto 5173 está ocupado, Vite usará 5174 u otro puerto y lo mostrará en
la terminal. Debes abrir exactamente esa dirección.

## Accesos de demostración

### Administrador

```text
Usuario: admin
Contraseña: flashadmin2026
```

### Usuario

```text
Usuario: estudiante
Contraseña: estudiar2026
```

La página de acceso también contiene botones para completar estas credenciales.

## Funcionalidades por rol

### Modo usuario

- Consultar y filtrar flashcards activas.
- Voltear tarjetas para comprobar respuestas.
- Estudiar por materia.
- Marcar cada tarjeta como dominada o pendiente de repaso.
- Guardar sesiones en `db.json`.
- Consultar historial y porcentaje de dominio.
- Pedir explicaciones, pistas o preguntas al asistente de estudio.

### Modo administrador

- Consultar flashcards activas e inactivas.
- Crear, editar, activar, desactivar y eliminar flashcards.
- Consultar, activar, desactivar y eliminar cuentas de estudiantes.
- Ver cantidad de contenido, estudiantes, sesiones y dominio promedio.
- Abrir gráficos de flashcards por materia y disponibilidad.

## Rutas

| Ruta | Página | Acceso |
| --- | --- | --- |
| `/` | Inicio | Público |
| `/login` | Inicio de sesión | Público |
| `/flashcards` | Biblioteca y asistente IA | Sesión iniciada |
| `/estudiar` | Sesión de flashcards | Sesión iniciada |
| `/panel` | Progreso del estudiante | Usuario |
| `/admin` | Panel administrativo | Administrador |
| `/admin/analisis` | Gráficos | Administrador |

## Base de datos JSON

`db.json` contiene tres colecciones:

- `usuarios`: credenciales simuladas, rol y estado.
- `flashcards`: pregunta, respuesta, materia, nivel y disponibilidad.
- `sesiones`: resultados y porcentaje de cada práctica.

Los `fetch()` del frontend están centralizados en `src/services`. Las páginas
llaman a esos servicios y los componentes reciben información mediante props.

## Activar la IA real

El asistente funciona sin configuración en modo demostración local, basándose
en las flashcards existentes. Para conectarlo a OpenAI:

1. Copia `.env.example` y llama `.env` a la copia.
2. Escribe la clave privada en `OPENAI_API_KEY`.
3. Conserva un modelo disponible en `OPENAI_MODEL`.
4. Reinicia `npm start`.

```env
OPENAI_API_KEY=tu_clave_privada
OPENAI_MODEL=gpt-5-mini
```

La clave no debe escribirse en JSX, `db.json` ni en una variable que empiece
con `VITE_`. El navegador consulta al servidor de `server/iaServer.js`, que
utiliza la Responses API y envía solamente información limitada de las
flashcards. La clave queda excluida de la entrega mediante `.gitignore`.

## Estructura principal

```text
Flashcard_VibeCoding/
├─ db.json
├─ docs/
│  ├─ Bitacora_de_prompts.docx
│  ├─ Reflexion_Vibe_Coding.docx
│  └─ Pruebas_y_criterios.md
├─ public/
├─ server/
│  └─ iaServer.js
├─ src/
│  ├─ components/
│  │  ├─ AsistenteEstudio/
│  │  ├─ Footer/
│  │  ├─ Header/
│  │  ├─ Icono/
│  │  ├─ ModalConfirmacion/
│  │  ├─ ModalFlashcard/
│  │  ├─ RutaProtegida/
│  │  └─ TarjetaFlashcard/
│  ├─ pages/
│  │  ├─ Biblioteca/
│  │  ├─ Estudiar/
│  │  ├─ Inicio/
│  │  ├─ Layout/
│  │  ├─ Login/
│  │  ├─ PanelAdmin/
│  │  ├─ PanelAnalisis/
│  │  └─ PanelUsuario/
│  ├─ routes/
│  ├─ services/
│  ├─ App.jsx
│  ├─ App.css
│  ├─ index.css
│  └─ main.jsx
├─ .env.example
├─ index.html
├─ package.json
└─ vite.config.js
```

## Comprobaciones técnicas

```bash
npm run lint
npm run build
```

Las pruebas funcionales y los criterios de éxito están documentados en
`docs/Pruebas_y_criterios.md`.

## Aviso académico

JSON Server y las contraseñas visibles en `db.json` son simulaciones para una
práctica. En una solución real se utilizaría autenticación de servidor,
contraseñas cifradas, autorización en la API y una base de datos segura.
