/* Auditoría de web/index.html. Se pega en la consola del navegador (o se evalúa con una herramienta)
   con la página servida (python3 -m http.server 8765 --directory web).
   Recorre los 3 tamaños de letra × 8 secciones × 14 pestañas (63 vistas) y devuelve un JSON:
     { n: número de fallos, issues: [...], errs: errores de JS, checks: vistas revisadas }
   Comprueba en cada vista: sin scroll horizontal, texto visible >= 16 px, contraste >= 7:1, botones y campos >= 48 px,
   casillas >= 28 px. Solo mide elementos visibles.
   Hay que repetirla en cada ancho: 320, 360, 390, 414, 480, 540, 600, 640, 700, 768, 820, 900, 1024, 1100, 1280, 1440.
   Para que las tablas tengan contenido, antes conviene subir un CSV de prueba (tests/subasta-prueba.csv)
   y apuntar algo en Almacén, Oro, Libro y Diario. OJO: deja el tamaño de letra en normal y la sección en Inicio. */
(() => {
  const issues = [];
  // Contraste de texto ≥ 7:1 contra el fondo opaco efectivo (añadido en el rediseño 4/5, 2026-11-15).
  const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => { const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const fondo = el => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] === 1)) return c; } return [244, 240, 230]; };
  const contraste = (a, b) => { const L1 = lum(a), L2 = lum(b); return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); };
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  const check = tag => {
    const sw = document.documentElement.scrollWidth, iw = window.innerWidth;
    if (sw > iw) issues.push(tag + ': scroll horizontal ' + sw + '>' + iw);
    document.querySelectorAll('button,.btn,input:not([type=checkbox]):not([type=file]),select,textarea').forEach(el => {
      if (!vis(el)) return;
      const r = el.getBoundingClientRect();
      if (r.height < 47.5 || (el.matches('button,.btn') && r.width < 47.5))
        issues.push(tag + ': control <48 ' + el.tagName + '#' + el.id + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    });
    document.querySelectorAll('input[type=checkbox]').forEach(el => {
      if (!vis(el)) return;
      const r = el.getBoundingClientRect();
      if (r.height < 27.5 || r.width < 27.5) issues.push(tag + ': casilla <28');
    });
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; const seen = new Set();
    while ((n = w.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      const el = n.parentElement;
      if (!el || seen.has(el) || !vis(el) || el.closest('svg,script,style')) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      if (fs < 15.99) issues.push(tag + ': texto ' + fs.toFixed(1) + 'px <' + el.tagName + '> "' + n.nodeValue.trim().slice(0, 25) + '"');
      if (el.closest('select')) continue; // las opciones las pinta el sistema
      const cr = contraste(rgb(cs.color), fondo(el));
      if (cr < 7) issues.push(tag + ': contraste ' + cr.toFixed(2) + ' <' + el.tagName + ' class="' + el.className + '"> "' + n.nodeValue.trim().slice(0, 25) + '"');
    }
  };
  let checks = 0;
  for (const fsz of [0, 1, 2]) {
    setFs(fsz);
    for (const s of SECS) {
      showSec(s);
      if (s === 'mmo') {
        for (const t of TABS) {
          showTab(t);
          if (t === 'subasta') { planHacer(); document.getElementById('bus-q').value = 'de'; buscar(); calcFab(); calcSubasta(); }
          check('fs' + fsz + ' mmo/' + t); checks++;
        }
      } else { check('fs' + fsz + ' ' + s); checks++; }
    }
  }
  setFs(1); showSec('inicio');
  return JSON.stringify({ n: issues.length, issues: [...new Set(issues)].slice(0, 40), errs: window.__errs, checks });
})()
