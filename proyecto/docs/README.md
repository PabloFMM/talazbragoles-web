# README · Talazbrágoles (web local)

Documento índice. Pensado para IAs y personas que operen o mantengan la web.
Última revisión: 2026-11-13.

## Qué es
- Prototipo local de la web Talazbrágoles: archivo de unas jornadas de rol de los 90 + comunidad rolera activa.
- Un solo archivo `web/index.html` autocontenido (CSS y JS dentro, sin librerías).
- Secciones: Inicio, Archivo, Rol de mesa, MMO, Juegos, LARP, Eventos, Fuentes.
- LARP y Eventos de rol son secciones distintas, no una combinada.
- El WoW Forever (hermandad La Barbarie) es una sección (MMO) dentro de la web.
- Producción prevista: integrar en el repo Astro `talazbragoles-web` (talazbragoles.com). Pendiente de permisos.

## Documentos
- `ESTRUCTURA.md`: documento rector. Mapa del sitio, decisiones, reglas entre sesiones, ramas y fases. LEER PRIMERO.
- `README.md`: este índice.
- `guias/`: guías de profesiones de WoW Forever (`_REGLAS.md` formato y normas, `_ESTADO.md` estado de revisión).
- `datos.md`: modelo de datos (localStorage, formato CSV de la subasta, extracto AH0).
- `comercio.md`: reglas, recetas y algoritmos de la pestaña Comercio.
- `asesoria.md`: datos del juego comprobados, con fuente y fecha.
- `produccion.md`: checklist de paso a producción (GitHub App, protección de `main`, dominio, publicación).
- `fichas/fissel.md`, `fichas/woldrik.md`, `fichas/mortem.md`, `fichas/towerbrunnen.md`: miembros.
- `fuentes-candidatas.md`: fuentes nuevas del Archivo, con cita literal y JSON listos para el repo.
- `../tools/build-guias.py`: genera `web/guias/*.html` desde `docs/guias/*.md` (vista local).
- `../tools/build-asesor.py`: genera la página del asesor del sitio Astro desde `web/index.html`.
- `../tools/sync-repo.py`: lleva guías, asesor y este material al clon del repo (rama `hermes/<tema>`).
- `../tests/auditoria.js`: comprobación automática de tamaños y scroll (ver «Comprobación»).
- `../tests/subasta-prueba.csv`: CSV de prueba. Sus precios de equipo son inventados para probar; no son datos del juego.

## Estructura de la web (id de sección)
- `inicio` → qué es el sitio y cómo se trabaja.
- `archivo` → historia, ediciones, cronología, recuerdos, legado (contenido del repo Astro).
- `rol` → Rol de mesa. Contenido: pendiente.
- `mmo` → La Barbarie · WoW Forever: asesoría completa con 14 pestañas (la 13.ª, «Ayuda», tiene los comandos del chat, el banco de hermandad y el tabardo; 2026-11-15).
- `juegos` → sección de juegos. Contenido: pendiente (falta definir).
- `larp` → LARP (rol en vivo). Contenido: pendiente.
- `eventos` → Eventos de rol (jornadas). Contenido: pendiente.
- `fuentes` → fuentes del archivo y del juego, con fecha de comprobación.

## Pestañas de la sección MMO (id → pregunta)
- `hoy` → ¿Qué hago ahora? Lista calculada desde el resto.
- `pj` → Mi chamán: ficha, rotación, hitos, equipo por hueco.
- `equipo` → ¿Qué equipo busco? Sufijos y compras según la última subida.
- `prof` → ¿Cómo voy de profesiones?
- `almacen` → ¿Qué guardo y qué vendo?
- `oro` → ¿Cómo gano oro? Registro con gráfica.
- `subasta` (rótulo «Comercio») → subidas de precios, plan de inversión, calculadoras, libro.
- `diario` → diario, exportar e importar copia.
- `hermandad` → bandas, miembros, tablón.
- `tower`, `mortem`, `woldrik` → ficha de cada compañero.
- `wfuentes` → fuentes del juego.

