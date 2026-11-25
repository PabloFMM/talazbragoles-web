# CLAUDE.md — Contexto para agentes de IA

Este archivo es leído automáticamente por Claude Code al inicio de cada sesión.
Contiene todo lo necesario para trabajar en el proyecto sin necesidad de explicaciones previas.

---

## ¿Qué es este proyecto?

**Talazbragoles-web** es un archivo web dedicado a preservar la memoria de las **Talazbrágoles**, unas jornadas de rol y simulación celebradas en la zona de Las Rozas / Majadahonda (Madrid).

Filosofía central: **rigor documental**. Solo se publica lo que tiene fuente verificable. Lo que no tiene fuente se marca explícitamente como "pendiente de documentar". Esta regla es arquitectónica, no solo editorial — está codificada en los esquemas Zod de las colecciones.

---

## Stack técnico

| Herramienta | Versión | Rol |
|-------------|---------|-----|
| Astro | 6.x | Framework SSG |
| CSS propio | — | `reset.css` + `sistema.css` («Papel y tinta»), sin framework (Tailwind retirado el 2026-11-17) |
| `@astrojs/sitemap` | latest | Sitemap automático |
| TypeScript | strict | Tipado completo |
| Cloudflare Workers | — | Despliegue (archivos estáticos de `dist/`; cada cambio en `main` se construye solo) |

**No hay JS en cliente**, con una única excepción documentada: `public/mmo/wow-forever/asesor/index.html` (el asesor de La Barbarie, ver «Sección MMO»). Todo lo demás es HTML estático generado en build. No hay backend, base de datos ni API.

---

## Estructura del proyecto

```
src/
├── content.config.ts       # Esquemas Zod + loaders (Content Layer API de Astro 6)
├── content/
│   ├── sources/            # Fuentes documentales (.json)
│   ├── editions/           # Ediciones de las jornadas (.json)
│   ├── people/             # Personas relevantes (.md / .mdx)
│   ├── systems/            # Sistemas de rol, de las Jornadas y del grupo (.md / .mdx)
│   ├── timeline/           # Eventos cronológicos (.json)
│   ├── juegos/             # Rol: un .md por juego que juega el grupo
│   ├── licencias/          # Rol: qué permite cada licencia
│   ├── autoria/            # Rol: personas autoras de juegos
│   ├── editoriales/        # Rol: editoriales originales y en castellano
│   ├── modulos/            # Rol fase 2: ficha de cada módulo (<slug>.md) y sus secciones (<slug>/<nn>-<sección>.md)
│   ├── mesas/              # Rol fase 2: grupos de juego, sin nombres de personas
│   └── campanas/           # Rol fase 2: campañas jugadas (reparto, jornadas, aportaciones)
├── components/
│   ├── sistema/            # Sistema «Papel y tinta»: Encabezado, Titulo, Ficha, Estado, Pendiente, NotaFuente…
│   ├── archivo/            # RegistroEdiciones (ediciones por año, portada), RielEdiciones (riel de años de /ediciones/<año>/), Migas
│   (MMO y guías: clases tz- de sistema.css §4.17; ya no hay MmoStyles)
├── layouts/
│   └── Layout.astro        # Layout único (cabecera, índice sin JS, pie-colofón)
├── lib/
│   ├── nav.ts              # mainNav (8 secciones)
│   ├── formato.ts          # Fechas parciales, etiquetas, anclas de fuente (solo presentación)
│   └── collections.ts      # Helpers tipados: getAllEditions(), getAllSources(), getAllCampanas()…
├── pages/
│   ├── index.astro         # Portada: frase de qué fueron las Jornadas + ediciones por año
│   ├── fuentes.astro       # Listado de fuentes
│   ├── ediciones/
│   │   ├── index.astro     # Todos los años (portada o hueco, estado, nº de documentos), de la más reciente a la más antigua
│   │   ├── [anio]/index.astro      # /ediciones/1997/ … /ediciones/sin-fecha/: riel de años + 01 visual · 02 qué se hizo · 03 organización · 04 lugar · 05 papeles · 06 fuentes
│   │   └── [anio]/[documento].astro # /ediciones/1997/folleto/: documento con caras y texto literal
│   ├── cronologia/
│   │   └── index.astro     # Línea temporal
│   ├── sistemas/
│   │   └── index.astro     # Catálogo de sistemas
│   ├── personas/
│   │   └── index.astro     # Directorio de personas
│   ├── rol/
│   │   ├── index.astro     # Portada de Rol: dos «puertas» con imagen, Ludoteca (juegos, sistemas, licencias, autoría, editoriales) y Crónicas (módulos, campañas, mesas); después, lo que hemos jugado (PortadaJuego)
│   │   ├── juegos/index.astro   # Catálogo de juegos con bloque «Filtrar» (componente CatalogoRol)
│   │   ├── juegos/[slug].astro  # Ficha de juego: datos con enlaces cruzados, ediciones y descargas, licencia, fuentes, parecidos
│   │   ├── juegos/descargables.astro, en-castellano.astro, [criterio]/[valor].astro
│   │   │                        # Páginas ya filtradas (sin JS): licencia/, sistema/, genero/, modo/, formato/ (lib/rol-filtros.ts)
│   │   ├── sistemas/            # index (familias y derivados) y [slug] (ficha, juegos también vía derivados)
│   │   ├── licencias/           # index (abiertas / no abiertas) y [slug] (qué permite, punto por punto, quién la usa; slug con puntos)
│   │   ├── autoria/ y editoriales/  # index y [slug]: juegos y sistemas de cada persona o editorial
│   │   ├── modulos/index.astro            # /rol/modulos/: módulos publicados
│   │   ├── modulos/[modulo]/index.astro   # Portada del módulo: ficha, Conflicto de Partida, cómo usarlo, índice, descarga
│   │   ├── modulos/[modulo]/[seccion].astro  # Una página por sección: migas, índice interno (plegado < 64rem), anterior/siguiente
│   │   ├── modulos/[modulo].md.ts         # /rol/modulos/<modulo>.md: el módulo entero en Markdown (CC0), imágenes con URL absoluta
│   │   ├── campanas/index.astro y [slug].astro  # La aventura: aviso de destripe, ficha, reparto, jornada a jornada, la verdad de la mesa, Registro del Tesaurum Verba
│   │   └── mesas/index.astro y [slug].astro     # La mesa: ficha, quiénes somos, campañas
│   └── diseno.astro        # /diseno/: muestrario interno del sistema (noindex)
└── styles/
    ├── global.css          # Punto de entrada: importa reset.css y sistema.css
    ├── reset.css           # Reinicio mínimo (lo que antes ponía el preflight de Tailwind)
    └── sistema.css         # Sistema de diseño: tokens y componentes tz-
```

