# Fuentes candidatas del Archivo

Búsqueda hecha el 2026-11-13. Formato: qué dice exactamente la fuente · estado · qué falta.
Regla: nada de esto se afirma como hecho contrastado. Cada fuente dice lo que dice.

## Estado
- Las dos primeras están ya en el prototipo (`web/index.html`, sección Archivo y Fuentes).
- Ninguna está todavía en el repo Astro (`repo/src/content/`). Abajo van los JSON listos para copiar.
- Decisión pendiente del dueño: publicarlas en talazbragoles.com.

## 1. Rol de los 90 — «La Runa: el primer (y único) periódico rolero» (2018-06-10)
- URL: https://roldelos90.blogspot.com/2018/06/la-runa-el-primer-y-unico-periodico.html
- Tipo: blog. Fuente secundaria (reseña un periódico; no es el periódico).
- Comprobada: 2026-11-13. La página carga y contiene el texto.
- Cita literal:
  > Tenemos en primer lugar la 5ª edición de las jornadas Talazbrágoles, celebradas en Las Rozas (Madrid) el 13 y 14 de abril. La Runa destaca que son unas jornadas sin ningún tipo de interés comercial y, por eso, tanto la entrada como las actividades eran gratuitas (aunque sí hubiese stands de tiendas y editoriales). Se habla de 130 mesas preparadas para partidas de rol, campeonatos de Magic y SATM, una partida de Doom en red y otras actividades como charlas y mesas redondas. En el número dos nos decían que la asistencia estuvo en torno a las 700 personas y que, prácticamente, habían asistido todas las editoriales del sector: Yggdrasil, M+D, Joc Internacional, Shirasagi, La Factoría, Cronópolis, Kerykion...
- Sobre el periódico, la misma página dice: mensual y gratuito; nº 1 en abril de 1996 y nº 2 en mayo; editado desde Las Rozas; director del nº 1, Jorge Lucio Sánchez-Galán; del nº 2, Juan Milano Escar.
- Año de la edición: la reseña no escribe «1996» junto a «13 y 14 de abril». Se deduce de la fecha de los dos números. El 13 y 14 de abril de 1996 fueron sábado y domingo (cálculo de calendario). Marcar como «año deducido».
- No dice: sede concreta, organizador, quién firma la crónica.
- No afirmar por nuestra cuenta: que las jornadas fueran anuales ni el año de la 1ª edición. La fuente solo dice «5ª edición».

## 2. Viruete.com — «Backstreet Boys en concierto, histeria no tan teenager» (2009-11-04)
- URL: https://viruete.com/blog/2009/11/04/backstreet-boys-en-concierto-histeria-no-tan-teenager/
- Tipo: blog. Testimonio de pasada.
- Comprobada: 2026-11-13.
- Cita literal:
  > Por cierto, la primera vez que vi el clip de este tema fue una tarde en la que me fui a unas Talazbrágoles (unas viejas jornadas de rol) donde conocía a mi amiga Cristina (muacks), que andaba cambiando cartas del juego de cartas de Star Trek La Nueva Generación.
- Comentario de un lector («Illuminatus», 2009-11-05): «Unas talazbrágoles, dices. Hace ya lo menos diez años que fui a unas.»
- No dice: año, sede ni edición.

## 3. Escaneos originales de La Runa (fuente primaria) — NO disponibles
- Estaban en el blog Sagittarius de Álvaro Prada: `sagittarius.es/blog/?p=376` (entrada del 2018-02-14).
- Hoy el dominio muestra «Coming Soon» (2026-11-13).
- Wayback Machine conserva la entrada: http://web.archive.org/web/20190821132140/https://sagittarius.es/blog/?p=376
- Los dos PDF (`la_runa_n_0001.pdf`, `la_runa_n_0002.pdf`) no están archivados: devuelven 404 (2026-11-13).
- Siguiente paso: pedir los escaneos a Álvaro Prada o al autor de Rol de los 90. Con ellos, la edición de 1996 pasaría a tener fuente primaria.

