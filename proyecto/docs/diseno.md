# Sistema de diseño «Papel y tinta»

Rediseño de talazbragoles.com (encargo de PabloFM, 2026-11-15). Tarjeta 1/5: `t_6bd8248f`.
Estilo (PabloFM, 2026-11-15, manda sobre el encargo inicial de «fanzine»): **actual, limpio y elegante**. Blanco y negro sobrio, mucho aire, retícula clara, filetes finos, jerarquía por tamaño y peso. Nada de fotocopia, máquina de escribir, recortes, sellos, texturas, dorados ni degradados. Solo tipografía: no hay logo gráfico, fotos ni ilustraciones. Solo modo claro (sin `prefers-color-scheme`).

- Código: `repo/src/styles/sistema.css` (tokens + componentes, prefijo `tz-`), `repo/src/styles/global.css` (punto de entrada: `reset.css` + `sistema.css`; sin Tailwind desde 2026-11-17), `repo/src/layouts/Layout.astro` (cabecera, índice, pie), `repo/src/components/sistema/*.astro`, `repo/src/lib/nav.ts` (8 entradas).
- Muestrario vivo: `/diseno/` (noindex, fuera del sitemap por el filtro de `astro.config.mjs`).
- Rama: `hermes/rediseno` (desde `hermes/web-mmo`), en el worktree `/opt/data/project-talazbragoles/repo-rediseno/` porque `repo/` tiene cambios sin guardar de otra sesión. Tiene su propio `node_modules` (ya no es un enlace a `repo/node_modules`: las dependencias de las dos ramas difieren).
- Auditoría: `tests/auditoria-sitio.js` (ver §8).

## 1. Principios
1. Jerarquía con tipografía, no con cajas: tamaño, peso y espaciado. Sin sombras, esquinas redondeadas, degradados ni texturas.
2. Solo papel y tinta. Sin color de acento: los estados se marcan con relleno de tinta, filete o borde vacío.
3. Mucho aire: secciones separadas por `--aire` (48→96 px), texto a una medida legible (`--medida`).
4. Detalles editoriales discretos: filetes finos, numeración de secciones (01, 02…), antetítulos, notas al margen.
5. Lo desconocido se ve: etiqueta «pendiente» o bloque de hueco (`Pendiente`). Nunca huecos en silencio.
6. Reglas fijas: texto ≥ 16 px, controles ≥ 48 px, contraste ≥ 7:1, sin animaciones ni transiciones (anuladas en `sistema.css`), sin JS (salvo el asesor).

## 2. Color
| Token | Valor | Uso | Contraste sobre papel |
|---|---|---|---|
| `--papel` | `#f4f0e6` | Fondo | — |
| `--papel-2` | `#ebe5d8` | Recuadros discretos (hueco «pendiente») | tinta 15,3:1 · tinta-2 8,1:1 |
| `--tinta` | `#0f0f10` | Texto, filetes de estructura, rellenos | 16,8:1 |
| `--tinta-2` | `#45413b` | Texto secundario (metadatos, entradillas, notas) | 8,9:1 |
| `--filete` | `#b8b2a5` | SOLO filetes divisorios finos. NUNCA texto | decorativo |

El cian `#00f5d4` anterior desaparece. Alias de compatibilidad para estilos antiguos: `--paper`, `--paper-2`, `--ink`, `--ink-2`, `--line`, `--line-2`, `--accent` (= tinta), `--nav-offset`. No usarlos en código nuevo.

## 3. Tipografía
Dos familias variables autoalojadas en `repo/public/fonts/` (subconjunto latín, cubre el español), licencia SIL OFL 1.1 (textos `OFL-*.txt` junto a los archivos). Procedencia: paquetes npm `@fontsource-variable/archivo` y `@fontsource-variable/source-serif-4`, copiados a mano (no son dependencias del proyecto). Las dos redondas se precargan en el `<head>`.