---

## Colecciones de contenido

Definidas en `src/content.config.ts` con Astro Content Layer + loaders `glob()`.

### `sources` — Fuentes documentales

Archivos JSON en `src/content/sources/`.

Campos clave: `title`, `url`, `asserts` (qué afirma), `type` (testimonio/prensa/etc.), `broken` (enlace caído), `tags`, `relatedEditions[]`, `relatedPeople[]`.

### `editions` — Ediciones de las jornadas

Archivos JSON en `src/content/editions/`.

Campos clave: `year` (número o `"desconocida"`), `title`, `status` (`documentada` | `parcial` | `pendiente`), `verified`, `venue`, `organizer`, `activities[]`, `sourceIds[]`.

Desde 2026-11-23 (Ediciones 1/2): el NOMBRE DEL ARCHIVO es la ruta (`1997.json` → `/ediciones/1997/`, `sin-fecha.json` → `/ediciones/sin-fecha/`); las rutas viejas (`talazbragoles-1997-sexta`…) redirigen con 301 en `public/_redirects` (Cloudflare Workers). Campos nuevos, todos opcionales (vacío = «pendiente»): `numero` (`romano`, `entero`), `anioEstado` (`estado` confirmado/deducido, `sourceIds[]`, `nota`; sus fuentes también en `sourceIds`), `fechas`, `horario`, `apoyo`, `asistencia`, `venue.comoLlegar`, `venue.hoy`, `organizacion` (`equipo[]`, `asociacion`, `patrocinadores[]`, `nota`), `portada` (`imagen`, `ancho`, `alto`, `alt`, `documento`). `documentos[]` lleva `slug` (antes `id`) y `apartado` (`papeles` | `objetos` | `prensa` | `fotos` | `recuerdos`); los que tienen `caras` generan `/ediciones/<año>/<slug>/`. Un objeto de época (pin) es un documento de una sola cara: foto ≤ 800 px en `public/documentos/pines/`, inscripción en `texto`, motivo en `nota`; en los años sin folleto es la `portada`. Un documento puede llevar `tabla` (`titulo`, `nota`, `columnas`, `filas`; «—» = celda vacía): su página la pinta como tabla accesible que se apila en móvil (lista de mesas de 1995). `anioEstado.estado` puede ser `atribuido` (el objeto no lleva año) y `numero.deducido` marca los números contados hacia atrás desde el folleto de 1997. Orden en todo el sitio: de la más reciente a la más antigua (`getAllEditions()`); rutas con `hrefEdicion()`/`hrefDocumento()`. Lo vigila `tests/ediciones.test.mjs`.

