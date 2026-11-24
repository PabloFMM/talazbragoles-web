// Sección Rol (fase 1): las referencias entre fichas apuntan a archivos que existen.
// `reference()` de Astro no lo comprueba en `astro check` ni en el build: un slug mal
// escrito daría una ficha con el dato perdido en silencio. Este test lo impide.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { RAIZ } from "./_comun.mjs";

const CONTENIDO = join(RAIZ, "src", "content");

/** { slug: frontmatter } de una colección en Markdown. */
function coleccion(nombre) {
  const dir = join(CONTENIDO, nombre);
  if (!existsSync(dir)) return {};
  const out = {};
  for (const n of readdirSync(dir).filter((x) => /\.mdx?$/.test(x))) {
    const texto = readFileSync(join(dir, n), "utf-8");
    const m = /^---\n([\s\S]*?)\n---/.exec(texto);
    assert.ok(m, `${nombre}/${n}: sin frontmatter`);
    out[n.replace(/\.mdx?$/, "")] = parse(m[1]) ?? {};
  }
  return out;
}

const juegos = coleccion("juegos");
const systems = coleccion("systems");
const existe = {
  systems,
  juegos,
  licencias: coleccion("licencias"),
  autoria: coleccion("autoria"),
  editoriales: coleccion("editoriales"),
  modulos: coleccion("modulos"),
  mesas: coleccion("mesas"),
  campanas: coleccion("campanas"),
};

/** Secciones de un módulo: src/content/modulos/<modulo>/<nn>-<slug>.md → [{ archivo, data, cuerpo }]. */
function secciones(modulo) {
  const dir = join(CONTENIDO, "modulos", modulo);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((x) => x.endsWith(".md")).sort().map((archivo) => {
    const texto = readFileSync(join(dir, archivo), "utf-8");
    const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(texto);
    assert.ok(m, `modulos/${modulo}/${archivo}: sin frontmatter`);
    return { archivo, data: parse(m[1]) ?? {}, cuerpo: m[2] };
  });
}

function compruebaRef(donde, col, slug) {
  assert.ok(slug in existe[col], `${donde}: «${slug}» no existe en src/content/${col}/`);
}

test("hay fichas de juegos con su sistema, licencias, autoría y editoriales", () => {
  assert.ok(Object.keys(juegos).length >= 13, "faltan juegos");
  for (const col of ["licencias", "autoria", "editoriales"]) assert.ok(Object.keys(existe[col]).length > 0, col);
});

test("las referencias de los juegos existen", () => {
  for (const [slug, d] of Object.entries(juegos)) {
    const donde = `juegos/${slug}`;
    if (d.sistema) compruebaRef(donde, "systems", d.sistema);
    for (const a of d.autoria ?? []) compruebaRef(donde, "autoria", a);
    for (const e of [...(d.editorial ?? []), ...(d.editorialCastellano ?? [])]) compruebaRef(donde, "editoriales", e);
    for (const l of d.licenciaJuego ?? []) compruebaRef(donde, "licencias", l.licencia);
  }
});

test("las ediciones apuntan a fichas que existen y sus traducciones a otra edición del juego", () => {
  for (const [slug, d] of Object.entries(juegos)) {
    const nombres = new Set((d.ediciones ?? []).map((e) => e.nombre));
    assert.equal(nombres.size, (d.ediciones ?? []).length, `juegos/${slug}: dos ediciones con el mismo nombre`);
    for (const e of d.ediciones ?? []) {
      const donde = `juegos/${slug} › ${e.nombre}`;
      if (e.editorial) compruebaRef(donde, "editoriales", e.editorial);
      if (e.licencia) compruebaRef(donde, "licencias", e.licencia);
      if (e.descarga) compruebaRef(donde, "licencias", e.descarga.licencia);
      if (e.traduccionDe) {
        assert.ok(nombres.has(e.traduccionDe), `${donde}: traduccionDe «${e.traduccionDe}» no es otra edición del juego`);
        assert.notEqual(e.traduccionDe, e.nombre, `${donde}: se traduce a sí misma`);
      }
    }
  }
});

