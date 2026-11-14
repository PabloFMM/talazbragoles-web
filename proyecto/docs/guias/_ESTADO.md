# Estado de las guías de profesión

Estado: revisadas (forma y muestreo) el 2026-11-14. Publicables en el prototipo. Contenido NO contrastado dato a dato ni probado en el juego.

## Qué se ha revisado
- Las 10 guías (12 profesiones) existen, con cabecera y secciones del formato de `_REGLAS.md`.
- Cada una enlaza sus fuentes (de 7 a 35 enlaces) y tiene secciones «Dudas y contradicciones» y «Pendiente».
- Dato comprobado por la coordinación abriendo la fuente: fundir bronce (Minería 65, 1 cobre + 1 estaño → 2 bronce) en WoW Forever DB. Coincide con la guía.
- Leída por encima: Ingeniería (cómo empezar y primeras recetas).
- Páginas generadas con `tools/build-guias.py` en `web/guias/`: 0 fallos en 176 vistas (11 páginas × 16 anchos).

## Qué falta
- Minería e Ingeniería: el redactor dejó páginas descargadas sin leer (Ingeniería: ruta de Wowhead solo hasta 257).
- Rutas de 225 a 300 de casi todas: datos de beta o de una sola fuente.
- Nombres en español del cliente: muchos pendientes (lista al final de cada guía).
- Sección «Para La Barbarie» (qué le conviene a cada miembro): sin escribir; faltan las profesiones de tres miembros.
- Segunda pasada: resolver contradicciones con pruebas en el juego de PabloFM.

## Cómo se actualiza
1. Editar `docs/guias/<slug>.md`.
2. `python3 tools/build-guias.py`.
3. Auditar `web/guias/*.html` en los 16 anchos.

Tarjeta de publicación en Astro: `t_ef769670` (espera a la GitHub App).
