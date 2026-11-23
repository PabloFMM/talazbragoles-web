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
  assert.ok(Object.keys(juegos).length >= 10, "faltan juegos");
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
  for (const [col, fichas] of Object.entries({ juegos, ...existe })) {
    for (const [slug, d] of Object.entries(fichas)) {
      for (const f of d.fuentes ?? []) {
        assert.ok(f.afirma?.trim(), `${col}/${slug}: fuente sin «afirma» (${f.url})`);
        assert.ok(f.consultado, `${col}/${slug}: fuente sin fecha de consulta (${f.url})`);
      }
    }
  }
});
