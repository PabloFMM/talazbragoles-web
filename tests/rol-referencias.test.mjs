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
  licencias: coleccion("licencias"),
  autoria: coleccion("autoria"),
  editoriales: coleccion("editoriales"),
};

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
  for (const [col, fichas] of Object.entries({ juegos, ...existe })) {
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
