// Reglas de lectura en TODAS las páginas y en 16 anchos:
// sin scroll horizontal, texto ≥ 16 px, controles ≥ 48 px, casillas ≥ 28 px, contraste ≥ 7:1.
import { test, expect } from "@playwright/test";
import { rutas, ANCHOS, ASESOR } from "./_comun.mjs";

/** Se ejecuta dentro de la página. Devuelve la lista de fallos de la vista actual. */
function medir() {
  const fallos = [];
  // Dentro de una medición los estilos no cambian: cada antepasado se calcula una sola vez
  // (antes se recorría la cadena entera por cada texto y cada control).
  const memo = (f) => { const m = new Map(); const g = (el) => { if (!el) return f(null, g); if (!m.has(el)) m.set(el, f(el, g)); return m.get(el); }; return g; };
  const estilo = memo((el) => el && getComputedStyle(el));
  // Ocultos para la vista pero no para el lector de pantalla (.tz-sr, cabeceras de tabla apiladas): clip-path inset(50%).
  const recortado = memo((el, yo) => !!el && (estilo(el).clipPath === "inset(50%)" || yo(el.parentElement)));
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const cs = estilo(el);
    if (cs.visibility === "hidden" || cs.display === "none") return false;
    // .sr-only y similares: recortados a 1 px.
    if (r.width <= 1 && r.height <= 1) return false;
    // Fuera de la pantalla por arriba o por la izquierda (enlace de salto sin foco).
    if (r.right <= 0 || r.bottom <= 0) return false;
    if (recortado(el)) return false;
    // Dentro de un <details> cerrado.
    const d = el.closest("details:not([open])");
    if (d && !el.closest("summary")) return false;
    return true;
  };
  const quien = (el) => `<${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}> «${(el.textContent || "").trim().slice(0, 30)}»`;

  // 1. Scroll horizontal.
  const sw = document.documentElement.scrollWidth, iw = window.innerWidth;
  if (sw > iw) fallos.push(`scroll horizontal: ${sw} > ${iw}`);

  // 2. Controles.
  const enLinea = (el) => {
    // Un enlace dentro de una frase no es un botón: se exime (WCAG 2.5.8, excepción «inline»).
    if (el.tagName !== "A" || getComputedStyle(el).display !== "inline") return false;
    return [...el.parentElement.childNodes].some((n) => n !== el && n.nodeType === 3 && n.nodeValue.trim().length > 0)
      || el.parentElement.closest("p, li, td, figcaption") !== null;
  };
  // Excepción «equivalente» de WCAG 2.5.8: un enlace pequeño (p. ej. el título de una ficha) queda exento
  // si en la página hay otro enlace visible al mismo destino que sí mide ≥ 48 × 48 (el «Ver ficha ›» del pie).
  const grande = (el) => { const r = el.getBoundingClientRect(); return r.width >= 47.5 && r.height >= 47.5; };
  const equivalente = (el) => el.tagName === "A" && [...document.querySelectorAll("a[href]")]
    .some((o) => o !== el && o.getAttribute("href") === el.getAttribute("href") && visible(o) && grande(o));
  document.querySelectorAll("a[href], button, summary, select, textarea, input:not([type=hidden]):not([type=file])").forEach((el) => {
    if (!visible(el) || enLinea(el)) return;
    const r = el.getBoundingClientRect();
    if (el.matches("input[type=checkbox], input[type=radio]")) {
      if (r.width < 27.5 || r.height < 27.5) fallos.push(`casilla < 28 px: ${quien(el)}`);
      return;
    }
    if ((r.height < 47.5 || r.width < 47.5) && !equivalente(el)) fallos.push(`control < 48 px (${Math.round(r.width)}×${Math.round(r.height)}): ${quien(el)}`);
  });

  // 3 y 4. Tamaño de texto y contraste.
  const rgba = (s) => {
    const m = /rgba?\(([^)]+)\)/.exec(s);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };
  const sobre = (arriba, abajo) => {
    const a = arriba[3];
    return [arriba[0] * a + abajo[0] * (1 - a), arriba[1] * a + abajo[1] * (1 - a), arriba[2] * a + abajo[2] * (1 - a), 1];
  };
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  // Fondo real: el color de fondo del elemento sobre el de sus antepasados, y debajo de todo el papel.
  const PAPEL = [244, 240, 230, 1]; // --papel (#f4f0e6): fondo liso del sistema «Papel y tinta»
  const fondo = memo((el, yo) => {
    if (!el) return PAPEL;
    const c = rgba(estilo(el).backgroundColor);
    if (c && c[3] >= 1) return c;
    return c && c[3] > 0 ? sobre(c, yo(el.parentElement)) : yo(el.parentElement);
  });
  const opacidad = memo((el, yo) => (el ? parseFloat(estilo(el).opacity) * yo(el.parentElement) : 1));
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const vistos = new Set();
  let n;
  while ((n = w.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement;
    if (!el || vistos.has(el) || el.closest("script, style, svg, noscript") || !visible(el)) continue;
    vistos.add(el);
    const cs = estilo(el);
    const fs = parseFloat(cs.fontSize);
    if (fs < 15.99) fallos.push(`texto de ${fs.toFixed(1)} px: ${quien(el)}`);
    if (el.closest("[aria-hidden=true]") || el.closest(":disabled")) continue; // decorativo o desactivado
    let color = rgba(cs.color);
    if (!color) continue;
    color = [color[0], color[1], color[2], color[3] * opacidad(el)];
    const bg = fondo(el);
    const r = ratio(sobre(color, bg), bg);
    if (r < 6.995) fallos.push(`contraste ${r.toFixed(2)}:1: ${quien(el)}`);
  }
  return [...new Set(fallos)];
}

