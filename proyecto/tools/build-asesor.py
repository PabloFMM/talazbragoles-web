#!/usr/bin/env python3
"""Genera la página del asesor para el sitio Astro a partir del prototipo.

Entrada:  web/index.html  (prototipo completo; única fuente de verdad del asesor)
Salida:   repo/public/mmo/wow-forever/asesor/index.html
Uso:      python3 tools/build-asesor.py

Qué cambia respecto al prototipo:
- Solo se ve la sección MMO (el resto del sitio vive en Astro).
- La cabecera es la del sitio: logotipo e índice («Menú» en móvil, fila en
  escritorio) con el mismo marcado que src/components/sistema/Indice.astro. Las
  entradas salen de src/lib/nav.ts y el CSS, de src/styles/sistema.css (§4.3,
  4.12, 4.13, 4.15 y migas), pasado a px porque el asesor tiene html a 18 px.
  tests/navegacion.spec.mjs comprueba que la cabecera coincide con la del sitio.
- Debajo, migas (Inicio › MMO › La Barbarie › Asesor) y los botones A−/A+.
- Los enlaces a las guías apuntan a /mmo/wow-forever/guias/<slug>.
No cambia la clave de localStorage (wowf-chaman-v1) ni el estado.
Cada sustitución debe casar el número exacto de veces; si no, el script falla.
"""
import os, pathlib, re, sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'web' / 'index.html'
# Carpeta de trabajo: <raíz>/repo es el clon. Dentro del repo: esta carpeta es <repo>/proyecto.
# TZ_REPO=<ruta> apunta a otro clon o worktree (p. ej. repo-rediseno).
if os.environ.get('TZ_REPO'):
    REPO = pathlib.Path(os.environ['TZ_REPO']).resolve()
else:
    REPO = RAIZ / 'repo' if (RAIZ / 'repo').is_dir() else RAIZ.parent
DESTINO = REPO / 'public' / 'mmo' / 'wow-forever' / 'asesor' / 'index.html'
SITIO = 'https://www.talazbragoles.com'

s = ORIGEN.read_text(encoding='utf-8')


def rep(viejo, nuevo, veces=1):
    global s
    n = s.count(viejo)
    if n != veces:
        sys.exit('No casa (%d veces, esperaba %d): %r' % (n, veces, viejo[:80]))
    s = s.replace(viejo, nuevo)


rep('<title>Talazbrágoles · Archivo y comunidad rolera</title>',
    '<title>Asesor de La Barbarie · WoW Forever · Talazbrágoles</title>\n'
    '<link rel="canonical" href="' + SITIO + '/mmo/wow-forever/asesor/">\n'
    '<meta name="description" content="Asesor de la hermandad La Barbarie en World of Warcraft: Forever. Los datos se guardan solo en tu navegador.">')

# Cabecera del sitio (la misma que pinta Layout.astro + Indice.astro).
RUTA = '/mmo/wow-forever/asesor'
nav_ts = (REPO / 'src' / 'lib' / 'nav.ts').read_text(encoding='utf-8')
GRUPOS = []
for g in re.finditer(r'\{ id: "([a-z]+)",(?: titulo: "([^"]+)",)? items: \[(.*?)\] \}', nav_ts, re.S):
    items = re.findall(r'\{ label: "([^"]+)",\s*href: "([^"]+)"\s*\}', g.group(3))
    GRUPOS.append((g.group(1), g.group(2), items))
if [x[0] for x in GRUPOS] != ['portada', 'archivo', 'comunidad'] or sum(len(x[2]) for x in GRUPOS) != 8:
    sys.exit('No entiendo gruposNav de src/lib/nav.ts: %r' % GRUPOS)


def actual(href):
    r, h = RUTA.rstrip('/') or '/', href.rstrip('/') or '/'
    if r == h:
        return 'page'
    if h != '/' and r.startswith(h + '/'):
        return 'true'
    return None


def grupos(sufijo):
    out, n = [], 0
    for gid, titulo, items in GRUPOS:
        lis = []
        for label, href in items:
            n += 1
            ac = actual(href)
            lis.append('<li><a href="%s"%s><span class="tz-num" aria-hidden="true">%02d</span> '
                       '<span class="tz-nav-texto">%s</span></a></li>'
                       % (href, ' aria-current="%s"' % ac if ac else '', n, label))
        tid = 'nav-%s-%s' % (sufijo, gid)
        out.append('<li class="tz-nav-grupo tz-nav-grupo--%s">%s<ul%s>%s</ul></li>' % (
            gid,
            '<span class="tz-nav-grupo-titulo" id="%s">%s</span>' % (tid, titulo) if titulo else '',
            ' aria-labelledby="%s"' % tid if titulo else '',
            ''.join(lis)))
    return '<ul class="tz-nav-grupos">%s</ul>' % ''.join(out)