### `people` — Personas

Archivos Markdown en `src/content/people/`. El cuerpo del `.md` es la biografía.

Campos frontmatter: `name`, `roles[]`, `active`, `links[]`, `editionIds[]`, `sourceIds[]`, `draft`.

### `systems` — Sistemas de rol

Archivos Markdown en `src/content/systems/`. El cuerpo es la descripción del sistema. Colección ÚNICA para las Jornadas y para el grupo actual.

- `jugadoEn`: `["jornadas"]` (valor por defecto; sale en `/sistemas/`, Archivo, vía `getSistemasJornadas()`) o `["grupo"]` (sección Rol, vía `getSistemasRol()`).
- Campos de las Jornadas (en inglés): `name`, `publisher`, `year`, `genre[]`, `editions[]`, `playedAtEditionIds[]`, `draft`.
- Campos de Rol (en castellano): `nombreCorto`, `familia` (sistema padre, `reference("systems")`), `origen`, `ano`, `autoria[]`, `editorial[]`, `licencia` (licencia del sistema), `srd` (`nombre`, `url`, `alcance`), `enlaces[]`, `dudas[]`, `fuentes[]`.

### Sección Rol: `juegos`, `licencias`, `autoria`, `editoriales` (fase 1, 2026-11-23)

Markdown en `src/content/<colección>/<slug>.md`. Se enlazan con `reference()`; `tests/rol-referencias.test.mjs` comprueba que cada slug existe (Astro no lo hace ni en `astro check` ni en el build).

