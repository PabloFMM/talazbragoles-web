/**
 * Plugin rehype (sin dependencias) para el Markdown del sitio.
 *
 * 1. Tablas legibles a 320 px: cada <td> recibe data-etiqueta con el texto de su
 *    cabecera, la tabla lleva la clase tz-tabla y roles ARIA explícitos (al
 *    apilarse en móvil con display:block, el navegador perdería la semántica).
 *    El CSS (sistema.css §4.17) apila cada fila como una ficha en anchos estrechos.
 * 2. Guías (src/content/guides): se quita el «# Título» del Markdown, porque el
 *    <h1> lo pone el Encabezado de la página (un solo h1 por página).
 * 3. Crónicas de mesa (src/content/modulos, campanas, mesas): lo que falta se
 *    escribe «(pendiente: qué)» y se pinta como el «pendiente» del sitio
 *    (<span class="tz-pendiente">, sistema.css §4.8). El .md descargable lo
 *    conserva como texto legible.
 * 4. Módulos (Rol 7/8): «imagen + pie en cursiva» → <figure class="tz-modulo-imagen"> con srcset (figurasModulo).
 *
 * El generador de la web local (proyecto/tools/build-guias.py) hace lo mismo en Python.
 */

const texto = (n) =>
  n.type === "text" ? n.value : (n.children || []).map(texto).join("");

const recorrer = (nodo, fn, padre = null) => {
  fn(nodo, padre);
  for (const h of nodo.children || []) recorrer(h, fn, nodo);
};

const hijos = (n, tag) => (n.children || []).filter((h) => h.type === "element" && h.tagName === tag);

function tabla(t) {
  t.properties = t.properties || {};
  t.properties.className = [...(t.properties.className || []), "tz-tabla"];
  t.properties.role = "table";
  const cabeceras = [];
  for (const thead of hijos(t, "thead")) {
    thead.properties = { ...thead.properties, role: "rowgroup" };
    for (const tr of hijos(thead, "tr")) {
      tr.properties = { ...tr.properties, role: "row" };
      for (const th of hijos(tr, "th")) {
        th.properties = { ...th.properties, role: "columnheader" };
        cabeceras.push(texto(th).trim());
      }
    }
  }
  for (const tbody of hijos(t, "tbody")) {
    tbody.properties = { ...tbody.properties, role: "rowgroup" };
    for (const tr of hijos(tbody, "tr")) {
      tr.properties = { ...tr.properties, role: "row" };
      hijos(tr, "td").forEach((td, i) => {
        td.properties = { ...td.properties, role: "cell" };
        if (cabeceras[i]) td.properties.dataEtiqueta = cabeceras[i];
      });
    }
  }
}

/** «(pendiente)» o «(pendiente: qué falta)»; admite un nivel de paréntesis dentro. */
export const RE_PENDIENTE = /\((pendiente(?::\s*(?:[^()]|\([^()]*\))*)?)\)/g;

/** Parte los nodos de texto con «(pendiente…)» en texto + <span class="tz-pendiente">. */
export function marcaPendientes(arbol) {
  recorrer(arbol, (n) => {
    if (n.type !== "element" || !n.children) return;
    const nuevos = [];
    let cambia = false;
    for (const h of n.children) {
      if (h.type !== "text" || !h.value.includes("(pendiente")) { nuevos.push(h); continue; }
      let ultimo = 0;
      for (const m of h.value.matchAll(RE_PENDIENTE)) {
        cambia = true;
        if (m.index > ultimo) nuevos.push({ type: "text", value: h.value.slice(ultimo, m.index) });
        nuevos.push({ type: "text", value: "(" });
        nuevos.push({ type: "element", tagName: "span", properties: { className: ["tz-pendiente"] }, children: [{ type: "text", value: m[1] }] });
        nuevos.push({ type: "text", value: ")" });
        ultimo = m.index + m[0].length;
      }
      if (ultimo < h.value.length) nuevos.push({ type: "text", value: h.value.slice(ultimo) });
    }
    if (cambia) n.children = nuevos;
  });
}

/**
 * Imágenes de los módulos (Rol 7/8): el Markdown pone la imagen y, en la línea
 * siguiente, el pie en cursiva (un solo <p>). Ese párrafo pasa a ser
 * <figure class="tz-modulo-imagen"> con <figcaption>. A la imagen se le dan
 * anchos y `sizes` para que Astro (rehype-images, que corre DESPUÉS de este
 * plugin y pasa estas propiedades a getImage) genere un srcset en WebP.
 */
export const ANCHOS_MODULO = [480, 800, 1200];
export const SIZES_MODULO = "(min-width: 64rem) 46rem, calc(100vw - 2rem)";
export function figurasModulo(arbol) {
  recorrer(arbol, (n) => {
    if (n.type !== "element" || n.tagName !== "p") return;
    const el = (n.children || []).filter((h) => !(h.type === "text" && !h.value.trim()));
    if (el.length !== 2 || el[0].tagName !== "img" || el[1].tagName !== "em") return;
    const [img, em] = el;
    img.properties = { ...img.properties, widths: ANCHOS_MODULO, sizes: SIZES_MODULO, loading: "lazy", decoding: "async" };
    n.tagName = "figure";
    n.properties = { className: ["tz-modulo-imagen"] };
    n.children = [img, { type: "element", tagName: "figcaption", properties: {}, children: em.children }];
  });
}

export default function rehypeGuias() {
  return (arbol, archivo) => {
    const ruta = String(archivo?.path || archivo?.history?.[0] || "");
    const esGuia = ruta.includes("/content/guides/");
    const esCronica = /\/content\/(modulos|campanas|mesas)\//.test(ruta);
    const quitar = [];
    recorrer(arbol, (n, padre) => {
      if (n.type !== "element") return;
      if (n.tagName === "table") tabla(n);
      if (esGuia && n.tagName === "h1" && padre) quitar.push([padre, n]);
    });
    for (const [padre, n] of quitar) padre.children.splice(padre.children.indexOf(n), 1);
    if (esCronica) {
      marcaPendientes(arbol);
      figurasModulo(arbol);
    }
  };
}
