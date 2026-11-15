# Sistema de diseño «Papel y tinta»

Rediseño de talazbragoles.com (encargo de PabloFM, 2026-11-15). Tarjeta 1/5: `t_6bd8248f`.
Estilo (PabloFM, 2026-11-15, manda sobre el encargo inicial de «fanzine»): **actual, limpio y elegante**. Blanco y negro sobrio, mucho aire, retícula clara, filetes finos, jerarquía por tamaño y peso. Nada de fotocopia, máquina de escribir, recortes, sellos, texturas, dorados ni degradados. Solo tipografía: no hay logo gráfico, fotos ni ilustraciones. Solo modo claro (sin `prefers-color-scheme`).

- Código: `repo/src/styles/sistema.css` (tokens + componentes, prefijo `tz-`), `repo/src/styles/global.css` (Tailwind + `@theme`), `repo/src/layouts/Layout.astro` (cabecera, índice, pie), `repo/src/components/sistema/*.astro`, `repo/src/lib/nav.ts` (8 entradas).
- Muestrario vivo: `/diseno/` (noindex, fuera del sitemap por el filtro de `astro.config.mjs`).
- Rama: `hermes/rediseno` (desde `hermes/web-mmo`), en el worktree `/opt/data/project-talazbragoles/repo-rediseno/` porque `repo/` tiene cambios sin guardar de otra sesión. `node_modules` es un enlace a `repo/node_modules`.
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
| `NotaFuente` (`n`, `titulo`, `url`, `tipo`, `fecha`, `consulta`, `afirma`, `reserva`, `caido`) | `tz-fuentes` (el `<ol>`), `tz-fuente*` | Nota numerada con tipo, fechas, «Dice:» (`asserts`) y «Reservas:». Recibe los campos de la colección `sources` |

Otras clases: `tz-rotulo`, `tz-subtitulo`, `tz-lista-numerada`, `tz-prosa` (texto y Markdown), `tz-enlace`, `tz-boton`, `tz-boton--tinta`, `tz-ref` (referencia corta «Fuente: …»), `tz-medida`, `tz-seccion`.
Prefijo `tz-` obligatorio (`z-` es de Tailwind).

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
Tailwind sigue disponible para maquetar (`grid`, `gap-*`…), pero tamaños de letra, colores, bordes y esquinas salen de los tokens (`text-xs`, `text-black/60`, `rounded-*` quedan prohibidos).

## 8. Auditoría
`tests/auditoria-sitio.js` (evaluar en la página servida; devuelve un STRING JSON `{w, sw, issues}`). Revisa scroll horizontal (y qué desborda), texto visible < 16 px, contraste < 7:1 contra el fondo opaco efectivo, controles < 48 px, `<script>` e imágenes visibles.
- Emular con `Emulation.setDeviceMetricsOverride(..., mobile=False)`: con `mobile=True` el navegador amplía la ventana al contenido y esconde el desbordamiento.
- Pasar cada ancho dos veces: índice cerrado y abierto (`details.open=true`).
- 16 anchos: 320, 360, 390, 414, 480, 540, 600, 640, 700, 768, 820, 900, 1024, 1100, 1280, 1440.

Resultado 2026-11-15 (tarjeta 1/5): `/diseno/`, `/rol/`, `/mmo/`, `/mmo/wow-forever/` y guías: 0 fallos en los 16 anchos, índice abierto y cerrado. Capturas a 360 y 1280 revisadas. Las páginas del Archivo (`/`, `/ediciones/`, `/fuentes/`, `/cronologia/`, `/personas/`, `/sistemas/`) aún usan sus componentes antiguos (tarjeta 2/5): letra de 10–14 px de utilidades Tailwind y desbordamiento en la portada (Hero antiguo, tabla `min-w-[760px]`).

## 9. Pendiente para las tarjetas siguientes
- 2/5 (`t_d211a9fa`): portada = Archivo de las Jornadas y páginas del Archivo con estos componentes; contenido de `/rol/`; retirar `components/home/*`, `ui/Badge`, `ui/PendingBanner`, `ui/SourceRef` y `homeNav` si ya no hacen falta.
- Asesor (`public/mmo/wow-forever/asesor/`, generado) y `MmoStyles.astro`: pasar a tokens `tz-`, misma cabecera y menú, quitar el tema oscuro.
- `/og.png` sigue sin existir (solo tipografía: si se hace, el logotipo en Source Serif 4 fino sobre papel).
