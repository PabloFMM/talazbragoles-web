// Sección Ediciones, sobre el contenido y el build (dist/):
// - una página por año (/ediciones/<año>/) más /ediciones/sin-fecha/, y una por documento con caras;
// - /ediciones/ y la portada las listan de la MÁS RECIENTE a la MÁS ANTIGUA, «sin fecha» al final;
// - las rutas viejas redirigen (301) a las nuevas en public/_redirects (Cloudflare Workers) y nada enlaza a ellas;
// - los años y números confirmados citan su documento; los deducidos lo dicen; ninguna página nombra a quien dio los datos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { DIST, RAIZ, archivosHtml } from "./_comun.mjs";

const DIR = join(RAIZ, "src", "content", "editions");
const ediciones = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({ id: f.replace(/\.json$/, ""), d: JSON.parse(readFileSync(join(DIR, f), "utf-8")) }));
const fuentes = new Set(readdirSync(join(RAIZ, "src", "content", "sources")).map((f) => f.replace(/\.json$/, "")));

const pagina = (ruta) => {
  const f = join(DIST, ...ruta.split("/").filter(Boolean), "index.html");
  assert.ok(existsSync(f), `falta la página ${ruta} en dist/ (¿se ha hecho el build?)`);
  return readFileSync(f, "utf-8");
};

const VIEJAS = {
  "/ediciones/talazbragoles-1997-sexta": "/ediciones/1997/",
  "/ediciones/talazbragoles-1996-quinta": "/ediciones/1996/",
  "/ediciones/talazbragoles-sin-fecha-1": "/ediciones/sin-fecha/",
};

test("cada edición se llama como su año (o «sin-fecha») y sus fuentes existen", () => {
  for (const { id, d } of ediciones) {
    if (d.year === "desconocida") assert.equal(id, "sin-fecha", `${id}: año desconocido debe ser sin-fecha.json`);
    else assert.equal(id, String(d.year), `${id}.json: el nombre del archivo debe ser el año (${d.year})`);
    const ids = [...d.sourceIds, ...(d.anioEstado?.sourceIds ?? []), ...(d.documentos ?? []).map((x) => x.sourceId)];
    for (const s of ids) assert.ok(fuentes.has(s), `${id}: la fuente «${s}» no existe`);
    for (const s of d.anioEstado?.sourceIds ?? []) assert.ok(d.sourceIds.includes(s), `${id}: la fuente del año «${s}» debe estar también en sourceIds (si no, no sale en «Fuentes»)`);
    if (d.portada?.documento) assert.ok((d.documentos ?? []).some((x) => x.slug === d.portada.documento), `${id}: la portada apunta a un documento que no existe`);
  }
});

test("ediciones por año: 1992-1999, 2002 y 2003 (2000 y 2001 no se crean sin fuente)", () => {
  const anios = ediciones.filter((e) => e.d.year !== "desconocida").map((e) => e.d.year).sort();
  assert.deepEqual(anios, [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2002, 2003]);
});

