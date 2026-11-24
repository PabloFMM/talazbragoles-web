# Ediciones por año: contexto para las tarjetas

Leer ENTERO antes de tocar nada. Después: skill `talazbragoles-web`, `docs/ESTRUCTURA.md` (fila «Ediciones: orden y forma»), `docs/diseno.md`, la propuesta `docs/ediciones/propuesta-v1/index.html` (aprobada por PabloFM con «ok» el 2026-11-23) y `documentos-historicos/README.md`.

## Dónde se trabaja

- Worktree: `/opt/data/project-talazbragoles/repo-ediciones`, rama `hermes/ediciones-riel` (desde `origin/main` 51140ff). `node_modules` es un enlace a `repo-rediseno/node_modules`.
- Las tarjetas de esta sección van EN SERIE sobre ese worktree. No tocar otros worktrees.
- Publicar: receta de la skill (PR → checks en verde → merge → comprobar «Workers Builds» de main y producción con curl). Sin pedir visto bueno.

## Decisiones (PabloFM, 2026-11-23)

1. Orden: de la MÁS RECIENTE a la MÁS ANTIGUA, en todo (riel, listas, `/ediciones/`, cronología de ediciones).
2. Forma: como el desplazador de fechas de una galería de fotos. Años a la DERECHA (riel), contenido a la IZQUIERDA; al elegir un año cambia el contenido. Sin JS: una página por año. En ≥1024 px el riel va a la derecha y `position: sticky`; por debajo, arriba en una fila de botones de 48 px que se parte en líneas (sin scroll horizontal).
3. Dentro de cada edición, en este orden:
   - 01 Lo visual + resumen: cartel o portada del folleto grande (si no hay, hueco tipográfico con el año) y al lado fechas, horario, lugar, organiza, apoyo, asistencia (vacío = «pendiente»).
   - 02 Qué se hizo: actividades agrupadas por tipo.
   - 03 Organización: equipo de ese año (cambiaba cada año), asociación, patrocinadores/colaboradores.
   - 04 Lugar: edificio exacto, dirección, cómo se llegaba, qué es hoy.
   - 05 Papeles, prensa y fotos: apartados «Papeles» (folletos, programas, carteles, inscripciones, permisos), «Prensa», «Fotos» y «Recuerdos» (testimonios). Cada uno «pendiente» si está vacío. Cada documento con caras tiene su página `/ediciones/<año>/<documento>/` (caras grandes + texto literal, lo que hoy hace `.tz-documento`).
   - 06 Fuentes.
4. Más adelante se irá pasando documentación poco a poco: el modelo debe admitir varios documentos por edición y por apartado.

## Decisiones reversibles tomadas por el coordinador (PabloFM respondió solo «ok» a las 4 preguntas)

- P1. Ediciones I-IV (1992-1995): SÍ se publican como páginas «pendiente», con «año deducido» visible: el folleto de 1997 dice «por sexto año consecutivo» (fuente `folleto-vi-jornadas-1997`). `verified: false`, `status: pendiente`. Sin ningún otro dato.
- P2. Después de 1997: nada (no hay fuente). El riel empieza en 1997. Nada de VII inventada.
- P3. Recuerdos/testimonios: cuarto apartado dentro del bloque 05. Los testimonios sin año van en `/ediciones/sin-fecha/` (hoy `talazbragoles-sin-fecha-1`).
- P4. `/ediciones/` = portada con todos los años (de nuevo a viejo), cada uno con su portada en miniatura o hueco tipográfico, estado y nº de documentos. No redirige (redirigir sin JS exige meta refresh).

## Rutas

| Ruta | Qué |
|---|---|
| `/ediciones/` | Portada de la sección (P4) |
| `/ediciones/1997/` … `/ediciones/1992/` | Una página por año con riel |
| `/ediciones/1997/folleto/` | Documento con caras |
| `/ediciones/sin-fecha/` | Menciones sin año |
| antiguas `/ediciones/talazbragoles-1997-sexta/`, `-1996-quinta/`, `-sin-fecha-1/` | Redirección 301 (en `public/_redirects` de Cloudflare Workers static assets; comprobar que el formato se aplica en Workers, si no, página mínima con enlace) |