test("las descargas solo salen de ediciones con licencia abierta o gratis en la web oficial", () => {
  // Abierta (CC, ORC, dominio público…) o PDF gratuito oficial («gratis/gratuito» en el formato).
  const abiertas = new Set(["cc", "orc", "abierta-propia", "dominio-publico"]);
  for (const [slug, d] of Object.entries(juegos)) {
    for (const e of d.ediciones ?? []) {
      if (!e.descarga) continue;
      const lic = existe.licencias[e.descarga.licencia];
      assert.ok(
        abiertas.has(lic.tipo) || /gratis|gratuit/i.test(e.descarga.formato),
        `juegos/${slug} › ${e.nombre}: descarga con licencia «${e.descarga.licencia}» que no es abierta ni consta como gratuita`
      );
    }
  }
});

test("las referencias de los sistemas existen", () => {
  for (const [slug, d] of Object.entries(systems)) {
    const donde = `systems/${slug}`;
    if (d.familia) compruebaRef(donde, "systems", d.familia);
    if (d.licencia) compruebaRef(donde, "licencias", d.licencia);
    for (const a of d.autoria ?? []) compruebaRef(donde, "autoria", a);
    for (const e of d.editorial ?? []) compruebaRef(donde, "editoriales", e);
  }
});

test("toda fuente de Rol dice qué afirma y cuándo se consultó", () => {
  const todas = (d) => [...(d.fuentes ?? []), ...(d.ediciones ?? []).flatMap((e) => e.fuentes ?? [])];
  for (const [col, fichas] of Object.entries(existe)) {
    for (const [slug, d] of Object.entries(fichas)) {
      for (const f of todas(d)) {
        assert.ok(f.afirma?.trim(), `${col}/${slug}: fuente sin «afirma» (${f.url})`);
        assert.ok(f.consultado, `${col}/${slug}: fuente sin fecha de consulta (${f.url})`);
      }
    }
  }
});