test("1992 (I), 1993 (II), 1995 (IV), 1996 (V) y 1998 (VII): número y año confirmados por un documento original de la edición", () => {
  const ESPERADO = {
    1992: { romano: "I", fuente: ["de-impresion-1992-05"] },
    1993: { romano: "II", fuente: ["cartel-1993"] },
    1995: { romano: "IV", fuente: ["folleto-1995", "pin-1995"] },
    1996: { romano: "V", fuente: ["la-runa-1-1996", "pin-1996"] },
    1998: { romano: "VII", fuente: ["cartel-1998", "pin-1998"] },
  };
  for (const [anio, e] of Object.entries(ESPERADO)) {
    const { id, d } = ediciones.find((x) => String(x.d.year) === anio);
    assert.equal(d.status, "parcial", id);
    assert.equal(d.verified, true, `${id}: el documento es original`);
    assert.equal(d.anioEstado?.estado, "confirmado", id);
    assert.deepEqual(d.anioEstado?.sourceIds, e.fuente, `${id}: fuente del año`);
    assert.equal(d.numero?.romano, e.romano, `${id}: número`);
    assert.notEqual(d.numero?.deducido, true, `${id}: el número ya no es deducido`);
    assert.ok(d.portada?.documento, `${id}: lleva imagen principal`);
    const html = pagina(`/ediciones/${id}/`).replace(/<nav class="tz-riel"[\s\S]*?<\/nav>/, "");
    assert.doesNotMatch(html, /número deducido|año deducido/i, `/ediciones/${id}/ ya no es deducido`);
  }
  // 1992: la prensa no usa «Talazbrágoles»: el título no lo afirma.
  const i = ediciones.find((x) => x.d.year === 1992).d;
  assert.doesNotMatch(i.title, /talazbr/i, "1992: el título no debe llamarla «Talazbrágoles»");
  assert.equal(i.anioEstado.sourceIds[0], "de-impresion-1992-05");
  assert.ok(i.documentos.every((x) => x.apartado === "prensa") && i.documentos.length === 2, "1992: dos recortes de prensa");
  for (const { id, d } of ediciones.filter((x) => [1992, 1993, 1995].includes(x.d.year))) {
    for (const campo of ["fechas", "venue", "organizer", "description"]) assert.ok(d[campo], `${id}: «${campo}» sale del documento`);
  }
  assert.equal(ediciones.find((x) => x.d.year === 1995).d.venue.name, undefined, "1995: el nombre del centro sigue pendiente");
});

test("1994 (III): año confirmado por su pin; el número sigue deducido", () => {
  const { id, d } = ediciones.find((e) => e.d.year === 1994);
  assert.equal(d.anioEstado?.estado, "confirmado", id);
  assert.deepEqual(d.anioEstado?.sourceIds, ["pin-1994"], id);
  assert.equal(d.numero?.romano, "III");
  assert.equal(d.numero?.deducido, true, "1994: el número sigue deducido");
  assert.equal(d.verified, false, id);
  const html = pagina("/ediciones/1994/").replace(/<nav class="tz-riel"[\s\S]*?<\/nav>/, "");
  assert.match(html, /número deducido/);
  assert.doesNotMatch(html, /año deducido/i);
});

test("1999, 2002 y 2003: pendientes, sin verificar, sin número; 1999 con año atribuido", () => {
  for (const { id, d } of ediciones.filter((e) => [1999, 2002, 2003].includes(e.d.year))) {
    assert.equal(d.status, "pendiente", id);
    assert.equal(d.verified, false, id);
    assert.equal(d.numero, undefined, `${id}: número de edición sin fuente (pendiente)`);
    assert.deepEqual(d.anioEstado?.sourceIds, [`pin-${id}`], id);
    assert.equal(d.anioEstado?.estado, id === "1999" ? "atribuido" : "confirmado", id);
    for (const campo of ["fechas", "horario", "apoyo", "asistencia", "venue", "organizer", "organizacion", "description"])
      assert.equal(d[campo], undefined, `${id}: «${campo}» sin fuente propia (debe quedar pendiente)`);
  }
  assert.match(pagina("/ediciones/1999/"), /año atribuido/, "/ediciones/1999/ debe decir «año atribuido»");
  assert.match(pagina("/ediciones/2003/"), /[Aa]ño según la inscripción/, "/ediciones/2003/ debe decir «año según la inscripción»");
});

/** Ancho y alto de un JPEG (marcador SOFn). */
const medidasJpeg = (buf) => {
  let i = 2;
  while (i < buf.length) {
    const m = buf[i + 1];
    const largo = buf.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { alto: buf.readUInt16BE(i + 5), ancho: buf.readUInt16BE(i + 7) };
    i += 2 + largo;
  }
  throw new Error("JPEG sin SOF");
};