SECCION = next(label for _, _, items in GRUPOS for label, href in items if actual(href))
CABECERA = (
    '<a href="#contenido" class="tz-saltar">Saltar al contenido</a>\n'
    '<header class="tz-cabecera"><div class="tz-pagina">'
    '<div class="tz-cabecera-fila"><a href="/" class="tz-logo" aria-label="Talazbrágoles · Archivo de las Jornadas (portada)">'
    '<span class="tz-logo-nombre">Talazbrágoles</span> <span class="tz-logo-sub">Archivo de las Jornadas</span></a></div>\n'
    '<nav class="tz-nav" aria-label="Secciones"><details class="tz-nav-plegable"><summary><span class="tz-nav-boton">'
    '<svg class="tz-nav-icono" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">'
    '<path class="tz-nav-icono-abrir" d="M3 6h18M3 12h18M3 18h18"></path><path class="tz-nav-icono-cerrar" d="M5 5l14 14M19 5 5 19"></path></svg> '
    '<span>Menú</span></span> <span class="tz-nav-donde">Estás en: <strong>%s</strong></span></summary>\n'
    '%s</details>\n<div class="tz-nav-fila">%s</div></nav></div></header>\n'
    '<div class="tz-pagina tz-asesor-barra">'
    '<nav class="tz-migas" aria-label="Estás en"><ol><li><a href="/">Inicio</a></li><li><a href="/mmo">MMO</a></li>'
    '<li><a href="/mmo/wow-forever">La Barbarie</a></li><li><span aria-current="page">Asesor</span></li></ol></nav>\n'
    % (SECCION, grupos('m'), grupos('f')))

m = re.search(r'<a class="salto" href="#contenido">Saltar al contenido</a>\s*<header class="top">\s*<div class="topbar">.*?'
              r'(<span class="fsbtns">.*?</span>)\s*</div>\s*</header>', s, re.S)
if not m:
    sys.exit('No encuentro la cabecera del prototipo')
s = s[:m.start()] + CABECERA + '  ' + m.group(1) + '\n</div>' + s[m.end():]

# CSS de la cabecera, sacado de sistema.css (sin @layer: así gana a las reglas de elemento del asesor).
css = (REPO / 'src' / 'styles' / 'sistema.css').read_text(encoding='utf-8')


def trozo(desde, hasta):
    i = css.index(desde)
    return css[i:css.index(hasta, i)]


tokens = re.search(r':root \{(.*?)\n\}', css, re.S).group(1)
partes = [
    '.tz-cabecera, .tz-saltar, .tz-asesor-barra {' + tokens + '\n}',
    re.search(r'  \.tz-pagina \{.*?\n  \}', css, re.S).group(0),
    re.search(r'  \.tz-num \{.*?\n  \}', css, re.S).group(0),
    trozo('  /* --- 4.3 Logotipo', '  /* --- 4.4 '),
    trozo('  /* --- 4.12 Cabecera del sitio', '  /* --- 4.14 '),
    trozo('  /* --- 4.15 Saltar al contenido', '  /* --- 4.16 '),
    ''.join(l + '\n' for l in css.splitlines() if l.startswith('  .tz-migas')),
]
cab = '\n'.join(partes)
# rem → px: el asesor tiene html a 18 px; el sitio, a 16 px.
cab = re.sub(r'(\d*\.?\d+)rem\b', lambda x: ('%g' % (float(x.group(1)) * 16)) + 'px', cab)
cab = re.sub(r'/\*.*?\*/', '', cab, flags=re.S)
cab = re.sub(r'\n\s*\n', '\n', cab)
PROPIO = '''
/* Lo que pone en el sitio la base (reset.css / sistema.css §3) */
.tz-cabecera, .tz-asesor-barra { font-size: 18px; line-height: 1.6; }
@media (min-width: 768px) { .tz-cabecera, .tz-asesor-barra { font-size: 19px; } }
:where(.tz-cabecera, .tz-asesor-barra) * { margin: 0; }
.tz-cabecera svg { display: block; }
.tz-nav-plegable > summary { cursor: pointer; }
.tz-nav-plegable > summary::-webkit-details-marker { display: none; }
/* Barra propia del asesor: migas a la izquierda, A−/A+ a la derecha */
.tz-asesor-barra { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 24px; padding-top: 16px; }
@media print { .tz-saltar, .tz-nav, .fsbtns { display: none; } .tz-migas a { min-height: 0; text-decoration: none; } }
'''
rep('</style>\n</head>', '</style>\n<style>\n/* ==== Cabecera del sitio (generada desde src/styles/sistema.css por build-asesor.py) ==== */\n'
    + cab + PROPIO + '</style>\n</head>')
rep('@media print{header.top,.wtabs,.salto,.btn{display:none}', '@media print{.wtabs,.btn{display:none}')

rep('<h1>MMO</h1>', '<h1>Asesor de La Barbarie</h1>')
rep('Talazbrágoles · prototipo local (13-nov-2026) · archivo con fuentes + comunidad rolera. Todo lo pendiente está marcado como pendiente; nada inventado.',
    'Talazbrágoles · asesor de La Barbarie. Tus datos se guardan solo en este navegador. Todo lo pendiente está marcado como pendiente; nada inventado.')

# Solo la sección MMO.
rep('function showSec(id){', "function showSec(id){\n id='mmo'; /* en el sitio solo existe esta sección */")

# Guías: rutas del sitio.
s, n = re.subn(r'href="guias/index\.html"', 'href="/mmo/wow-forever/guias"', s)
if n != 1:
    sys.exit('Enlace al índice de guías: %d' % n)
s, n = re.subn(r'href="guias/([a-z-]+)\.html(#[a-z-]+)?"', r'href="/mmo/wow-forever/guias/\1\2"', s)
if n < 10:
    sys.exit('Enlaces a guías: %d' % n)

if 'wowf-chaman-v1' not in s:
    sys.exit('Falta la clave de localStorage')

DESTINO.parent.mkdir(parents=True, exist_ok=True)
DESTINO.write_text(s, encoding='utf-8')
print('Asesor generado:', DESTINO, len(s), 'bytes;', n, 'enlaces a guías')
