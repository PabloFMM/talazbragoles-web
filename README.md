# Talazbragoles Web

Archivo web dedicado a preservar la memoria de las **Talazbrágoles**, unas jornadas de rol y simulación celebradas en la zona de Las Rozas / Majadahonda (Madrid, España).

> «Que lo unido por la fantasía no sea roto por la realidad.»

## Filosofía

**Rigor documental**: solo se publica lo que tiene fuente verificable. Lo que no tiene fuente se marca explícitamente como "pendiente de documentar". Esta regla está codificada en los esquemas de datos del proyecto.

## Stack

- [Astro 6](https://astro.build) — generación estática (SSG), sin JS en cliente
- [Tailwind CSS 4](https://tailwindcss.com) — estilos vía plugin Vite
- [Astro Content Layer](https://docs.astro.build/en/guides/content-collections/) — colecciones de contenido con validación Zod
- [Vercel](https://vercel.com) — despliegue automático desde `main`

## Arrancar en local

```bash
npm install
npm run dev      # http://localhost:4321
```

## Estructura de contenido

Todo el contenido vive en `src/content/` como archivos JSON o Markdown:

| Directorio | Tipo | Descripción |
|------------|------|-------------|
| `sources/` | JSON | Fuentes y bibliografía |
| `editions/` | JSON | Ediciones de las jornadas |
| `people/` | Markdown | Personas relevantes |
| `systems/` | Markdown | Sistemas de rol |
| `timeline/` | JSON | Eventos cronológicos |

Para añadir contenido, crea un archivo en el directorio correspondiente. El sitio se regenera en el siguiente build. Consulta [CLAUDE.md](./CLAUDE.md) para ver los esquemas completos y ejemplos.

## Comandos

| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor local en `localhost:4321` |
| `npm run build` | Build estático en `/dist` |
| `npm run preview` | Preview del build antes de desplegar |

## Despliegue

Push a `main` → Vercel despliega automáticamente.

## Contribuir

Si tienes material sobre las Talazbrágoles (programas, carteles, fotos, recortes de prensa), puedes:

1. Añadir la fuente en `src/content/sources/` siguiendo el esquema del proyecto
2. Actualizar o crear la edición correspondiente en `src/content/editions/`
3. Abrir un Pull Request

La norma es estricta: cada dato necesita su `sourceId`. Si el dato no tiene fuente, el campo va vacío o el `status` queda como `"pendiente"`.