## Cómo operarla (persona)
- Cambiar de sección: botones de la cabecera.
- Subir precios: MMO → Comercio → «Subir precios nuevos (CSV)» → archivo exportado de la subasta.
- Pedir un plan de inversión: Comercio → «Calcular plan».
- Tamaño de letra: botones A− y A+ (se recuerda). Tres tamaños: A− baja uno, A+ sube uno.
- Enlace directo: la dirección cambia con la sección (`#archivo`, `#mmo-subasta`…). Se puede guardar o enviar.
- Copia de seguridad: MMO → Diario → «Descargar copia (archivo)». Para recuperarla: «Cargar copia desde un archivo» y luego «Importar».
- Quitar una subida de precios: Comercio → «Quitar» en su fila (pide confirmar).

## Cómo operarla (IA)
- Estado local: `localStorage` clave `wowf-chaman-v1`. No cambiar la clave ni borrar campos.
- Campos nuevos: siempre en `norm()` con valor por defecto.
- Cambios:
  1. Editar `web/index.html`.
  2. Servir en local (p. ej. `python3 -m http.server 8765 --directory web`).
  3. Pasar la comprobación (ver abajo).
  4. Actualizar el documento .md que corresponda.

## Reglas de contenido
- Cada consejo lleva fuente y fecha de comprobación.
- Dato de beta o de Classic sin confirmar en Forever: etiqueta al lado.
- Nada inventado: lo desconocido queda «pendiente».
- Frases cortas. Una idea por tarjeta. Términos explicados la primera vez.
- Nombres de objetos: los del cliente en español.

## Estilo
- Dos estéticas documentadas:
  - Archivo (fanzine): papel `#f4f0e6`, tinta `#0f0f10`, bordes de 2 px, serif.
  - MMO La Barbarie (oscuro): fondo `#0e0908`, panel `#1c1210`, panel 2 `#2a1813`, borde `#5a2a1e`, texto `#f4e9d4`, secundario `#d2bfa0`, oro `#e7b552`, azul `#7fc0ee`, verde `#7fd27f`, naranja `#f0a050`, rojo claro `#ff8f80`.
- Tipografía: Georgia/Palatino. Cuerpo 18 px (16 px con A−). Interlineado 1,6. Títulos en versalitas.
- Cortes: 700 px y 1100 px. Primero móvil.
- Sin animaciones, sin transiciones, sin `alert`/`confirm`/`prompt`.

## Accesibilidad (obligatoria)
- Texto ≥ 16 px. Botones y campos ≥ 48 px. Casillas ≥ 28 px.
- Contraste ≥ 7:1 (verificado el 2026-11-13: 15 pares de color, todos ≥ 8:1 salvo ninguno por debajo de 7:1).
- Foco visible: contorno de 3 px (cian en claro, oro en oscuro).
- Confirmaciones: «¿Seguro? Pulsa otra vez» (`confirma()`), nunca `confirm()`.

## Comprobación antes de publicar (repetida el 2026-11-13, tarde)
- Herramienta: `tests/auditoria.js` (se evalúa en la página servida). Recorre 3 tamaños de letra × 8 secciones × 14 pestañas = 63 vistas.
- Anchos: 320, 360, 390, 414, 480, 540, 600, 640, 700, 768, 820, 900, 1024, 1100, 1280 y 1440 px.
- Resultado: 0 fallos en las 960 vistas. Sin scroll horizontal, texto ≥ 16 px, botones y campos ≥ 48 px, casillas ≥ 28 px, 0 errores de JavaScript.
- Probado a mano con `tests/subasta-prueba.csv`: subir CSV (con BOM, fila mala y nombre con apóstrofo), plan de inversión, compras por sufijo, buscador y «Usar», valor del almacén, meta de la montura, totales del libro, importación no válida, tamaños de letra, enlaces con `#`, estado antiguo con sección desconocida.
- Prueba de regresión del plan: con Minería 65, pólvora férrea ×415 a la venta y 25 de plata, sale exactamente el resultado documentado en `comercio.md` (62 pólvoras + 16 bronces; recupera 40 pl. 51 cobre).
- No probado: descarga real del archivo de copia y portapapeles (dependen del navegador del jugador); un CSV real de 2.991 filas.