Revisar todos los enlaces internos a las rutas antiguas (cronología, fuentes, portada, `relatedEditions`, tests).

## Hecho en la tarjeta 1/2 (`t_d03a65c6`, 2026-11-23): qué cambió en el esquema y los datos

- **Ids = rutas.** `src/content/editions/` ahora tiene `1997.json` … `1992.json` y `sin-fecha.json` (antes `talazbragoles-1997-sexta`, `-1996-quinta`, `-sin-fecha-1`). Referencias actualizadas: `relatedEditions` de las fuentes, `relatedEditionId` de la cronología (también el testimonio de Viruete → `sin-fecha`), URL de la fuente `folleto-vi-jornadas-1997` → `/ediciones/1997/folleto/`.
- **Campos nuevos de `editions`** (todos opcionales; vacío = «pendiente»): `numero {romano, entero}`, `anioEstado {estado: confirmado|deducido, sourceIds[], nota}` (sus fuentes van también en `sourceIds` para salir en «Fuentes»; el test lo exige), `fechas`, `horario`, `apoyo`, `asistencia`, `venue.comoLlegar`, `venue.hoy`, `organizacion {equipo[], asociacion, patrocinadores[], nota}`, `portada {imagen, ancho, alto, alt, documento}` (1997 apunta a la cara 1 del folleto; sin portada → hueco tipográfico en la 2/2). Se mantienen `organizer` (línea «Organiza» del resumen), `description`, `activities`, `assets`.
- **`documentos[]`**: `id` → `slug` (único por edición) + `apartado` (`papeles` | `prensa` | `fotos` | `recuerdos`); `caras` pasa a opcional (default `[]`). Solo los que tienen caras generan página. `sin-fecha` lleva los dos testimonios (Viruete 2009, Umbría 2012) como `recuerdos`, sin caras.
- **Datos**: 1997 con fechas, horario, apoyo, cómo llegar, 14 patrocinadores y portada (todo del folleto); 1996 con número V, año deducido (La Runa + folleto), fechas, asistencia y 4 actividades de la reseña; 1995-1992 = número, `anioEstado` deducido (folleto) y nada más.
- **Rutas**: `src/pages/ediciones/[anio]/index.astro` (maqueta actual, ya en el orden 01 Resumen · 02 Qué se hizo · 03 Organización · 04 Lugar · 05 Papeles, prensa y fotos (4 apartados, «pendiente» si vacío) · 06 Fuentes · 07 cronología) y `[anio]/[documento].astro` (caras + texto literal, lo que antes iba dentro de la ficha). Sin riel ni imagen de portada en la página del año: eso es la 2/2 (la auditoría solo admite imágenes en `.tz-documento-imagen`).
- **Orden**: `getAllEditions()` va de la más reciente a la más antigua, sin fecha al final (portada, `/ediciones/`, `/diseno/`). Helpers `hrefEdicion(id)` y `hrefDocumento(id, slug)` en `lib/collections.ts`; etiquetas `APARTADOS`/`apartadoDocumento` en `lib/formato.ts`. La cronología (`/cronologia/`) NO se ha reordenado: si la 2/2 quiere ponerla de nueva a vieja, es `getAllTimeline()`.
- **Redirecciones**: `public/_redirects` (con y sin barra final, 301). Comprobado con `wrangler dev` local (workerd): 301 a `/ediciones/1997/`, `/1996/`, `/sin-fecha/`. `wrangler deploy --dry-run` pasa (no lista las reglas). El ancla vieja `#folleto` se pierde (el folleto tiene ahora su página).
- **Material de época en el repo**: `proyecto/documentos-historicos/` con la estructura nueva (README raíz y de cada edición, `1997-vi-jornadas/folleto/folleto-1997.md`, `herramientas/`, `sin-fechar/`), sin `originales/` ni `restaurado/` (las caras reducidas ya están en `public/documentos/1997-folleto-vi-jornadas/`, rutas de imagen sin cambiar).
- **Tests**: `tests/ediciones.test.mjs` (nombre de archivo = año, fuentes existen, I-IV pendientes y sin datos, una página por año y por documento con caras, orden nuevo→viejo en `/ediciones/` y portada, redirecciones 301 en `_redirects` y ningún enlace a rutas viejas, sin nombres).