| Familia | Token | Archivo | Uso |
|---|---|---|---|
| Archivo (sin remates) | `--letra-texto`, `font-sans` | `archivo-wdth-wght.woff2` | texto corrido, interfaz, menú, rótulos, botones |
| Source Serif 4 (remates limpios, tamaño óptico) | `--letra-titular`, `font-serif` | `source-serif-4-opsz-wght.woff2` + `-italic` | logotipo, titulares y títulos, citas |

Respaldo: «Helvetica Neue»/Arial y Georgia. El subconjunto latín no trae `№`: usar «Nº». (Las flechas `→` del muestrario salen con letra del sistema.)

Escala (razón ≈ 1,25 sobre 18 px):

| Token | px | Uso |
|---|---|---|
| `--t-6` | 44 → 120 (fluido) | titular de portada (`tz-titular--portada`) |
| `--t-logo` | 40 → 80 (fluido) | logotipo |
| `--t-5` | 40 → 76 (fluido) | titular de página, `h1` (`tz-titular`) |
| `--t-4` | 38 | título de sección `h2` desde 768 px (`tz-titulo`) |
| `--t-3` | 28 | título de sección en móvil |
| `--t-2` | 22 | entradilla (24 desde 768), título de ficha |
| `--t-1` | 18 (19 desde 768 px) | texto corrido |
| `--t-0` | 16 | rótulos, metadatos, notas. MÍNIMO ABSOLUTO |

Pesos: `--p-fino` 300 (logotipo y titulares grandes; en tinta pura cumple 16,8:1), `--p-normal` 400, `--p-medio` 500, `--p-semi` 600. Interlineado: titular 1,04 · título 1,18 · texto 1,6. Rótulos: Archivo, mayúsculas, espaciado 0,1–0,14 em.

## 4. Espaciado y retícula
- Espacios, base 4 px: `--e-1` 4 · `--e-2` 8 · `--e-3` 12 · `--e-4` 16 · `--e-5` 24 · `--e-6` 32 · `--e-7` 48 · `--e-8` 64 · `--e-9` 96 · `--e-10` 128.
- Caja `--pagina` 76 rem (1216 px); margen `--margen` fluido 20→56 px; medianil `--medianil` 16→40 px; `--aire` 48→96 px entre secciones.
- Medida del texto `--medida` 40 rem (≈ 70 caracteres).
- `.tz-pagina`: caja centrada. `.tz-reticula`: 1 columna; 12 desde 768 px.
- `.tz-con-margen`: texto + columna de notas al margen (`.tz-margen`, `--columna-margen` 15 rem) desde 1024 px; en móvil la nota va debajo.
- Filetes: `--f-fino` 1 px · `--f-medio` 2 px. `--toque` 48 px (alto mínimo de controles y enlaces del menú).

## 5. Componentes (`src/components/sistema/`)
| Componente (props) | Clases | Qué hace |
|---|---|---|
| `Logo` (`href`) | `tz-logo`, `tz-logo-nombre`, `tz-logo-sub` | «Talazbrágoles» en Source Serif 4 fino a `--t-logo` y «Archivo de las Jornadas» debajo en Archivo 16 px, mayúsculas espaciadas. Enlaza a la portada. Cabe a 320 px |
| `Encabezado` (`titulo`, `numero`, `seccion`, `entradilla`, `portada`) | `tz-encabezado`, `tz-antetitulo`, `tz-titular`, `tz-entradilla` | Cabeza de página: antetítulo (número + sección), el único `h1`, entradilla |
| `Titulo` (`id`, `numero`, `nivel`) | `tz-titulo` | `h2`/`h3` con filete fino de tinta encima y número «01» |
| `Filete` (`tipo`: fino, suave, medio, corto) | `tz-filete`, `tz-filete--*` | Separador `<hr>` |
| `Ficha` (`titulo`, `numero`, `estado`, `datos[]`, `href`, `enlace`, `nivel`) | `tz-ficha*`, `tz-datos`; rejilla `tz-fichas` | Ficha de archivo. Un dato vacío (`null`, `""`) se pinta «pendiente», no se omite. Pie con enlace de 48 px |
| `Estado` (`estado`: documentada, parcial, pendiente) | `tz-estado--*` | Marca de estado: cuadro lleno / medio / vacío + texto. Mismos valores que el esquema de ediciones |
| `Pendiente` (`mensaje`, `pide`, `etiqueta`) | `tz-pendiente` (en línea), `tz-hueco` (bloque) | Sin props: etiqueta en línea. Con `mensaje`/`pide`: bloque digno para secciones con poco contenido (lo usa `/rol/`) |
| `Cita` (`texto`, `autor`, `fuente`, `url`, `fecha`, `origenPendiente`) | `tz-cita` | Cita en Source Serif cursiva con atribución obligatoria; si no se sabe el origen, `origenPendiente` |
| `NotaFuente` (`n`, `titulo`, `url`, `tipo`, `fecha`, `consulta`, `afirma`, `reserva`, `caido`, `id`) | `tz-fuentes` (el `<ol>`), `tz-fuente*` | Nota numerada con tipo, fechas, «Dice:» (`asserts`) y «Reservas:». Recibe los campos de la colección `sources`. `id` = id de la fuente: en `/fuentes/` cada nota es el ancla `/fuentes#<id>` a la que enlazan las demás páginas |