## 4. Sin verificar (no usar todavía)
- Ediciones Sombra (edsombra.com): un buscador mostró en su portada la cita «Que lo unido por la fantasía no sea roto por la realidad.» con el rótulo «Lema de las Talazbrágoles». Al abrir la página no apareció (parece una cita que rota). Pendiente de localizar la página fija.
- Rol de los 90 — entrevista a Roberto López-Herrero (2020-01): el buscador la devuelve para «Talazbrágoles» y habla de una radio local de Las Rozas y de «una actividad de juegos de rol». No se ha podido leer el texto completo. Pendiente de comprobar si nombra las jornadas.
- EL PAÍS 2001 (ya en el repo): sigue sin comprobarse si nombra las Talazbrágoles; está como contexto.

## JSON listos para el repo (no copiados)

`src/content/sources/rol-de-los-90-la-runa-2018.json`
```json
{
  "title": "Rol de los 90 — \"La Runa: el primer (y único) periódico rolero\" (2018-06-10)",
  "url": "https://roldelos90.blogspot.com/2018/06/la-runa-el-primer-y-unico-periodico.html",
  "asserts": "Reseña del periódico La Runa (Las Rozas; nº 1 de abril de 1996 y nº 2 de mayo). Según la reseña, La Runa publicó la crónica de la 5ª edición de las jornadas Talazbrágoles, celebradas en Las Rozas (Madrid) el 13 y 14 de abril: entrada y actividades gratuitas, 130 mesas para partidas de rol, campeonatos de Magic y SATM, una partida de Doom en red, charlas y mesas redondas; asistencia en torno a 700 personas.",
  "caveat": "Fuente secundaria. El año 1996 se deduce de la fecha de los números de La Runa; la reseña no lo escribe junto a los días. Los escaneos originales ya no se pueden descargar (comprobado el 2026-11-13).",
  "type": "otro",
  "date": "2018-06-10",
  "accessDate": "2026-11-13",
  "broken": false,
  "tags": ["menciona Talazbrágoles", "La Runa", "Las Rozas", "fuente secundaria"],
  "relatedEditions": ["talazbragoles-1996-quinta"],
  "relatedPeople": []
}
```

`src/content/sources/viruete-2009.json`
```json
{
  "title": "Viruete.com — \"Backstreet Boys en concierto, histeria no tan teenager\" (2009-11-04)",
  "url": "https://viruete.com/blog/2009/11/04/backstreet-boys-en-concierto-histeria-no-tan-teenager/",
  "asserts": "El autor cuenta que fue a «unas Talazbrágoles (unas viejas jornadas de rol)», donde conoció a una amiga que cambiaba cartas del juego de Star Trek: La Nueva Generación. No da año ni sede.",
  "type": "testimonio",
  "date": "2009-11-04",
  "accessDate": "2026-11-13",
  "broken": false,
  "tags": ["menciona Talazbrágoles", "testimonio"],
  "relatedEditions": [],
  "relatedPeople": []
}
```

`src/content/editions/talazbragoles-1996-quinta.json`
```json
{
  "year": 1996,
  "title": "Talazbrágoles — 5ª edición (13 y 14 de abril)",
  "verified": false,
  "status": "parcial",
  "venue": { "city": "Las Rozas" },
  "sourceIds": ["rol-de-los-90-la-runa-2018"],
  "peopleIds": [],
  "activities": []
}
```

Avisos antes de copiarlos:
- Comprobados contra `src/content.config.ts` (2026-11-13): `type` no admite «blog», por eso va `"otro"`; `caveat` y `accessDate` existen.
- `activities` se deja vacío a propósito: el esquema pide nombre y tipo por actividad y la fuente solo las enumera. Están en `asserts`.
- Los JSON no se han probado con `npm run build`: probarlos al copiarlos.
- `year: 1996` es deducido: por eso `verified: false` y `status: "parcial"`.
