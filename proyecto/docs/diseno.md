# Sistema de diseño «Papel y tinta»

Rediseño de talazbragoles.com (encargo de PabloFM, 2026-11-15). Tarjeta 1/5: `t_6bd8248f`.
Estilo (PabloFM, 2026-11-15, manda sobre el encargo inicial de «fanzine»): **actual, limpio y elegante**. Blanco y negro sobrio, mucho aire, retícula clara, filetes finos, jerarquía por tamaño y peso. Nada de fotocopia, máquina de escribir, recortes, sellos, texturas, dorados ni degradados. Solo tipografía: no hay logo gráfico, fotos ni ilustraciones, con dos excepciones (2026-11-23): las portadas oficiales de los juegos en Rol (§2 bis) y la reproducción de un documento de época en la ficha de su edición (folleto, programa, cartel), porque es la prueba documental, no adorno; siempre con su texto copiado al lado (componente `.tz-documento`, sistema.css §4.17 quater) y con `alt`, `width` y `height`. Desde Ediciones 2/2 (2026-11-23) la misma imagen sale también como portada grande de su año, como miniatura de sus caras y en la rejilla de `/ediciones/`, siempre dentro de `.tz-documento-imagen` (la auditoría solo la admite ahí) y enlazando a la página del documento con su texto. Desde Ediciones 3 (2026-11-24) la excepción incluye los **objetos de época** (pines conmemorativos y similares, apartado «Objetos»): foto en escala de grises, reducida a ≤ 800 px, con `alt` que describe el motivo y copia la inscripción, `width` y `height` obligatorios, y su página `/ediciones/<año>/<objeto>/` con la inscripción literal; en los años sin folleto ni cartel el objeto es la portada del año. Solo modo claro (sin `prefers-color-scheme`).

- Código: `repo/src/styles/sistema.css` (tokens + componentes, prefijo `tz-`), `repo/src/styles/global.css` (punto de entrada: `reset.css` + `sistema.css`; sin Tailwind desde 2026-11-17), `repo/src/layouts/Layout.astro` (cabecera, índice, pie), `repo/src/components/sistema/*.astro`, `repo/src/lib/nav.ts` (8 entradas en 3 grupos), `repo/src/components/sistema/Indice.astro` (índice).
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

## 2 bis. Excepción de color: portadas oficiales (Rol 5, 2026-11-23, tarjeta `t_2e62a9d4`)

Decisión del grupo (2026-11-23, manda sobre el «hueco tipográfico» de la fase 1): en `/rol/` se publican las **portadas oficiales** de los juegos, reproducidas sin ánimo de lucro. Con los documentos de época del Archivo (§4.17 quater de `sistema.css`) y las ilustraciones de los módulos (§2 ter), son las únicas imágenes del sistema, y las únicas en color.

- **Origen**: solo la web oficial de la editorial o del autor (página del producto). Nada de tiendas de terceros, wikis ni aficionados. Si no hay portada oficial en la web, se queda el hueco tipográfico (`PortadaTipografica`). Se guarda en el repo (`src/assets/rol/portadas/<slug>.jpg`, JPEG de 640 px de ancho como máximo, recortada a la portada si la web la enseña en una maqueta o una tableta); no se enlaza en caliente.
- **Datos**: campo `portada` de la ficha (`archivo`, `titulo` si el impreso no es el del juego, `edicion`, `credito`, `ilustracion` solo si la web la acredita, `permiso: oficial-sin-lucro`) + una fuente en `fuentes[]` con `datos: ["portada"]`: url exacta de la página de donde sale, qué enseña y fecha. El esquema rechaza una portada sin esa fuente.
- **Aspecto**: tal cual, en su proporción (no se recorta a 3:4); filete fino de tinta (`--f-fino`) alrededor; sin bordes redondeados, sombras, filtros, transiciones ni animaciones. En las rejillas enlazadas, al pasar el ratón un contorno de 2 px de tinta (la portada tipográfica, en cambio, se invierte).
- **Crédito**: debajo, a 16 px (`--t-0`) en `--tinta-2` con el enlace en tinta y subrayado: «Portada: <editorial>» en rejillas y catálogo; en la ficha, «Portada oficial: <editorial> (<edición>). Reproducida sin ánimo de lucro, con crédito y enlace a la editorial.» En las rejillas el crédito va FUERA del enlace de la portada (no se anidan enlaces).
- **Texto alternativo**: «Portada de <título> (<edición>)».
- **Técnica**: `astro:assets` (`<Picture>`): AVIF y WebP + JPEG de reserva, `width`/`height`, `srcset` 1×/2× (240/480 en la ficha, 200/400 en rejillas, 144/288 en el catálogo), calidad 45 (la 2× más pesada, Dungeon World, ~60 KB en AVIF), `loading="lazy"` salvo en la ficha. HTML estático, sin JS.
- **Componentes**: `PortadaJuego` (imagen o hueco) y `CreditoPortada`; clases `tz-portada-figura`, `tz-portada-img`, `tz-portada-credito` (`sistema.css` §4.17 quinquies). Muestra en `/diseno/` §13.
- **Auditoría**: `tests/auditoria-sitio.js` sigue marcando cualquier imagen visible salvo `.tz-portada-img` y los documentos y objetos de época (`.tz-documento-imagen`, con alt de ≥ 20 caracteres, `width` y `height` obligatorios); a la portada le exige alt «Portada de … (…)» y medidas. `tests/rol-publicado.test.mjs` y `tests/rol-referencias.test.mjs` comprueban alt, medidas, AVIF/WebP, crédito con enlace y fuente oficial.