### Componentes del Archivo (`src/components/archivo/`, tarjeta 2/5)
| Componente (props) | Clases | Qué hace |
|---|---|---|
| `RegistroEdiciones` (`ediciones`, `conTexto`, `nivel`) | `tz-registro`, `tz-registro-*` | Ediciones por año: año grande en serif fino a la izquierda (desde 768 px), título, estado, sede y nº de fuentes. Año desconocido = «Año pendiente», al final. `conTexto` añade la descripción (en `/ediciones/`) |
| `Migas` (`pasos[]`) | `tz-migas` | «Ediciones › 1996». Enlaces de 48 px; el último paso no enlaza |

Clases nuevas (`sistema.css` §4.16): `tz-portada-frase` (h1 de portada: la frase que explica las Jornadas), `tz-portada-ref`, `tz-enlace-bloque` («Ver ficha ›», 48 px), `tz-crono`/`tz-crono-*` (cronología: fecha a la izquierda), `tz-resumen` (bloques de menos peso de la portada), `tz-recuento`, `tz-acciones`.
Formato compartido (sin datos): `src/lib/formato.ts` (`partesFecha`, `fechaLarga` «14 de noviembre de 2026», etiquetas de categoría y estado, `plural`, `anclaFuente`).

### MMO y guías (tarjeta 3/5, `sistema.css` §4.17)
| Clase | Qué hace |
|---|---|
| `tz-tabla` | Tabla de datos: filete de tinta de 2 px arriba, filetes finos entre filas, sin rellenos. Dentro de un `tz-contenedor` (consulta de contenedor), si la caja mide ≤ 44 rem cada fila se apila como una ficha: la cabecera se oculta (sigue para lectores de pantalla) y cada celda muestra su etiqueta encima (`data-etiqueta`); entre 30 y 44 rem, etiqueta a la izquierda. Una tabla corta (3 columnas de cifras) va SIN `tz-contenedor` y se queda como tabla |
| `tz-contenedor` | `container-type: inline-size`. El artículo de la guía lo lleva |
| `tz-lista-enlaces` (`-nombre`, `-detalle`, `-flecha`; `--una` = una columna) | Lista de filas-enlace: nombre en serif, detalle en tinta-2, «›» a la derecha. Guías y accesos |
| `tz-nota` | Nota de lectura («Cómo leer esta guía»): papel-2 y filete de tinta. No es «pendiente» |
| `tz-guia-reticula`, `tz-guia-margen`, `tz-indice-guia`, `tz-guia` | Página de guía: nota + índice numerado (enlaces de 48 px) antes del texto en móvil y en columna al margen desde 1024 px; la prosa a `--medida` y las tablas a todo el ancho; `h2` con filete |
| `tz-datos--ancho` | `tz-datos` con etiqueta de 11 rem (nombres de personaje) |
| `tz-encabezado--tras-migas` (prop `trasMigas` de `Encabezado`) | Encabezado justo debajo de unas `Migas` |
| `tz-cmd`, `.tz-prosa code` | Monoespaciada a 1 em (no `monospace` a secas: baja a 13 px) |

