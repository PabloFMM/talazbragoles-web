# Paso a producción — talazbragoles.com

Checklist de preparación (creado 2026-11-13). Nada de esto está aplicado aún en el repo; es la lista de lo que falta.

## 1. Acceso de Hermes al repo (GitHub App)

Tarjeta Kanban `t_29d0b62b`. Pendiente de decisión del usuario: propuesta en `docs/github-app-propuesta.md` (2026-11-13). Alcance «plataforma» (multi-repo, panel): pendiente de definir, fuera de esta tarea.

Nota (2026-11-13): el repo no tiene `.github/workflows/` ni script `test`; hoy no hay checks de build/tests que exigir.

- [ ] Crear GitHub App instalada solo en `PabloFMM/talazbragoles-web`.
- [ ] Permisos mínimos: Contents R/W, Pull requests R/W, Checks/Actions lectura.
- [ ] Guardar la clave privada fuera del repo (credenciales de Hermes).
- [ ] Flujo propuesto: rama + PR → preview de Vercel → revisión → merge a `main` (= deploy).

## 2. Protección de `main`

Preparado 2026-11-14: rama local `hermes/ci-build` (commit `13fb991`) con `.github/workflows/build.yml` → check **`build`** (Node 22, `npm ci` + `npm run build`). Reproducido en un clon limpio: build correcto. Falta push + PR.

- [ ] Exigir PR para fusionar.
- [ ] Exigir checks verdes: `npm run build` + tests (los prepara PabloFM).

## 3. Errores conocidos a corregir en el repo

- [ ] (Preparado 2026-11-14 en la rama local `hermes/dominio-canonico`, commit `7d3d0c7`, build correcto: canonical, sitemap y robots apuntan a `https://www.talazbragoles.com`. Falta push + PR, bloqueado por la GitHub App.) Dominio: `astro.config.mjs` (`site`) y `src/layouts/Layout.astro` (fallback de `siteUrl`) apuntan a `https://talazbragoles-web.vercel.app`; deben ser `https://talazbragoles.com`. Según `CLAUDE.md`, actualizar también `public/robots.txt` (sitemap) a la vez.
- [ ] Decidir si se unifican las dos estéticas (fanzine B/N del repo vs. prototipo `web/index.html`).

## 4. Integración del prototipo local (`web/index.html`)

- [x] Decidido y hecho en la rama local `hermes/web-mmo` (2026-11-14): página aparte con excepción documentada en `CLAUDE.md`. El asesor se genera con `tools/build-asesor.py` en `public/mmo/wow-forever/asesor/index.html`. MMO, La Barbarie y las guías son páginas Astro estáticas. Build correcto (21 páginas). Falta push + PR (GitHub App).
- [x] `hermes/web-mmo` incluye también las ramas `hermes/ci-build`, `hermes/dominio-canonico` y `hermes/fuentes-archivo`: se publica todo en un solo PR.

## 5. Antes de cada publicación

- [ ] `npm run build` sin errores.
- [ ] Probar a 360, 390, 768 y 1280 px (y barrido intermedio 320–1440): sin scroll horizontal, 0 errores de JS.
- [ ] Accesibilidad: texto ≥16 px, botones ≥48 px, contraste ≥7:1, sin animaciones.
- [ ] Ningún dato sin fuente (regla documental).