## 2 quater. Portada de Rol: dos puertas con imagen (2026-11-25)

`/rol/` abre con dos «puertas» (`.tz-puertas`, `sistema.css` §4.17 octies): **Ludoteca** (imagen = tira de hasta tres portadas oficiales de lo jugado, §2 bis, cada una con su crédito «Portada: <editorial>» debajo) y **Crónicas** (imagen = una ilustración de módulo, §2 ter, dentro de `figure.tz-modulo-imagen.tz-puerta-figura` con pie). Titular grande en Source Serif fino, entradilla y lista de enlaces anchos (≥ 56 px, filete medio) que se invierten al pasar el ratón. Una columna hasta 64rem; dos desde ahí.

## 2 ter. Excepción de imagen: ilustraciones de los módulos de Rol (Rol 7/8, 2026-11-24, tarjeta `t_a152be1b`)

Tercera excepción, con las portadas oficiales (§2 bis) y los documentos de época: las **ilustraciones de un módulo de aventura** (hoy, las 9 de «Los Navegantes del Sueño»). Son parte del módulo (mapas, planos, carteles que se enseñan a los jugadores), las hizo con IA quien lo escribió y se publican con el módulo en CC0.

- **Dónde**: solo en las páginas de sección del módulo (`/rol/modulos/<módulo>/<sección>/`), dentro de `<figure class="tz-modulo-imagen">` con `figcaption`. En el Markdown de la sección, la imagen y en la línea siguiente el pie en cursiva; `src/lib/rehype-guias.mjs` (`figurasModulo`) convierte ese párrafo en la figura. **Ampliación (Rol 9, 2026-11-25):** también en la portada del módulo (`/rol/modulos/<módulo>/`), sección «Mapas y láminas» (`ul.tz-laminas`, datos en `src/lib/laminas-modulos.ts`), con enlace a tamaño completo y a la sección donde se usa cada lámina.
- **Pie**: qué es, nombres en castellano cuando la imagen trae otros («Agora Plaza» → Ágora), avisos (mapa que lleva respuestas de una mesa), «Ilustración del módulo, hecha con IA. CC0.».
- **Aspecto**: en su proporción, hasta 46rem de ancho, filete fino de tinta, sin redondeos, sombras, filtros ni animaciones. Pie a 16 px en `--tinta-2`.
- **Técnica**: imagen de Markdown procesada por `astro:assets` (un `<Picture>` no cabe dentro de Markdown): WebP con `srcset` de 480/800/1200 px y `sizes`, `width`/`height`, `loading="lazy"`. Originales en `src/assets/rol/<módulo>/`. Tras cambiar el plugin rehype hay que borrar la caché de contenidos (`npx astro sync --force`): el build reutiliza el HTML ya renderizado.
- **Auditoría**: `tests/auditoria-sitio.js` admite `figure.tz-modulo-imagen img` si tiene alt de ≥ 20 caracteres, `width`/`height`, pie con texto y no desborda. Clases en `sistema.css` §4.17 septies.

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
| `Encabezado` (`titulo`, `numero`, `seccion`, `entradilla`, `portada`, `migas[]`) | `tz-encabezado`, `tz-antetitulo`, `tz-titular`, `tz-entradilla` | Cabeza de página: [migas], antetítulo (número + sección), el único `h1`, entradilla. `numero` = `numeroSeccion("/ruta")` de `lib/nav.ts` |
| `Titulo` (`id`, `numero`, `nivel`) | `tz-titulo` | `h2`/`h3` con filete fino de tinta encima y número «01» |
| `Filete` (`tipo`: fino, suave, medio, corto) | `tz-filete`, `tz-filete--*` | Separador `<hr>` |
| `Ficha` (`titulo`, `numero`, `estado`, `datos[]`, `href`, `enlace`, `nivel`) | `tz-ficha*`, `tz-datos`; rejilla `tz-fichas` | Ficha de archivo. Un dato vacío (`null`, `""`) se pinta «pendiente», no se omite. Pie con enlace de 48 px |
| `Datos` (`datos[]`, `class`) | `tz-datos` | Lista `dl` etiqueta/valor; un valor vacío se pinta «pendiente». La usan `Ficha` y las fichas de edición y campaña |
| `Estado` (`estado`: documentada, parcial, pendiente) | `tz-estado--*` | Marca de estado: cuadro lleno / medio / vacío + texto. Mismos valores que el esquema de ediciones |
| `Pendiente` (`mensaje`, `pide`, `etiqueta`) | `tz-pendiente` (en línea), `tz-hueco` (bloque) | Sin props: etiqueta en línea. Con `mensaje`/`pide`: bloque digno para secciones con poco contenido (lo usa `/rol/`) |
| `Cita` (`texto`, `autor`, `fuente`, `url`, `fecha`, `origenPendiente`) | `tz-cita` | Cita en Source Serif cursiva con atribución obligatoria; si no se sabe el origen, `origenPendiente` |
| `NotaFuente` (`fuente`, `n`, `ancla`) | `tz-fuentes` (el `<ol>`), `tz-fuente*` | Nota numerada con tipo, fechas, «Dice:» (`asserts`) y «Reservas:». Recibe la entrada de la colección `sources`. `ancla` (solo en `/fuentes/`) pone `id` = id de la fuente: es el ancla `/fuentes#<id>` a la que enlazan las demás páginas |

