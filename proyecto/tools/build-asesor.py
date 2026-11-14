#!/usr/bin/env python3
"""Genera la página del asesor para el sitio Astro a partir del prototipo.

Entrada:  web/index.html  (prototipo completo; única fuente de verdad del asesor)
Salida:   repo/public/mmo/wow-forever/asesor/index.html
Uso:      python3 tools/build-asesor.py

Qué cambia respecto al prototipo:
- Solo se ve la sección MMO (el resto del sitio vive en Astro).
- El menú de secciones se sustituye por enlaces al sitio.
- Los enlaces a las guías apuntan a /mmo/wow-forever/guias/<slug>.
No cambia la clave de localStorage (wowf-chaman-v1) ni el estado.
Cada sustitución debe casar el número exacto de veces; si no, el script falla.
"""
import pathlib, re, sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'web' / 'index.html'
# Carpeta de trabajo: <raíz>/repo es el clon. Dentro del repo: esta carpeta es <repo>/proyecto.
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
    '<title>Asesor de La Barbarie · WoW Forever · TALAZBRÁGOLES</title>\n'
    '<link rel="canonical" href="' + SITIO + '/mmo/wow-forever/asesor/">\n'
    '<meta name="description" content="Asesor de la hermandad La Barbarie en World of Warcraft: Forever. Los datos se guardan solo en tu navegador.">')

# Menú de secciones → enlaces al sitio.
m = re.search(r'<nav class="topnav" aria-label="Secciones">.*?</nav>', s, re.S)
if not m:
    sys.exit('No encuentro el menú de secciones')
s = s[:m.start()] + ('<nav class="topnav" aria-label="Sitio">\n'
                     '      <a class="btn" href="/">← Talazbrágoles</a>\n'
                     '      <a class="btn" href="/mmo/wow-forever">La Barbarie</a>\n'
                     '      <a class="btn" href="/mmo/wow-forever/guias">Guías</a>\n'
                     '    </nav>') + s[m.end():]

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