for (const ruta of rutas().filter((r) => r !== ASESOR)) {
  test(`lectura: ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    const fallos = [];
    for (const ancho of ANCHOS) {
      await page.setViewportSize({ width: ancho, height: 900 });
      for (const f of await page.evaluate(medir)) fallos.push(`${ancho} px · ${f}`);
      // Menú móvil abierto (si existe a este ancho).
      const resumen = page.locator("nav details > summary");
      if (await resumen.isVisible()) {
        await resumen.click();
        for (const f of await page.evaluate(medir)) fallos.push(`${ancho} px · menú abierto · ${f}`);
        await resumen.click();
      }
    }
    expect(fallos, fallos.slice(0, 25).join("\n")).toEqual([]);
  });
}

// El asesor, en 4 tests de 4 anchos (antes uno solo de 16 anchos y ~2 min, el más lento de la batería):
// así se reparten entre los workers. Cada uno parte de una página recién cargada con los mismos datos.
const GRUPOS_ANCHOS = Array.from({ length: Math.ceil(ANCHOS.length / 4) }, (_, i) => ANCHOS.slice(i * 4, i * 4 + 4));
for (const anchos of GRUPOS_ANCHOS) {
  test(`lectura: asesor a ${anchos.join(", ")} px (3 tamaños de letra × todas las pestañas)`, async ({ page }) => {
    test.setTimeout(300_000); // 4 anchos × 3 letras × 14 pestañas
    const errores = [];
    page.on("pageerror", (e) => errores.push(String(e)));
    await page.goto(ASESOR);
    const PESTANAS = await page.evaluate(() => TABS); // las del propio asesor: una pestaña nueva entra sola
    // Datos de prueba para que las tablas tengan contenido.
    await page.evaluate(() => {
      S.alm = { "Lingote de cobre": 40, "Cosa d'prueba": 3 };
      S.oro = [{ f: "2026-11-12", g: 180, n: "ayer" }, { f: "2026-11-13", g: 250, n: "hoy, con una nota larga para probar el ancho" }];
      S.sub.libro = [{ id: "l1", f: "2026-11-13", tipo: "compra", obj: "Piedra basta", cant: 62, pu: 0.1 }];
      S.diario = [{ id: "d1", f: "2026-11-13", nv: 12, oro: 250, zona: "Los Baldíos", t: "Entrada larga del diario para comprobar el ancho de la tabla en móviles" }];
      save(); pintaTodo();
    });
    const fallos = [];
    for (const ancho of anchos) {
      await page.setViewportSize({ width: ancho, height: 900 });
      for (const letra of [0, 1, 2]) {
        for (const pest of PESTANAS) {
          await page.evaluate(([l, p]) => {
            setFs(l); showTab(p);
            if (p === "subasta") { planHacer(); document.getElementById("bus-q").value = "de"; buscar(); calcFab(); calcSubasta(); }
          }, [letra, pest]);
          for (const f of await page.evaluate(medir)) fallos.push(`${ancho} px · letra ${letra} · ${pest} · ${f}`);
        }
      }
    }
    expect(errores, "errores de JavaScript").toEqual([]);
    expect(fallos, [...new Set(fallos.map((f) => f.split(" · ").slice(2).join(" · ")))].slice(0, 30).join("\n")).toEqual([]);
  });
}