### Componentes del Archivo (`src/components/archivo/`, tarjeta 2/5)
| Componente (props) | Clases | Qué hace |
|---|---|---|
| `RegistroEdiciones` (`ediciones`, `conTexto`, `nivel`) | `tz-registro`, `tz-registro-*` | Ediciones por año: año grande en serif fino a la izquierda (desde 768 px), título, estado, sede y nº de fuentes. Año desconocido = «Año pendiente», al final. `conTexto` añade la descripción (en `/ediciones/`) |
| `Migas` (`pasos[]`) | `tz-migas` | «Ediciones › 1996». Enlaces de 48 px; el último paso no enlaza |
| `RielEdiciones` (`ediciones`, `actual`, `muestra`, `idTitulo`) | `tz-riel`, `tz-riel-*`, `tz-oculto` | Ediciones 2/2 (2026-11-23). Riel de años como el desplazador de fechas de una galería de fotos: de la más reciente a la más antigua, «Sin fecha» al final; `nav` con nombre («Ediciones por año»), año en serif + número romano + marca de estado (misma forma que `Estado`: círculo lleno/medio/vacío, en `currentColor`) y texto oculto «, VI edición, año deducido, parcial». El actual, invertido con `aria-current="page"` (`muestra` en `/diseno/` → `"true"`). Debajo, leyenda de estados y de los años no confirmados («1992-1993: año deducido.», «1999: año atribuido.»; el texto oculto añade «(número deducido)» si toca). ≥ 1024 px: columna derecha `sticky` (filete de 2 px a la izquierda, filetes finos entre años; si no cabe en la ventana, se desplaza dentro: `max-height` + `overflow-y`). Por debajo: arriba, fila de botones de 48 px con borde fino que se parte en líneas (sin scroll horizontal; el número romano se oculta) |

