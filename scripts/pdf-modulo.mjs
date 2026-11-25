#!/usr/bin/env node
/**
 * PDF maquetado de un módulo de Rol (Rol 10, 2026-11-25).
 *
 *   node scripts/pdf-modulo.mjs [modulo]        (por defecto: los-navegantes-del-sueno)
 *
 * Lee la ficha (src/content/modulos/<modulo>.md) y sus secciones limpias
 * (src/content/modulos/<modulo>/NN-*.md), monta un HTML de libro (A4, dos columnas,
 * portada, ficha, índice, capítulos con sus imágenes, créditos) y lo imprime con el
 * Chromium de Playwright en public/descargas/<modulo>.pdf.
 *
 * Estilo: el de Numinia (numinia.org): papel crema #F9EBDC, tinta #14110F, verde azulado
 * #016E7D, Alegreya y Alegreya SC (tipografías del manual, licencia SIL OFL; van en
 * scripts/fuentes/). No sigue «Papel y tinta» del sitio a propósito: es el libro del juego.
 *
 * No corre en el build de Cloudflare (no hay Chromium): el PDF se genera aquí y se
 * versiona. tests/rol-modulo-pdf.test.mjs falla si las fuentes cambian y el PDF no
 * (compara el hash guardado en scripts/pdf-huellas/<modulo>.txt).
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, copyFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir, homedir } from "node:os";
import yaml from "js-yaml";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { chromium } from "playwright";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const modulo = process.argv[2] ?? "los-navegantes-del-sueno";
const dirSecciones = join(raiz, "src/content/modulos", modulo);
const fichaRuta = join(raiz, "src/content/modulos", `${modulo}.md`);
const salida = join(raiz, "public/descargas", `${modulo}.pdf`);

export function leerMd(ruta) {
  const t = readFileSync(ruta, "utf8");
  const m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return { datos: yaml.load(m[1]), cuerpo: m[2] };
}

export function archivosFuente(mod = modulo) {
  const dir = join(raiz, "src/content/modulos", mod);
  const secc = readdirSync(dir).filter((f) => /^\d\d-.*\.md$/.test(f)).sort().map((f) => join(dir, f));
  return [join(raiz, "src/content/modulos", `${mod}.md`), ...secc, join(raiz, "scripts/pdf-modulo.mjs")];
}

/** Hash de todo lo que alimenta el PDF (textos, imágenes enlazadas y este script). */
export function hashFuentes(mod = modulo) {
  const h = createHash("sha256");
  for (const f of archivosFuente(mod)) {
    const t = readFileSync(f);
    h.update(t);
    for (const [, img] of t.toString().matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) h.update(readFileSync(resolve(dirname(f), img)));
  }
  return h.digest("hex");
}

const md = unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: false }).use(rehypeStringify);
const html = (s) => String(md.processSync(s));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/** Sección → HTML de capítulo: imágenes con pie a <figure>, «(pendiente: …)» marcado, anclas. */
function capitulo(ruta, n) {
  const { datos, cuerpo } = leerMd(ruta);
  let h = html(cuerpo);
  // imagen + pie en cursiva en la línea siguiente → figura. Apaisadas a todo el ancho; verticales en la columna.
  h = h.replace(/<p><img src="([^"]+)" alt="([^"]*)">\n?(?:<em>([\s\S]*?)<\/em>)?<\/p>/g, (_, src, alt, pie) => {
    const abs = resolve(dirname(ruta), src);
    const retrato = /\/\d\d-retrato-/.test(src); // retratos de PNJ: pequeños, en la columna
    const ancho = !retrato && !/\/0[389]-/.test(src); // 03 cartel, 08 y 09 Ouroboros: verticales, van en la columna
    return `<figure class="${retrato ? "retrato" : ancho ? "ancha" : "columna"}"><img src="${pathToFileURL(abs)}" alt="${alt}">${pie ? `<figcaption>${pie}</figcaption>` : ""}</figure>`;
  });
  // tablas de 4 o más columnas: a todo el ancho de la página (en una columna no caben)
  h = h.replace(/<table>([\s\S]*?)<\/table>/g, (t, dentro) => ((dentro.match(/<th[ >]/g) || []).length >= 4 ? t.replace("<table>", '<table class="ancha">') : t));
  h = h.replace(/\((pendiente[^)]*)\)/g, '<span class="pendiente">($1)</span>');
  const usados = new Set();
  const toc = [];
  h = h.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, nivel, txt) => {
    let a = `c${n}-${slug(txt.replace(/<[^>]+>/g, ""))}`;
    while (usados.has(a)) a += "-b";
    usados.add(a);
    if (nivel === "2") toc.push({ a, txt: txt.replace(/<[^>]+>/g, "") });
    return `<h${nivel} id="${a}">${txt}</h${nivel}>`;
  });
  return { datos, h, toc, id: `cap-${n}` };
}