## Cambios del 2026-11-13 (tarde)
- Errores corregidos:
  - La cabecera seguía fija en móvil (la regla estaba antes que `sticky` y no hacía efecto): ocupaba unos 550 px de 844. Ahora es fija solo desde 1100 px.
  - El plan de inversión calculaba la ganancia contra «vender el material» en vez de contra lo pagado. Ahora coincide con `comercio.md`.
  - El límite del 15 % no se aplicaba bien (mayúsculas, recetas que dan 2, menos de 7 a la venta) y el de materiales no existía.
  - Nombres con apóstrofo rompían «Usar» y «Quitar».
  - Un CSV con BOM colaba la cabecera como objeto; una fila con precio no numérico entraba a precio 0.
  - Las pérdidas salían como «pendiente» en la calculadora de fabricar.
  - Etiquetas dentro de texto pequeño bajaban a 14,3 px.
  - A−/A+ no dejaban volver al tamaño normal.
  - El botón de subir CSV no se alcanzaba con el teclado.
  - Sección o pestaña desconocida en el estado dejaba la página en blanco.
  - Importar una copia no válida no avisaba. Fallar al guardar tampoco.
- Funciones nuevas (ninguna añade campos al estado):
  - Equipo y Comercio: compras por sufijo y nivel según la última subida (regla de `comercio.md`).
  - Almacén: precio y valor de cada material; total con y sin comisión.
  - Oro: cuánto falta para la montura según el último apunte.
  - Libro: totales de compras, ventas y balance.
  - Hoy: aviso de precios viejos, próximo hito, «Datos que faltan por apuntar» con botón a cada pestaña.
  - Hermandad: tabla resumen de los cuatro personajes.
  - Copia: descargar y cargar archivo. Subidas: botón «Quitar».
  - Enlaces directos con `#`, título de página por sección, enlace «Saltar al contenido», `aria-current` en menús, hoja de impresión.
- Archivo: dos fuentes nuevas y la 5ª edición (1996, año deducido). Ver `fuentes-candidatas.md`.

## Límites conocidos
- Fundir bronce: resuelto el 2026-11-14. En Forever pide Minería 65 (Wowhead, WoW Forever DB, ForeverDB, Icy Veins). Con Minería 56, Fissel todavía no puede: la web no propone el bronce hasta que la habilidad apuntada llegue a 65. El resultado documentado del 2026-11-13 lo incluía por error.
- Guías de profesiones (`web/guias/`): redactadas desde páginas públicas, no probadas en el juego. Estado y carencias en `docs/guias/_ESTADO.md`.
- El plan usa el precio más bajo de cada material para todas las unidades. Si se compran muchas, las últimas pueden salir más caras. Se avisa en pantalla.
- Compras por sufijo: se busca el sufijo y el nivel entre paréntesis en el nombre. Probado solo con nombres de prueba; falta un CSV real.
- La subida completa de precios del 2026-11-13 08:16 (2.991 objetos) no está disponible fuera del artifact de Claude: la web incluye solo un extracto con los precios clave de `comercio.md`. Pendiente de integrar.
- Integrada (2026-11-13) una subida completa de 3.823 objetos (AH1, recibida a las 21:27 UTC; hora de exportación pendiente). Ver `datos.md`.
- Integrada (2026-11-15) una subida completa de 4.634 objetos (AH2, recibida a las 17:44 UTC; hora de exportación pendiente). Es la que usa la web por defecto. Ver `datos.md`.
- La base de datos compartida (`db`) del artifact no está conectada en el prototipo: los CSV se guardan solo en este navegador (máximo 6).
- La ficha de personajes del artifact (capturas base64) no está portada: campo `img` reservado en el estado.
- El HTML real del artifact (slug `31c048d5-0dec-48aa-9c43-1bce5782e570`) no es accesible desde aquí: la sección MMO está reconstruida desde su documentación.

## Producción (pendiente de permisos)
- Riesgos antes de pasar a producción:
  - Dos estéticas (fanzine claro + oscuro WoW): decidir si se unifican o se mantienen por sección.
  - Integrar el HTML real del artifact de Claude o mantener esta reimplementación.
  - Conectar la sincronización de precios (en el repo Astro haría falta un backend o un JSON versionado en el repo).
  - Dominio canonical: arreglado en local el 2026-11-13 (`astro.config.mjs`, `public/robots.txt`, `src/layouts/Layout.astro` → `https://www.talazbragoles.com`; `npm run build` correcto). Sin commit ni push. En producción sigue apuntando a `vercel.app` hasta que se publique.
  - Falta la imagen `/og.png` que anuncia el `Layout.astro` (hay un TODO en el código).
- Camino previsto: mover la sección MMO como página/ruta del repo Astro o como isla; contenido del archivo ya vive en las colecciones Astro.
