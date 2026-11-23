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

test("de la I a la VI hay una edición por año, 1992-1997, y la I-IV son pendientes con año deducido", () => {
  const anios = ediciones.filter((e) => e.d.year !== "desconocida").map((e) => e.d.year).sort();
  assert.deepEqual(anios, [1992, 1993, 1994, 1995, 1996, 1997]);
  for (const { id, d } of ediciones.filter((e) => [1992, 1993, 1994, 1995].includes(e.d.year))) {
    assert.equal(d.status, "pendiente", id);
    assert.equal(d.verified, false, id);
    assert.equal(d.anioEstado?.estado, "deducido", id);
    assert.deepEqual(d.anioEstado?.sourceIds, ["folleto-vi-jornadas-1997"], id);
    assert.equal(d.numero?.entero, d.year - 1991, `${id}: número de edición`);
    for (const campo of ["fechas", "horario", "apoyo", "asistencia", "venue", "organizer", "organizacion", "portada", "description"])
      assert.equal(d[campo], undefined, `${id}: «${campo}» sin fuente propia (debe quedar pendiente)`);
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
    for (const ap of ["Papeles", "Prensa", "Fotos", "Recuerdos"]) assert.ok(html.includes(`>${ap}</h3>`), `/ediciones/${id}/: falta el apartado ${ap}`);
  }
  pagina("/ediciones/1997/folleto/");
});

test("/ediciones/ y la portada van de la más reciente a la más antigua, «sin fecha» al final", () => {
  const esperado = ["1997", "1996", "1995", "1994", "1993", "1992", "sin-fecha"];
  for (const ruta of ["/ediciones/", "/"]) {
    const html = pagina(ruta);
    const orden = [...new Set([...html.matchAll(/href="\/ediciones\/([^/"]+)\/"/g)].map((m) => m[1]))];
    assert.deepEqual(orden, esperado, `${ruta}: orden de las ediciones`);
  }
});

test("cada página de año lleva el riel completo, en orden, con su año marcado y los bloques 01-06 en orden", () => {
  const esperado = ["1997", "1996", "1995", "1994", "1993", "1992", "sin-fecha"];
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
