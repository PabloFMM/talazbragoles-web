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
| Tailwind CSS | 4.x | Estilos (vía plugin Vite, sin `tailwind.config.*`) |
| `@astrojs/sitemap` | latest | Sitemap automático |
| TypeScript | strict | Tipado completo |
| Vercel | — | Despliegue (push a `main` = deploy automático) |

**No hay JS en cliente.** Todo es HTML estático generado en build. No hay backend, base de datos ni API.

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
│   ├── ui/                 # Átomos: Badge, SourceRef, PendingBanner
│   ├── home/               # Secciones de la homepage
│   ├── editions/           # EditionCard, EditionDetail
│   └── sources/            # SourceCard
├── layouts/
│   └── Layout.astro        # Layout único (nav sticky + footer)
├── lib/
│   ├── nav.ts              # mainNav (secciones) y homeNav (anclas)
│   └── collections.ts      # Helpers tipados: getAllEditions(), getAllSources(), etc.
├── pages/
│   ├── index.astro         # Home (usa componentes home/)
│   ├── fuentes.astro       # Listado de fuentes
│   ├── ediciones/
│   │   ├── index.astro     # Listado de ediciones
│   │   └── [slug].astro    # Ficha detallada
│   ├── cronologia/
│   │   └── index.astro     # Línea temporal
│   ├── sistemas/
│   │   └── index.astro     # Catálogo de sistemas
│   └── personas/
│       └── index.astro     # Directorio de personas
└── styles/
    └── global.css          # Solo importa Tailwind
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

### `timeline` — Cronología

Archivos JSON en `src/content/timeline/`.

Campos clave: `date` (ISO 8601 o parcial: `"1994"`, `"1994-05"`), `precision`, `title`, `category`, `sourceIds[]`, `verified`.

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

## Reglas de diseño (no romper)

- **Paleta**: solo B/N + papel (`--paper: #f4f0e6`, `--ink: #0f0f10`). El acento cian (`--accent: #00f5d4`) solo para estados interactivos (focus, hover de subrayados).
- **Sin JS en cliente**: no añadir `<script>` ni frameworks de UI.
- **Sin dorados ni gradientes de color**: estética fanzine/fotocopia.
- **Accesibilidad**: mantener `aria-hidden` en decorativos, `focus-visible:ring`, `prefers-reduced-motion`.
- **Tailwind v4**: no existe `tailwind.config.*`. Los tokens CSS están en el `<style is:global>` de `Layout.astro`.

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

- No crear archivos `tailwind.config.*` — Tailwind 4 no lo necesita.
- No añadir dependencias de runtime JS (React, Vue, Alpine, etc.) sin consenso.
- No publicar datos sin fuente en las colecciones.
- No modificar la URL del sitio en `astro.config.mjs` sin actualizar también `robots.txt`.
- No mover `src/content.config.ts` — debe estar en la raíz de `src/` (Astro 6 Content Layer).
