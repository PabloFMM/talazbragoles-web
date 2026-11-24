// Sección Ediciones, sobre el contenido y el build (dist/):
// - una página por año (/ediciones/<año>/) más /ediciones/sin-fecha/, y una por documento con caras;
// - /ediciones/ y la portada las listan de la MÁS RECIENTE a la MÁS ANTIGUA, «sin fecha» al final;
// - las rutas viejas redirigen (301) a las nuevas en public/_redirects (Cloudflare Workers) y nada enlaza a ellas;
// - los años deducidos lo dicen y citan su fuente; ninguna página nombra a quien dio los datos.
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

test("la I y la II (1992-1993) siguen pendientes, con año y número deducidos y sin ningún dato", () => {
  for (const { id, d } of ediciones.filter((e) => [1992, 1993].includes(e.d.year))) {
    assert.equal(d.status, "pendiente", id);
    assert.equal(d.verified, false, id);
    assert.equal(d.anioEstado?.estado, "deducido", id);
    assert.deepEqual(d.anioEstado?.sourceIds, ["folleto-vi-jornadas-1997"], id);
    assert.equal(d.numero?.entero, d.year - 1991, `${id}: número de edición`);
    assert.equal(d.numero?.deducido, true, `${id}: el número es deducido`);
    for (const campo of ["fechas", "horario", "apoyo", "asistencia", "venue", "organizer", "organizacion", "portada", "description"])
      assert.equal(d[campo], undefined, `${id}: «${campo}» sin fuente propia (debe quedar pendiente)`);
    assert.equal((d.documentos ?? []).length, 0, `${id}: no hay documentos`);
  }
});

test("1994-1996: año confirmado por su pin; el número (III, IV, V) sigue deducido", () => {
  for (const { id, d } of ediciones.filter((e) => [1994, 1995, 1996].includes(e.d.year))) {
    assert.equal(d.anioEstado?.estado, "confirmado", id);
    assert.deepEqual(d.anioEstado?.sourceIds, [`pin-${id}`], id);
    assert.equal(d.numero?.entero, d.year - 1991, `${id}: número de edición`);
    assert.equal(d.numero?.deducido, true, `${id}: el número sigue deducido`);
    assert.equal(d.verified, false, id);
    // Sin el riel: su leyenda («1992-1993: año deducido») y textos ocultos salen en todas las páginas.
    const html = pagina(`/ediciones/${id}/`).replace(/<nav class="tz-riel"[\s\S]*?<\/nav>/, "");
    assert.match(html, /número deducido/, `/ediciones/${id}/ no dice que el número es deducido`);
    assert.doesNotMatch(html, /año deducido/i, `/ediciones/${id}/ ya no es año deducido`);
  }
});

test("1998, 1999, 2002 y 2003: pendientes, sin verificar, sin número; 1999 con año atribuido", () => {
  for (const { id, d } of ediciones.filter((e) => [1998, 1999, 2002, 2003].includes(e.d.year))) {
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
    assert.equal(d.portada?.documento, a === 1997 ? "folleto" : "pin", `${a}: portada`);
  }
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
