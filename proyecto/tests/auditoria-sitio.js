/*
  Auditoría de una página del sitio Astro (sistema «Papel y tinta»).
  Evaluar en la página servida, una vez por ancho. Devuelve un STRING JSON:
  {w, sw, issues:[...]}  (json.loads en Python).
  Comprueba: scroll horizontal, texto visible < 16 px, controles < 48 px,
  contraste de texto < 7:1 (fondo opaco efectivo), imágenes y <script> (no debe haber).
*/
(() => {
  const issues = [];
  const add = (m) => { if (!issues.includes(m) && issues.length < 60) issues.push(m); };
  const W = innerWidth, SW = document.documentElement.scrollWidth;
  if (SW > W) {
    add(`scroll horizontal: ${SW} > ${W}`);
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > W + 1 && !el.closest('.tz-scroll')) add(`desborda: ${el.tagName.toLowerCase()}.${el.className}`.slice(0, 120));
    }
  }
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('details:not([open]) > :not(summary)');
  };
  const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const fondo = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const c = rgb(getComputedStyle(e).backgroundColor);
      if (c.length >= 3 && (c.length < 4 || c[3] === 1)) return c;
    }
    return [244, 240, 230];
  };
  const tz = (el) => (typeof el.className === 'string' ? el.className : '').split(' ')[0];
  // Texto: tamaño y contraste
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const vistos = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (vistos.has(el) || !visible(el) || el.closest('.tz-saltar,[aria-hidden="true"] .no-audit')) continue;
    vistos.add(el);
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    if (fs < 15.95) add(`letra ${fs.toFixed(1)}px: <${el.tagName.toLowerCase()} class="${tz(el)}"> «${t.textContent.trim().slice(0, 30)}»`);
    const c = rgb(cs.color), b = fondo(el);
    const L1 = lum(c), L2 = lum(b);
    const cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    if (cr < 7) add(`contraste ${cr.toFixed(2)}: <${el.tagName.toLowerCase()} class="${tz(el)}"> «${t.textContent.trim().slice(0, 30)}»`);
  }
  // Controles ≥ 48 px (enlaces dentro de párrafos quedan exentos: son texto)
  const ctrl = 'button, summary, input, select, textarea, .tz-boton, .tz-nav a, .tz-ficha-pie a, .tz-pie-indice a, .tz-cabecera-nombre, .tz-migas a, .tz-enlace-bloque';
  for (const el of document.querySelectorAll(ctrl)) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 47.5 || (r.width < 47.5 && !el.matches('summary'))) add(`control ${Math.round(r.width)}×${Math.round(r.height)}: <${el.tagName.toLowerCase()} class="${tz(el)}"> «${el.textContent.trim().slice(0, 30)}»`);
  }
  if (document.querySelector('script:not([type="application/ld+json"])')) add('hay <script> (prohibido fuera del asesor)');
  for (const img of document.images) if (visible(img)) add(`imagen visible: ${img.getAttribute('src')}`);
  return JSON.stringify({ w: W, sw: SW, issues });
})()
