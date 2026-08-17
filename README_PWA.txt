# FADENA Organizador PWA v21

Archivos para GitHub Pages:

- `index.html`
- `manifest.webmanifest`
- `sw.js`
- carpeta `icons/` completa

Todos deben quedar en la raíz del repositorio, salvo los iconos dentro de `icons/`.

Novedades v21:
- Historial académico por períodos.
- Estados: PLANIFICADO / ACTIVO / FINALIZADO.
- Períodos finalizados protegidos contra edición accidental.
- Nuevo período se crea como PLANIFICADO.
- Activar un período finaliza de forma segura el período activo anterior.
- Se eliminó la función destructiva “Restablecer datos”.
- Restaurar respaldo crea antes una copia automática del estado actual y pide confirmación antes de reemplazar datos.
- Respaldo completo mediante archivo JSON.
