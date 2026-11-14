/* Auditoría de web/index.html. Se pega en la consola del navegador (o se evalúa con una herramienta)
   con la página servida (python3 -m http.server 8765 --directory web).
   Recorre los 3 tamaños de letra × 8 secciones × 13 pestañas (60 vistas) y devuelve un JSON:
     { n: número de fallos, issues: [...], errs: errores de JS, checks: vistas revisadas }
   Comprueba en cada vista: sin scroll horizontal, texto visible >= 16 px, botones y campos >= 48 px,
   casillas >= 28 px. Solo mide elementos visibles.
   Hay que repetirla en cada ancho: 320, 360, 390, 414, 480, 540, 600, 640, 700, 768, 820, 900, 1024, 1100, 1280, 1440.
   Para que las tablas tengan contenido, antes conviene subir un CSV de prueba (tests/subasta-prueba.csv)
   y apuntar algo en Almacén, Oro, Libro y Diario. OJO: deja el tamaño de letra en normal y la sección en Inicio. */
(() => {
  const issues = [];
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
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 15.99) issues.push(tag + ': texto ' + fs.toFixed(1) + 'px <' + el.tagName + '> "' + n.nodeValue.trim().slice(0, 25) + '"');
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