## Datos que ya existen

- `src/content/editions/talazbragoles-1997-sexta.json` (folleto con 4 caras, 15 actividades, sede, organizador), `talazbragoles-1996-quinta.json` (La Runa), `talazbragoles-sin-fecha-1.json`.
- Material de época en el proyecto: `/opt/data/project-talazbragoles/documentos-historicos/` (una carpeta por edición, ya ordenadas; fichas I-IV con año deducido). En el repo la copia está en `proyecto/documentos-historicos/1997-04-folleto-vi-jornadas/`: pasarla a la estructura nueva (`1997-vi-jornadas/folleto/`, etc.) copiando desde la carpeta del proyecto (sin `originales/`, que pesan 12 MB: solo `restaurado/` reducido si hace falta, el `.md` y los README).

## Reglas

Nada inventado (lo desconocido «pendiente»); cada dato con fuente; no nombrar a PabloFM en lo publicado (grep en `dist/ediciones`); texto ≥16 px, toques ≥48 px, contraste ≥7:1, sin animaciones, sin JS de cliente; auditar 320-1440 px (11 anchos) × 100/200 %; `npm test` en verde (lanzar en segundo plano con `PLAYWRIGHT_BROWSERS_PATH=/opt/data/cache/ms-playwright CI=1`).

## Hecho en la tarjeta 2/2 (`t_896bc03a`, 2026-11-23)

- **Riel**: `src/components/archivo/RielEdiciones.astro` (clases `tz-riel*` y `tz-oculto` en `sistema.css` §4.17 sexies). ≥1024 px columna derecha sticky (si no cabe en la ventana, se desplaza dentro); por debajo, arriba, fila de botones de 48 px que se parte. Marca de estado con la forma de `Estado` + texto oculto; `aria-current="page"` en el año de la página.
- **Página del año** con el orden de la propuesta: 01 «De un vistazo» (portada grande enlazada al documento, o hueco tipográfico con el año) + resumen + nota del año + «Lo que cuentan las fuentes» · índice interno (48 px) · 02 Qué se hizo agrupado por tipo (`tipoActividadGrupo`) · 03 · 04 · 05 (con miniaturas de las caras → `#cara-N` del documento) · 06 · 07 cronología.
- **Documento**: caras grandes (`.tz-documento--grande`), cada cara con ancla `#cara-N`.
- **`/ediciones/`**: rejilla de años de nuevo a viejo con portada o hueco, estado, «año deducido» y nº de documentos.
- **Cronología**: ahora de la más reciente a la más antigua (`getAllTimeline().reverse()` en la página; el helper sigue de vieja a nueva).
- `/diseno/` §15 muestra el riel; `docs/diseno.md` §5 lo documenta.
- Sigue pendiente (preguntas para PabloFM): ¿hubo ediciones después de 1997?, ¿quién organizaba cada año?, ¿hay fotos, prensa o más papeles de alguna edición?

## Pines (2026-11-23, tarjeta «Ediciones 3»)

Llegaron 8 fotos de pines conmemorativos (colección particular; el material es de las Jornadas y se publica igual que el folleto). Restaurados en `documentos-historicos/<edición>/pin/restaurado/pin-<año>.jpg` (originales al lado), ficha `pin-<año>.md` (inscripción, motivo, qué aporta, qué NO dice). Script: `documentos-historicos/herramientas/pines.py`.

