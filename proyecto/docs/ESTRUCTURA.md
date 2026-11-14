# Estructura de la web y coordinación

Documento rector. Creado el 2026-11-14 por la sesión coordinadora (encargo de PabloFM: «ahora lo lideras tú»).
Quien trabaje en el proyecto (persona o IA) lee esto primero y después `README.md`.

## 1. Decisiones tomadas
| Tema | Decisión | Quién y cuándo |
|---|---|---|
| Dominio canónico | `https://www.talazbragoles.com` (el dominio sin www ya redirige a www) | PabloFM delega; coordinación, 2026-11-14 |
| Fuentes nuevas del Archivo | Se publican como enlace + resumen propio. No se copian textos ni imágenes ajenos (no son de dominio público) | PabloFM (condición) + coordinación, 2026-11-14 |
| Guías de profesiones | Sí: todas las profesiones de WoW Forever, una guía por profesión | PabloFM, 2026-11-14 |
| Publicación | Hermes trabaja en ramas, fusiona con checks en verde y publica; PabloFM hace QA en producción | PabloFM, 2026-11-13 |
| Dos estéticas | Fanzine B/N en todo el sitio, también en MMO y guías. Tema oscuro solo dentro del asesor | Coordinación, 2026-11-14 (reversible) |
| Una sola rama de publicación | Todo lo preparado va junto en `hermes/web-mmo` (un solo PR) | Coordinación, 2026-11-14 |
| Archivo del proyecto | El repo guarda copia de todo el material de trabajo en `proyecto/` (no se publica) | PabloFM pide poder archivar; coordinación, 2026-11-14 |
| JS en cliente | Prohibido en todo el sitio salvo UNA página: el asesor de La Barbarie | Coordinación, 2026-11-14 (reversible) |

## 2. Mapa del sitio (objetivo en talazbragoles.com)
Las direcciones que ya existen no cambian.

| Dirección | Qué es | Estado |
|---|---|---|
| `/` | Inicio | publicado |
| `/ediciones/`, `/ediciones/<slug>/` | Ediciones de las jornadas | publicado (1) · +1 en rama |
| `/cronologia/` | Línea temporal | publicado |
| `/personas/`, `/sistemas/` | Personas y sistemas de rol | publicado, vacío |
| `/fuentes/` | Fuentes del Archivo | publicado (2) · +2 en rama |
| `/mmo/` | Portada de MMO | hecho en rama |
| `/mmo/wow-forever/` | La Barbarie: asesor, guías, bandas, miembros | hecho en rama |
| `/mmo/wow-forever/guias/` y `/guias/<slug>/` | Guías de profesiones (HTML estático, colección `guides`) | hecho en rama (10 guías) |
| `/mmo/wow-forever/asesor/` | El asesor interactivo (generado desde `web/index.html`) | hecho en rama |
| `/rol/`, `/juegos/`, `/larp/`, `/eventos/` | Secciones futuras | sin contenido: no se publican páginas vacías |

Menú principal (hecho en rama): Inicio · Ediciones · Cronología · Sistemas · Personas · MMO · Fuentes. Las secciones sin contenido entran en el menú cuando tengan contenido.

## 3. Dónde vive cada cosa
| Contenido | Fuente de verdad | Formato |
|---|---|---|
| Archivo (fuentes, ediciones, cronología, personas, sistemas) | `repo/src/content/` | JSON / Markdown con esquema Zod |
| Guías de profesiones | `docs/guias/<slug>.md` → se copian a `repo/src/content/guides/` con `tools/sync-repo.py` | Markdown; reglas en `docs/guias/_REGLAS.md` |
| Datos del juego comprobados | `docs/asesoria.md` | dato · fuente · fecha |
| Asesor interactivo | `web/index.html` → `tools/build-asesor.py` genera la página del sitio | un archivo; estado en `localStorage` `wowf-chaman-v1` |
| Subidas de precios | `data/subastas/*.csv` | CSV exportado de la subasta |
| Fuentes candidatas (sin publicar) | `docs/fuentes-candidatas.md` | cita literal + lo que NO dice |
| Pruebas | `tests/` | `auditoria.js`, CSV de prueba |

