// Lo generado coincide con su origen (proyecto/).
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { RAIZ, archivosHtml } from "./_comun.mjs";

test("las guías publicadas son las de proyecto/docs/guias", () => {
  const origen = join(RAIZ, "proyecto", "docs", "guias");
  const destino = join(RAIZ, "src", "content", "guides");
  const lista = (d) => readdirSync(d).filter((n) => /^[a-z].*\.md$/.test(n)).sort();
  assert.deepEqual(lista(destino), lista(origen));
  assert.ok(lista(origen).length >= 10);
  for (const n of lista(origen)) assert.equal(readFileSync(join(destino, n), "utf-8"), readFileSync(join(origen, n), "utf-8"), n);
});

test("el asesor publicado es el que genera proyecto/tools/build-asesor.py", () => {
  // --comprobar genera en memoria y compara: el test no reescribe public/ (antes lo hacía, y al fallar lo «arreglaba»).
  const env = { ...process.env, PYTHONDONTWRITEBYTECODE: "1" };
  delete env.TZ_REPO; // el repo es este (proyecto/tools está dentro)
  try {
    execFileSync("python3", [join(RAIZ, "proyecto", "tools", "build-asesor.py"), "--comprobar"], { stdio: "pipe", env });
  } catch (e) {
    assert.fail(String(e.stderr || e.message).trim());
  }
  assert.match(readFileSync(join(RAIZ, "public", "mmo", "wow-forever", "asesor", "index.html"), "utf-8"), /wowf-chaman-v1/);
});

test("ninguna página usa alert, confirm ni prompt", () => {
  // Todo el build (asesor incluido): código de <script> sin comentarios /* */ y atributos on…="…".
  const llamada = /(?<![\w.$])(?:window\.)?(alert|confirm|prompt)\s*\(/;
  const paginas = archivosHtml();
  assert.ok(paginas.length > 10, `solo ${paginas.length} páginas en dist/ (¿falta npm run build?)`);
  const fallos = [];
  let scripts = 0;
  for (const archivo of paginas) {
    const html = readFileSync(archivo, "utf-8");
    const codigo = [
      ...[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1].replace(/\/\*[\s\S]*?\*\//g, "")),
      ...[...html.matchAll(/\son[a-z]+="([^"]*)"/g)].map((m) => m[1]),
    ];
    scripts += codigo.length;
    for (const c of codigo) {
      const m = llamada.exec(c);
      if (m) fallos.push(`${archivo}: ${m[0]}`);
    }
  }
  assert.ok(scripts > 50, `solo ${scripts} trozos de código revisados`); // el asesor tiene cientos de onclick
  assert.deepEqual(fallos, []);
});
