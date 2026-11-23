# Ediciones por año: contexto para las tarjetas

Leer ENTERO antes de tocar nada. Después: skill `talazbragoles-web`, `docs/ESTRUCTURA.md` (fila «Ediciones: orden y forma»), `docs/diseno.md`, la propuesta `docs/ediciones/propuesta-v1/index.html` (aprobada por PabloFM con «ok» el 2026-11-23) y `documentos-historicos/README.md`.

## Dónde se trabaja

- Worktree: `/opt/data/project-talazbragoles/repo-ediciones`, rama `hermes/ediciones-riel` (desde `origin/main` 51140ff). `node_modules` es un enlace a `repo-rediseno/node_modules`.
- Las tarjetas de esta sección van EN SERIE sobre ese worktree. No tocar otros worktrees.
- Publicar: receta de la skill (PR → checks en verde → merge → comprobar «Workers Builds» de main y producción con curl). Sin pedir visto bueno.

## Decisiones (PabloFM, 2026-11-23)

1. Orden: de la MÁS RECIENTE a la MÁS ANTIGUA, en todo (riel, listas, `/ediciones/`, cronología de ediciones).
2. Forma: como el desplazador de fechas de una galería de fotos. Años a la DERECHA (riel), contenido a la IZQUIERDA; al elegir un año cambia el contenido. Sin JS: una página por año. En ≥1024 px el riel va a la derecha y `position: sticky`; por debajo, arriba en una fila de botones de 48 px que se parte en líneas (sin scroll horizontal).
3. Dentro de cada edición, en este orden:
   - 01 Lo visual + resumen: cartel o portada del folleto grande (si no hay, hueco tipográfico con el año) y al lado fechas, horario, lugar, organiza, apoyo, asistencia (vacío = «pendiente»).
   - 02 Qué se hizo: actividades agrupadas por tipo.
   - 03 Organización: equipo de ese año (cambiaba cada año), asociación, patrocinadores/colaboradores.
   - 04 Lugar: edificio exacto, dirección, cómo se llegaba, qué es hoy.
   - 05 Papeles, prensa y fotos: apartados «Papeles» (folletos, programas, carteles, inscripciones, permisos), «Prensa», «Fotos» y «Recuerdos» (testimonios). Cada uno «pendiente» si está vacío. Cada documento con caras tiene su página `/ediciones/<año>/<documento>/` (caras grandes + texto literal, lo que hoy hace `.tz-documento`).
   - 06 Fuentes.
4. Más adelante se irá pasando documentación poco a poco: el modelo debe admitir varios documentos por edición y por apartado.

## Decisiones reversibles tomadas por el coordinador (PabloFM respondió solo «ok» a las 4 preguntas)

- P1. Ediciones I-IV (1992-1995): SÍ se publican como páginas «pendiente», con «año deducido» visible: el folleto de 1997 dice «por sexto año consecutivo» (fuente `folleto-vi-jornadas-1997`). `verified: false`, `status: pendiente`. Sin ningún otro dato.
- P2. Después de 1997: nada (no hay fuente). El riel empieza en 1997. Nada de VII inventada.
- P3. Recuerdos/testimonios: cuarto apartado dentro del bloque 05. Los testimonios sin año van en `/ediciones/sin-fecha/` (hoy `talazbragoles-sin-fecha-1`).
- P4. `/ediciones/` = portada con todos los años (de nuevo a viejo), cada uno con su portada en miniatura o hueco tipográfico, estado y nº de documentos. No redirige (redirigir sin JS exige meta refresh).

## Rutas

| Ruta | Qué |
|---|---|
| `/ediciones/` | Portada de la sección (P4) |
| `/ediciones/1997/` … `/ediciones/1992/` | Una página por año con riel |
| `/ediciones/1997/folleto/` | Documento con caras |
| `/ediciones/sin-fecha/` | Menciones sin año |
| antiguas `/ediciones/talazbragoles-1997-sexta/`, `-1996-quinta/`, `-sin-fecha-1/` | Redirección 301 (en `public/_redirects` de Cloudflare Workers static assets; comprobar que el formato se aplica en Workers, si no, página mínima con enlace) |

Revisar todos los enlaces internos a las rutas antiguas (cronología, fuentes, portada, `relatedEditions`, tests).

## Hecho en la tarjeta 1/2 (`t_d03a65c6`, 2026-11-23): qué cambió en el esquema y los datos

