// Utilidades comunes de los tests.
import { readdirSync, statSync } from "node:fs";
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

/** Pestañas del asesor. */
export const PESTANAS = ["hoy", "pj", "equipo", "prof", "almacen", "oro", "subasta", "diario", "hermandad", "tower", "mortem", "woldrik", "ayuda", "wfuentes"];