- **Fuentes por dato**: cada ficha lleva `fuentes: [{ datos: [campos], url, afirma, consultado, secundaria? }]`. El esquema (`exigeFuentes()` en `content.config.ts`) RECHAZA un campo con valor si ninguna fuente lo nombra en `datos`. Sin fuente → campo vacío → la página pinta «pendiente». `secundaria: true` = Wikipedia, prensa o reseñas (no la editorial ni el autor).
- `juegos`: `titulo`, `tituloCastellano`, `estado` (vacío = publicado; `en-construccion`), `edicion` (texto, solo si la edición jugada no se puede marcar en `ediciones[]`), `ano`, `ediciones[]`, `autoria[]`, `editorial[]`, `editorialCastellano[]`, `sistema`, `licenciaJuego[]` (`licencia`, `alcance`; distinta de la del sistema), `generos[]`, `modo[]` (`con-dj`, `sin-dj`, `solitario`), `formato[]`, `jugadores` (`min`, `max`, `nota`), `jugado` (`nosotros`, `ultima`; dato del grupo, sin fuente web), `portada` (opcional: `archivo` = imagen de `src/assets/rol/portadas/` vía `image()`, `titulo`, `edicion`, `credito`, `ilustracion`, `permiso`; exige una fuente con `datos: ["portada"]` = página oficial de donde sale; 12 de 13 la tienen, Numinia no; componentes `PortadaJuego` y `CreditoPortada`), `enlaces[]`, `dudas[]` (preguntas abiertas, en impersonal), `fuentes[]`, `draft`. Cuerpo: 2-4 frases propias de qué es el juego.
- **Ediciones** (`juegos.ediciones[]`, dato de primera clase): `nombre`, `ano`, `editorial` (ref), `idioma` (`en`/`es`), `traduccionDe` (nombre de otra edición del mismo juego), `licencia` (ref, por edición), `jugadaPorNosotros` (bool, dato del grupo), `descarga` opcional `{url, formato, licencia}` y `fuentes[]` propias (mínimo una; `exigeFuentes` también aquí). Descarga SOLO si la licencia de esa edición lo permite (abierta) o es gratuita en la web oficial, y siempre el enlace oficial: no alojamos archivos. El test comprueba refs, `traduccionDe` y descargas.
- **Nunca nombrar a PabloFM** (ni «según…», «lo dictó») en lo que se publica: lo que afirma el grupo sale como dato del grupo. Quién lo dijo, solo en `proyecto/docs`. Lo vigila `tests/rol-sin-nombres.test.mjs`.
- `licencias`: `nombre`, `nombreCorto`, `tipo` (`cc`, `orc`, `abierta-propia`, `dominio-publico` = abiertas; `politica-de-uso`, `con-aprobacion`, `fans`, `cerrada`), `url`, `permite` (`comercial`, `adaptar`, `atribucion`, `compartirIgual`), `fuentes[]`. Cuerpo: qué permite, en castellano llano.
- `autoria` y `editoriales`: `nombre`, `web`, `fuentes[]`. `autoria` es distinta de `people` (personas de las Jornadas).
- Helpers en `lib/collections.ts`: `getAllJuegos()`, `getSistemasRol()`, `getAllLicencias()`, `getAllAutoria()`, `getAllEditoriales()`, `resuelveJuego()` (resuelve referencias y ediciones; calcula `licencias` = todas las que tocan al juego (juego, sistema, ediciones, descargas), `abierto` = alguna de ellas abierta, `estado`, `edicionesJugadas`/`edicionJugadaTexto`, `descargas` = descargas de ediciones + SRD del sistema, `descargable` (cualquiera de ellas) y `descargaJuego` (alguna EDICIÓN descargable: filtro «Se puede descargar»)), `juegosDescargables()`, `juegosDeSistema()` (incluye los de sistemas derivados, con `via`), `linajeSistema()`, `derivadosDeSistema()`, `juegosDeLicencia()`, `usosDeLicencia()`, `sistemasDeLicencia()`, `juegosDeEditorial()` y `papelesDeEditorial()` (miran también las ediciones), `juegosDePersona()`, `sistemasDeAutoria()`, `sistemasDeEditorial()`, `esAbierta()`. Etiquetas de los enums en `lib/formato.ts` (`generoRol`, `modoJuego`, `formatoPartida`, `tipoLicencia`, `estadoJuego`, `dondeSeJugo`, `idiomaEdicion`…).
- Buscador sin JS: `lib/rol-filtros.ts` (`filtrosRol()` = juegos resueltos + grupos de filtros con sus juegos; una opción sin juegos no se publica) y componentes `Filtros` y `CatalogoRol`. Filtro nuevo = una opción en `construye()`; si su ruta tiene una sola parte, hace falta su `.astro` en `pages/rol/juegos/`. Rutas de Rol en `lib/rol-rutas.ts` (`hrefLicencia` termina en barra: los ids llevan puntos). `Datos` admite `enlaces` (dato con enlaces a otras fichas).
- Idea futura, sin colección: «material adicional» (imprimibles 2D/3D). Ver `proyecto/docs/rol/datos-fase1.md`.
- Estado de los datos y pendientes por juego: `proyecto/docs/rol/datos-fase1.md`.

### `guides` — Guías de juego (sección MMO)

Archivos Markdown en `src/content/guides/`. Frontmatter: `profesion`, `slug`, `tipo`, `comprobado`. Cada dato cita su fuente dentro del texto; las contradicciones entre fuentes se anotan, no se resuelven. Reglas de redacción: `proyecto/docs/guias/_REGLAS.md`.

### `timeline` — Cronología

Archivos JSON en `src/content/timeline/`.

Campos clave: `date` (ISO 8601 o parcial: `"1994"`, `"1994-05"`), `precision`, `title`, `category`, `sourceIds[]`, `verified`.

### Crónicas de mesa: `modulos`, `seccionesModulo`, `mesas`, `campanas` (Rol fase 2, 2026-11-24)

Sustituyen a la antigua `campaigns` (JSON vacío con `gm` y `player`). Markdown. Decisiones en `docs/rol/cronicas/` de la carpeta del proyecto de trabajo (CONTEXTO.md y CONTEXTO-TARJETAS.md). NO se archivan en `proyecto/docs/` (el repo es público y CONTEXTO.md nombra a quien dirigió): no lanzar `sync-repo.py` sin excluir esa carpeta. Versiones anotadas con fuentes en `proyecto/material/<módulo>/`.

