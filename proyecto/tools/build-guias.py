#!/usr/bin/env python3
"""Genera las páginas estáticas de las guías de profesión.

Entrada:  docs/guias/<slug>.md   (formato en docs/guias/_REGLAS.md)
Salida:   web/guias/<slug>.html  y  web/guias/index.html
Uso:      python3 tools/build-guias.py
Sin JS en las páginas. Requiere el módulo `markdown` de Python.
"""
import html, pathlib, re, sys
import markdown

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'docs' / 'guias'
DESTINO = RAIZ / 'web' / 'guias'

CSS = """
:root{--bg:#0e0908;--panel:#1c1210;--panel2:#2a1813;--line:#5a2a1e;--text:#f4e9d4;--sec:#d2bfa0;--gold:#e7b552;--azul:#7fc0ee;--nar:#f0a050}
*{box-sizing:border-box}
html{font-size:18px}
html,body{margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:Georgia,'Palatino Linotype',Palatino,serif;font-size:18px;line-height:1.6;overflow-wrap:break-word}
@media(min-width:700px){body{font-size:19px}}
.wrap{max-width:1100px;margin:0;padding:16px 16px 48px}
@media(min-width:1200px){.wrap{margin:0 auto}}
h1,h2,h3{line-height:1.25;margin:24px 0 12px;font-variant:small-caps;letter-spacing:.04em;color:var(--gold)}
h1{font-size:1.6em;margin-top:8px} h2{font-size:1.3em;border-top:2px solid var(--line);padding-top:16px} h3{font-size:1.1em}
p{margin:0 0 12px}
ul,ol{margin:0 0 12px;padding-left:24px}
li{margin:0 0 6px}
a{color:var(--azul)}
a:visited{color:var(--azul)}
:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
code,kbd,samp,pre{font-family:inherit;font-size:1em}
small,sub,sup{font-size:1em;vertical-align:baseline}
.nav{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}
.btn{display:inline-block;min-height:48px;min-width:48px;padding:10px 16px;border:2px solid var(--line);border-radius:6px;background:var(--panel2);color:var(--text);text-decoration:none}
.btn:visited{color:var(--text)}
.aviso{border:2px dashed var(--nar);border-radius:10px;padding:12px 16px;margin:0 0 16px;background:var(--panel)}
.meta{color:var(--sec)}
.tscroll{overflow-x:auto;margin:0 0 12px;border:1px solid var(--line)}
table{border-collapse:collapse;width:100%;min-width:560px}
th,td{border:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}
th{background:var(--panel2);color:var(--gold)}
.salto{position:absolute;left:-9999px;top:0}
.salto:focus{position:static;display:inline-block;min-height:48px;padding:10px 16px;background:var(--panel2);color:var(--text)}
.lista{list-style:none;padding:0;display:grid;gap:12px}
@media(min-width:768px){.lista{grid-template-columns:1fr 1fr}}
.lista a{display:block;min-height:48px;padding:12px 16px;border:2px solid var(--line);border-radius:10px;background:var(--panel);color:var(--text);text-decoration:none}
.lista strong{color:var(--gold);display:block}
@media print{.nav,.salto{display:none}body{background:#fff;color:#000}h1,h2,h3,th{color:#000}}
"""

AVISO = ('<div class="aviso"><p><strong>Cómo leer esta guía.</strong> Está redactada el {fecha} a partir de páginas públicas, '
         'no de pruebas en el juego. Cada dato dice de qué sitio sale. Cuando dos sitios no coinciden, no se elige: '
         'está apuntado en «Dudas y contradicciones». Lo que no se ha podido confirmar está en «Pendiente».</p></div>')


def pagina(titulo, cuerpo, nav):
    return ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<title>' + html.escape(titulo) + ' · La Barbarie · Talazbrágoles</title>\n<style>' + CSS + '</style>\n</head>\n<body>\n'
            '<a class="salto" href="#contenido">Saltar al contenido</a>\n<div class="wrap">\n'
            '<nav class="nav" aria-label="Navegación">' + nav + '</nav>\n<main id="contenido">\n' + cuerpo + '\n</main>\n</div>\n</body>\n</html>\n')