test("cada pin: objeto con imagen ≤ 800 px, medidas reales, alt con la inscripción, su fuente y su página", () => {
  const PINES = [1994, 1995, 1996, 1997, 1998, 1999, 2002, 2003];
  for (const a of PINES) {
    const { d } = ediciones.find((e) => e.d.year === a);
    const pin = (d.documentos ?? []).find((x) => x.slug === "pin");
    assert.ok(pin, `${a}: falta el documento «pin»`);
    assert.equal(pin.apartado, "objetos", `${a}: el pin va en «objetos»`);
    assert.equal(pin.sourceId, `pin-${a}`, `${a}: fuente del pin`);
    assert.ok(d.sourceIds.includes(`pin-${a}`), `${a}: la fuente del pin no sale en «Fuentes»`);
    assert.equal(pin.caras.length, 1, `${a}: un objeto lleva una sola foto`);
    const c = pin.caras[0];
    assert.equal(c.imagen, `/documentos/pines/pin-${a}.jpg`);
    const f = join(RAIZ, "public", ...c.imagen.split("/").filter(Boolean));
    assert.ok(existsSync(f), `${a}: falta ${c.imagen}`);
    const m = medidasJpeg(readFileSync(f));
    assert.deepEqual([m.ancho, m.alto], [c.ancho, c.alto], `${a}: ancho/alto no casan con la imagen`);
    assert.ok(Math.max(m.ancho, m.alto) <= 800, `${a}: imagen de más de 800 px`);
    assert.ok(c.alt.length >= 60, `${a}: alt corto`);
    for (const t of c.texto) assert.ok(c.alt.includes(t), `${a}: el alt no copia la inscripción «${t}»`);
    const html = pagina(`/ediciones/${a}/pin/`);
    assert.ok(html.includes(`src="${c.imagen}"`) && html.includes(`width="${c.ancho}"`) && html.includes(`height="${c.alto}"`), `/ediciones/${a}/pin/: falta la imagen con medidas`);
    assert.ok(html.includes(`alt="${c.alt.replaceAll("'", "&#39;")}"`) || html.includes(`alt="${c.alt}"`), `/ediciones/${a}/pin/: falta el alt`);
    assert.ok(existsSync(join(DIST, "documentos", "pines", `pin-${a}.jpg`)), `${a}: la imagen no llega a dist/`);
    // Lo visual primero: sin folleto, la portada del año es el pin; 1997 sigue con el folleto.
    assert.equal(d.portada?.documento, { 1995: "folleto", 1996: "la-runa", 1997: "folleto", 1998: "cartel" }[a] ?? "pin", `${a}: portada`);
  }
});

test("documentos de 1992-1998 y sin fecha: página propia, imagen ≤ 1200 px con medidas y alt, y su fuente apunta a esa página", () => {
  const DOCS = [
    ["1992", "de-impresion-mayo"], ["1992", "de-impresion-diciembre"], ["1993", "cartel"],
    ["1995", "folleto"], ["1995", "mesas"], ["1995", "fanzine"], ["1996", "la-runa"], ["1998", "cartel"],
    ["sin-fecha", "folleto-jrt"], ["sin-fecha", "ultria-jrt"], ["sin-fecha", "cartel-csss"],
    ["sin-fecha", "cartel-proyecto-genesis"], ["sin-fecha", "articulo-paul-mv"],
  ];
  for (const [anio, slug] of DOCS) {
    const { d } = ediciones.find((e) => e.id === anio);
    const doc = (d.documentos ?? []).find((x) => x.slug === slug);
    assert.ok(doc, `${anio}: falta el documento ${slug}`);
    assert.ok(d.sourceIds.includes(doc.sourceId), `${anio}/${slug}: su fuente no sale en «Fuentes»`);
    const f = JSON.parse(readFileSync(join(RAIZ, "src", "content", "sources", `${doc.sourceId}.json`), "utf-8"));
    assert.equal(f.url, `https://www.talazbragoles.com/ediciones/${anio}/${slug}/`, `${doc.sourceId}: url = página del documento`);
    const html = pagina(`/ediciones/${anio}/${slug}/`);
    assert.ok(doc.caras.length > 0, `${anio}/${slug}: sin caras`);
    for (const c of doc.caras) {
      const img = join(RAIZ, "public", ...c.imagen.split("/").filter(Boolean));
      assert.ok(existsSync(img), `falta ${c.imagen}`);
      const m = medidasJpeg(readFileSync(img));
      assert.deepEqual([m.ancho, m.alto], [c.ancho, c.alto], `${c.imagen}: ancho/alto no casan`);
      assert.ok(Math.max(m.ancho, m.alto) <= 1200, `${c.imagen}: más de 1200 px`);
      assert.ok(c.alt.length >= 60, `${c.imagen}: alt corto`);
      assert.ok(html.includes(`src="${c.imagen}"`) && html.includes(`width="${c.ancho}"`), `/ediciones/${anio}/${slug}/: falta la imagen`);
      assert.ok(existsSync(join(DIST, ...c.imagen.split("/").filter(Boolean))), `${c.imagen} no llega a dist/`);
      if (!doc.tabla) assert.ok(c.texto.length > 0, `${anio}/${slug}: «${c.titulo}» sin texto copiado`);
    }
  }
  // Portadas: cartel en 1993 y 1998, folleto en 1995, La Runa en 1996, recorte de mayo en 1992.
  const portadas = { 1992: "de-impresion-mayo", 1993: "cartel", 1995: "folleto", 1996: "la-runa", 1998: "cartel" };
  for (const [a, slug] of Object.entries(portadas)) assert.equal(ediciones.find((e) => e.id === a).d.portada?.documento, slug, `${a}: portada`);
});

