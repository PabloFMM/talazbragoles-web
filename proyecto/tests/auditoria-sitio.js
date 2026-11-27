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
  const ctrl = 'button, summary, input, select, textarea, .tz-boton, .tz-nav a, .tz-ficha-pie a, .tz-pie-indice a, .tz-cabecera-nombre, .tz-migas a, .tz-enlace-bloque, .tz-indice-guia a, .tz-lista-enlaces a, .nav a, .indice a, .lista a';
  for (const el of document.querySelectorAll(ctrl)) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 47.5 || (r.width < 47.5 && !el.matches('summary'))) add(`control ${Math.round(r.width)}×${Math.round(r.height)}: <${el.tagName.toLowerCase()} class="${tz(el)}"> «${el.textContent.trim().slice(0, 30)}»`);
  }
  if (document.querySelector('script:not([type="application/ld+json"])')) add('hay <script> (prohibido fuera del asesor)');
  for (const img of document.images) {
    if (!visible(img)) continue;
    // Excepción (2026-11-23): reproducción de un documento u objeto de época (folleto,
    // cartel, pin…: fuente primaria) en su ficha, siempre con alt descriptivo y medidas.
    if (img.closest('.tz-documento-imagen')) {
      if (!img.alt || img.alt.length < 20) add(`documento u objeto sin alt descriptivo: ${img.getAttribute('src')}`);
      if (!img.getAttribute('width') || !img.getAttribute('height')) add(`documento u objeto sin width/height: ${img.getAttribute('src')}`);
      if (img.getBoundingClientRect().right > W + 1) add(`documento u objeto desborda: ${img.getAttribute('src')}`);
      continue;
    }
    // Excepción (Rol 5, 2026-11-23): la portada oficial de un juego, con alt «Portada de … (…)» y medidas.
    if (img.matches('.tz-portada-img')) {
      if (!/^Portada de .+ \(.+\)$/.test(img.alt)) add(`portada sin alt correcto: ${img.getAttribute('src')}`);
      if (!img.getAttribute('width') || !img.getAttribute('height')) add(`portada sin width/height: ${img.getAttribute('src')}`);
      if (img.getBoundingClientRect().right > W + 1) add(`portada desborda: ${img.getAttribute('src')}`);
      continue;
    }
    // Excepción (2026-11-25): imagen de una de las dos puertas de /rol/ (Ludoteca, Crónicas), sin pie.
    if (img.matches('.tz-puerta-foto')) {
      if (!img.alt || img.alt.length < 20) add(`imagen de puerta sin alt descriptivo: ${img.getAttribute('src')}`);
      if (!img.getAttribute('width') || !img.getAttribute('height')) add(`imagen de puerta sin width/height: ${img.getAttribute('src')}`);
      if (img.getBoundingClientRect().right > W + 1) add(`imagen de puerta desborda: ${img.getAttribute('src')}`);
      continue;
    }
    // Excepción (2026-11-27): retrato de un PJ en su ficha del reparto de una aventura (el nombre va en el h3).
    if (img.closest('.tz-ficha') && img.closest('picture') && img.matches('.tz-retrato-pj, picture img')) {
      if (!img.alt || img.alt.length < 20) add(`retrato de PJ sin alt descriptivo: ${img.getAttribute('src')}`);
      if (!img.getAttribute('width') || !img.getAttribute('height')) add(`retrato de PJ sin width/height: ${img.getAttribute('src')}`);
      if (img.getBoundingClientRect().right > W + 1) add(`retrato de PJ desborda: ${img.getAttribute('src')}`);
      continue;
    }
    // Excepción (Rol 7/8, 2026-11-24): ilustración de un módulo de aventura (CC0), en su figura con pie.
    if (img.closest('figure.tz-modulo-imagen')) {
      if (!img.alt || img.alt.length < 20) add(`ilustración de módulo sin alt descriptivo: ${img.getAttribute('src')}`);
      if (!img.getAttribute('width') || !img.getAttribute('height')) add(`ilustración de módulo sin width/height: ${img.getAttribute('src')}`);
      if (!img.closest('figure').querySelector('figcaption')?.textContent.trim()) add(`ilustración de módulo sin pie: ${img.getAttribute('src')}`);
      if (img.getBoundingClientRect().right > W + 1) add(`ilustración de módulo desborda: ${img.getAttribute('src')}`);
      continue;
    }
    add(`imagen visible: ${img.getAttribute('src')}`);
  }
  return JSON.stringify({ w: W, sw: SW, issues });
})()
