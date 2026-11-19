# PR único: `hermes/rediseno` → `main`

Preparado el 2026-11-15 (tarjeta `t_4d16f210`). Se abre en cuanto exista la GitHub App (`t_29d0b62b`).
`origin/main` es ancestro de la rama: la fusión es directa, sin conflictos.

**Título:** Rediseño «Papel y tinta», sección MMO (La Barbarie, guías, asesor), CI, dominio canónico y fuentes del Archivo

**Descripción:**

Incluye todo lo preparado en `hermes/web-mmo` y el rediseño:

- Sistema de diseño «Papel y tinta» (blanco y negro, solo modo claro, Archivo + Source Serif 4 autoalojadas). Detalle en `proyecto/docs/diseno.md` y en `/diseno/` (noindex).
- Portada = Archivo de las Jornadas (frase con fuente + ediciones por año). Índice de 8 secciones, con `/rol/` y `/mmo/`.
- Sección MMO: La Barbarie, 10 guías de profesiones (tablas apilables en móvil) y el asesor (única página con JS; clave `wowf-chaman-v1` sin cambios).
- Archivo: 5ª edición (1996, año deducido) y dos fuentes nuevas.
- CI: check `build` en cada PR. Canonical, sitemap y robots → `www.talazbragoles.com`.

Comprobado en local sobre el build: 16 anchos (320-1440) sin fallos de letra, controles, contraste ≥7:1 ni scroll horizontal; axe-core sin avisos; teclado y foco visible; 0 enlaces internos rotos; las URL de producción siguen existiendo.

Tras fusionar: Vercel despliega `main`. PabloFM aprueba haciendo QA en producción; si algo falla, PR con `git revert`.