Página de una edición (`/ediciones/<año>/`, Ediciones 2/2): migas encima de todo; debajo, rejilla `tz-edicion` (contenido + riel). Contenido en el orden de la propuesta aprobada: encabezado (antetítulo «1997 · VI edición», titular, estado) · **01 De un vistazo** (`tz-edicion-visual`: portada grande dentro de `.tz-documento-imagen` —enlaza al documento— y, al lado desde 768 px, `Datos` del resumen; sin portada, hueco tipográfico `tz-edicion-hueco` con el año en serif fino sobre papel-2, proporción 3:4) + nota del año (`tz-edicion-nota`) + «Lo que cuentan las fuentes» · índice interno `tz-edicion-indice` (`nav` «En esta edición», enlaces de 48 px) · 02 Qué se hizo, agrupado por tipo (`tipoActividadGrupo` de `lib/formato.ts`) · 03 Organización · 04 Lugar · 05 Papeles, objetos, prensa y fotos (5 apartados: Papeles, Objetos, Prensa, Fotos, Recuerdos; los documentos con caras llevan miniaturas `tz-miniaturas` que enlazan a `/ediciones/<año>/<doc>/#cara-N`) · 06 Fuentes · 07 En la cronología. Documento: `.tz-documento--grande` (cara hasta 36rem o el 60 %). `/ediciones/`: rejilla `tz-ediciones` con portada en miniatura (o hueco), «1997 · VI edición», título, estado, «año deducido» y nº de documentos. En impresión se ocultan el riel y el índice interno.

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
| `tz-encabezado--tras-migas` (prop `migas` de `Encabezado`, que pinta también las `Migas`) | Encabezado justo debajo de unas migas |
| `code` (en `reset.css`) | Monoespaciada a 1 em (no `monospace` a secas: baja a 13 px) |
| `tz-item-titulo`, `tz-item-meta`, `tz-item-texto` | Título, dato y texto de un elemento de `tz-lista-numerada` (actividades, sesiones) |

- Markdown: `repo/src/lib/rehype-guias.mjs` (en `astro.config.mjs`) pone `data-etiqueta`, la clase `tz-tabla` y roles ARIA en todas las tablas, y quita el `# Título` de las guías (el `h1` lo pone `Encabezado`). `tools/build-guias.py` hace lo mismo para `web/guias/`.
- `MmoStyles.astro` y las clases `mmo-*` ya no existen.

Otras clases: `tz-rotulo`, `tz-subtitulo`, `tz-lista-numerada`, `tz-prosa` (texto y Markdown), `tz-enlace`, `tz-boton`, `tz-boton--tinta`, `tz-ref` (referencia corta «Fuente: …»), `tz-medida`, `tz-seccion`.
Prefijo `tz-` obligatorio (evita choques con clases genéricas).

## 6. Marco del sitio (`Layout.astro`)
- Props: `title` y `description` obligatorios; `noindex` (pone `robots noindex, nofollow`); `canonicalPath` opcional (por defecto, la ruta de la página sin barra final). El título lleva « · Talazbrágoles» salvo que ya contenga la marca. Open Graph completo: `og:site_name`, `og:locale`, `og:image` (`/og.png`) con tamaño y `og:image:alt`. Lo comprueba `tests/enlaces.test.mjs`.
- Cabecera (no fija): logotipo y, debajo, el índice (`components/sistema/Indice.astro`). Mismo marco en todo el sitio, MMO y asesor incluidos.
- Índice de 8 entradas numeradas en 3 grupos (`gruposNav` de `lib/nav.ts`, 2026-11-17): Inicio · **Archivo** (Ediciones, Cronología, Sistemas, Personas, Fuentes) · **Comunidad** (Rol, MMO). El número sale del orden (01…08) y `numeroSeccion()` lo pone en el antetítulo de cada página. Ver §6 bis.
- Pie sobre filete de tinta: columnas «El método», índice y colofón (tipos y licencias).
- Foco: contorno de tinta de 3 px separado 3 px. «Saltar al contenido» aparece al tabular.
- Se quitaron: ruido SVG de fondo, degradados, `backdrop-blur`, sombras, cabecera fija, `scroll-smooth`, `overflow-x-hidden` en `body` (escondía desbordamientos).

## 6 bis. Navegación (2026-11-17, tarjeta `t_f77da12d`)
Encargo de PabloFM: «mejora el menú y su usabilidad, usa todos los estándares conocidos, que la web sea responsive». Público de más de 50 años: claridad antes que nada. Sin JS, sin desplegables, URL sin cambios.

