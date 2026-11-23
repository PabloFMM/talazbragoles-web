// Sección Rol: lo que se publica no nombra a quien dio los datos.
// Lo que el grupo afirma (qué juega, qué edición) se publica como dato del grupo;
// quién lo dijo solo puede constar en proyecto/docs (no se publica).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "./_comun.mjs";

const COLECCIONES = ["juegos", "systems", "licencias", "autoria", "editoriales"];
const PROHIBIDO = /PabloFM|Pablo\s+Fern/i;

test("las fichas de Rol no nombran a PabloFM", () => {
  let revisados = 0;
  for (const col of COLECCIONES) {
    const dir = join(RAIZ, "src", "content", col);
    if (!existsSync(dir)) continue;
    for (const n of readdirSync(dir).filter((x) => /\.(mdx?|json)$/.test(x))) {
      const texto = readFileSync(join(dir, n), "utf-8");
      revisados++;
      texto.split("\n").forEach((linea, i) => {
        assert.ok(!PROHIBIDO.test(linea), `src/content/${col}/${n}:${i + 1} nombra a quien dio los datos: «${linea.trim()}»`);
      });
    }
  }
  assert.ok(revisados > 0, "no se ha revisado ninguna ficha");
});