// Rol 5 (2026-11-23): portadas oficiales. Cada `portada` apunta a un archivo que
// existe en src/assets/rol/portadas/, lleva crédito, edición y permiso, y tiene
// una fuente en `fuentes[]` (datos: «portada») con la url oficial de la imagen.
test("cada portada tiene archivo, crédito y la url oficial de donde sale", () => {
  let n = 0;
  for (const [slug, d] of Object.entries(juegos)) {
    if (!d.portada) continue;
    n++;
    const p = d.portada;
    const ruta = join(CONTENIDO, "juegos", p.archivo);
    assert.ok(existsSync(ruta), `juegos/${slug}: no existe la imagen ${p.archivo}`);
    assert.match(p.archivo, /^\.\.\/\.\.\/assets\/rol\/portadas\/[a-z0-9-]+\.(jpg|png|webp)$/, `juegos/${slug}: la portada va en src/assets/rol/portadas/`);
    for (const c of ["credito", "edicion", "permiso"]) assert.ok(String(p[c] ?? "").trim(), `juegos/${slug}: portada sin «${c}»`);
    const f = (d.fuentes ?? []).filter((x) => x.datos?.includes("portada"));
    assert.equal(f.length, 1, `juegos/${slug}: la portada necesita UNA fuente con «portada» en datos`);
    assert.match(f[0].url, /^https:\/\//, `juegos/${slug}: la fuente de la portada debe ser https`);
    assert.ok(!f[0].secundaria, `juegos/${slug}: la portada sale de la web oficial, no de una fuente secundaria`);
  }
  assert.ok(n > 0, "ninguna ficha tiene portada: revisar la prueba");
});

// Rol 6/8 (2026-11-24): crónicas de mesa. Módulos, secciones, mesas y campañas
// apuntan a fichas que existen y llevan la licencia decidida (CC0 el módulo base,
// CC BY 4.0 lo propio de la campaña).
test("hay un módulo con secciones, una mesa y una campaña", () => {
  for (const col of ["modulos", "mesas", "campanas"]) assert.ok(Object.keys(existe[col]).length > 0, `no hay ${col}`);
  for (const slug of Object.keys(existe.modulos)) assert.ok(secciones(slug).length > 0, `modulos/${slug}: sin secciones`);
});

test("las referencias de módulos, secciones y campañas existen", () => {
  for (const [slug, d] of Object.entries(existe.modulos)) {
    const donde = `modulos/${slug}`;
    compruebaRef(donde, "juegos", d.juego);
    compruebaRef(donde, "licencias", d.licencia);
    assert.equal(d.licencia, "cc0-1.0", `${donde}: el módulo base es CC0`);
    if (d.campana) compruebaRef(donde, "campanas", d.campana);
  }
  for (const [slug, d] of Object.entries(existe.campanas)) {
    const donde = `campanas/${slug}`;
    compruebaRef(donde, "juegos", d.juego);
    compruebaRef(donde, "mesas", d.mesa);
    compruebaRef(donde, "licencias", d.licencia);
    assert.equal(d.licencia, "cc-by-4.0", `${donde}: la campaña es CC BY 4.0`);
    if (d.modulo) {
      compruebaRef(donde, "modulos", d.modulo);
      assert.equal(existe.modulos[d.modulo].campana, slug, `${donde}: el módulo «${d.modulo}» no enlaza de vuelta a la campaña`);
    }
  }
});

test("cada sección del módulo es de su módulo, va en orden y comparte licencia y autoría", () => {
  for (const [slug, ficha] of Object.entries(existe.modulos)) {
    const ss = secciones(slug);
    ss.forEach(({ archivo, data }, i) => {
      const donde = `modulos/${slug}/${archivo}`;
      assert.equal(data.modulo, slug, `${donde}: «modulo» debe ser «${slug}»`);
      assert.equal(data.orden, i + 1, `${donde}: «orden» debe ser ${i + 1}`);
      assert.equal(archivo, `${String(data.orden).padStart(2, "0")}-${data.slug}.md`, `${donde}: el archivo se llama <nn>-<slug>.md`);
      assert.equal(data.licencia, ficha.licencia, `${donde}: licencia distinta de la del módulo`);
      assert.equal(data.autoria, ficha.autoria, `${donde}: autoría distinta de la del módulo`);
    });
    assert.equal(new Set(ss.map((s) => s.data.slug)).size, ss.length, `modulos/${slug}: dos secciones con el mismo slug`);
  }
});

test("las imágenes del módulo existen y llevan texto alternativo y pie", () => {
  let n = 0;
  for (const slug of Object.keys(existe.modulos)) {
    for (const { archivo, cuerpo } of secciones(slug)) {
      for (const m of cuerpo.matchAll(/!\[([^\]]*)\]\(([^)]+)\)(\n\*[^\n]+\*)?/g)) {
        n++;
        const donde = `modulos/${slug}/${archivo}: ${m[2]}`;
        assert.match(m[2], /^\.\.\/\.\.\/\.\.\/assets\/rol\/[a-z0-9-]+\/[a-z0-9-]+\.(jpg|png|webp)$/, `${donde}: la imagen va en src/assets/rol/<módulo>/`);
        assert.ok(existsSync(join(CONTENIDO, "modulos", slug, m[2])), `${donde}: no existe`);
        assert.ok(m[1].trim().length > 20, `${donde}: texto alternativo vacío o muy corto`);
        assert.ok(m[3], `${donde}: falta el pie (línea en cursiva justo debajo)`);
      }
    }
  }
  assert.ok(n > 0, "el módulo no tiene imágenes: revisar la prueba");
});

test("las aportaciones de una campaña las propone un personaje del reparto", () => {
  for (const [slug, d] of Object.entries(existe.campanas)) {
    const pj = new Set((d.reparto ?? []).map((r) => r.personaje));
    for (const a of d.aportaciones ?? []) {
      if (a.personaje) assert.ok(pj.has(a.personaje), `campanas/${slug} › ${a.nombre}: «${a.personaje}» no está en el reparto`);
      if (a.grado === "inscrita") assert.ok(a.manual?.version && a.manual?.capitulo, `campanas/${slug} › ${a.nombre}: inscrita sin versión ni capítulo del manual`);
    }
  }
});