**Cómo es**
- Móvil y tableta (< 1024 px): botón **«Menú»** con el icono de tres rayas (SVG `aria-hidden`), con borde de tinta y 48 px de alto; al lado, «Estás en: *sección*». Es un `<details>`: se abre en el sitio (empuja el contenido, no flota ni tapa nada), el icono pasa a aspa y el botón se invierte (papel sobre tinta). Dentro, los grupos con su rótulo (ARCHIVO, COMUNIDAD) y una entrada por línea (2 columnas desde 480 px). Cada página llega con el menú cerrado.
- Escritorio (≥ 1024 px): una fila; cada grupo con su rótulo encima y un filete vertical entre grupos. Cabe sin partir a 1024 px.
- Sección actual: seminegra y subrayado de 2 px, y `aria-current`: `"page"` en la portada de la sección (p. ej. `/ediciones/`) y `"true"` en sus subpáginas (`/ediciones/<slug>/`, `/mmo/wow-forever/guias/<slug>/`, el asesor). Así lo hace la *service navigation* de GOV.UK: en una subpágina, decir «página actual» sería falso para quien usa lector de pantalla. Función `actualDe()` de `lib/nav.ts`.
- Migas (`archivo/Migas.astro`) en las subpáginas: empiezan siempre en «Inicio», cada paso se llama como en el índice («Rol», no «Juegos de rol»), el último es la página (sin enlace, `aria-current="page"`). En la portada de cada sección no hay migas: el índice ya dice dónde se está.
- Asesor (página generada): misma cabecera, carácter a carácter. `tools/build-asesor.py` lee `gruposNav` de `lib/nav.ts` y copia de `sistema.css` el CSS de §4.3, 4.12, 4.13, 4.15 y las migas (pasado a px: el asesor tiene `html` a 18 px); debajo, migas «Inicio › MMO › La Barbarie › Asesor» y los botones A−/A+. Si se cambia el índice, regenerar el asesor (`sync-repo.py`); el test lo detecta si no.
- Impresión (`@media print`, §4.18): fuera el enlace de salto, el índice y el índice del pie; se quedan logotipo, migas (como texto) y contenido; los enlaces externos llevan su dirección entre paréntesis.

**Criterios que cumple** (comprobados por `tests/navegacion.spec.mjs`, `teclado.spec.mjs`, `lectura.spec.mjs` y `accesibilidad.spec.mjs`, todos en `npm test`)
| Norma | Criterio | Cómo |
|---|---|---|
| WCAG 2.2 · 2.4.1 Evitar bloques (A) | «Saltar al contenido» | primer elemento con foco, visible al tabular, lleva a `#contenido` (también en el asesor) |
| WCAG 2.2 · 2.4.3 Orden del foco (A) | orden lógico | logotipo → Menú → entradas en el orden visual → contenido; el menú no atrapa el foco |
| WCAG 2.2 · 2.4.5 Múltiples vías (AA) | índice + migas + índice del pie | |
| WCAG 2.2 · 2.4.7 Foco visible (AA) | contorno de tinta de 3 px separado 3 px | probado con Tab en 6 páginas y en el menú a 320 px |
| WCAG 2.2 · 2.4.11 Foco no tapado (AA) | sin cabecera fija ni capas | cada elemento con foco queda dentro de la pantalla |
| WCAG 2.2 · 2.4.8 Ubicación (AAA) | sección marcada + «Estás en» + migas + antetítulo numerado | |
| WCAG 2.2 · 2.5.8 Tamaño del destino (AA) | ≥ 48 × 48 px (más que los 24 px del criterio) | botón, entradas, migas |
| WCAG 2.2 · 1.4.10 Reflow (AA) | 320 px = zoom al 400 % | sin scroll horizontal en las 23 páginas × 16 anchos, menú abierto y cerrado |
| WCAG 2.2 · 1.4.4 Texto al 200 % (AA) | `html{font-size:200%}` | 23 páginas × 16 anchos sin scroll horizontal (logotipo con tope `min(…, 13vw)`, botón «Menú» con relleno topado en px, titulares que parten palabras largas, etiquetas de `Datos` ≤ 40 %, tabla de bandas desplazable en su caja) |
| WCAG 2.2 · 1.4.12 Espaciado del texto (AA) | interlineado 1,5, letras 0,12 em, palabras 0,16 em, párrafos 2 em | cabecera, índice y migas sin recortes en 6 páginas × 3 anchos; en el resto, solo dos tablas de guía de 6 columnas a 820 px piden scroll (tabla de datos: exenta en 1.4.10; no se pierde contenido) |
| WCAG 2.2 · 1.4.3/1.4.6 Contraste | ≥ 7:1 | rótulos de grupo en `--tinta-2` (8,9:1) |
| WCAG 2.2 · 1.3.1 Información y relaciones (A) | listas anidadas; cada grupo es una `<ul aria-labelledby>` con su rótulo | |
| WCAG 2.2 · 3.2.3 Navegación coherente (AA) | mismo índice, mismo orden, en todas las páginas y en el asesor | test de cabecera idéntica |
| WCAG 2.2 · 4.1.2 Nombre, función, valor (A) | `<details>/<summary>` nativo: nombre «Menú, Estás en: …», estado abierto/cerrado lo da el navegador | |
| WAI-ARIA APG · Disclosure / landmarks | un solo `<nav aria-label="Secciones">` en la cabecera, migas en `<nav aria-label="Estás en">`, pie en `<nav aria-labelledby>`; `aria-current` en la sección | |
| GOV.UK Design System | *service navigation* («Menu» que se despliega en el flujo, sección actual marcada en sección y subpáginas), *breadcrumbs* (empiezan en Inicio; el último paso no enlaza), *skip link* | |
| USWDS | cabecera con navegación primaria agrupada y botón «Menú» con texto visible (no solo icono) | |