| Año | Inscripción | Consecuencia |
|---|---|---|
| 2003 | TALAZBRAGOLES'03 | edición nueva. La foto llegó nombrada «pin del 93», pero el pin dice '03 (comprobado ampliando): manda la inscripción. Nota visible: «año según la inscripción». |
| 2002 | TALAZBRÁGOLES '02 | edición nueva |
| 1999 | TALAZBRAGOLES (sin año) | edición nueva, año «según la colección» (sin otra fuente), `verified: false` |
| 1998 | TALAZBRÁGOLES 98 | edición nueva |
| 1997 | TALAZBRÁGOLES'97 | se añade el pin a 1997 (la portada sigue siendo el folleto) |
| 1996 | 96 · TALAZBRÁGOLES | 1996 pasa a año confirmado (pin) |
| 1995 | TALAZBRAGOLES'95 | 1995: año confirmado (pin); número IV sigue deducido |
| 1994 | '94 · TALAZBRÁGOLES | 1994: año confirmado (pin); número III sigue deducido |

Decisiones (reversibles, coordinador):
- Ediciones después de 1997: número de edición «pendiente» (no sabemos si hubo 2000 y 2001). 2000 y 2001 NO se crean.
- Nuevo apartado `objetos` en `documentos[]` (pines y similares), además de papeles, prensa, fotos, recuerdos.
- Lo visual primero: en los años sin folleto, la imagen principal (`portada`) es el pin. En 1997 la portada sigue siendo el folleto y el pin va en «objetos».
- Fuente nueva por pin (tipo `foto`… o el que admita el esquema): «Pin conmemorativo de Talazbrágoles <año>, ejemplar de una colección particular, fotografiado en 2026». No nombrar al dueño.
- Imagen en el repo: reducida (≤ 800 px de lado mayor, JPEG ~80), con `alt` que describa el motivo y la inscripción, `width`/`height`. Ampliar la excepción de imágenes de la auditoría y de `docs/diseno.md` a «objetos de época».
- `/ediciones/` y el riel: 2003, 2002, 1999, 1998, 1997 … 1992, sin fecha.

## Hecho en Ediciones 3 (`t_3e85294d`, 2026-11-24)

- **Esquema**: apartado `objetos` en `documentos[]` (orden: papeles, objetos, prensa, fotos, recuerdos; bloque 05 = «Papeles, objetos, prensa y fotos»). Un objeto es un documento de UNA cara (la foto, `texto` = inscripción literal, `nota` = motivo) y tiene su página `/ediciones/<año>/pin/` («El objeto y su inscripción»). `anioEstado.estado` admite `atribuido` (1999: el pin no lleva año). `numero.deducido` (bool): I-V deducidos («número deducido» en recuento, resumen, `/ediciones/` y texto oculto del riel). Etiquetas en `anioEstadoTexto` y `tramoAnios()` de `lib/formato.ts`; la leyenda del riel dice «1992-1993: año deducido.» y «1999: año atribuido.».
- **Imágenes**: `public/documentos/pines/pin-<año>.jpg` (≤ 800 px, JPEG 80 progresivo, 80-134 KB) con `scratch/pines-reduce.py`. Datos generados con `scratch/pines-datos.py` (fuentes `pin-<año>` tipo `documento-de-epoca`, url = página del pin; ediciones nuevas; 1994-1996).
- **Datos**: 2003, 2002, 1998 año confirmado; 1999 atribuido; los cuatro `pendiente`, `verified: false`, sin número. 1994-1996: año confirmado por el pin, número deducido; 1996 conserva fechas/asistencia de La Runa (que esa crónica sea la de 1996 sigue deducido). 1997: pin en objetos, portada = folleto. Portada = pin en los demás.
- **Material de época** en el repo: `proyecto/documentos-historicos/<edición>/pin/pin-<año>.md` + README de las ediciones nuevas + `herramientas/pines.py` (sin `originales/` ni `restaurado/`).
- **QA**: 9 páginas × 11 anchos × 100/200 % = 198 vistas, 0 fallos. Riel con 11 años + sin fecha: a 320 px 4 filas de botones; a 1024×700 cabe fijo con desplazamiento propio (la leyenda queda abajo).
- Preguntas abiertas: ¿hubo ediciones en 2000 y 2001? ¿qué número tuvo cada edición desde 1998? ¿el pin de 1999 es de verdad de 1999? ¿quién organizaba cada año, fechas y sede?

