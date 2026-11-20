# Modelo de datos

Última revisión: 2026-11-13.

## Dónde se guarda cada cosa
- Datos personales de cada jugador: `localStorage`, clave `wowf-chaman-v1`. Solo en su navegador.
- Subidas de precios: en el prototipo, solo locales (máximo 6). La base de datos compartida del artifact: pendiente de conectar.

## Estado local (objeto `S`)
- `sec`: sección visible (`inicio`, `archivo`, `rol`, `mmo`, `juegos`, `larp`, `eventos`, `fuentes`). Valor desconocido: se muestra `inicio`.
- `tab`: última pestaña del MMO. Valor desconocido: se muestra `hoy`.
- La dirección refleja `sec` y `tab` (`#mmo-subasta`). Al abrir un enlace con `#`, manda el enlace.
- `fs`, `fsUser`: tamaño de letra (0 pequeña, 1 normal, 2 grande).
- `pj`: `{nombre, nivel, raza, rama, oro, img, eq:{hueco:texto}, huecos:{hueco:bool}}`
  - `raza`: índice del desplegable (0 orco, 1 tauren, 2 trol, 3 skyborne, 4 enano).
  - `eq`: equipo puesto por hueco. `huecos`: marcado «Conseguido».
  - `img`: captura en base64, pendiente de portar del artifact.
- `skill`: `{Minería, Ingeniería, Primeros aux., Cocina, Pesca}` → 0-300.
  - Nota: en el `datos.md` original figuraba «Pesfa»; corregido a «Pesca» (el encargo del dueño usa «Pesca»).
- `alm`: `{material: cantidad}`. Nombres del cliente en español.
- `oro`: `[{f:"AAAA-MM-DD", g:número, n:nota}]` (g en plata).
- `diario`: `[{id, f, nv, oro, zona, t}]`.
- `compis`: `{tower|mortem|woldrik: {nombre, clase, raza, nivel, rama, p1, s1, p2, s2, pa, coc, pes, img, necesita, dar, huecos, eq}}`
  - `clase`: índice en `CLASES` (0 = sin saber). Lista provisional: 1 Chamán, 2 Pícaro, 3 Guerrero, 4 Mago, 5 Brujo, 6 Sacerdote, 7 Druida, 8 Cazador. El índice exacto del artifact original: pendiente de comprobar al integrar.
  - `pa`, `coc`, `pes`: Primeros auxilios, Cocina, Pesca (0-300).
  - `p1`/`p2`, `s1`/`s2`: profesiones 1 y 2 y sus habilidades.
  - `necesita`, `dar`: texto libre del asesor.
- `tablon`: texto.
- `sub`: `{com:5, dep:1, pres:25, pu:20, libro:[{id, f, tipo:"venta"|"compra", obj, cant, pu}]}`
  - `com`: comisión en %. `dep`: depósito en plata. `pres`: presupuesto en plata. `pu`: precio por unidad en plata.
- `ahs`: `[{id, ts, por, n, d}]` subidas subidas por CSV (máximo 6).

## Subida de precios (una «foto» de la subasta)
- No son precios en vivo. Cada subida lleva fecha y hora.
- Campos: `id` (`"s"` + milisegundos), `ts` (milisegundos), `por` (quién la subió), `n` (número de objetos), `d` (filas).
- Fila: `[precio_en_cobre, nombre, nivel_de_objeto, propio(0|1), disponibles]`.
- Unidades: 1 oro = 100 plata = 10.000 cobre.
- El número entre paréntesis del nombre es el nivel que pide el objeto.
- `disponibles = -1`: disponibilidad pendiente (usado en el extracto).

## AH0 (extracto) en el prototipo
- `id:"s0"`, `ts`: 2026-11-13 08:16, `n:8`, marcado `ext:true`.
- Solo los precios clave de `comercio.md`: mineral de cobre 149 cobre; lingote de cobre 135; lingote de estaño 100; lingote de bronce 189; piedra basta 10; pólvora férrea 20; paño de lino 24; bolsa de lino 220.
- La subida completa del artifact (2.991 objetos): pendiente de integrar.

