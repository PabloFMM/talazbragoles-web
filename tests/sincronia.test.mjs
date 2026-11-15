// Lo generado coincide con su origen (proyecto/).
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "./_comun.mjs";

test("las guías publicadas son las de proyecto/docs/guias", () => {
  const origen = join(RAIZ, "proyecto", "docs", "guias");
  const destino = join(RAIZ, "src", "content", "guides");
  const lista = (d) => readdirSync(d).filter((n) => /^[a-z].*\.md$/.test(n)).sort();
  assert.deepEqual(lista(destino), lista(origen));
  assert.ok(lista(origen).length >= 10);
  for (const n of lista(origen)) assert.equal(readFileSync(join(destino, n), "utf-8"), readFileSync(join(origen, n), "utf-8"), n);
});

test("el asesor publicado es el que genera proyecto/tools/build-asesor.py", () => {
  const archivo = join(RAIZ, "public", "mmo", "wow-forever", "asesor", "index.html");
  const antes = readFileSync(archivo, "utf-8");
  execFileSync("python3", [join(RAIZ, "proyecto", "tools", "build-asesor.py")], { stdio: "pipe" });
  assert.equal(readFileSync(archivo, "utf-8"), antes, "public/…/asesor/index.html no coincide con proyecto/web/index.html: ejecuta build-asesor.py");
  assert.match(antes, /wowf-chaman-v1/);
});

test("ninguna página usa alert, confirm ni prompt", () => {
  const asesor = readFileSync(join(RAIZ, "public", "mmo", "wow-forever", "asesor", "index.html"), "utf-8");
  assert.doesNotMatch(asesor.replace(/\/\*.*?\*\//gs, ""), /(?<![\w.])(alert|confirm|prompt)\s*\(/);
});