## Lote de documentos 1992-1995 (2026-11-23, tarjeta «Ediciones 4»)

Llegaron 8 fotos más. Ya restauradas (`herramientas/hoja.py`) y transcritas en `documentos-historicos/` (leer cada `.md`: transcripción literal, qué aporta, qué NO dice):

| Edición | Documento | Carpeta (en `documentos-historicos/`) | Apartado |
|---|---|---|---|
| 1992 (I) | «Gran éxito de las primeras jornadas de Juegos de Rol», De Impresión, mayo 1992, p. 8, firma Sonia Esqueta; con el dibujo que llegó como «el primer cartel» | `1992-i-jornadas/prensa-1992-05-de-impresion/` | prensa |
| 1992 (I) | «Extrañas criaturas en Las Rozas», De Impresión, diciembre 1992 | `1992-i-jornadas/prensa-1992-12-de-impresion/` | prensa |
| 1993 (II) | Cartel oficial Talazbrágoles'93 | `1993-ii-jornadas/cartel/` | papeles (cartel) |
| 1995 (IV) | Folleto Talazbrágoles '95 (2 fotos: portada+horario, interior con clubes) | `1995-iv-jornadas/folleto/` | papeles |
| 1995 (IV) | Distribución final de mesas (tabla transcrita, 33 filas) | `1995-iv-jornadas/mesas/` | papeles |
| sin fecha | «Pruébalo»: folleto del Juego de Rol Transtemporal (JRT) de la Cofradía de Supervivientes de Solaris Siete | `sin-fechar/folleto-jrt-solaris-siete/` | papeles |

Consecuencias en los datos (todo sale de esos documentos; las fichas `README.md` de cada edición ya están actualizadas: usarlas como fuente de verdad):
- **1992 = I, confirmada**: «I Jornada de Juegos de Rol», sábado 4 de abril de 1992, Centro de Servicios Sociales (C/ Comunidad de la Rioja s/n, Las Rozas), siete grupos, Departamento de Juventud, nace la CSSS. El nombre «Talazbrágoles» NO sale en estos artículos: el título de la ficha no debe afirmar que se llamara así (p. ej. «I Jornada de Juegos de Rol (1992)»).
- **1993 = II, confirmada** (cartel): 24-25 abril, Centro de Bienestar Social, 5 clubes organizadores, 9 colaboradores, 6 tiendas, tel./fax. Portada = cartel.
- **1995 = IV, confirmada** (folleto): 22-23 abril, horario, mesa redonda «MAGIC: amigo o enemigo de los juegos de rol», entrega de premios, 6 clubes organizadores, 7 colaboradores, 3 tiendas, 32 mesas ocupadas y sus juegos. Portada = portada del folleto. Sede: «el Centro», nombre pendiente.
- 1994 = III y 1996 = V quedan como número por serie (ya confirmados I, II, IV y VI).
- Los nombres de pila de quienes dirigían mesas en 1995 salen en la lista: se publica la lista tal cual (documento de un acto público, solo nombres de pila; decisión reversible del coordinador). Nunca añadir apellidos ni datos de nadie que no estén en el documento.
- Actividades 1995: construirlas desde la lista de mesas agrupadas por juego (no 32 entradas sueltas).
- Imágenes: desde `restaurado/` de cada carpeta, reducidas (≤1200 px lado mayor) a `public/documentos/<año>-<slug>/`. Cada documento con su página `/ediciones/<año>/<slug>/` (imagen + texto literal del `.md`). La lista de mesas: tabla accesible (`tz-tabla`, se apila en móvil) además de la imagen.
- Fuentes nuevas, una por documento (tipo `prensa` para De Impresión con fecha 1992-05 y 1992-12; `documento-oficial` u `otro` para cartel/folleto/lista).
