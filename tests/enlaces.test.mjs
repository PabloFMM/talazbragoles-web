// Enlaces internos del build: todo href/src que empieza por "/" debe existir en dist/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { DIST, archivosHtml } from "./_comun.mjs";

test("no hay enlaces internos rotos", () => {
  const rotos = [];
  let total = 0;
  for (const archivo of archivosHtml()) {
    const html = readFileSync(archivo, "utf-8");
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const url = m[1];
      if (url.startsWith("#")) {
        total++;
        if (url.length > 1 && !ids.has(decodeURIComponent(url.slice(1)))) rotos.push(`${archivo}: ancla ${url}`);
        continue;
      }
      if (!url.startsWith("/") || url.startsWith("//")) continue;
      total++;
      const [ruta, ancla] = url.split("#");
      let destino = join(DIST, decodeURIComponent(ruta.split("?")[0]));
      if (existsSync(destino) && statSync(destino).isDirectory()) destino = join(destino, "index.html");
      if (!existsSync(destino)) { rotos.push(`${archivo}: ${url}`); continue; }
      if (ancla && destino.endsWith(".html")) {
        const otro = readFileSync(destino, "utf-8");
        if (!new RegExp(`\\sid="${ancla.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(otro)) rotos.push(`${archivo}: ${url} (falta el ancla)`);
      }
    }
  }
  assert.ok(total > 50, `solo ${total} enlaces revisados`);
  assert.deepEqual(rotos, []);
});

test("canonical y sitemap apuntan al dominio definitivo", () => {
  for (const archivo of archivosHtml()) {
    const m = /<link rel="canonical" href="([^"]+)"/.exec(readFileSync(archivo, "utf-8"));
    assert.ok(m, `sin canonical: ${archivo}`);
    assert.ok(m[1].startsWith("https://www.talazbragoles.com/"), `${archivo}: ${m[1]}`);
  }
  assert.match(readFileSync(join(DIST, "robots.txt"), "utf-8"), /Sitemap: https:\/\/www\.talazbragoles\.com\/sitemap-index\.xml/);
});