- **Privacidad (no saltarse nunca):** en `campanas` y `mesas` los jugadores salen SOLO con su personaje y quien dirige, como «DJ» (`direccion: "DJ"`). Los objetos son `.strict()` (un campo `jugador`, `gm`… rompe el build) y `buscaPersonas()` de `src/lib/privacidad.mjs` rechaza claves de persona y nombres reales en cualquier texto. La única persona real nombrada es la autoría del módulo base, en `modulos`. Lo vigila `tests/rol-sin-nombres.test.mjs`.
- `modulos` (`src/content/modulos/<slug>.md`): ficha del módulo. `titulo`, `juego` (ref), `tipo`, `licencia` (`"cc0-1.0"`, literal), `autoria`, `dificultad`, `duracion`, `jugadores`, `ambito`, `conflicto` (Conflicto de Partida), `resumen`, `campana` (ref a la aventura de nuestra mesa). Cuerpo: «Cómo usar este módulo».
- `seccionesModulo` (`src/content/modulos/<slug>/<nn>-<sección>.md`, id `<slug>/<nn>-<sección>`): una página por sección. `modulo` (ref), `orden`, `slug` (ruta), `titulo`, `licencia` y `autoria` (las de la ficha), `resumen`. Cuerpo LIMPIO: sin `<!-- -->`, sin «Decisiones de redacción», sin nombres de PJ ni nada que sea solo de nuestra mesa (`tests/rol-cronicas.test.mjs`). Empieza en `##` (el h1 lo pone la página). Imágenes: `![alt](../../../assets/rol/<módulo>/<nn>-<nombre>.jpg)` con el pie en cursiva en la LÍNEA SIGUIENTE (mismo párrafo: la página lo convierte en `<figure>`).
- `mesas`: `nombre`, `resumen`, `lugar` (`en-linea` | `presencial` | `mixta`), `herramientas[]`, `direccion` (`fija` | `rotatoria`). Cuerpo: quiénes somos, sin nombres.
- `campanas`: `titulo`, `juego`, `mesa`, `modulo` (refs), `estado` (+ `estadoNota`), `fechas` (`inicio`, `fin`, `nota`), `numeroJornadas` (`n`, `aproximado`), `versionManual`, `licencia` (`"cc-by-4.0"`), `atribucion`, `direccion: "DJ"`, `aviso` (destripe), `resumen`, `reparto[]` (`personaje`, `posicion`, `especie`, `concepto`, `escena`, `nota`), `jornadas[]` (`n`, `titulo`, `quePaso`, `estado`: `documentado` | `deducido` | `pendiente`), `aportaciones[]` (ficha «Registro del Tesaurum Verba»: `nombre`, `tipo`, `grado` `aportacion` | `consolidada` | `inscrita` | `prevista`, `personaje` del reparto, `jornada`, `minuto`, `comoSeConsolido`, `manual` {`version`, `capitulo`} obligatorio si está inscrita, `queCambio`, `pendiente`). Cuerpo: «La verdad de nuestra mesa».
- Lo que falta se escribe `(pendiente: qué)` en el Markdown; `src/lib/rehype-guias.mjs` lo pinta como `<span class="tz-pendiente">` en estas colecciones.
- Helpers: `getAllCampanas()`, `getAllMesas()`, `campanasDeMesa()`, `getAllModulos()`, `seccionesDeModulo()`; etiquetas en `lib/formato.ts` (`estadoCampana`, `estadoJornada`, `gradoAportacion`, `lugarMesa`, `direccionMesa`). Referencias, orden de secciones, imágenes y aportaciones: `tests/rol-referencias.test.mjs`.
- **Páginas (Rol 7/8, 2026-11-24)**: rutas en `lib/rol-rutas.ts` (`hrefModulo`, `hrefSeccionModulo`, `hrefModuloMd`, `hrefCampana`, `hrefMesa`, `anclaAportacion`). `/rol/` enlaza módulos, campañas y mesas desde la puerta «Crónicas» (2026-11-25; antes «Crónicas de mesa»; la otra puerta, «Ludoteca», sustituye a «Por dónde seguir»); la ficha de un juego con campañas o módulos añade la sección «Crónicas» (Lo jugamos · Módulo · Aportaciones al Corpus Numiniense, con ancla a cada ficha del Tesaurum Verba). El cuerpo de una sección empieza por sus apartados (`##`): no repetir el título de la sección (el h1 lo pone la página). Clases en `sistema.css` §4.17 septies. Lo vigila `tests/rol-cronicas-publicado.test.mjs` (sobre `dist/`).
- **Imágenes del módulo**: tercera excepción de imagen (`proyecto/docs/diseno.md` §2 ter). `rehype-guias.mjs` (`figurasModulo`) convierte «imagen + pie en cursiva» en `<figure class="tz-modulo-imagen">` y pide a Astro WebP con `srcset` 480/800/1200. OJO: el build reutiliza el HTML ya renderizado de las colecciones; tras tocar un plugin rehype, `npx astro sync --force` antes del build.

