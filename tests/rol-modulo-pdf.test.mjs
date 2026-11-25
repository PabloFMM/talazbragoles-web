// PDF maquetado de los módulos (Rol 10): existe, es un PDF y está al día con sus fuentes.
// Si falla «desfasado»: `PLAYWRIGHT_BROWSERS_PATH=… node scripts/pdf-modulo.mjs <modulo>` y commit del PDF.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { hashFuentes } from "../scripts/pdf-modulo.mjs";

const modulos = readdirSync("src/content/modulos").filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));

for (const m of modulos) {
  test(`PDF del módulo ${m}: existe y está al día`, () => {
    const ruta = `public/descargas/${m}.pdf`;
    assert.ok(existsSync(ruta), `falta ${ruta}`);
    const b = readFileSync(ruta);
    assert.equal(b.subarray(0, 5).toString(), "%PDF-");
    assert.ok(b.length < 15 * 1048576, "el PDF pesa más de 15 MB");
    const guardado = readFileSync(`scripts/pdf-huellas/${m}.txt`, "utf8").trim();
    assert.equal(guardado, hashFuentes(m), `PDF desfasado: el texto, las imágenes o el script cambiaron; regenera ${ruta}`);
  });
}
