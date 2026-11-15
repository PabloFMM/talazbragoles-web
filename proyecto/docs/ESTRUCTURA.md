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
| Dos estéticas | ~~Tema oscuro solo dentro del asesor~~ → sustituida por «Rediseño» | Coordinación, 2026-11-14 |
| Rediseño | Estilo (precisado por PabloFM 2026-11-15): «algo actual, limpio y elegante». Blanco y negro sobrio y contemporáneo, NO estética de fotocopia ni recortes; del fanzine se queda solo la paleta. En TODO el sitio, asesor incluido (se acaba el tema oscuro). Portada centrada en el Archivo de las Jornadas: arriba una frase que explique qué fueron las Jornadas y debajo las ediciones por año (PabloFM, 2026-11-15). Solo tipografía (no hay logo, fotos ni ilustraciones). Logotipo: «Talazbrágoles» grande y en peso fino, con «Archivo de las Jornadas» debajo en pequeño (PabloFM, 2026-11-15). La Barbarie/asesor/guías: una entrada más del menú («MMO») al mismo nivel que Ediciones o Cronología, sin bloque propio en portada (PabloFM, 2026-11-15). Solo modo claro (papel y tinta), sin modo oscuro (PabloFM, 2026-11-15). Debe existir una sección de JUEGOS DE ROL (`/rol/`) en el menú aunque aún tenga poco contenido (PabloFM, 2026-11-15; anula «no se publican páginas vacías» para `/rol/`). El estilo «fotocopia» y el acento cian de `repo/CLAUDE.md` quedan sustituidos: actualizar ese archivo. Sin webs de referencia | PabloFM, 2026-11-15 |
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
| `hermes/rediseno` | **`hermes/web-mmo` entera + rediseño «Papel y tinta» (tarjetas 1-5).** Worktree en `repo-rediseno/`. **Es la rama del PR único** (2026-11-15): contiene todo `hermes/web-mmo` sin divergencias y `origin/main` es su ancestro (fusión fast-forward, 14 commits) | correcto (23 páginas) |

Tarjeta de publicación: `t_c67acf00`. **Un solo PR desde `hermes/rediseno`** (decidido en la QA final, tarjeta `t_4d16f210`, 2026-11-15): incluye todo `hermes/web-mmo`, así que no hace falta fusionar ramas; `hermes/web-mmo` queda como histórico. No se avanzó la rama `hermes/web-mmo` porque `repo/` tiene cambios sin guardar de otra sesión (batería Playwright/axe del 2026-11-14 y un Layout antiguo). Las tarjetas de CI, dominio, fuentes y guías solo comprueban su parte en producción.

Todas esperan lo mismo: la GitHub App (tarjeta `t_29d0b62b`), que solo puede crear PabloFM con `docs/crear-github-app.html`.

### QA final del rediseño (2026-11-15, tarjeta `t_4d16f210`)
Sobre el build de `hermes/rediseno` (23 páginas + asesor):
- `tests/auditoria-sitio.js` en 16 anchos (320-1440): 368 vistas, 0 fallos (letra ≥16 px, controles ≥48 px, contraste ≥7:1, sin scroll horizontal, sin `<script>`).
- Asesor con `tests/auditoria.js` a 320 y 1280: 0 fallos, 0 errores de JS (1.008 vistas en 16 anchos en la tarjeta 4/5).
- axe-core 4.14 (WCAG 2.0/2.1/2.2 A-AA + buenas prácticas + contraste mejorado AAA) en 24 páginas a 360 y 1280: corregidos los 2 avisos (título duplicado «Tipografía» en `/diseno/`; nombre accesible de A−/A+ en el asesor). Lighthouse no está instalado en el host.
- Teclado: primer Tab = «Saltar al contenido», que lleva a `#contenido`; todos los enlaces alcanzables, foco visible (contorno 3 px) y dentro de pantalla en todas las páginas a 360 y 1280; el «Índice» `<details>` se abre con Intro.
- Enlaces internos y anclas del build: 0 rotos (1.189 enlaces). Las 7 URL de producción siguen existiendo.
- Muro único para publicar: acceso de GitHub (GitHub App, `t_29d0b62b`).

Flujo para actualizar la rama de publicación (desde 2026-11-15): editar en la carpeta de trabajo → `TZ_REPO=repo-rediseno python3 tools/sync-repo.py` → `npm run build` en `repo-rediseno/` → commit en `hermes/rediseno`. (Antes: `repo/` en `hermes/web-mmo`.)

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