## 4. Reglas de trabajo (todas las sesiones)
1. Un tema, una rama: `hermes/<tema>` desde `main`. Nunca commits en `main`. Dejar el clon en `main` y limpio al terminar.
2. Un archivo, un dueño a la vez. `web/index.html` solo lo edita la sesión coordinadora; las demás escriben en archivos propios (p. ej. una guía) y la coordinación integra.
3. Antes de tocar `web/index.html`: copia en `web/index-antes-<tema>.html`.
4. Nada inventado. Cada dato con fuente y fecha. Lo desconocido, «pendiente». Las contradicciones entre fuentes se anotan, no se resuelven a ojo.
5. Contenido ajeno: enlace y resumen propio. No copiar textos largos ni imágenes sin licencia libre.
6. Antes de dar algo por hecho: `npm run build` (repo) o `tests/auditoria.js` en los 16 anchos (prototipo).
7. Cada cambio actualiza su `.md`. Cada trabajo tiene tarjeta en el tablero Kanban; lo que una sesión no termina lo deja escrito en la tarjeta.
8. Secretos solo en `/opt/data/secrets/`. Nunca en el repo ni en el chat.

## 5. Ramas locales preparadas (sin publicar)
| Rama | Contenido | Build |
|---|---|---|
| `hermes/ci-build` | Workflow de build en cada PR | correcto |
| `hermes/dominio-canonico` | canonical, sitemap y robots → `www.talazbragoles.com` | correcto |
| `hermes/fuentes-archivo` | 2 fuentes, 5ª edición (1996, año deducido), 2 entradas de cronología | correcto (8 páginas) |

| `hermes/web-mmo` | **Las tres anteriores + sección MMO completa + `proyecto/`.** Es la que se publica | correcto (21 páginas) |

Todas esperan lo mismo: la GitHub App (tarjeta `t_29d0b62b`), que solo puede crear PabloFM con `docs/crear-github-app.html`.

Flujo para actualizar la rama: editar en la carpeta de trabajo → `git -C repo checkout hermes/web-mmo` → `python3 tools/sync-repo.py` → `npm run build` → commit → `git -C repo checkout main`.

## 6. Plan por fases
1. **Acceso** (bloqueado por PabloFM): GitHub App → tokens → CI → protección de `main`.
2. **Publicar lo preparado**: dominio, fuentes del Archivo.
3. **Guías de profesiones**: hechas y en la rama (2026-11-14). Falta: segunda pasada de contenido y sección «Para La Barbarie».
4. **Sección MMO en Astro**: hecha en la rama `hermes/web-mmo` (2026-11-14).
5. **Portada**: enlazar MMO desde la home. Imagen `/og.png`.
6. **Contenido pendiente del dueño**: rol de mesa, juegos, LARP, eventos; escaneos de La Runa.

## 7. Qué se puede archivar (2026-11-14)
Todo lo planeado en otras sesiones está recogido aquí, en el tablero o en la rama `hermes/web-mmo`:
- Sesión del prototipo y de la subida de precios AH1: `web/index.html`, `data/subastas/`, `docs/datos.md`, `docs/comercio.md`.
- Sesión de la GitHub App: `docs/github-app-propuesta.md`, `docs/crear-github-app.html`, `docs/produccion.md`, tarjetas `t_29d0b62b` y siguientes, ramas `hermes/ci-build` y `hermes/dominio-canonico`.
- Esta sesión: fuentes del Archivo, guías, estructura, sección MMO.

Esas conversaciones se pueden archivar sin perder nada. No archivar: las tarjetas abiertas del tablero ni la carpeta `/opt/data/project-talazbragoles`.
Copias antiguas del prototipo (`web/index-*.html`) y `web/guias/` (generado): prescindibles; siguen en la carpeta de trabajo, no en el repo.
