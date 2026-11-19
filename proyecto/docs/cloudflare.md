# Pasar talazbragoles.com de Vercel a Cloudflare Pages

Decidido por PabloFM el 2026-11-19: Cloudflare se conecta a GitHub desde su panel y cada fusión en `main` se publica sola.
El DNS ya está en Cloudflare (servidores `cosmin` y `audrey.ns.cloudflare.com`).

## Preparado en el repo (rama `hermes/cloudflare`)
- `public/_headers`: sustituye a `vercel.json` (caché sin caducar de `asesor/datos/`, `fonts/` y `_astro/`, y cabeceras de seguridad básicas).
- `src/pages/404.astro` → `dist/404.html`. Sin este archivo, Pages trataría el sitio como una SPA y respondería 200 con la portada a cualquier dirección que no exista.
- `vercel.json` se queda hasta apagar Vercel.

## Pasos de PabloFM en el panel de Cloudflare (~5 min)
1. dash.cloudflare.com → **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git**.
2. Autorizar GitHub y elegir solo el repo `PabloFMM/talazbragoles-web`.
3. Configuración del build:
   - Production branch: `main`
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables: `NODE_VERSION` = `22`
4. **Save and Deploy**. Sale una dirección `https://<proyecto>.pages.dev`: pasársela a Hermes, que la comprueba antes de tocar el dominio.
5. Cuando Hermes dé el visto bueno, en el proyecto → **Custom domains**: añadir `www.talazbragoles.com` y luego `talazbragoles.com`. Cloudflare cambia los registros DNS solo: aceptar.
6. Redirigir el dominio sin www: **Rules → Redirect Rules** (zona talazbragoles.com) → plantilla «Redirect from root to WWW» (301, conservando ruta y parámetros).
7. Al confirmar que todo va: en Vercel, quitar los dominios del proyecto (o borrar el proyecto).

## Comprobaciones de Hermes
- En `*.pages.dev`: 200 en las 23 rutas, 404 de verdad en una ruta inventada, `_headers` aplicadas (`curl -I`), asesor con sus 5 `datos/*.json`.
- Tras el paso 5: lo mismo en `https://www.talazbragoles.com`, y `https://talazbragoles.com/x` → 301 a `https://www.talazbragoles.com/x`.
