// Utilidades comunes de los tests.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const RAIZ = fileURLToPath(new URL("..", import.meta.url));
export const DIST = join(RAIZ, "dist");
export const ASESOR = "/mmo/wow-forever/asesor/";

/** Anchos que exige el proyecto: los 4 canónicos y los intermedios donde ya hubo fallos. */
export const ANCHOS = [320, 360, 390, 414, 480, 540, 600, 640, 700, 768, 820, 900, 1024, 1100, 1280, 1440];

function htmls(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...htmls(p));
    else if (n.endsWith(".html")) out.push(p);
  }
  return out;
}

/** Archivos .html del build. */
export function archivosHtml() {
  return htmls(DIST);
}

/** Rutas de todas las páginas del build ("/", "/fuentes/", …). Así ninguna página nueva queda sin probar. */
export function rutas() {
  return htmls(DIST)
    .map((f) => "/" + relative(DIST, f).split(sep).join("/").replace(/index\.html$/, ""))
    .sort();
}

// Las pestañas del asesor se leen de su variable TABS (así no se desincronizan).
/** Pestañas del asesor publicado, leídas de su `TABS=[…]`: sirven para crear un test por pestaña. */
export function pestanasAsesor() {
  const html = readFileSync(join(RAIZ, "public", "mmo", "wow-forever", "asesor", "index.html"), "utf-8");
  const m = /\bTABS=\[([^\]]*)\]/.exec(html);
  if (!m) throw new Error("No encuentro TABS=[…] en el asesor publicado");
  const lista = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  if (lista.length < 5) throw new Error(`TABS del asesor con solo ${lista.length} pestañas: ${lista}`);
  return lista;
}

/**
 * Abre el asesor (con `hash` opcional) y espera a que lleguen los precios de las subidas incluidas
 * (public/…/asesor/datos/*.json, se cargan con fetch al arrancar): mientras tanto, lo que depende de
 * precios dice «Cargando». Falla si alguna subida no ha llegado (data-precios="incompletos").
 */
export async function abrirAsesor(page, hash = "") {
  await page.goto(ASESOR + hash);
  await page.waitForFunction(() => document.documentElement.hasAttribute("data-precios"));
  const estado = await page.locator("html").getAttribute("data-precios");
  if (estado !== "listos") throw new Error(`El asesor no ha cargado todas las subidas (data-precios=${estado})`);
}