- Markdown: `repo/src/lib/rehype-guias.mjs` (en `astro.config.mjs`) pone `data-etiqueta`, la clase `tz-tabla` y roles ARIA en todas las tablas, y quita el `# Título` de las guías (el `h1` lo pone `Encabezado`). `tools/build-guias.py` hace lo mismo para `web/guias/`.
- `MmoStyles.astro` y las clases `mmo-*` ya no existen.

Otras clases: `tz-rotulo`, `tz-subtitulo`, `tz-lista-numerada`, `tz-prosa` (texto y Markdown), `tz-enlace`, `tz-boton`, `tz-boton--tinta`, `tz-ref` (referencia corta «Fuente: …»), `tz-medida`, `tz-seccion`.
Prefijo `tz-` obligatorio (evita choques con clases genéricas).

## 6. Marco del sitio (`Layout.astro`)
- Prop nueva `noindex` (pone `robots noindex, nofollow`). El resto igual (`title`, `description`, `canonicalPath`, `nav`).
- Cabecera (no fija): logotipo y, debajo, el índice. Mismo marco en todo el sitio, MMO incluido.
- Índice de 8 entradas numeradas (`nav.ts`): Inicio, Ediciones, Cronología, Sistemas, Personas, Rol (`/rol`), MMO (`/mmo`, La Barbarie), Fuentes. Sin JS: por debajo de 1024 px es un `<details>` «Índice» que se despliega en el flujo (1 columna; 2 desde 480 px); desde 1024 px, una fila repartida. La sección actual lleva `aria-current="page"` (calculado en el build).
- Pie sobre filete de tinta: columnas «El método», índice y colofón (tipos y licencias).
- Foco: contorno de tinta de 3 px separado 3 px. «Saltar al contenido» aparece al tabular.
- Se quitaron: ruido SVG de fondo, degradados, `backdrop-blur`, sombras, cabecera fija, `scroll-smooth`, `overflow-x-hidden` en `body` (escondía desbordamientos).

## 7. Cómo usarlo en una página
```astro
---
import Layout from "../layouts/Layout.astro";
import Encabezado from "../components/sistema/Encabezado.astro";
import Titulo from "../components/sistema/Titulo.astro";
---
<Layout title="Ediciones" canonicalPath="/ediciones">
  <div class="tz-pagina">
    <Encabezado numero="02" seccion="Archivo" titulo="Ediciones" entradilla="…" />
    <section class="tz-seccion" aria-labelledby="s1">
      <Titulo id="s1" numero="01">…</Titulo>
      <div class="tz-prosa">…</div>
    </section>
  </div>
</Layout>
```
No hay Tailwind (retirado el 2026-11-17: no se usaba ninguna utilidad y su escáner metía en el CSS clases sacadas de la documentación). Maquetar con las clases `tz-`; si hace falta algo nuevo, añadirlo a `sistema.css` con los tokens: tamaños de letra, colores, bordes y esquinas salen siempre de ahí.

## 8. Auditoría
`tests/auditoria-sitio.js` (evaluar en la página servida; devuelve un STRING JSON `{w, sw, issues}`). Revisa scroll horizontal (y qué desborda), texto visible < 16 px, contraste < 7:1 contra el fondo opaco efectivo, controles < 48 px, `<script>` e imágenes visibles.
- Emular con `Emulation.setDeviceMetricsOverride(..., mobile=False)`: con `mobile=True` el navegador amplía la ventana al contenido y esconde el desbordamiento.
- Pasar cada ancho dos veces: índice cerrado y abierto (`details.open=true`).
- 16 anchos: 320, 360, 390, 414, 480, 540, 600, 640, 700, 768, 820, 900, 1024, 1100, 1280, 1440.

Resultado 2026-11-15 (tarjeta 1/5): `/diseno/`, `/rol/`, `/mmo/`, `/mmo/wow-forever/` y guías: 0 fallos en los 16 anchos, índice abierto y cerrado. Capturas a 360 y 1280 revisadas.

