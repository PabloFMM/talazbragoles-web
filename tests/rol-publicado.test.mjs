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

// Rol 5 (2026-11-23): portadas oficiales. Juego con `portada` → <img> con alt
// «Portada de …», width/height y AVIF/WebP, y crédito con enlace a la fuente de
// la imagen. Juego sin `portada` → hueco tipográfico y ninguna imagen.
const imagenes = (html) => [...html.matchAll(/<img\b[^>]*class="tz-portada-img"[^>]*>/g)].map((m) => m[0]);
const decodifica = (s) => s?.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
const attr = (tag, a) => decodifica(new RegExp(`\\s${a}="([^"]*)"`).exec(tag)?.[1]);

test("portadas oficiales con alt, medidas y crédito enlazado; sin portada, hueco", async () => {
  const { parse } = await import("yaml");
  const dir = join(RAIZ, "src", "content", "juegos");
  let con = 0, sin = 0;
  for (const n of readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    const slug = n.replace(/\.md$/, "");
    const fm = parse(readFileSync(join(dir, n), "utf-8").split(/^---\s*$/m)[1] ?? "") ?? {};
    if (fm.draft) continue;
    const html = pagina(`/rol/juegos/${slug}/`);
    // La portada de la ficha va en la sección «Ficha» (antes de «Qué es»); las de «Juegos parecidos», aparte.
    const ficha = html.split('id="s-ficha"')[1]?.split("</section>")[0] ?? "";
    const imgs = imagenes(ficha);
    if (!fm.portada) {
      sin++;
      assert.equal(imgs.length, 0, `${slug}: sin portada en el .md no debe haber imagen`);
      assert.match(ficha, /class="tz-portada tz-portada--grande"/, `${slug}: falta el hueco tipográfico`);
      continue;
    }
    con++;
    assert.equal(imgs.length, 1, `${slug}: la ficha debe tener una imagen de portada`);
    const img = imgs[0];
    assert.equal(attr(img, "alt"), `Portada de ${fm.portada.titulo ?? fm.titulo} (${fm.portada.edicion})`, `${slug}: alt`);
    assert.ok(Number(attr(img, "width")) > 0 && Number(attr(img, "height")) > 0, `${slug}: la imagen necesita width y height`);
    const fig = /<figure class="tz-portada-figura[\s\S]*?<\/figure>/.exec(ficha)?.[0] ?? "";
    assert.match(fig, /<source[^>]+type="image\/avif"/, `${slug}: falta la fuente AVIF`);
    assert.match(fig, /<source[^>]+type="image\/webp"/, `${slug}: falta la fuente WebP`);
    const url = fm.fuentes.find((f) => f.datos.includes("portada")).url;
    assert.ok(fig.includes(`<a href="${url.replace(/&/g, "&amp;")}"`), `${slug}: el crédito debe enlazar a ${url}`);
    assert.ok(texto(fig).includes(fm.portada.credito.replace(/&/g, "&amp;")), `${slug}: falta el crédito «${fm.portada.credito}»`);
    for (const src of [...fig.matchAll(/\/_astro\/[^\s"]+/g)].map((m) => m[0])) {
      assert.ok(existsSync(join(DIST, src)), `${slug}: falta ${src} en dist/`);
    }
    assert.ok(!/<script/i.test(fig), `${slug}: la portada no lleva JS`);
  }
  assert.ok(con > 0 && sin > 0, `hace falta al menos un juego con portada (${con}) y uno sin ella (${sin})`);
});

test("en /rol/ y el catálogo, cada portada lleva su crédito con enlace", () => {
  for (const r of ["/rol/", "/rol/juegos/"]) {
    const html = pagina(r);
    const imgs = imagenes(html);
    assert.ok(imgs.length > 0, `${r}: sin portadas`);
    for (const img of imgs) {
      assert.match(attr(img, "alt") ?? "", /^Portada de .+ \(.+\)$/, `${r}: alt mal formado: ${img}`);
      assert.ok(attr(img, "width") && attr(img, "height"), `${r}: imagen sin medidas`);
    }
    const creditos = [...html.matchAll(/<p class="tz-portada-credito">[^<]*<a href="https:\/\//g)].length;
    assert.equal(creditos, imgs.length, `${r}: ${imgs.length} portadas y ${creditos} créditos con enlace`);
  }
});