export async function generar() {
  const { datos: f, cuerpo: comoUsar } = leerMd(fichaRuta);
  const secc = archivosFuente().slice(1, -1);
  const caps = secc.map((r, i) => capitulo(r, i + 1));
  const fuentes = pathToFileURL(join(raiz, "scripts/fuentes")).href;
  const portada = pathToFileURL(join(raiz, "src/assets/rol/navegantes/07-ouroboros-vortice-de-los-suenos.jpg")).href;
  const fecha = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  const ficha = [
    ["Juego", "Numinia (manual v0.6.0)"],
    ["Autoría", f.autoria],
    ["Dificultad", f.dificultad],
    ["Duración", f.duracion],
    ["Jugadores", f.jugadores],
    ["Dónde transcurre", f.ambito],
    ["Licencia", "CC0 1.0: dominio público. Se puede copiar, adaptar, jugar y publicar sin pedir permiso."],
  ];

  const doc = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(f.titulo)} · ${esc(f.tipo)}</title>
<style>
@font-face{font-family:"N Alegreya";src:url(${fuentes}/Alegreya-wght.ttf);font-weight:400 900}
@font-face{font-family:"N Alegreya";font-style:italic;src:url(${fuentes}/Alegreya-Italic-wght.ttf);font-weight:400 900}
@font-face{font-family:"N Alegreya SC";src:url(${fuentes}/AlegreyaSC-Regular.ttf)}
@font-face{font-family:"N Alegreya SC";font-weight:700;src:url(${fuentes}/AlegreyaSC-Bold.ttf)}
@font-face{font-family:"N Alegreya Sans";src:url(${fuentes}/AlegreyaSans-Regular.ttf)}
@font-face{font-family:"N Alegreya Sans";font-weight:700;src:url(${fuentes}/AlegreyaSans-Bold.ttf)}
@font-face{font-family:"N Alegreya Sans";font-style:italic;src:url(${fuentes}/AlegreyaSans-Italic.ttf)}
:root{--papel:#F9EBDC;--papel-2:#F1DCC4;--tinta:#14110F;--tinta-2:#4a3f37;--verde:#016E7D;--oro:#9a6a0a}
@page{size:A4;margin:18mm 16mm 20mm;background:var(--papel);
  @bottom-center{content:counter(page);font:10pt "Alegreya SC",serif;color:var(--verde)}
  @top-center{content:"${esc(f.titulo)} · Módulo para Numinia";font:8.5pt "Alegreya SC",serif;letter-spacing:.08em;color:var(--tinta-2)}}
@page portada{margin:0;@bottom-center{content:none}@top-center{content:none}}
@page sin{@top-center{content:none}}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html{background:var(--papel)}
body{margin:0;font:10.2pt/1.42 "N Alegreya",serif;color:var(--tinta);hyphens:auto;font-variant-numeric:oldstyle-nums;orphans:3;widows:3}
a{color:inherit;text-decoration:none}
/* portada */
.portada{page:portada;height:297mm;position:relative;color:#fff;break-after:page;overflow:hidden;background:#0b0a09}
.portada img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.92}
.portada .velo{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,7,6,.85) 0%,rgba(8,7,6,.15) 38%,rgba(8,7,6,.2) 60%,rgba(8,7,6,.92) 100%)}
.portada .arriba{position:absolute;top:22mm;left:18mm;right:18mm;text-align:center}
.portada .juego{font:600 13pt "N Alegreya SC",serif;letter-spacing:.35em;color:#F9EBDC}
.portada h1{font:700 44pt/1 "N Alegreya SC",serif;margin:8mm 0 4mm;letter-spacing:.02em;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.portada .sub{font:italic 14pt "N Alegreya",serif;color:#F9EBDC}
.portada .abajo{position:absolute;bottom:20mm;left:18mm;right:18mm;text-align:center;font:11pt "N Alegreya",serif;color:#F9EBDC}
.portada .abajo b{font:700 12pt "N Alegreya SC",serif;letter-spacing:.08em;display:block;margin-bottom:2mm;color:#fff}
.portada .filete{width:40mm;height:0;border-top:1px solid #F9EBDC;margin:6mm auto}
/* ficha e índice */
.pagina{page:sin;break-after:page}
.rotulo{font:700 9pt "N Alegreya Sans",sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--verde);margin:0 0 2mm}
h2.titulo-pag{font:700 24pt/1.1 "N Alegreya SC",serif;margin:0 0 6mm;border-bottom:2px solid var(--tinta);padding-bottom:3mm}
.conflicto{border:1.5px solid var(--verde);background:var(--papel-2);padding:4mm 5mm;margin:0 0 6mm;font-size:11pt}
.conflicto p{margin:0}
table.ficha{width:100%;border-collapse:collapse;margin:0 0 6mm}
table.ficha th{font:700 8.5pt "N Alegreya Sans",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--verde);text-align:left;vertical-align:top;width:34mm;padding:2mm 3mm 2mm 0;border-top:1px solid #cdb59a}
table.ficha td{padding:2mm 0;border-top:1px solid #cdb59a;vertical-align:top}
.uso{columns:2;column-gap:8mm}
.uso p{margin:0 0 2.5mm}
ol.indice{list-style:none;padding:0;margin:0}
ol.indice>li{margin:0 0 4mm;break-inside:avoid}
ol.indice>li>a{display:flex;gap:4mm;align-items:baseline;font:700 13pt "N Alegreya SC",serif;border-bottom:1px dotted var(--tinta-2);padding-bottom:1mm}
ol.indice .n{color:var(--verde);font:700 18pt "N Alegreya SC",serif;min-width:10mm}
ol.indice p{margin:1mm 0 1.5mm 14mm;font-style:italic;color:var(--tinta-2)}
ol.indice ul{margin:0 0 0 14mm;padding:0;list-style:none;columns:2;column-gap:6mm;font-size:9.5pt}
ol.indice ul li{break-inside:avoid}
/* capítulos */
.capitulo{break-before:page}
.apertura{column-span:all;margin:0 0 7mm;padding:4mm 0 5mm;border-top:3px double var(--tinta);border-bottom:1px solid var(--tinta)}
.apertura .n{font:700 40pt/1 "N Alegreya SC",serif;color:var(--verde);float:left;margin:0 5mm 0 0}
.apertura h1{font:700 22pt/1.1 "N Alegreya SC",serif;margin:1mm 0 2mm}
.apertura p{margin:0;font-style:italic;color:var(--tinta-2)}
.cuerpo{columns:2;column-gap:7mm;column-rule:.5px solid #d6c0a6;column-fill:auto}
.cuerpo>*:first-child{margin-top:0}
.cuerpo h2{font:700 15pt/1.15 "N Alegreya SC",serif;color:var(--verde);margin:5mm 0 2mm;break-after:avoid;border-bottom:1px solid var(--verde);padding-bottom:1mm}
.cuerpo h3{font:700 12pt/1.2 "N Alegreya SC",serif;margin:4mm 0 1.5mm;break-after:avoid}
.cuerpo h4{font:700 8.5pt "N Alegreya Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--verde);margin:3mm 0 1mm;break-after:avoid}
.cuerpo p{margin:0 0 2mm;text-align:justify}
.cuerpo ul,.cuerpo ol{margin:0 0 2.5mm;padding-left:4.5mm}
.cuerpo li{margin:0 0 1mm}
.cuerpo li::marker{color:var(--verde)}
.cuerpo strong{font-weight:700}
.cuerpo blockquote{margin:1mm 0 3mm;padding:2.5mm 3.5mm;background:var(--papel-2);border-left:3px solid var(--verde);font-style:italic;break-inside:auto}
.cuerpo blockquote p{margin:0 0 1.5mm;text-align:left}
.cuerpo blockquote p:last-child{margin:0}
.cuerpo hr{border:0;text-align:center;margin:3mm 0}
.cuerpo hr::after{content:"◆ ◆ ◆";color:var(--verde);font-size:7pt;letter-spacing:.6em}
.cuerpo table{width:100%;border-collapse:collapse;font:8.6pt/1.3 "N Alegreya Sans",sans-serif;margin:1mm 0 3mm;break-inside:auto}
.cuerpo th{background:var(--tinta);color:var(--papel);text-align:left;padding:1.2mm 1.5mm;font-weight:700}
.cuerpo td{padding:1.2mm 1.5mm;border-bottom:.5px solid #cdb59a;vertical-align:top}
.cuerpo tr:nth-child(even) td{background:rgba(241,220,196,.6)}
.cuerpo tr{break-inside:avoid}
.cuerpo table.ancha{column-span:all;font-size:9pt}
figure{margin:2mm 0 4mm;break-inside:avoid}
figure.ancha{column-span:all;margin:3mm 0 5mm}
figure img{display:block;width:100%;height:auto;border:1px solid var(--tinta)}
figure.ancha img{max-height:150mm;object-fit:contain;background:#0b0a09}
figure.columna img{max-height:120mm;object-fit:cover}
figure.retrato{text-align:center}
figure.retrato img{width:auto;max-width:100%;max-height:82mm;margin:0 auto}
figure.retrato figcaption{text-align:left}
figcaption{font:italic 8.6pt/1.35 "N Alegreya",serif;color:var(--tinta-2);margin-top:1.5mm}
.pendiente{font-family:"N Alegreya Sans",sans-serif;font-style:italic;font-size:.88em;color:var(--oro)}
/* créditos */
.creditos{break-before:page;page:sin;columns:2;column-gap:8mm;font-size:9.5pt}
.creditos h2{column-span:all;font:700 18pt "N Alegreya SC",serif;border-bottom:2px solid var(--tinta);padding-bottom:2mm}
.creditos h3{font:700 11pt "N Alegreya SC",serif;color:var(--verde);margin:3mm 0 1mm}
.creditos p{margin:0 0 2mm}
</style></head><body>

<section class="portada">
  <img src="${portada}" alt="">
  <div class="velo"></div>
  <div class="arriba">
    <div class="juego">Numinia</div>
    <h1>${esc(f.titulo)}</h1>
    <div class="sub">Módulo para el juego de rol de Numinia</div>
  </div>
  <div class="abajo">
    <b>${esc(f.autoria)}</b>
    Dificultad ${esc(f.dificultad.toLowerCase())} · Dominio público (CC0 1.0)
    <div class="filete"></div>
    talazbragoles.com/rol/modulos/${modulo}/
  </div>
</section>

<section class="pagina">
  <p class="rotulo">El módulo de un vistazo</p>
  <h2 class="titulo-pag">${esc(f.titulo)}</h2>
  <div class="conflicto"><p class="rotulo">Conflicto de Partida</p><p>${esc(f.conflicto)}</p></div>
  <table class="ficha">${ficha.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>
  <p class="rotulo">Cómo usar este módulo</p>
  <div class="uso">${html(comoUsar)}<p>La aventura tal como la jugó el club de los miércoles, que desvela el misterio, está en talazbragoles.com/rol/campanas/${modulo}/.</p></div>
</section>

<section class="pagina">
  <p class="rotulo">Contenido</p>
  <h2 class="titulo-pag">Índice</h2>
  <ol class="indice">${caps.map((c, i) => `<li><a href="#${c.id}"><span class="n">${String(i + 1).padStart(2, "0")}</span>${esc(c.datos.titulo)}</a><p>${esc(c.datos.resumen)}</p><ul>${c.toc.map((t) => `<li><a href="#${t.a}">${esc(t.txt)}</a></li>`).join("")}</ul></li>`).join("")}</ol>
</section>

${caps.map((c, i) => `<section class="capitulo" id="${c.id}">
  <div class="cuerpo">
    <header class="apertura"><span class="n">${String(i + 1).padStart(2, "0")}</span><h1>${esc(c.datos.titulo)}</h1><p>${esc(c.datos.resumen)}</p></header>
    ${c.h}
  </div>
</section>`).join("\n")}

<section class="creditos">
  <h2>Créditos y licencia</h2>
  <h3>Autoría</h3><p>${esc(f.autoria)}. Módulo escrito para Numinia, el juego de rol de Numen Games (manual v0.6.0, numinia.org/manual).</p>
  <h3>Licencia</h3><p>Texto e ilustraciones: CC0 1.0 Universal, dominio público. Se puede copiar, cambiar, jugar, traducir y publicar, también con fines comerciales, sin pedir permiso. Texto de la licencia: creativecommons.org/publicdomain/zero/1.0/deed.es</p>
  <h3>Ilustraciones</h3><p>Hechas por el autor del módulo con herramientas de inteligencia artificial y cedidas al dominio público. En los mapas, algunos rótulos están en inglés; manda el nombre en castellano del texto (Taberna Hiperbórea, Ágora).</p>
  <h3>Tipografías</h3><p>Alegreya, Alegreya SC y Alegreya Sans, de Juan Pablo del Peral (Huerta Tipográfica), con licencia SIL Open Font License 1.1. Son las del manual de Numinia.</p>
  <h3>Edición</h3><p>Maquetado por Talazbrágoles el ${fecha}. Versión web, siempre la más reciente, y descarga en Markdown: talazbragoles.com/rol/modulos/${modulo}/</p>
  <h3>La partida original</h3><p>Este módulo sale de la campaña que jugó el club de los miércoles entre abril y septiembre de 2026. Su crónica, que desvela el misterio, está en talazbragoles.com/rol/campanas/${modulo}/</p>
</section>
</body></html>`;

  // Las cajas de margen de @page (encabezado y número de página) no ven las @font-face:
  // Chromium las pinta con fuentes del sistema. Se instalan las Alegreya en ~/.local/share/fonts.
  const dirFuentes = join(homedir(), ".local/share/fonts");
  mkdirSync(dirFuentes, { recursive: true });
  for (const t of readdirSync(join(raiz, "scripts/fuentes")).filter((x) => x.endsWith(".ttf"))) {
    if (!existsSync(join(dirFuentes, t))) copyFileSync(join(raiz, "scripts/fuentes", t), join(dirFuentes, t));
  }
  const tmp = join(tmpdir(), `${modulo}-pdf.html`);
  writeFileSync(tmp, doc);
  const nav = await chromium.launch();
  const p = await nav.newPage();
  await p.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  mkdirSync(dirname(salida), { recursive: true });
  await p.pdf({ path: salida, format: "A4", printBackground: true, preferCSSPageSize: true, outline: true, tagged: true });
  await nav.close();
  writeFileSync(join(raiz, "scripts/pdf-huellas", `${modulo}.txt`), hashFuentes() + "\n");
  return salida;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  generar().then((s) => console.log("PDF:", s, (readFileSync(s).length / 1048576).toFixed(1), "MB"));
}
