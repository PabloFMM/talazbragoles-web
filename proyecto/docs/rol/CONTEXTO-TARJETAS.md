# Sección Rol: contexto común para las tarjetas (2026-11-23)

Léelo entero antes de empezar. Las tarjetas «Rol n/4» van EN SERIE en el mismo worktree.

## Qué es
PabloFM (dueño de talazbragoles.com, responde siempre en español) quiere convertir `/rol/` en un registro de juegos de rol: juegos, sistemas, licencias, autoría y editoriales, con buscador. Aprobó la propuesta `docs/rol/propuesta-rol-v1.html` (mapa de piezas, rutas, wireframes, plantilla `.md`, tabla de 14 juegos). LÉELA: es la especificación visual y de datos. Se ejecuta y luego se corrige con él en producción (no pide aprobaciones).

## Dónde
- Carpeta del proyecto: `/opt/data/project-talazbragoles` (docs en `docs/`, documento rector `docs/ESTRUCTURA.md`).
- Worktree: `/opt/data/project-talazbragoles/repo-rol`, rama `hermes/rol` (sale de `origin/main`). `node_modules` es un enlace a `repo-rediseno/node_modules`. NO tocar `repo/`, `repo-rediseno/` ni otros worktrees.
- Skills obligatorias: `talazbragoles-web` (reglas, trampas, receta de publicación) y `claude-design`.
- Leer `repo-rol/CLAUDE.md`, `docs/diseno.md` y `/diseno/` antes de maquetar.

## Decisiones (reversibles, por delegación; ver ESTRUCTURA.md)
1. Buscador SIN JavaScript: catálogo completo + páginas ya filtradas (por licencia abierta/CC/cerrada, por sistema, por género, por modo de juego). Nada de `<script>`.
2. Portadas: hueco tipográfico (título + sistema, con filete) del tamaño de la portada; campo `portada` opcional en el esquema (archivo, crédito, permiso). No descargar ni publicar imágenes de portadas.
3. Fase 1 = juegos, sistemas, licencias, autoría, editoriales. Fase 2 (mesas, campañas, sesiones, mundo, material) NO se hace; la colección `campaigns` existente se deja tal cual y la portada de /rol/ la anuncia como «en preparación».
4. Colección de sistemas ÚNICA: reutilizar/ampliar `systems` (hoy vacía) con un campo de dónde se jugó (jornadas / grupo); `/sistemas/` (Archivo) sigue mostrando solo lo de las Jornadas. Sistemas de rol actuales en `/rol/sistemas/`.
5. Cada juego = un `.md` en `src/content/juegos/` (frontmatter de la propuesta §3.5). Cada dato con fuente (url, qué afirma, fecha de consulta). Sin fuente → campo vacío → la página pinta «pendiente».
6. Ficha separa «licencia del juego» y «licencia del sistema»; el filtro «abierta» mira las dos.

## Juegos que se publican (identificados con seguridad)
Public Access (Jason Cordova, The Gauntlet, Carved from Brindlewood) · Trophy Dark (Jesse Ross; él dijo «Dark Trophy», anotar edición por confirmar) · Dungeon World · Root: The Roleplaying Game (Magpie Games) · Ironsworn (Shawn Tomkin) · Delta Green (Arc Dream) · Star Trek Adventures (Modiphius; edición pendiente) · La llamada de Cthulhu (Chaosium; edición pendiente) · Alice is Missing (Spencer Campbell) · Dungeons & Dragons 5.ª edición (WotC; 2014 o 2024 pendiente).
CONFIRMADOS por PabloFM (2026-11-23): «Bison» = Vaesen (Free League; su licencia abierta NO incluye Vaesen, fuente GeekNative 2026) · «Space Terror» = Mothership (Tuesday Knight Games; licencia de terceros con aprobación previa, no abierta: tuesdayknightgames.zendesk.com artículo 4412576594843) · Trophy = Trophy Dark (confirmado). Se publican.
«Numinia» = el juego de rol de numinia.com (Numen Games, Madrid; objetos CC0 según numinia.com/how-it-works; licencia del reglamento pendiente). Se publica. Es el proyecto del propio PabloFM: tono descriptivo.
«Dark Age» era Dungeon World (descartado como juego aparte).
Ediciones jugadas: D&D 5.ª (2014/2024 pendiente); La llamada de Cthulhu 7.ª; Star Trek Adventures 2.ª.
NUNCA nombrar a PabloFM en la web («según PabloFM» prohibido): sus datos se publican como dato del grupo, sin matices de duda.
Numinia: ficha y página propia con estado «En construcción»; sin mencionar relación personal ni LinkedIn.

## Ediciones, descargas y material (PabloFM, 2026-11-23)
- Ediciones = dato de primera clase: `juegos.ediciones[]` (nombre, año, editorial, idioma, traducción de, licencia por edición, la jugamos, descarga, fuentes).
- Descarga solo si la licencia de esa edición lo permite; enlace a la descarga OFICIAL, sin alojar archivos. Filtro «Se puede descargar».
- Idea futura, NO ahora: zona de material adicional (imprimibles 2D/3D, artefactos). Ediciones jugadas: ver arriba (D&D 5.ª con subedición pendiente; Cthulhu 7.ª; STA 2.ª). Esquema y estado de datos tras Rol 1b: `docs/rol/datos-fase1.md`.
Fuentes de licencia ya verificadas: tabla §4 de la propuesta (Trophy SRD CC BY 4.0 en trophyrpg.com/system; Dungeon World CC BY 3.0 en dungeonworldsrd.com/more-info; Ironsworn CC BY-NC-SA 4.0 libro + CC BY 4.0 SRD en tomkinpress.com/pages/licensing; SRD 5.1 CC BY 4.0 desde 27-1-2023; BRP bajo ORC en chaosium.com/orc-license; Cypher Open License; Blades SRD CC BY 3.0; Delta Green publishing guidelines; Root licencia oficial Leder→Magpie). Public Access: la licencia abierta de Carved from Brindlewood solo la cita un blog → buscar el texto oficial o dejar «por verificar».

## Reglas no negociables
Nada inventado; texto ≥16 px, controles ≥48 px, contraste ≥7:1, sin animaciones; sin JS; «Papel y tinta», sin color; responsive sin desbordes en 320–1440 px; `npm test` en verde (cómo: skill talazbragoles-web); commits pequeños en `hermes/rol`, nunca en `main`. Al tocar navegación, regenerar el asesor (sync-repo con `TZ_REPO=repo-rol`).
