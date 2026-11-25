// Crónicas de mesa publicadas (Rol 7/8, 2026-11-24), sobre el build (dist/):
// - existen las páginas de módulos, secciones, campaña y mesa, y el .md completo;
// - las ilustraciones salen como <figure class="tz-modulo-imagen"> con pie, alt y srcset;
// - el .md lleva la cabecera de licencia CC0 y la autoría, sin comentarios internos;
// - la autoría real (única persona nombrada) solo sale en las páginas del módulo;
// - /rol/ y la ficha de Numinia enlazan módulo, campaña y aportaciones (con anclas que existen).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { DIST, archivosHtml } from "./_comun.mjs";

const MODULO = "los-navegantes-del-sueno";
const SECCIONES = ["raiz", "presentacion-y-deliberacion", "investigacion", "suenos-piezas-anclajes", "reflexion-y-accion", "resolucion-y-anexos", "guia-del-dj"];
const pagina = (ruta) => {
  const f = join(DIST, ...ruta.split("/").filter(Boolean), "index.html");
  assert.ok(existsSync(f), `falta la página ${ruta} en dist/ (¿se ha hecho el build?)`);
  return readFileSync(f, "utf-8");
};
const ruta = (f) => "/" + relative(DIST, f).split(sep).join("/").replace(/index\.html$/, "");

test("existen las páginas de las crónicas de mesa", () => {
  for (const r of ["/rol/modulos/", `/rol/modulos/${MODULO}/`, ...SECCIONES.map((s) => `/rol/modulos/${MODULO}/${s}/`),
    `/rol/campanas/`, `/rol/campanas/${MODULO}/`, "/rol/mesas/", "/rol/mesas/el-club-de-los-miercoles/"]) pagina(r);
});

test("cada sección tiene índice interno con anclas que existen y paso anterior/siguiente", () => {
  for (const s of SECCIONES) {
    const html = pagina(`/rol/modulos/${MODULO}/${s}/`);
    const anclas = [...html.matchAll(/class="tz-indice-guia tz-modulo-indice tz-modulo-indice--ancho"[\s\S]*?<\/nav>/g)][0]?.[0] ?? "";
    const hrefs = [...anclas.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    assert.ok(hrefs.length >= 3, `${s}: índice interno con menos de 3 apartados`);
    for (const id of hrefs) assert.ok(html.includes(`id="${id}"`), `${s}: el índice apunta a #${id}, que no existe`);
    assert.match(html, /class="tz-modulo-paso"/, `${s}: falta anterior/siguiente`);
  }
});

test("las 9 ilustraciones salen en figura con pie, alt, medidas y srcset", () => {
  let n = 0;
  for (const s of SECCIONES) {
    const html = pagina(`/rol/modulos/${MODULO}/${s}/`);
    for (const [fig] of html.matchAll(/<figure class="tz-modulo-imagen">[\s\S]*?<\/figure>/g)) {
      n++;
      assert.match(fig, /<img [^>]*alt="[^"]{20,}"/, `${s}: ilustración sin alt descriptivo`);
      assert.match(fig, /width="\d+"[^>]*height="\d+"/, `${s}: ilustración sin medidas`);
      assert.match(fig, /srcset="[^"]*480w[^"]*800w/, `${s}: ilustración sin srcset`);
      assert.match(fig, /<figcaption>[^<]{10,}/, `${s}: ilustración sin pie`);
    }
    assert.doesNotMatch(html, /<p><img /, `${s}: queda una imagen suelta en un párrafo`);
  }
  assert.equal(n, 9);
});

test("el módulo completo en Markdown lleva licencia, autoría y todas las secciones, sin comentarios", () => {
  const f = join(DIST, "rol", "modulos", `${MODULO}.md`);
  assert.ok(existsSync(f), "falta el .md del módulo");
  const md = readFileSync(f, "utf-8");
  assert.match(md, /^# Los Navegantes del Sueño/);
  assert.match(md, /CC0 1\.0/);
  assert.match(md, /Christian Märtens, storyteller de Numen Games/);
  assert.doesNotMatch(md, /<!--|\[pendiente|Decisiones de redacción/);
  assert.equal((md.match(/^# \d\d\. /gm) || []).length, SECCIONES.length);
  for (const [, url] of md.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) assert.match(url, /^https:\/\/www\.talazbragoles\.com\/_astro\/.+\.jpg$/);
  for (const [, url] of md.matchAll(/!\[[^\]]*\]\(https:\/\/www\.talazbragoles\.com(\/_astro\/[^)]+)\)/g))
    assert.ok(existsSync(join(DIST, ...url.split("/").filter(Boolean))), `imagen del .md sin publicar: ${url}`);
});

test("la autoría real solo sale en las páginas del módulo", () => {
  for (const f of archivosHtml(DIST)) {
    if (ruta(f).startsWith(`/rol/modulos/${MODULO}/`)) continue;
    assert.doesNotMatch(readFileSync(f, "utf-8"), /Christian|Märtens/, `${ruta(f)} nombra a la autoría del módulo`);
  }
});

test("la campaña: aviso de destripe, licencia CC BY, DJ, reparto, jornadas y fichas del Tesaurum Verba", () => {
  const html = pagina(`/rol/campanas/${MODULO}/`);
  assert.match(html, /aria-label="Aviso de destripe"/);
  assert.match(html, /href="\/rol\/licencias\/cc-by-4\.0\/"/);
  assert.match(html, /<dt>Quién dirige<\/dt>\s*<dd>\s*DJ\s*<\/dd>/);
  assert.equal((html.match(/class="tz-jornada"/g) || []).length, 15);
  assert.ok((html.match(/Registro del Tesaurum Verba/g) || []).length >= 5);
  assert.match(html, new RegExp(`href="/rol/modulos/${MODULO}/"`));
});

test("/rol/ y la ficha de Numinia enlazan las crónicas", () => {
  const rol = pagina("/rol/");
  assert.doesNotMatch(rol, /En preparación/);
  for (const h of [`/rol/modulos/${MODULO}/`, `/rol/campanas/${MODULO}/`, "/rol/mesas/el-club-de-los-miercoles/"]) assert.ok(rol.includes(`href="${h}"`), `/rol/ no enlaza ${h}`);
  const numinia = pagina("/rol/juegos/numinia/");
  assert.match(numinia, /Aportaciones al Corpus Numiniense/);
  const campana = pagina(`/rol/campanas/${MODULO}/`);
  const anclas = [...numinia.matchAll(new RegExp(`href="/rol/campanas/${MODULO}/#([^"]+)"`, "g"))].map((m) => m[1]);
  assert.ok(anclas.length >= 5, "la ficha de Numinia no enlaza las aportaciones");
  for (const a of anclas) assert.ok(campana.includes(`id="${a}"`), `#${a} no existe en la campaña`);
});
