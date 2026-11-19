#!/usr/bin/env node
/**
 * Genera public/og.png (imagen para redes sociales, 1200 × 630) solo con tipografía:
 * papel #f4f0e6, «Talazbrágoles» en Source Serif 4 fino y «Archivo de las Jornadas»
 * en Archivo, con las fuentes autoalojadas del sitio (public/fonts, SIL OFL 1.1).
 *
 * Uso, desde el repo (worktree con node_modules):
 *     node proyecto/tools/og-imagen.mjs
 * Desde la carpeta de trabajo: TZ_REPO=repo-rediseno node tools/og-imagen.mjs
 *
 * Usa el Chromium de Playwright (devDependency del repo). Si falta:
 *     npx playwright install chromium
 * Reproducible: mismas fuentes + mismo Chromium = mismo PNG. Comprueba al final
 * que la imagen mide 1200 × 630 y que las dos fuentes han cargado.
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
// proyecto/tools/ dentro del repo → el repo está dos niveles arriba; tools/ de la carpeta de trabajo → ../repo.
const REPO = process.env.TZ_REPO
  ? resolve(process.env.TZ_REPO)
  : existsSync(join(AQUI, "..", "..", "astro.config.mjs"))
    ? resolve(AQUI, "..", "..")
    : resolve(AQUI, "..", "repo");
if (!existsSync(join(REPO, "astro.config.mjs"))) {
  console.error(`og-imagen: no encuentro el repo en ${REPO} (usa TZ_REPO=<ruta del repo>).`);
  process.exit(1);
}

const ANCHO = 1200;
const ALTO = 630;
const SALIDA = join(REPO, "public", "og.png");

const fuente = (archivo) => {
  const ruta = join(REPO, "public", "fonts", archivo);
  if (!existsSync(ruta)) {
    console.error(`og-imagen: falta la fuente ${ruta}`);
    process.exit(1);
  }
  return `data:font/woff2;base64,${readFileSync(ruta).toString("base64")}`;
};

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><style>
  @font-face { font-family: "Archivo"; font-weight: 100 900; font-stretch: 62% 125%; src: url(${fuente("archivo-wdth-wght.woff2")}) format("woff2"); }
  @font-face { font-family: "Source Serif 4"; font-weight: 200 900; src: url(${fuente("source-serif-4-opsz-wght.woff2")}) format("woff2"); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${ANCHO}px; height: ${ALTO}px; background: #f4f0e6; color: #0f0f10; }
  body { display: flex; flex-direction: column; justify-content: flex-end; padding: 0 96px 104px; }
  .filete { position: absolute; left: 96px; right: 96px; top: 96px; border-top: 2px solid #0f0f10; }
  .nombre { font-family: "Source Serif 4", serif; font-weight: 300; font-optical-sizing: auto; font-size: 168px; line-height: 1.1; letter-spacing: -0.015em; }
  .sub { margin-top: 48px; font-family: "Archivo", sans-serif; font-weight: 500; font-size: 34px; letter-spacing: 0.14em; text-transform: uppercase; line-height: 1.3; }
</style></head><body>
  <div class="filete"></div>
  <p class="nombre">Talazbrágoles</p>
  <p class="sub">Archivo de las Jornadas</p>
</body></html>`;

const require = createRequire(join(REPO, "package.json"));
const { chromium } = require("@playwright/test");

const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({ viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: 1 });
  await pagina.setContent(html, { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  const cargadas = await pagina.evaluate(() =>
    ["300 20px 'Source Serif 4'", "500 20px Archivo"].map((f) => document.fonts.check(f)),
  );
  if (cargadas.includes(false)) throw new Error(`no han cargado las fuentes: ${JSON.stringify(cargadas)}`);
  // Que nada se salga de la imagen.
  const desborda = await pagina.evaluate(
    ([w, h]) => [...document.querySelectorAll("p")].some((p) => { const r = p.getBoundingClientRect(); return r.right > w || r.bottom > h || r.left < 0; }),
    [ANCHO, ALTO],
  );
  if (desborda) throw new Error("el texto se sale de la imagen");
  const png = await pagina.screenshot({ type: "png", clip: { x: 0, y: 0, width: ANCHO, height: ALTO } });
  // Cabecera PNG: ancho y alto en los bytes 16-23.
  const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
  if (w !== ANCHO || h !== ALTO) throw new Error(`la imagen mide ${w} × ${h}`);
  writeFileSync(SALIDA, png);
  console.log(`og-imagen: ${SALIDA} (${w} × ${h}, ${png.length} bytes)`);
} catch (e) {
  console.error(`og-imagen: ${e.message}`);
  process.exitCode = 1;
} finally {
  await navegador.close();
}