## AH1 (subida completa incluida en la web)
- `id:"s1"`, `base:true` (no se puede quitar), `n:3823`, `por`: «PabloFM (CSV completo, hora de recepción)».
- `ts`: 2026-11-13 21:27 UTC = hora en que llegó por chat. La hora real de exportación en el juego: pendiente.
- Copia literal del archivo: `data/subastas/2026-11-13_2127UTC_recibida.csv`. 3.823 filas, 0 malas.
- Una fila repetida en el original: «Elixir de fuerza menor» (60 cobre, 70 y 159 unidades). Se dejan las dos; `dispDe` las suma.
- 6 filas marcadas como propias («Sí»).

## AH2 (subida completa, la más reciente)
- `id:"s2"`, `base:true`, `n:4634`, `por`: «PabloFM (CSV completo, hora de recepción)».
- `ts`: 2026-11-15 17:44 UTC = hora en que llegó por chat. Hora real de exportación en el juego: pendiente.
- Copia literal: `data/subastas/2026-11-15_1744UTC_recibida.csv`. 4.634 filas, 0 malas.
- Fila repetida en el original: «Elixir de fuerza menor» (77 cobre ×142 y 25 cobre ×161). Se dejan las dos.
- 9 filas marcadas como propias («Sí»), entre ellas Mineral de cobre ×1.143 a 85 cobre.
- `AHB=[AH0,AH1,AH2,AH3]`: subidas incluidas.

## AH3 (subida completa, la más reciente)
- `id:"s3"`, `base:true`, `n:4731`, recibida 2026-11-15 21:15 UTC (hora de exportación: pendiente).
- Copia literal: `data/subastas/2026-11-15_2115UTC_recibida.csv`. 4.731 filas, 0 malas. Repetida: «Elixir de fuerza menor». 7 filas propias. `ahUltima()` parte de la más reciente de `AHB` y la cambia por una local si es más nueva. `ahSegunda()` ordena `AHB` + locales.

## Formato del archivo exportado (CSV)
- Cabecera: `"Precio","Nombre","Nivel de objeto","¿Propiedad?","Disponible"`
- Ejemplo: `135,"Lingote de cobre",10,"",610`
- `"Sí"` en la cuarta columna = propio.
- Lo lee `parseCSV()`. Menos de 5 filas válidas = archivo rechazado.
- Fila válida: 5 columnas, precio numérico y nombre no vacío. Las demás se ignoran y se dice cuántas.
- Se quita la marca BOM del principio del archivo.
- Si no cabe en el almacenamiento: se borran las subidas más antiguas; si aun así no cabe, no se guarda y se avisa.
- Cada subida local se puede quitar a mano (`ahDel`). El extracto no.

## norm()
- Nunca borra campos del estado; los nuevos entran con valor por defecto.
- Compatible con el estado del artifact original (misma forma de objeto `S`).

## Copia de seguridad
- Exportar: JSON de `S` completo, mostrado en un área de texto (con botón de copiar al portapapeles).
- Descargar: el mismo JSON como archivo `la-barbarie-copia-AAAA-MM-DD.json`.
- Importar: sustituye `S` tras confirmación («¿Seguro? Pulsa otra vez»). Pasa por `norm()`. Se puede pegar o cargar desde archivo.
- Si la copia no es JSON válido: no cambia nada y se avisa.

## Funciones de apoyo (2026-11-13)
- `fmtC(cobre)`: `null` → «pendiente»; negativo → con signo «−».
- `dispDe(nombre)`: unidades a la venta; `null` si no consta o es −1.
- `save()`: devuelve `true`/`false`. Si falla, aviso visible arriba de la página.
- Los nombres de objeto se pasan a los botones con `data-…`, nunca dentro del `onclick` (los apóstrofos lo rompían).
- Cambios del 2026-11-13: ningún campo nuevo en `S`.

## Profesiones de Fissel (captura del juego, 2026-11-15 18:24 UTC)
- Minería 80/150 (Oficial: ya tiene el tope 150). Ingeniería 43/75 (Aprendiz). Cocina 11/75 (Aprendiz). Pesca 96/150 (Oficial). Primeros auxilios 60/75 (Aprendiz).
- Valores por defecto de `defS()` actualizados. Quien ya tenga datos guardados en su navegador debe cambiarlos en la pestaña Profesiones.