---

## Cómo añadir contenido

### Nueva fuente

Crea `src/content/sources/<slug>.json`:

```json
{
  "title": "Título descriptivo de la fuente",
  "url": "https://...",
  "asserts": "Qué afirma exactamente esta fuente.",
  "type": "testimonio",
  "date": "2005",
  "broken": false,
  "tags": ["testimonio", "Majadahonda"],
  "relatedEditions": [],
  "relatedPeople": []
}
```

### Nueva edición

Crea `src/content/editions/<año>.json` (el nombre del archivo es la ruta):

```json
{
  "year": 1996,
  "title": "Talazbrágoles '96",
  "verified": false,
  "status": "parcial",
  "venue": { "city": "Las Rozas" },
  "sourceIds": ["slug-de-la-fuente"],
  "peopleIds": [],
  "activities": []
}
```

### Nueva persona

Crea `src/content/people/<slug>.md`:

```markdown
---
name: "Nombre Apellido"
roles: ["organizador"]
verified: true
draft: false
editionIds: ["sin-fecha"]
sourceIds: ["comunidad-umbria-2012"]
---

Texto biográfico en Markdown.
```

---

## Sección MMO

| Ruta | Qué es | Origen |
|------|--------|--------|
| `/mmo` | Portada de MMO | `src/pages/mmo/index.astro` |
| `/mmo/wow-forever` | La Barbarie (hermandad de WoW Forever) | `src/pages/mmo/wow-forever/index.astro` |
| `/mmo/wow-forever/guias` y `/guias/<slug>` | Guías de profesiones | colección `guides` |
| `/mmo/wow-forever/asesor/` | Asesor interactivo (JS + `localStorage`) | `public/…/asesor/index.html`, GENERADO |

- El asesor NO se edita a mano: se genera con `proyecto/tools/build-asesor.py` desde `proyecto/web/index.html`. Las subidas de la subasta incluidas van en `public/mmo/wow-forever/asesor/datos/subasta-s<n>-<resumen>.json` (copias de `proyecto/web/datos/`, también generadas) y el asesor las carga con `fetch` al arrancar. El nombre cambia con el contenido, así que `vercel.json` las sirve con caché sin caducar (`immutable`): no editar un archivo de datos sin cambiarle el nombre.
- La clave de `localStorage` es `wowf-chaman-v1`. No cambiarla ni borrar campos del estado: los jugadores perderían sus datos.
- Reglas de lectura de la sección (público de más de 50 años): texto ≥ 16 px, botones ≥ 48 px, contraste ≥ 7:1, sin animaciones. Mismo sistema «Papel y tinta» que el resto (clases `tz-` de `sistema.css` §4.17: `tz-tabla`, `tz-lista-enlaces`, `tz-nota`, `tz-guia-reticula`). Las tablas del Markdown se apilan como fichas en cajas estrechas gracias a `src/lib/rehype-guias.mjs` (pone `data-etiqueta` en cada celda y quita el `# Título` de las guías).
- El índice del sitio tiene 8 entradas en 3 grupos (`gruposNav` de `src/lib/nav.ts`: Inicio · Archivo · Comunidad; componente `src/components/sistema/Indice.astro`). Por debajo de 1024 px es un botón «Menú» hecho con `<details>` (sin JS); desde 1024 px, una fila. `aria-current`: "page" en la portada de la sección, "true" en sus subpáginas. El asesor pinta la misma cabecera desde `build-asesor.py`: si cambias el índice, regenera el asesor (`tests/navegacion.spec.mjs` lo comprueba). Criterios WCAG/APG: `proyecto/docs/diseno.md` §6 bis.
- `proyecto/`: documentación, herramientas, pruebas y datos de trabajo. No se publica (está fuera de `public/`). Empezar por `proyecto/docs/ESTRUCTURA.md`.

