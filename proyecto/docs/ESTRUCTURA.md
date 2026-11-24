# Estructura de la web y coordinación

Documento rector. Creado el 2026-11-14 por la sesión coordinadora (encargo de PabloFM: «ahora lo lideras tú»).
Quien trabaje en el proyecto (persona o IA) lee esto primero y después `README.md`.

## 1. Decisiones tomadas
| Tema | Decisión | Quién y cuándo |
|---|---|---|
| Folleto de 1997 (documento de época) | Se publican las 4 caras escaneadas y su texto literal en la ficha de la edición: el folleto es material propio de las Jornadas y hay permiso. Excepción a «no se copian textos ni imágenes ajenos» y a «solo tipografía» (componente `.tz-documento`). Original y restauración en `documentos-historicos/1997-vi-jornadas/folleto/` (movido 2026-11-23; el repo guarda su copia en `proyecto/documentos-historicos/`) | PabloFM, 2026-11-23 |
| Ediciones: orden y forma (aprobada, tarjetas t_d03a65c6 → t_896bc03a) | De la más reciente a la más antigua. Años en un riel a la derecha (como el desplazador de fechas de una galería de fotos); al elegir un año cambia el contenido de la izquierda (sin JS: una página por año, `/ediciones/1997/`). Dentro de cada edición, primero lo visual (cartel/portada) y después qué se hizo, organización (cambiaba cada año), lugar exacto, papeles/prensa/fotos, fuentes. Propuesta: `docs/ediciones/propuesta-v1/index.html`; `documentos-historicos/` ya ordenado así (una carpeta por edición, I-IV con año deducido) | PabloFM, 2026-11-23 |
| Dominio canónico | `https://www.talazbragoles.com` (el dominio sin www ya redirige a www) | PabloFM delega; coordinación, 2026-11-14 |
| Fuentes nuevas del Archivo | Se publican como enlace + resumen propio. No se copian textos ni imágenes ajenos (no son de dominio público) | PabloFM (condición) + coordinación, 2026-11-14 |
| Guías de profesiones | Sí: todas las profesiones de WoW Forever, una guía por profesión | PabloFM, 2026-11-14 |
| Publicación | Hermes trabaja en ramas, fusiona con checks en verde y publica; PabloFM hace QA en producción | PabloFM, 2026-11-13 |
| Dos estéticas | ~~Tema oscuro solo dentro del asesor~~ → sustituida por «Rediseño» | Coordinación, 2026-11-14 |
| Rediseño | Estilo (precisado por PabloFM 2026-11-15): «algo actual, limpio y elegante». Blanco y negro sobrio y contemporáneo, NO estética de fotocopia ni recortes; del fanzine se queda solo la paleta. En TODO el sitio, asesor incluido (se acaba el tema oscuro). Portada centrada en el Archivo de las Jornadas: arriba una frase que explique qué fueron las Jornadas y debajo las ediciones por año (PabloFM, 2026-11-15). Solo tipografía (no hay logo, fotos ni ilustraciones). Logotipo: «Talazbrágoles» grande y en peso fino, con «Archivo de las Jornadas» debajo en pequeño (PabloFM, 2026-11-15). La Barbarie/asesor/guías: una entrada más del menú («MMO») al mismo nivel que Ediciones o Cronología, sin bloque propio en portada (PabloFM, 2026-11-15). Solo modo claro (papel y tinta), sin modo oscuro (PabloFM, 2026-11-15). Debe existir una sección de JUEGOS DE ROL (`/rol/`) en el menú aunque aún tenga poco contenido (PabloFM, 2026-11-15; anula «no se publican páginas vacías» para `/rol/`). El estilo «fotocopia» y el acento cian de `repo/CLAUDE.md` quedan sustituidos: actualizar ese archivo. Sin webs de referencia | PabloFM, 2026-11-15 |
| Contenido pendiente de PabloFM | Sede de la edición sin fechar → «pendiente» (la fuente no la afirma). Sin medio de contacto: se quitan las invitaciones a escribir hasta que lo haya | Coordinación por delegación («dale caña»), 2026-11-17 (reversible) |
| Una sola rama de publicación | Todo lo preparado va junto en `hermes/web-mmo` (un solo PR) | Coordinación, 2026-11-14 |
| Archivo del proyecto | El repo guarda copia de todo el material de trabajo en `proyecto/` (no se publica) | PabloFM pide poder archivar; coordinación, 2026-11-14 |
| JS en cliente | Prohibido en todo el sitio salvo UNA página: el asesor de La Barbarie | Coordinación, 2026-11-14 (reversible) |
| Menú y navegación | Índice en 3 grupos sin desplegables: Inicio · Archivo (Ediciones, Cronología, Sistemas, Personas, Fuentes) · Comunidad (Rol, MMO); números 01-08 según ese orden (Fuentes 06, Rol 07, MMO 08). Móvil: botón «Menú» con icono + «Estás en: …». `aria-current` "page"/"true" (patrón GOV.UK). El asesor lleva la misma cabecera. Criterios en `docs/diseno.md` §6 bis | Encargo de PabloFM («usa todos los estándares»), tarjeta `t_f77da12d`, 2026-11-17 (reversible) |
| Sección Rol (encargo) | PabloFM, 2026-11-23: antes de producción, wireframes y propuestas que él acepte. Fase 1: juegos (empezando por los que hemos jugado y los de licencia abierta/CC), sistemas abiertos, licencias, autoría y editoriales, con buscador por criterios; portadas con peso y un `.md` por juego. Fuera por ahora: tiendas y otros clubes. Fase 2: mesa/club → campaña → sesión → mundo y material. Propuesta v1 en `docs/rol/propuesta-rol-v1.html` (pendiente de su respuesta: buscador con/sin JS, portadas y derechos, nombres dudosos, ámbito de «abierto», «file overwrite», privacidad de jugadores) | PabloFM, 2026-11-23 |
| Sección Rol: decisiones reversibles para arrancar | PabloFM aprobó la propuesta v1 y pidió ejecutar y corregir sobre la marcha (2026-11-23). Tomadas por delegación hasta que responda: (1) buscador SIN JS: páginas ya filtradas por licencia, sistema y género; (2) portadas: hueco tipográfico con el título hasta tener foto propia o permiso del editor; el campo `portada` existe en el esquema; (3) solo se publican los juegos identificados con seguridad; «Dark Age», «Bison», «Numenia» y «Space Terror» esperan respuesta; (4) se dan de alta solo los sistemas de nuestros juegos; (5) colección de sistemas única con campo «dónde se jugó»; (6) la fase 2 (mesas/campañas) no empieza todavía. Trabajo en el worktree `repo-rol/` (rama `hermes/rol`) | Hermes por delegación, 2026-11-23 |
| Rol: ediciones, descargas y material | PabloFM, 2026-11-23: las fichas recogen las ediciones de cada juego (muy común); descarga cuando la licencia de esa edición lo permita; zona de material adicional (imprimibles 2D/3D, artefactos) = idea para más adelante, no ahora. Ediciones jugadas: D&D 5.ª, Cthulhu «la última» (7.ª), Star Trek Adventures «la última» (2.ª). «Dark Age» era Dungeon World | PabloFM, 2026-11-23 |
| Rol: respuestas de fase 1 y privacidad | PabloFM, 2026-11-23 (2.ª sesión): D&D jugado = 5.ª de **2014**; Mothership = **0e**; La llamada de Cthulhu 7.ª **en castellano (Edge)**. Licencias sin texto oficial (Public Access/Carved from Brindlewood, Root, Alice is Missing): se buscó otra vez en editorial/autor; sin texto oficial siguen «pendiente» (Root gana el año 2021, blog de Magpie). **Portadas: se usan las oficiales** (él: «no es un problema, la web no tiene ánimo de lucro»), con crédito y enlace a la fuente; tarjeta en el tablero (triage) para contactar con cada autor y editorial. **Fase 2: los jugadores salen solo con su personaje** (nadie identificable). «File overwrite» = filosofía **file over app**; estudiar numinia.org y su NWOS, que se adoptará «en un futuro cercano» | PabloFM, 2026-11-23 |
| Rol: NWOS y fase 2 | PabloFM, 2026-11-23: el NWOS se aparca («más adelante»); el estudio queda en `docs/rol/file-over-app-nwos.md` sin aplicar. Ahora toca planificar las portadas (¿«catatulas» = carátulas?) y la fase 2: estructura de las sesiones, de la sesión 0 a las siguientes; él irá pasando enlaces a donde están las sesiones, poco a poco | PabloFM, 2026-11-23 |
| Rol: fase 2 = clubes | PabloFM, 2026-11-23: la fase 2 gira en torno a los CLUBES; cada club tendrá su página y cada juego mostrará los clubes que lo han jugado (la misma información vista desde dos lados). En el futuro, la plataforma de Numinia será el gestor de comunidades. Propuesta en `docs/rol/propuesta-fase2-v1.html` (club → campaña → sesión 0 → sesiones → personajes/mundo/material), con 8 preguntas; no se toca la web hasta su visto bueno | PabloFM, 2026-11-23 |
| Rol: autoría de los datos y Numinia | PabloFM, 2026-11-23: no se le nombra en los textos de la web; lo que él afirma se da por bueno y se publica como dato del grupo (Cthulhu 7.ª, Star Trek Adventures 2.ª sin «probable»). Numinia: ficha y página propia en estado «En construcción» | PabloFM, 2026-11-23 |

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
| `/rol/` | Registro de juegos de rol del grupo: lo que hemos jugado, accesos, «Crónicas de mesa: en preparación» (fase 2) | publicado 2026-11-23 (PR #7) |
| `/rol/juegos/`, `/rol/juegos/<slug>/` | Catálogo con bloque «Filtrar» y 13 fichas de juego (ediciones, licencias, descargas oficiales, fuentes) | publicado 2026-11-23 |
| `/rol/juegos/{licencia,sistema,genero,modo,formato}/<valor>/`, `/rol/juegos/descargables/`, `/rol/juegos/en-castellano/` | Buscador sin JS: 23 páginas ya filtradas | publicado 2026-11-23 |
| `/rol/sistemas/`, `/rol/licencias/`, `/rol/autoria/`, `/rol/editoriales/` (+ `<slug>/`) | Fichas cruzadas de sistemas (9), licencias (13), autoría (19) y editoriales (20) | publicado 2026-11-23 |
| `/rol/campanas/<slug>/` | Campañas (fase 2, colección `campaigns` vacía) | sin páginas |
| `/juegos/`, `/larp/`, `/eventos/` | Secciones futuras | sin contenido: no se publican páginas vacías |

Menú principal (hecho en rama): Inicio · Ediciones · Cronología · Sistemas · Personas · MMO · Fuentes. Las secciones sin contenido entran en el menú cuando tengan contenido.

## 3. Dónde vive cada cosa
| Contenido | Fuente de verdad | Formato |
|---|---|---|
| Archivo (fuentes, ediciones, cronología, personas, sistemas) | `repo/src/content/` | JSON / Markdown con esquema Zod |
| Guías de profesiones | `docs/guias/<slug>.md` → se copian a `repo/src/content/guides/` con `tools/sync-repo.py` | Markdown; reglas en `docs/guias/_REGLAS.md` |
| Datos del juego comprobados | `docs/asesoria.md` | dato · fuente · fecha |
| Asesor interactivo | `web/index.html` → `tools/build-asesor.py` genera la página del sitio | un archivo + subidas en `web/datos/*.json` (se cargan con fetch); estado en `localStorage` `wowf-chaman-v1` |
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
- Teclado: primer Tab = «Saltar al contenido», que lleva a `#contenido`; todos los enlaces alcanzables, foco visible (contorno 3 px) y dentro de pantalla en todas las páginas a 360 y 1280; el «Menú» `<details>` se abre con Intro (desde 2026-11-17 el botón dice «Menú»; navegación y criterios WCAG en `docs/diseno.md` §6 bis).
- Enlaces internos y anclas del build: 0 rotos (1.189 enlaces). Las 7 URL de producción siguen existiendo.
- Muro único para publicar: acceso de GitHub (GitHub App, `t_29d0b62b`).

Flujo para actualizar la rama de publicación (desde 2026-11-15): editar en la carpeta de trabajo → `TZ_REPO=repo-rediseno python3 tools/sync-repo.py` → `npm run build` en `repo-rediseno/` → commit en `hermes/rediseno`. (Antes: `repo/` en `hermes/web-mmo`.)

## 6. Plan por fases
1. **Acceso** (bloqueado por PabloFM): GitHub App → tokens → CI → protección de `main`.
2. **Publicar lo preparado**: dominio, fuentes del Archivo.
3. **Guías de profesiones**: hechas y en la rama (2026-11-14). Falta: segunda pasada de contenido y sección «Para La Barbarie».
4. **Sección MMO en Astro**: hecha en la rama `hermes/web-mmo` (2026-11-14).
5. **Portada**: enlazar MMO desde la home. Imagen `/og.png`: hecha el 2026-11-17 (`tools/og-imagen.mjs`).
6. **Contenido pendiente del dueño**: rol de mesa, juegos, LARP, eventos; escaneos de La Runa.

## 7. Qué se puede archivar (2026-11-14)
Todo lo planeado en otras sesiones está recogido aquí, en el tablero o en la rama `hermes/web-mmo`:
- Sesión del prototipo y de la subida de precios AH1: `web/index.html`, `data/subastas/`, `docs/datos.md`, `docs/comercio.md`.
- Sesión de la GitHub App: `docs/github-app-propuesta.md`, `docs/crear-github-app.html`, `docs/produccion.md`, tarjetas `t_29d0b62b` y siguientes, ramas `hermes/ci-build` y `hermes/dominio-canonico`.
- Esta sesión: fuentes del Archivo, guías, estructura, sección MMO.

Esas conversaciones se pueden archivar sin perder nada. No archivar: las tarjetas abiertas del tablero ni la carpeta `/opt/data/project-talazbragoles`.
Copias antiguas del prototipo (`web/index-*.html`) y `web/guias/` (generado): prescindibles; siguen en la carpeta de trabajo, no en el repo.
