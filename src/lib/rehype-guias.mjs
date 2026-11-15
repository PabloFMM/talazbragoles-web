/**
 * Plugin rehype (sin dependencias) para el Markdown del sitio.
 *
 * 1. Tablas legibles a 320 px: cada <td> recibe data-etiqueta con el texto de su
 *    cabecera, la tabla lleva la clase tz-tabla y roles ARIA explícitos (al
 *    apilarse en móvil con display:block, el navegador perdería la semántica).
 *    El CSS (sistema.css §4.17) apila cada fila como una ficha en anchos estrechos.
 * 2. Guías (src/content/guides): se quita el «# Título» del Markdown, porque el
 *    <h1> lo pone el Encabezado de la página (un solo h1 por página).
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

export default function rehypeGuias() {
  return (arbol, archivo) => {
    const ruta = String(archivo?.path || archivo?.history?.[0] || "");
    const esGuia = ruta.includes("/content/guides/");
    const quitar = [];
    recorrer(arbol, (n, padre) => {
      if (n.type !== "element") return;
      if (n.tagName === "table") tabla(n);
      if (esGuia && n.tagName === "h1" && padre) quitar.push([padre, n]);
    });
    for (const [padre, n] of quitar) padre.children.splice(padre.children.indexOf(n), 1);
  };
}