---

## Reglas de diseño (no romper)

- **Sistema «Papel y tinta»** (2026-11-15): leer `proyecto/docs/diseno.md` y ver `/diseno/` antes de maquetar. Tokens y componentes en `src/styles/sistema.css` (prefijo `tz-`) y `src/components/sistema/`.
- **Paleta**: solo papel y tinta (`--papel: #f4f0e6`, `--tinta: #0f0f10`, `--tinta-2: #45413b` para texto secundario). Sin color de acento: los estados se marcan invirtiendo o engrosando filetes.
- **Portadas de Rol (imagen en color)**: las portadas OFICIALES de los juegos de Rol (2026-11-23): solo de la web de la editorial o del autor, guardadas en el repo, con crédito y enlace debajo, filete fino, sin redondeos ni sombras. Ver `proyecto/docs/diseno.md` §2 bis. La otra excepción son los documentos de época del Archivo (`.tz-documento`); ninguna imagen más (la auditoría las marca).
- **Tipografías**: Archivo (texto e interfaz, sin remates) y Source Serif 4 (logotipo y titulares, peso fino), autoalojadas en `public/fonts/` (SIL OFL 1.1). Nada de fuentes externas.
- **Mínimos**: texto ≥ 16 px, controles ≥ 48 px, contraste ≥ 7:1, sin animaciones ni transiciones. Nada de `text-xs`, `text-black/60`, `rounded-*`, sombras ni texturas.
- **Sin JS en cliente**: no añadir `<script>` ni frameworks de UI (única excepción: el asesor, ver «Sección MMO»).
- **Estilo** (PabloFM, 2026-11-15): actual, limpio y elegante. Blanco y negro sobrio; nada de fotocopia, sellos, recortes, texturas, dorados ni degradados.
- **Accesibilidad**: mantener `aria-hidden` en decorativos y el foco visible (contorno de tinta de 3 px, definido en `sistema.css`).
- **Sin Tailwind** (retirado el 2026-11-17): no se usaba ninguna utilidad y su escáner metía en el CSS clases sacadas de la documentación (`.hidden`, `.table`, `.text-xs`…). Tokens y componentes en `src/styles/sistema.css`; `reset.css` es el reinicio mínimo.

---

## Regla documental (no saltarse nunca)

> Si no hay fuente verificable, no se afirma como hecho.

- Nunca añadir datos (`year`, `organizer`, `venue`) en una edición sin poner el `sourceId` correspondiente.
- Si un dato es incierto, usar `status: "pendiente"` o `verified: false`.
- Los campos `asserts` en las fuentes deben ser precisos: qué afirma exactamente, no qué queremos que afirme.

---

## Comandos habituales

```bash
npm run dev       # Servidor local en localhost:4321
npm run build     # Build estático en /dist
npm run preview   # Preview del build
```

## Despliegue

El repo está en GitHub (`PabloFMM/talazbragoles-web`). Cloudflare Workers (proyecto `talazbragoles-web`, config en `wrangler.jsonc`) construye y publica cada cambio en `main`: `npm run build` + `npx wrangler deploy`. Para que se dispare, la app de GitHub «Cloudflare Workers and Pages» de la cuenta PabloFMM debe tener este repositorio en «Repository access» (añadido el 2026-11-23). Tras fusionar, comprobar que aparece el check de Cloudflare en el commit. Pasos de la migración: `proyecto/docs/cloudflare.md`.

---

## Qué NO hacer

- No volver a meter Tailwind ni otro framework CSS: todo sale de los tokens de `sistema.css`.
- No añadir dependencias de runtime JS (React, Vue, Alpine, etc.) sin consenso.
- No publicar datos sin fuente en las colecciones.
- No modificar la URL del sitio en `astro.config.mjs` sin actualizar también `robots.txt`.
- No mover `src/content.config.ts` — debe estar en la raíz de `src/` (Astro 6 Content Layer).