test("lista de mesas de 1995: tabla accesible con las 33 filas, cabeceras de columna y de fila", () => {
  const { d } = ediciones.find((e) => e.id === "1995");
  const t = d.documentos.find((x) => x.slug === "mesas").tabla;
  assert.ok(t, "1995/mesas: falta la tabla transcrita");
  assert.equal(t.filas.length, 33);
  assert.deepEqual(t.filas.map((f) => f[0]), Array.from({ length: 33 }, (_, i) => String(i + 1)), "mesas 1-33 en orden");
  const html = pagina("/ediciones/1995/mesas/");
  const tabla = html.match(/<table class="tz-tabla"[\s\S]*?<\/table>/)?.[0];
  assert.ok(tabla, "/ediciones/1995/mesas/: falta la tabla");
  assert.match(tabla, /<caption[^>]*>[^<]+<\/caption>/, "la tabla necesita caption");
  assert.equal([...tabla.matchAll(/<th scope="col"/g)].length, t.columnas.length, "cabeceras de columna");
  assert.equal([...tabla.matchAll(/<th scope="row"/g)].length, 33, "una cabecera de fila por mesa");
  assert.equal([...tabla.matchAll(/<td data-etiqueta=/g)].length, 33 * (t.columnas.length - 1), "cada celda con su etiqueta (se apila en móvil)");
  assert.match(tabla, /Star Wars · David/);
  assert.match(html, /tz-contenedor/, "la tabla va en un contenedor que la apila");
  // Actividades de 1995 agrupadas por juego (no 32 entradas sueltas).
  assert.ok(d.activities.length < 25 && d.activities.some((a) => /^AD&D: \d+ mesas$/.test(a.name)), "1995: actividades por juego");
});

test("hay una página por año, la de sin fecha y una por documento con caras", () => {
  for (const { id, d } of ediciones) {
    const html = pagina(`/ediciones/${id}/`);
    if (d.anioEstado?.estado === "deducido") assert.match(html, /año deducido/i, `/ediciones/${id}/ no dice que el año es deducido`);
    for (const doc of d.documentos ?? []) {
      if (doc.caras?.length) {
        pagina(`/ediciones/${id}/${doc.slug}/`);
        assert.ok(html.includes(`href="/ediciones/${id}/${doc.slug}/"`), `/ediciones/${id}/ no enlaza a su documento ${doc.slug}`);
      }
    }
    for (const ap of ["Papeles", "Objetos", "Prensa", "Fotos", "Recuerdos"]) assert.ok(html.includes(`>${ap}</h3>`), `/ediciones/${id}/: falta el apartado ${ap}`);
  }
  pagina("/ediciones/1997/folleto/");
});

