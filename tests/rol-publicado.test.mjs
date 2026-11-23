// Sección Rol, sobre el build (dist/): lo que se publica cumple la regla documental.
// - Existe al menos una página de cada tipo (portada, catálogo, ficha, filtradas, sistemas, licencias, autoría, editoriales).
// - Ninguna página de /rol/ nombra a quien dio los datos.
// - En las fichas de juego, ningún dato sale vacío: sin valor (ni fuente) se pinta «pendiente».
// Los specs de Playwright (lectura, axe, teclado) recorren solos todas las rutas de dist/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { DIST, RAIZ, archivosHtml } from "./_comun.mjs";

const pagina = (ruta) => {
  const f = join(DIST, ...ruta.split("/").filter(Boolean), "index.html");
  assert.ok(existsSync(f), `falta la página ${ruta} en dist/ (¿se ha hecho el build?)`);
  return readFileSync(f, "utf-8");
};
const texto = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const MUESTRA = [
  "/rol/",
  "/rol/juegos/",
  "/rol/juegos/dungeon-world/",
  "/rol/juegos/numinia/",
  "/rol/juegos/licencia/abierta/",
  "/rol/juegos/descargables/",
  "/rol/juegos/en-castellano/",
  "/rol/juegos/sistema/powered-by-the-apocalypse/",
  "/rol/sistemas/",
  "/rol/sistemas/powered-by-the-apocalypse/",
  "/rol/licencias/",
  "/rol/licencias/cc-by-4.0/",
  "/rol/autoria/",
  "/rol/editoriales/",
  "/sistemas/",
];

test("hay una página de cada tipo de la sección Rol", () => {
  for (const r of MUESTRA) pagina(r);
  const dirs = (d) => readdirSync(join(DIST, "rol", d), { withFileTypes: true }).filter((x) => x.isDirectory()).length;
  for (const d of ["autoria", "editoriales", "juegos/genero", "juegos/modo", "juegos/formato"]) {
    assert.ok(dirs(d) > 0, `/rol/${d}/ no tiene ninguna página`);
  }
});

test("ninguna página de /rol/ nombra a quien dio los datos", () => {
  const PROHIBIDO = /PabloFM|Pablo\s+Fern[aá]ndez|seg[uú]n\s+Pablo/i;
  const paginas = archivosHtml().filter((f) => relative(DIST, f).split(sep)[0] === "rol");
  assert.ok(paginas.length > 50, `solo ${paginas.length} páginas en /rol/`);
  for (const f of paginas) {
    const m = PROHIBIDO.exec(readFileSync(f, "utf-8"));
    assert.equal(m, null, `${relative(DIST, f)} contiene «${m?.[0]}»`);
  }
});

test("Numinia se publica con el estado «En construcción»", () => {
  assert.match(texto(pagina("/rol/juegos/numinia/")), /En construcción/);
});

// Campo del frontmatter → etiqueta de la ficha. Si el campo no está, la ficha debe decir «pendiente».
const CAMPOS = { ano: "Año", autoria: "Autoría", sistema: "Sistema", editorial: "Editorial", jugadores: "Jugadores" };

test("las fichas de juego no muestran datos vacíos: sin dato, «pendiente»", () => {
  const dir = join(RAIZ, "src", "content", "juegos");
  const fichas = readdirSync(dir).filter((n) => n.endsWith(".md"));
  assert.ok(fichas.length > 0);
  let pendientes = 0;
  for (const n of fichas) {
    const md = readFileSync(join(dir, n), "utf-8");
    const fm = md.split(/^---\s*$/m)[1] ?? "";
    if (/^draft:\s*true/m.test(fm)) continue;
    const slug = n.replace(/\.md$/, "");
    const html = pagina(`/rol/juegos/${slug}/`);
    // Primera lista de datos de la página = datos del juego.
    const dl = /<dl class="tz-datos[^"]*"[^>]*>([\s\S]*?)<\/dl>/.exec(html);
    assert.ok(dl, `${slug}: no encuentro la lista de datos`);
    const filas = [...dl[1].matchAll(/<dt>([\s\S]*?)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/g)].map((m) => [texto(m[1]), texto(m[2])]);
    assert.ok(filas.length >= 8, `${slug}: solo ${filas.length} datos`);
    for (const [et, val] of filas) assert.ok(val.length > 0, `${slug}: «${et}» sale vacío`);
    const datos = new Map(filas);
    for (const [campo, et] of Object.entries(CAMPOS)) {
      if (new RegExp(`^${campo}:`, "m").test(fm)) continue;
      pendientes++;
      assert.ok(datos.has(et), `${slug}: falta la fila «${et}»`);
      assert.equal(datos.get(et), "pendiente", `${slug}: sin «${campo}» en el .md, «${et}» debería decir «pendiente» y dice «${datos.get(et)}»`);
    }
  }
  assert.ok(pendientes > 0, "ningún campo vacío comprobado: revisar la prueba");
});