Resultado 2026-11-15 (tarjeta 2/5): Archivo rehecho. `/`, `/ediciones/`, las 2 fichas de edición, `/cronologia/`, `/personas/`, `/sistemas/`, `/fuentes/`, `/rol/`, `/diseno/`, `/mmo/` y `/mmo/wow-forever/`: 384 vistas (12 páginas × 16 anchos × índice cerrado/abierto), 0 fallos. La auditoría mide ahora también `.tz-migas a` y `.tz-enlace-bloque` (≥ 48 px). Capturas a 360 y 1280 revisadas.

Resultado 2026-11-15 (tarjeta 3/5): `/mmo/`, `/mmo/wow-forever/`, `/mmo/wow-forever/guias/` y las 10 guías (16 anchos × índice cerrado/abierto = 416 vistas) más `web/guias/` (índice + 10 guías × 16 anchos = 176 vistas): 592 vistas, 0 fallos, y ninguna cabecera de tabla visible en modo apilado. La auditoría mide ahora también `.tz-indice-guia a`, `.tz-lista-enlaces a` y los enlaces de `web/guias/` (`.nav a`, `.indice a`, `.lista a`). Capturas a 320/360 y 1280 revisadas.
- Trampa: la auditoría NO ve una cabecera de tabla que se pinta como filas sueltas (pasó con `<thead>` roto por una expresión regular `<th[^>]*>` que también casaba con `<thead>`). Mirar siempre la captura de una tabla apilada.

## 8 ter. Páginas MMO (tarjeta 3/5)
- `/mmo/`: Encabezado «07 MMO · Juegos en línea», ficha de La Barbarie (datos + fuente) y «Directo a» (guías, asesor); «Otros juegos» = `Pendiente`.
- `/mmo/wow-forever/`: migas, asesor (botón de tinta), guías (`tz-lista-enlaces`), bandas (tabla corta) con fuentes y fecha, miembros (`tz-datos--ancho`, huecos con `Pendiente`).
- Guías: migas MMO › La Barbarie › Guías › profesión; antetítulo, nombre como `h1`, «Profesión de … · comprobada el …»; nota «Cómo leer esta guía» + índice al margen.
- `web/guias/` (local, enlazada desde el asesor): misma maqueta con CSS propio en `tools/build-guias.py`. Usa los tipos de respaldo (Helvetica/Arial, Georgia): `web/` no tiene las tipografías. El script se para si una guía sale con 0 enlaces.

## 8 bis. Páginas del Archivo (tarjeta 2/5)
- Portada (PabloFM, 2026-11-15): antetítulo «Qué fueron las Jornadas», UNA frase como `h1` sacada de la fuente `rol-de-los-90-la-runa-2018` (con su referencia y «fuente secundaria, año deducido» debajo), ediciones por año (`RegistroEdiciones`) y, con menos peso, «Más del archivo» (cronología, fuentes, sistemas, personas). Inicio y fin de las Jornadas: «pendiente».
- `/ediciones/`: recuento por estado, registro con descripción y «Lo que falta». `/ediciones/<slug>/`: migas, datos (vacíos = «pendiente»), «Lo que cuentan las fuentes», actividades, notas de fuente y entradas de cronología.
- `/cronologia/`: cada entrada con ancla `#<id>`, fuente enlazada a `/fuentes#<id>` y edición relacionada.
- `/personas/` y `/sistemas/`: colecciones vacías → bloque `Pendiente` digno. Personas lista los testimonios anónimos; Sistemas, los juegos que nombran las fuentes (Magic, SATM, Doom, cartas de Star Trek), cada uno con su fuente y la aclaración de que no son de rol.
- `/fuentes/`: «Nombran las Talazbrágoles» (etiqueta `menciona Talazbrágoles`) y «Contexto»; «Qué buscamos». Canal para enviar material: «pendiente» (no existe; no se escribe «escríbenos» sin canal).
- `/rol/`: campañas ACTUALES del grupo (colección `campaigns`: `title`, `system`, `status` en-curso/en-pausa/terminada/pendiente, `started`, `gm`, `summary`, `sessions[]` {n, date, title, summary}, `characters[]` {name, player, description}, `draft`), ficha en `/rol/<slug>/`. Hoy vacía: estado «pendiente».