test("/ediciones/ y la portada van de la más reciente a la más antigua, «sin fecha» al final", () => {
  const esperado = ["2003", "2002", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "sin-fecha"];
  for (const ruta of ["/ediciones/", "/"]) {
    const html = pagina(ruta);
    const orden = [...new Set([...html.matchAll(/href="\/ediciones\/([^/"]+)\/"/g)].map((m) => m[1]))];
    assert.deepEqual(orden, esperado, `${ruta}: orden de las ediciones`);
  }
});

test("cada página de año lleva el riel completo, en orden, con su año marcado y los bloques 01-06 en orden", () => {
  const esperado = ["2003", "2002", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "sin-fecha"];
  for (const id of esperado) {
    const html = pagina(`/ediciones/${id}/`);
    const riel = html.match(/<nav class="tz-riel"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(riel, `/ediciones/${id}/: falta el riel`);
    assert.match(riel, /aria-labelledby="riel-titulo"/, `/ediciones/${id}/: el riel no tiene nombre`);
    const orden = [...riel.matchAll(/href="\/ediciones\/([^/"]+)\/"/g)].map((m) => m[1]);
    assert.deepEqual(orden, esperado, `/ediciones/${id}/: orden del riel`);
    const actuales = [...riel.matchAll(/href="\/ediciones\/([^/"]+)\/"\s+aria-current="page"/g)].map((m) => m[1]);
    assert.deepEqual(actuales, [id], `/ediciones/${id}/: el riel debe marcar solo su año con aria-current="page"`);
    const bloques = ["s-resumen", "s-actividades", "s-organizacion", "s-lugar", "s-documentos", "s-fuentes"].map((b) => html.indexOf(`id="${b}"`));
    assert.ok(bloques.every((p) => p > 0), `/ediciones/${id}/: falta algún bloque 01-06`);
    assert.deepEqual([...bloques].sort((a, b) => a - b), bloques, `/ediciones/${id}/: los bloques 01-06 no van en orden`);
  }
});

test("/cronologia/ va de la entrada más reciente a la más antigua", () => {
  const html = pagina("/cronologia/");
  const anos = [...html.matchAll(/<span class="tz-crono-ano">(\d{4})<\/span>/g)].map((m) => Number(m[1]));
  assert.ok(anos.length >= 2, "la cronología debería tener entradas");
  assert.deepEqual(anos, [...anos].sort((a, b) => b - a));
});

test("las rutas viejas redirigen con 301 y nada enlaza a ellas", () => {
  const reglas = readFileSync(join(RAIZ, "public", "_redirects"), "utf-8")
    .split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).map((l) => l.split(/\s+/));
  for (const [vieja, nueva] of Object.entries(VIEJAS)) {
    for (const desde of [vieja, `${vieja}/`]) {
      const r = reglas.find(([d]) => d === desde);
      assert.ok(r, `falta la redirección de ${desde}`);
      assert.deepEqual(r.slice(1), [nueva, "301"], `${desde} debe ir a ${nueva} con 301`);
    }
    assert.ok(existsSync(join(DIST, ...nueva.split("/").filter(Boolean), "index.html")), `el destino ${nueva} no existe`);
  }
  assert.ok(existsSync(join(DIST, "_redirects")), "public/_redirects no llega a dist/");
  const viejas = Object.keys(VIEJAS).map((v) => v.split("/").pop());
  for (const archivo of archivosHtml()) {
    const html = readFileSync(archivo, "utf-8");
    for (const v of viejas) assert.ok(!html.includes(`/ediciones/${v}`), `${archivo} enlaza a la ruta vieja ${v}`);
  }
});

test("ninguna página de Ediciones nombra a quien dio los datos", () => {
  for (const archivo of archivosHtml().filter((f) => f.includes(`${join("dist", "ediciones")}`))) {
    assert.doesNotMatch(readFileSync(archivo, "utf-8"), /pablo\s*f|pablofm/i, archivo);
  }
});