- **Ids = rutas.** `src/content/editions/` ahora tiene `1997.json` … `1992.json` y `sin-fecha.json` (antes `talazbragoles-1997-sexta`, `-1996-quinta`, `-sin-fecha-1`). Referencias actualizadas: `relatedEditions` de las fuentes, `relatedEditionId` de la cronología (también el testimonio de Viruete → `sin-fecha`), URL de la fuente `folleto-vi-jornadas-1997` → `/ediciones/1997/folleto/`.
- **Campos nuevos de `editions`** (todos opcionales; vacío = «pendiente»): `numero {romano, entero}`, `anioEstado {estado: confirmado|deducido, sourceIds[], nota}` (sus fuentes van también en `sourceIds` para salir en «Fuentes»; el test lo exige), `fechas`, `horario`, `apoyo`, `asistencia`, `venue.comoLlegar`, `venue.hoy`, `organizacion {equipo[], asociacion, patrocinadores[], nota}`, `portada {imagen, ancho, alto, alt, documento}` (1997 apunta a la cara 1 del folleto; sin portada → hueco tipográfico en la 2/2). Se mantienen `organizer` (línea «Organiza» del resumen), `description`, `activities`, `assets`.
- **`documentos[]`**: `id` → `slug` (único por edición) + `apartado` (`papeles` | `prensa` | `fotos` | `recuerdos`); `caras` pasa a opcional (default `[]`). Solo los que tienen caras generan página. `sin-fecha` lleva los dos testimonios (Viruete 2009, Umbría 2012) como `recuerdos`, sin caras.
- **Datos**: 1997 con fechas, horario, apoyo, cómo llegar, 14 patrocinadores y portada (todo del folleto); 1996 con número V, año deducido (La Runa + folleto), fechas, asistencia y 4 actividades de la reseña; 1995-1992 = número, `anioEstado` deducido (folleto) y nada más.
- **Rutas**: `src/pages/ediciones/[anio]/index.astro` (maqueta actual, ya en el orden 01 Resumen · 02 Qué se hizo · 03 Organización · 04 Lugar · 05 Papeles, prensa y fotos (4 apartados, «pendiente» si vacío) · 06 Fuentes · 07 cronología) y `[anio]/[documento].astro` (caras + texto literal, lo que antes iba dentro de la ficha). Sin riel ni imagen de portada en la página del año: eso es la 2/2 (la auditoría solo admite imágenes en `.tz-documento-imagen`).
- **Orden**: `getAllEditions()` va de la más reciente a la más antigua, sin fecha al final (portada, `/ediciones/`, `/diseno/`). Helpers `hrefEdicion(id)` y `hrefDocumento(id, slug)` en `lib/collections.ts`; etiquetas `APARTADOS`/`apartadoDocumento` en `lib/formato.ts`. La cronología (`/cronologia/`) NO se ha reordenado: si la 2/2 quiere ponerla de nueva a vieja, es `getAllTimeline()`.
- **Redirecciones**: `public/_redirects` (con y sin barra final, 301). Comprobado con `wrangler dev` local (workerd): 301 a `/ediciones/1997/`, `/1996/`, `/sin-fecha/`. `wrangler deploy --dry-run` pasa (no lista las reglas). El ancla vieja `#folleto` se pierde (el folleto tiene ahora su página).
- **Material de época en el repo**: `proyecto/documentos-historicos/` con la estructura nueva (README raíz y de cada edición, `1997-vi-jornadas/folleto/folleto-1997.md`, `herramientas/`, `sin-fechar/`), sin `originales/` ni `restaurado/` (las caras reducidas ya están en `public/documentos/1997-folleto-vi-jornadas/`, rutas de imagen sin cambiar).
- **Tests**: `tests/ediciones.test.mjs` (nombre de archivo = año, fuentes existen, I-IV pendientes y sin datos, una página por año y por documento con caras, orden nuevo→viejo en `/ediciones/` y portada, redirecciones 301 en `_redirects` y ningún enlace a rutas viejas, sin nombres).

## Datos que ya existen

- `src/content/editions/talazbragoles-1997-sexta.json` (folleto con 4 caras, 15 actividades, sede, organizador), `talazbragoles-1996-quinta.json` (La Runa), `talazbragoles-sin-fecha-1.json`.
- Material de época en el proyecto: `/opt/data/project-talazbragoles/documentos-historicos/` (una carpeta por edición, ya ordenadas; fichas I-IV con año deducido). En el repo la copia está en `proyecto/documentos-historicos/1997-04-folleto-vi-jornadas/`: pasarla a la estructura nueva (`1997-vi-jornadas/folleto/`, etc.) copiando desde la carpeta del proyecto (sin `originales/`, que pesan 12 MB: solo `restaurado/` reducido si hace falta, el `.md` y los README).

## Reglas

Nada inventado (lo desconocido «pendiente»); cada dato con fuente; no nombrar a PabloFM en lo publicado (grep en `dist/ediciones`); texto ≥16 px, toques ≥48 px, contraste ≥7:1, sin animaciones, sin JS de cliente; auditar 320-1440 px (11 anchos) × 100/200 %; `npm test` en verde (lanzar en segundo plano con `PLAYWRIGHT_BROWSERS_PATH=/opt/data/cache/ms-playwright CI=1`).
