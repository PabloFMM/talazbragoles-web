// Rol 6/8 (2026-11-24): lo que se publica de las crónicas de mesa sale LIMPIO.
// - Ningún .md de `modulos`, `campanas` o `mesas` lleva comentarios <!-- --> (Astro
//   los pasaría al HTML: son las notas de fuente internas), ni «[pendiente: …]» en
//   bruto, ni la sección «Decisiones de redacción».
// - El módulo base (CC0) no nombra a los PJ de nuestra mesa ni lo que es solo de
//   nuestra mesa (decisiones 32-40 y modulo/_BRIEF.md del proyecto).
// - «(pendiente: …)» se pinta como el «pendiente» del sitio (rehype-guias.mjs).
// Las versiones anotadas, con fuentes, están en proyecto/material/<módulo>/modulo/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { RAIZ } from "./_comun.mjs";
import { marcaPendientes, RE_PENDIENTE } from "../src/lib/rehype-guias.mjs";

const CONTENIDO = join(RAIZ, "src", "content");

/** Todos los .md de una colección (también en subcarpetas): [{ ruta, texto }]. */
function mds(col) {
  const dir = join(CONTENIDO, col);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true }).map(String).filter((x) => x.endsWith(".md"))
    .map((r) => ({ ruta: `${col}/${r}`, texto: readFileSync(join(dir, r), "utf-8") }));
}

const PUBLICADOS = [...mds("modulos"), ...mds("campanas"), ...mds("mesas")];
const MODULO = mds("modulos");

/** Nombres de los PJ de todas las campañas (nombre completo y nombre de pila). */
function nombresPJ() {
  const nombres = new Set();
  for (const { texto } of mds("campanas")) {
    const fm = parse(/^---\n([\s\S]*?)\n---/.exec(texto)[1]);
    for (const r of fm.reparto ?? []) {
      nombres.add(r.personaje);
      nombres.add(r.personaje.split(/\s+/)[0]);
    }
  }
  return [...nombres];
}

/** Lo que es solo de nuestra mesa y no puede salir en el módulo base (modulo/_BRIEF.md). */
const SOLO_MESA = [
  "Elizabeth", "EID-5", "EID", "Lázarus", "punto de persistencia", "Devan",
  "Bucle de Retención", "Nivel VI", "red neuronal", "Tratado de modelaje", "cereza",
  "Puertas Ciegas", "Hipótesis Fragmentaria", "Stellar Circle", "Energía",
];

const linea = (texto, i) => texto.slice(0, i).split("\n").length;

test("hay crónicas que revisar", () => {
  assert.ok(MODULO.length >= 2, "faltan la ficha y las secciones del módulo");
  assert.ok(mds("campanas").length > 0 && mds("mesas").length > 0, "faltan campaña o mesa");
});

test("ningún .md publicado lleva comentarios, «[pendiente» en bruto ni «Decisiones de redacción»", () => {
  for (const { ruta, texto } of PUBLICADOS) {
    for (const [patron, que] of [[/<!--|-->/g, "un comentario HTML"], [/\[pendiente/gi, "«[pendiente» en bruto (usar «(pendiente: …)»)"], [/Decisiones de redacción/gi, "la sección «Decisiones de redacción»"]]) {
      const m = patron.exec(texto);
      assert.equal(m, null, `${ruta}:${m ? linea(texto, m.index) : 0} lleva ${que}`);
    }
  }
});

test("cada «(pendiente» del contenido se puede pintar como «pendiente»", () => {
  for (const { ruta, texto } of PUBLICADOS) {
    const abiertos = (texto.match(/\(pendiente/g) ?? []).length;
    const casan = [...texto.matchAll(RE_PENDIENTE)].length;
    assert.equal(casan, abiertos, `${ruta}: hay un «(pendiente» mal cerrado o con formato dentro`);
  }
});

test("el módulo base no nombra a los PJ de nuestra mesa ni lo que es solo de nuestra mesa", () => {
  const pj = nombresPJ();
  assert.ok(pj.length >= 4, "no se han leído los PJ del reparto");
  for (const { ruta, texto } of MODULO) {
    for (const nombre of [...pj, ...SOLO_MESA]) {
      const re = new RegExp(`(?<![\\p{L}-])${nombre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}])`, "u");
      const m = re.exec(texto);
      assert.equal(m, null, `${ruta}:${m ? linea(texto, m.index) : 0} nombra «${nombre}» (es de nuestra mesa: va en la campaña)`);
    }
  }
});

test("rehype pinta «(pendiente: …)» con la clase del sitio", () => {
  const arbol = {
    type: "root",
    children: [{ type: "element", tagName: "p", properties: {}, children: [{ type: "text", value: "Recuento. (pendiente: el manual no lo dice (todavía)) y sigue." }] }],
  };
  marcaPendientes(arbol);
  const p = arbol.children[0];
  const span = p.children.find((h) => h.type === "element");
  assert.ok(span, "no se ha creado el span");
  assert.deepEqual(span.properties.className, ["tz-pendiente"]);
  assert.equal(span.children[0].value, "pendiente: el manual no lo dice (todavía)");
  assert.equal(p.children.map((h) => h.value ?? h.children[0].value).join(""), "Recuento. (pendiente: el manual no lo dice (todavía)) y sigue.");
});