**Lo que no hace (y por qué)**: no hay submenús desplegables (exigirían JS o capas encima del contenido); Escape no cierra el menú (sin JS; se cierra con el mismo botón); los números de sección cambiaron al agrupar (Fuentes pasa de 08 a 06, Rol de 06 a 07, MMO de 07 a 08), las URL no.

## 7. Cómo usarlo en una página
```astro
---
import Layout from "../layouts/Layout.astro";
import Encabezado from "../components/sistema/Encabezado.astro";
import Titulo from "../components/sistema/Titulo.astro";
import { numeroSeccion } from "../lib/nav";
---
<Layout title="Ediciones" description="…">
  <div class="tz-pagina">
    <Encabezado numero={numeroSeccion("/ediciones")} seccion="Archivo" titulo="Ediciones" entradilla="…" />
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
- `/mmo/`: Encabezado «08 MMO · Juegos en línea» (07 hasta el 2026-11-17), ficha de La Barbarie (datos + fuente) y «Directo a» (guías, asesor); «Otros juegos» = `Pendiente`.
- `/mmo/wow-forever/`: migas, asesor (botón de tinta), guías (`tz-lista-enlaces`), bandas (tabla corta) con fuentes y fecha, miembros (`tz-datos--ancho`, huecos con `Pendiente`).
- Guías: migas Inicio › MMO › La Barbarie › Guías › profesión; antetítulo, nombre como `h1`, «Profesión de … · comprobada el …»; nota «Cómo leer esta guía» + índice al margen.
- `web/guias/` (local, enlazada desde el asesor): misma maqueta con CSS propio en `tools/build-guias.py`. Usa los tipos de respaldo (Helvetica/Arial, Georgia): `web/` no tiene las tipografías. El script se para si una guía sale con 0 enlaces.

## 8 bis. Páginas del Archivo (tarjeta 2/5)
- Portada (PabloFM, 2026-11-15): antetítulo «Qué fueron las Jornadas», UNA frase como `h1` sacada de la fuente `rol-de-los-90-la-runa-2018` (con su referencia y «fuente secundaria, año deducido» debajo), ediciones por año (`RegistroEdiciones`) y, con menos peso, «Más del archivo» (cronología, fuentes, sistemas, personas). Inicio y fin de las Jornadas: «pendiente».
- `/ediciones/`: recuento por estado, rejilla de años con portada o hueco y «Lo que falta». `/ediciones/<año>/`: riel de años + bloques 01-06 (ver `RielEdiciones` en §5; Ediciones 2/2, 2026-11-23).
- `/cronologia/`: de la más reciente a la más antigua (2026-11-23, como las ediciones); cada entrada con ancla `#<id>`, fuente enlazada a `/fuentes#<id>` y edición relacionada.
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