## AH4 — 2026-11-15 21:36 UTC (hora de recepción)
- Copia: `data/subastas/2026-11-15_2136UTC_recibida.csv`. 4.755 filas, 0 malas. «Elixir de fuerza menor» aparece dos veces (se deja tal cual). 8 filas propias.
- `AHB=[AH0,AH1,AH2,AH3,AH4]`. Solo 21 min después de AH3: 20 cambios ≥15 % (9 bajan, 11 suben).

## Dónde viven las subidas incluidas (desde el 2026-11-17)
- En `web/index.html` solo queda la ficha de cada una: `var AHn={id:'sn',ts:…,por:…,n:<filas>,base:true, src:'subasta-sn-<resumen>.json'}`. AH0 (extracto de 8 precios) sigue dentro, con `d`.
- Las filas van en `web/datos/subasta-sn-<resumen>.json`: `{"id":"sn","n":<filas>,"d":[[precio,nombre,nivel,propia 0/1,disponibles], …]}`, una fila por línea. `<resumen>` = 10 primeros hex del sha256 del archivo: si cambia el contenido, cambia el nombre. Por eso el sitio los sirve con `Cache-Control: public, max-age=31536000, immutable` (`vercel.json` del repo) y el navegador no los vuelve a pedir.
- Al arrancar, `cargaSubidas()` los pide con `fetch` (`AH_DIR`: `datos/` en el prototipo; `/mmo/wow-forever/asesor/datos/` en el sitio, lo pone `build-asesor.py`) y comprueba que `id` y número de filas coinciden con la ficha. Mientras tanto, `DATOS.listo=false` y lo que depende de precios dice «Cargando…» (`preciosListos()`); al acabar, `<html data-precios="listos">` (o `"incompletos"`, y las que no llegan se quitan de `AHB` con aviso en `#aviso-datos`).
- Nada de esto va a `localStorage`: el estado guardado (`wowf-chaman-v1`) no cambia. Las subidas que sube el jugador siguen en `S.ahs` con sus filas.
- Añadir una subida: `scripts/add-subasta.py` del skill `talazbragoles-web` (escribe el JSON y la ficha) y `TZ_REPO=repo-rediseno python3 tools/sync-repo.py`.
- Peso: las 5 completas suman 1.138.780 bytes en `web/datos/`; el HTML pasa de 1.242.608 a 130.522 bytes (publicado: 141.658).

## AH5 — 2026-11-17 18:18 UTC (hora de recepción)
- Copia: `data/subastas/2026-11-17_1818UTC_recibida.csv`. 4.514 filas, 0 malas. «Elixir de fuerza menor» repetido (se deja). 0 filas propias. Hora de exportación: pendiente.
- `AHB=[AH0,AH1,AH2,AH3,AH4,AH5]`. Casi dos días después de AH4: 1.537 cambios ≥15 % (937 bajan, 600 suben); 2.253 nombres desaparecen y 2.012 son nuevos.
- Precios clave (cobre por unidad, a la venta entre paréntesis): mineral de cobre 140 (599); lingote de cobre 100 (1.260); mineral de estaño 148 (572); lingote de estaño 174 (333); lingote de bronce 174 (2.262); piedra basta 11 (3.031); pólvora férrea 75 (1.062); paño de lino 38 (6.143); puñado de tornillos de cobre 183 (59).

## AH6 — 2026-11-20 22:20 UTC (hora de recepción)
- Copia: `data/subastas/2026-11-20_2220UTC_recibida.csv` → `web/datos/subasta-s6-048c11b2b5.json`. 5.456 filas. «Elixir de fuerza menor» repetido (se deja). 10 filas propias. Hora de exportación: pendiente.
- `AHB=[AH0,…,AH6]`. Tres días después de AH5.
- Precios clave (cobre, a la venta): mineral de cobre 97 (2.380); lingote de cobre 90 (1.533); mineral de estaño 155 (912); lingote de estaño 175 (597); lingote de bronce 170 (1.905); lingote de plata 455 (495); piedra basta 4 (3.993); pólvora férrea 25 (1.543); pólvora burda 33 (525); puñado de tornillos de cobre 299 (84); contacto de plata 40 (405); tubo de bronce 573 (39); paño de lino 22 (4.796).