## 9. Pendiente para las tarjetas siguientes
- 2/5 (`t_d211a9fa`): HECHO (ver §8 bis). Retirados `components/home/*`, `components/ui/*`, `EditionCard`, `SourceCard` y `homeNav`. Queda: la edición `talazbragoles-sin-fecha-1` lleva sede «Majadahonda», pero su fuente (Comunidad Umbría) solo dice «en la Talazbrágoles y en la Casa de la Juventud de Majadahonda»: revisar el dato (decisión de contenido, no de diseño). El pie del Layout dice «aquí lo cuidamos» sin canal de contacto.
- 3/5 (`t_a2f1420e`): HECHO (ver §8 ter). `MmoStyles.astro` retirado.
- 4/5 (`t_63deb1c3`): HECHO (ver §8 quater).
- `/og.png` (2026-11-17): solo tipografía, 1200 × 630: filete fino arriba, «Talazbrágoles» en Source Serif 4 300 a 168 px y «Archivo de las Jornadas» en Archivo 500 en mayúsculas espaciadas, sobre papel. Se regenera con `node proyecto/tools/og-imagen.mjs` (Chromium de Playwright; mismo resultado byte a byte). `Layout.astro` declara tamaño y texto alternativo (`og:image:alt`).

## 8 quater. Asesor de La Barbarie (tarjeta 4/5)
- Fuente única: `web/index.html` (copia previa: `web/index-antes-rediseno.html`). El asesor del sitio (`public/mmo/wow-forever/asesor/index.html`) se GENERA con `tools/build-asesor.py` / `tools/sync-repo.py`; con el worktree del rediseño: `TZ_REPO=repo-rediseno python3 tools/sync-repo.py`.
- Solo cambió el CSS (bloque `<style>` reescrito con los tokens de §2-§4) y dos retoques de marcado (logotipo «Talazbrágoles / Archivo de las Jornadas» en la cabecera; la frase de antigüedad de las subidas ya no habla de naranja/rojo). La lógica y la clave `wowf-chaman-v1` no se tocaron.
- Las clases siguen siendo las del asesor (`card`, `asesor`, `btn`, `pill`…), SIN prefijo `tz-`: el JS genera esas clases en cientos de cadenas y renombrarlas sería tocar lógica. Equivalencias: `.card` = bloque con filete de tinta arriba (sin caja); `.asesor` y `.card.aviso` = `tz-nota` (papel-2 + filete de tinta de 2 px); `.pend` = `tz-hueco` con filete discontinuo; `.btn` = `tz-boton` (1 px de tinta, relleno al pasar); `.btn.onS` = `tz-boton--tinta`; tablas = `tz-tabla` (dentro de `.tscroll` se desplazan; no se apilan porque las genera el JS sin `data-etiqueta`).
- Pestañas (`.wtabs`): rejilla `repeat(auto-fill,minmax(8em,1fr))`, celdas de 48 px con filete inferior; la actual en relleno de tinta. 2 columnas a 320-360 px, 7-8 desde 1280.
- Marcas de estado sin color: `pill-ok` filete continuo, `pill-warn` discontinuo, `pill-bad` relleno de tinta; el texto siempre dice el estado. La gráfica de oro (`.charta`) pinta las barras en tinta desde CSS (pisa los `fill` del SVG).
- Tipografías: `@font-face` a `/fonts/…` (sirven en el sitio); en `web/` local salen las de respaldo.
- Auditoría: `tests/auditoria.js` mide ahora también el contraste ≥ 7:1 (mismo cálculo que `auditoria-sitio.js`). Resultado 2026-11-15: 1.008 vistas (3 tamaños de letra × 21 vistas × 16 anchos) con `tests/subasta-prueba.csv`, 0 fallos, 0 errores de JS; build del sitio auditado con `auditoria.js` sobre `/mmo/wow-forever/asesor/`. Regresión del plan con estado limpio idéntica a la de antes del cambio. Capturas a 360 y 1280 revisadas.
