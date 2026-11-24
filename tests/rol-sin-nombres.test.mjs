// Sección Rol: lo que se publica no nombra a quien dio los datos.
// Lo que el grupo afirma (qué juega, qué edición) se publica como dato del grupo;
// quién lo dijo solo puede constar en proyecto/docs (no se publica).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { RAIZ } from "./_comun.mjs";
import { buscaPersonas, NOMBRE_REAL } from "../src/lib/privacidad.mjs";

const COLECCIONES = ["juegos", "systems", "licencias", "autoria", "editoriales", "modulos", "mesas", "campanas"];
const PROHIBIDO = /PabloFM|Pablo\s+Fern/i;

test("las fichas de Rol no nombran a PabloFM", () => {
  let revisados = 0;
  for (const col of COLECCIONES) {
    const dir = join(RAIZ, "src", "content", col);
    if (!existsSync(dir)) continue;
    const archivos = readdirSync(dir, { recursive: true }).map(String).filter((x) => /\.(mdx?|json)$/.test(x));
    for (const n of archivos) {
      const texto = readFileSync(join(dir, n), "utf-8");
      revisados++;
      texto.split("\n").forEach((linea, i) => {
        assert.ok(!PROHIBIDO.test(linea), `src/content/${col}/${n}:${i + 1} nombra a quien dio los datos: «${linea.trim()}»`);
      });
    }
  }
  assert.ok(revisados > 0, "no se ha revisado ninguna ficha");
});

// Rol 6/8 (crónicas de mesa): en `campanas` y `mesas` los jugadores salen solo con su
// personaje y quien dirige, como «DJ» (decisiones 1 y 52). Ni campos de persona
// (jugador, gm…) ni nombres reales. La única persona real nombrada en la fase 2 es
// la autoría del módulo base, y solo en `modulos`.
function fichas(col) {
  const dir = join(RAIZ, "src", "content", col);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((x) => x.endsWith(".md")).map((n) => {
    const texto = readFileSync(join(dir, n), "utf-8");
    const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(texto);
    assert.ok(m, `${col}/${n}: sin frontmatter`);
    return { n, data: parse(m[1]) ?? {}, cuerpo: m[2] };
  });
}

test("campañas y mesas no tienen campos de persona ni nombres reales", () => {
  let revisadas = 0;
  for (const col of ["campanas", "mesas"]) {
    for (const { n, data, cuerpo } of fichas(col)) {
      revisadas++;
      assert.deepEqual(buscaPersonas(data), [], `${col}/${n}`);
      assert.ok(!NOMBRE_REAL.test(cuerpo), `${col}/${n}: el cuerpo nombra a una persona real`);
    }
  }
  assert.ok(revisadas >= 2, "no se ha revisado ninguna campaña ni mesa");
  for (const { n, data } of fichas("campanas")) assert.equal(data.direccion, "DJ", `campanas/${n}: quien dirige sale como «DJ»`);
});

test("el detector de personas encuentra campos y nombres (prueba del propio detector)", () => {
  assert.ok(buscaPersonas({ jugador: "x" }).length > 0, "jugador");
  assert.ok(buscaPersonas({ gm: "x" }).length > 0, "gm");
  assert.ok(buscaPersonas({ reparto: [{ personaje: "Uruk", player: "x" }] }).length > 0, "player anidado");
  assert.ok(buscaPersonas({ resumen: "Dirige Christian" }).length > 0, "nombre real en un texto");
  assert.deepEqual(buscaPersonas({ reparto: [{ personaje: "Uruk", posicion: "Armonauta" }], direccion: "DJ" }), []);
});