def leer(ruta):
    txt = ruta.read_text(encoding='utf-8')
    m = re.match(r'^---\n(.*?)\n---\n', txt, re.S)
    if not m:
        sys.exit('Sin cabecera: ' + ruta.name)
    meta = {}
    for linea in m.group(1).splitlines():
        if ':' in linea:
            k, v = linea.split(':', 1)
            meta[k.strip()] = v.strip()
    for k in ('profesion', 'slug', 'tipo', 'comprobado'):
        if k not in meta:
            sys.exit('Falta «%s» en %s' % (k, ruta.name))
    if meta['slug'] != ruta.stem:
        sys.exit('El slug no coincide con el nombre del archivo: ' + ruta.name)
    return meta, txt[m.end():]


def a_html(md):
    # El contenido viene de páginas ajenas: no se admite HTML en bruto (se deja pasar solo <http…> de enlace automático).
    md = re.sub(r'<(?!https?://)', '&lt;', md)
    # Las direcciones sueltas pasan a ser enlaces.
    md = re.sub(r'(?<![<(\[`])(https?://[^\s<>|)\]]*[^\s<>|)\].,;:])', r'<\1>', md)
    h = markdown.markdown(md, extensions=['tables', 'toc', 'sane_lists'], output_format='html5')
    h = re.sub(r'<table>', '<div class="tscroll" tabindex="0" role="region" aria-label="Tabla (se desplaza de lado)"><table>', h)
    h = h.replace('</table>', '</table></div>')
    h = re.sub(r'<a href="(https?://[^"]+)"', r'<a rel="noopener noreferrer" href="\1"', h)
    if re.search(r'<script|\son\w+=|javascript:', h, re.I):
        sys.exit('HTML no permitido en una guía')
    return h


def main():
    DESTINO.mkdir(parents=True, exist_ok=True)
    guias = []
    for ruta in sorted(ORIGEN.glob('[a-z]*.md')):
        meta, md = leer(ruta)
        cuerpo = a_html(md)
        secciones = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', cuerpo)
        indice = '<nav aria-label="Índice de la guía"><p><strong>En esta guía:</strong></p><ul>' + ''.join(
            '<li><a href="#%s">%s</a></li>' % (i, t) for i, t in secciones) + '</ul></nav>'
        cabecera = '<p class="meta">Tipo: %s · Comprobado: %s</p>' % (html.escape(meta['tipo']), html.escape(meta['comprobado']))
        # El h1 viene del Markdown; el aviso y el índice van justo detrás.
        cuerpo = re.sub(r'(</h1>)', r'\1' + '\n' + cabecera + AVISO.format(fecha=html.escape(meta['comprobado'])) + indice, cuerpo, count=1)
        nav = ('<a class="btn" href="../index.html#mmo-prof">← Volver al asesor</a>'
               '<a class="btn" href="index.html">Todas las guías</a>')
        (DESTINO / (meta['slug'] + '.html')).write_text(pagina(meta['profesion'], cuerpo, nav), encoding='utf-8')
        guias.append(meta)
    cuerpo = ('<h1>Guías de profesiones · WoW Forever</h1>\n'
              '<p>Una guía por profesión, para la hermandad La Barbarie. Redactadas a partir de páginas públicas; '
              'cada dato lleva su fuente y lo dudoso está marcado.</p>\n<ul class="lista">' + ''.join(
                  '<li><a href="%s.html"><strong>%s</strong>%s · comprobado %s</a></li>' % (
                      g['slug'], html.escape(g['profesion']), html.escape(g['tipo']), html.escape(g['comprobado'])) for g in guias) + '</ul>')
    nav = '<a class="btn" href="../index.html#mmo-prof">← Volver al asesor</a>'
    (DESTINO / 'index.html').write_text(pagina('Guías de profesiones', cuerpo, nav), encoding='utf-8')
    print('Guías generadas:', len(guias), '→', DESTINO)


if __name__ == '__main__':
    main()
