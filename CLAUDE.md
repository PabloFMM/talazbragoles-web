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
| Vercel | — | Despliegue (push a `main` = deploy automático) |

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
│   ├── systems/            # Sistemas de rol (.md / .mdx)
│   └── timeline/           # Eventos cronológicos (.json)
├── components/
│   ├── sistema/            # Sistema «Papel y tinta»: Encabezado, Titulo, Ficha, Estado, Pendiente, NotaFuente…
│   ├── archivo/            # RegistroEdiciones (ediciones por año), Migas
│   (MMO y guías: clases tz- de sistema.css §4.17; ya no hay MmoStyles)
├── layouts/
│   └── Layout.astro        # Layout único (cabecera, índice sin JS, pie-colofón)
├── lib/
│   ├── nav.ts              # mainNav (8 secciones)
│   ├── formato.ts          # Fechas parciales, etiquetas, anclas de fuente (solo presentación)
│   └── collections.ts      # Helpers tipados: getAllEditions(), getAllSources(), getAllCampaigns()…
├── pages/
│   ├── index.astro         # Portada: frase de qué fueron las Jornadas + ediciones por año
│   ├── fuentes.astro       # Listado de fuentes
│   ├── ediciones/
│   │   ├── index.astro     # Listado de ediciones
│   │   └── [slug].astro    # Ficha detallada
│   ├── cronologia/
│   │   └── index.astro     # Línea temporal
│   ├── sistemas/
│   │   └── index.astro     # Catálogo de sistemas
│   ├── personas/
│   │   └── index.astro     # Directorio de personas
│   ├── rol/
│   │   ├── index.astro     # Juegos de rol: campañas ACTUALES del grupo (colección campaigns)
│   │   └── [slug].astro    # Ficha de campaña: sesiones y personajes
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

### `people` — Personas

Archivos Markdown en `src/content/people/`. El cuerpo del `.md` es la biografía.

Campos frontmatter: `name`, `roles[]`, `active`, `links[]`, `editionIds[]`, `sourceIds[]`, `draft`.

### `systems` — Sistemas de rol

Archivos Markdown en `src/content/systems/`. El cuerpo es la descripción del sistema.

Campos frontmatter: `name`, `publisher`, `year`, `genre[]`, `editions[]`, `playedAtEditionIds[]`, `draft`.

### `guides` — Guías de juego (sección MMO)

Archivos Markdown en `src/content/guides/`. Frontmatter: `profesion`, `slug`, `tipo`, `comprobado`. Cada dato cita su fuente dentro del texto; las contradicciones entre fuentes se anotan, no se resuelven. Reglas de redacción: `proyecto/docs/guias/_REGLAS.md`.

### `timeline` — Cronología

Archivos JSON en `src/content/timeline/`.

Campos clave: `date` (ISO 8601 o parcial: `"1994"`, `"1994-05"`), `precision`, `title`, `category`, `sourceIds[]`, `verified`.

### `campaigns` — Campañas actuales del grupo (sección `/rol/`)

Archivos JSON en `src/content/campaigns/` (hoy vacía: no inventar campañas ni personajes). Distinto de `systems`, que es lo jugado en las Jornadas históricas.

Campos: `title`, `system`, `status` (`en-curso` | `en-pausa` | `terminada` | `pendiente`), `started`, `gm`, `summary`, `sessions[]` (`n`, `date`, `title`, `summary`), `characters[]` (`name`, `player`, `description`), `draft`.

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

Crea `src/content/editions/<slug>.json`:

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
editionIds: ["talazbragoles-sin-fecha-1"]
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

- El asesor NO se edita a mano: se genera con `proyecto/tools/build-asesor.py` desde `proyecto/web/index.html`.
- La clave de `localStorage` es `wowf-chaman-v1`. No cambiarla ni borrar campos del estado: los jugadores perderían sus datos.
- Reglas de lectura de la sección (público de más de 50 años): texto ≥ 16 px, botones ≥ 48 px, contraste ≥ 7:1, sin animaciones. Mismo sistema «Papel y tinta» que el resto (clases `tz-` de `sistema.css` §4.17: `tz-tabla`, `tz-lista-enlaces`, `tz-nota`, `tz-guia-reticula`). Las tablas del Markdown se apilan como fichas en cajas estrechas gracias a `src/lib/rehype-guias.mjs` (pone `data-etiqueta` en cada celda y quita el `# Título` de las guías).
- El índice del sitio tiene 8 entradas en 3 grupos (`gruposNav` de `src/lib/nav.ts`: Inicio · Archivo · Comunidad; componente `src/components/sistema/Indice.astro`). Por debajo de 1024 px es un botón «Menú» hecho con `<details>` (sin JS); desde 1024 px, una fila. `aria-current`: "page" en la portada de la sección, "true" en sus subpáginas. El asesor pinta la misma cabecera desde `build-asesor.py`: si cambias el índice, regenera el asesor (`tests/navegacion.spec.mjs` lo comprueba). Criterios WCAG/APG: `proyecto/docs/diseno.md` §6 bis.
- `proyecto/`: documentación, herramientas, pruebas y datos de trabajo. No se publica (está fuera de `public/`). Empezar por `proyecto/docs/ESTRUCTURA.md`.

---

## Reglas de diseño (no romper)

- **Sistema «Papel y tinta»** (2026-11-15): leer `proyecto/docs/diseno.md` y ver `/diseno/` antes de maquetar. Tokens y componentes en `src/styles/sistema.css` (prefijo `tz-`) y `src/components/sistema/`.
- **Paleta**: solo papel y tinta (`--papel: #f4f0e6`, `--tinta: #0f0f10`, `--tinta-2: #45413b` para texto secundario). Sin color de acento: los estados se marcan invirtiendo o engrosando filetes.
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

El repo está en GitHub (`PabloFMM/talazbragoles-web`). Vercel está conectado al branch `main`. Un `git push origin main` despliega automáticamente.

---

## Qué NO hacer

- No volver a meter Tailwind ni otro framework CSS: todo sale de los tokens de `sistema.css`.
- No añadir dependencias de runtime JS (React, Vue, Alpine, etc.) sin consenso.
- No publicar datos sin fuente en las colecciones.
- No modificar la URL del sitio en `astro.config.mjs` sin actualizar también `robots.txt`.
- No mover `src/content.config.ts` — debe estar en la raíz de `src/` (Astro 6 Content Layer).
