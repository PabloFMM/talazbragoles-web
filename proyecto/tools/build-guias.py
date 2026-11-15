#!/usr/bin/env python3
"""Genera las páginas estáticas de las guías de profesión (web local).

Entrada:  docs/guias/<slug>.md   (formato en docs/guias/_REGLAS.md)
Salida:   web/guias/<slug>.html  y  web/guias/index.html
Uso:      python3 tools/build-guias.py
Sin JS en las páginas. Requiere el módulo `markdown` de Python.

Estilo: sistema «Papel y tinta» (docs/diseno.md, rediseño 3/5, 2026-11-15), el mismo
que las guías del sitio Astro (/mmo/wow-forever/guias/). Las tablas se apilan como
fichas en anchos estrechos: cada celda lleva data-etiqueta con su cabecera (lo mismo
que hace el plugin repo/src/lib/rehype-guias.mjs en el sitio).
Las tipografías del sitio (Archivo, Source Serif 4) no están en web/: aquí salen sus
respaldos (Helvetica/Arial y Georgia).
"""
import html, pathlib, re, sys
import markdown

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'docs' / 'guias'
DESTINO = RAIZ / 'web' / 'guias'

CSS = """
:root{--papel:#f4f0e6;--papel-2:#ebe5d8;--tinta:#0f0f10;--tinta-2:#45413b;--filete:#b8b2a5;
--texto:"Archivo","Helvetica Neue",Arial,sans-serif;--titular:"Source Serif 4",Georgia,"Times New Roman",serif;
--margen:clamp(1.25rem,0.5rem + 3vw,3.5rem);--medida:40rem;--toque:3rem}
*,*::before,*::after{box-sizing:border-box;transition:none!important;animation:none!important}
html{background:var(--papel);color:var(--tinta);-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;background:var(--papel);color:var(--tinta);font-family:var(--texto);font-size:1.125rem;line-height:1.6;overflow-wrap:break-word}
@media(min-width:48rem){body{font-size:1.1875rem}}
::selection{background:var(--tinta);color:var(--papel)}
:focus-visible{outline:3px solid var(--tinta);outline-offset:3px}
.pagina{width:min(100% - 2*var(--margen),76rem);margin-inline:auto;padding-block:1.5rem 4rem}
a{color:var(--tinta);text-decoration-thickness:1px;text-underline-offset:.22em}
a:hover{text-decoration-thickness:2px}
code,kbd,samp,pre{font-family:ui-monospace,Consolas,"Courier New",monospace;font-size:1em}
small,sub,sup{font-size:1em;vertical-align:baseline}
.rotulo{margin:0;font-size:1rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;line-height:1.35}
.salto{position:absolute;left:1rem;top:-10rem;display:inline-flex;align-items:center;min-height:var(--toque);padding:.5rem 1.5rem;background:var(--tinta);color:var(--papel);font-weight:600;text-decoration:none}
.salto:focus{top:1rem}
/* Barra de vuelta */
.nav{display:flex;flex-wrap:wrap;gap:0 1.5rem;border-bottom:1px solid var(--tinta);padding-bottom:.75rem}
.nav a{display:inline-flex;align-items:center;min-height:var(--toque);min-width:var(--toque);font-size:1rem;font-weight:600}
/* Encabezado */
.cabeza{padding-block:clamp(2rem,1rem + 4vw,4.5rem) 0}
.cabeza .rotulo{margin-bottom:1.5rem}
h1{margin:0;font-family:var(--titular);font-size:clamp(2.5rem,1.5rem + 4.4vw,4.75rem);font-weight:300;line-height:1.04;letter-spacing:-.015em;text-wrap:balance}
.meta{margin:1.5rem 0 0;font-size:1rem;color:var(--tinta-2)}
.entradilla{margin:1.5rem 0 0;max-width:38rem;font-size:1.375rem;line-height:1.5;color:var(--tinta-2)}
/* Retícula: nota e índice antes del texto en móvil, al margen desde 1024 px */
.reticula{display:grid;grid-template-columns:minmax(0,1fr);grid-template-areas:"margen" "texto";gap:3rem 2rem;padding-top:clamp(3rem,2rem + 4vw,6rem)}
.reticula>article{grid-area:texto;container-type:inline-size}
.reticula>aside{grid-area:margen}
@media(min-width:64rem){.reticula{grid-template-columns:minmax(0,1fr) 15rem;grid-template-areas:"texto margen";column-gap:4rem}}
aside>*+*{margin-top:2rem}
.nota{padding:1.5rem;background:var(--papel-2);border-top:1px solid var(--tinta);font-size:1rem;line-height:1.55}
.nota p{margin:0;max-width:var(--medida)}
.nota .rotulo{margin-bottom:.75rem}
.indice{border-top:1px solid var(--tinta);padding-top:.75rem}
.indice ol{list-style:none;margin:.5rem 0 0;padding:0;counter-reset:g}
.indice li{counter-increment:g;border-top:1px solid var(--filete)}
.indice li:first-child{border-top:0}
.indice a{display:grid;grid-template-columns:2.25rem minmax(0,1fr);align-items:center;min-height:var(--toque);padding-block:.25rem;font-size:1rem;line-height:1.35;text-decoration:none}
.indice a::before{content:counter(g,decimal-leading-zero);color:var(--tinta-2);font-variant-numeric:tabular-nums}
.indice a:hover span{text-decoration:underline}
/* Texto de la guía */
article>*{margin-block:0}
article>*+*{margin-top:1rem}
article>p,article>ul,article>ol,article>h3{max-width:var(--medida)}
article p{text-wrap:pretty}
article ul,article ol{padding-left:1.4em}
article li+li{margin-top:.5rem}
article li::marker{color:var(--tinta-2)}
article strong{font-weight:600}
article h2{margin-top:6rem;padding-top:1rem;border-top:1px solid var(--tinta);font-family:var(--titular);font-size:1.75rem;font-weight:400;line-height:1.18;letter-spacing:-.01em;text-wrap:balance}
@media(min-width:48rem){article h2{font-size:2.375rem}}
article>h2:first-child{margin-top:0}
article h3{margin-top:2rem;font-size:1.375rem;font-weight:600;line-height:1.18}
/* Tablas: filetes finos; en caja estrecha cada fila es una ficha con la etiqueta encima */
table{width:100%;border-collapse:collapse;margin-block:1.5rem;font-size:1rem;line-height:1.5;border-top:2px solid var(--tinta)}
th,td{padding:.75rem 1rem .75rem 0;text-align:left;vertical-align:top;overflow-wrap:break-word}
th:last-child,td:last-child{padding-right:0}
th{font-weight:600;border-bottom:1px solid var(--tinta)}
td{border-bottom:1px solid var(--filete)}
td:first-child{font-weight:600}
@container (max-width:44rem){
 table,thead,tbody,tr,th,td{display:block}
 thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}
 table{border-top:0}
 tr{padding-block:1rem;border-top:1px solid var(--filete)}
 tr:first-child{border-top:2px solid var(--tinta)}
 tr:last-child{border-bottom:1px solid var(--tinta)}
 td{padding:0;border:0}
 td+td{margin-top:.75rem}
 td[data-etiqueta]::before{content:attr(data-etiqueta);display:block;color:var(--tinta-2);font-weight:400;font-size:1rem}
 td:first-child{font-size:1.125rem}
}
@container (min-width:30rem) and (max-width:44rem){td[data-etiqueta]{display:grid;grid-template-columns:9rem minmax(0,1fr);gap:1rem}}
/* Índice de guías */
.lista{list-style:none;margin:2rem 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,22rem),1fr));column-gap:2rem}
.lista>li{border-top:1px solid var(--tinta)}
.lista a{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:.25rem 1rem;min-height:var(--toque);padding-block:1rem;text-decoration:none}
.lista .nombre{font-family:var(--titular);font-size:1.375rem;line-height:1.25}
.lista .detalle{grid-column:1;font-size:1rem;color:var(--tinta-2)}
.lista .flecha{grid-column:2;grid-row:1/span 2;font-size:1.375rem}
.lista a:hover .nombre{text-decoration:underline;text-decoration-thickness:1px}
@media print{.nav,.salto,aside .indice{display:none}}
"""

AVISO = ('<div class="nota"><p class="rotulo">Cómo leer esta guía</p><p>Está redactada el {fecha} a partir de páginas públicas, '
         'no de pruebas en el juego. Cada dato dice de qué sitio sale. Cuando dos sitios no coinciden, no se elige: '
         'está apuntado en «Dudas y contradicciones». Lo que no se ha podido confirmar está en «Pendiente».</p></div>')

MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']


def fecha_larga(iso):
    m = re.match(r'^(\d{4})-(\d{2})-(\d{2})$', iso)
    return '%d de %s de %s' % (int(m.group(3)), MESES[int(m.group(2)) - 1], m.group(1)) if m else iso


def pagina(titulo, cuerpo, nav):
    return ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<meta name="theme-color" content="#f4f0e6">\n'
            '<title>' + html.escape(titulo) + ' · La Barbarie · Talazbrágoles</title>\n<style>' + CSS + '</style>\n</head>\n<body>\n'
            '<a class="salto" href="#contenido">Saltar al contenido</a>\n<div class="pagina">\n'
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


def tablas(h):
    """Etiqueta cada <td> con el texto de su cabecera y pone roles ARIA (la tabla se apila en móvil)."""
    def una(m):
        t = m.group(0)
        cab = [html.unescape(re.sub(r'<[^>]+>', '', c)).strip() for c in re.findall(r'<th(?=[\s>])[^>]*>(.*?)</th>', t, re.S)]

        def fila(mf):
            i = [0]

            def celda(mc):
                n = i[0]
                i[0] += 1
                et = (' data-etiqueta="%s"' % html.escape(cab[n], quote=True)) if n < len(cab) and cab[n] else ''
                return '<td role="cell"' + et + mc.group(1) + '>'
            return '<tr role="row">' + re.sub(r'<td([^>]*)>', celda, mf.group(1)) + '</tr>'
        t = re.sub(r'<tr>(.*?)</tr>', fila, t, flags=re.S)
        t = t.replace('<table>', '<table role="table">').replace('<thead>', '<thead role="rowgroup">').replace('<tbody>', '<tbody role="rowgroup">')
        t = re.sub(r'<th(?=[\s>])([^>]*)>', r'<th role="columnheader"\1>', t)
        return t
    return re.sub(r'<table>.*?</table>', una, h, flags=re.S)


def a_html(md):
    # El contenido viene de páginas ajenas: no se admite HTML en bruto (se deja pasar solo <http…> de enlace automático).
    md = re.sub(r'<(?!https?://)', '&lt;', md)
    # Las direcciones sueltas pasan a ser enlaces.
    md = re.sub(r'(?<![<(\[`])(https?://[^\s<>|)\]]*[^\s<>|)\].,;:])', r'<\1>', md)
    h = markdown.markdown(md, extensions=['tables', 'toc', 'sane_lists'], output_format='html5')
    h = tablas(h)
    h = re.sub(r'<a href="(https?://[^"]+)"', r'<a rel="noopener noreferrer" href="\1"', h)
    if re.search(r'<script|\son\w+=|javascript:', h, re.I):
        sys.exit('HTML no permitido en una guía')
    return h


def main():
    DESTINO.mkdir(parents=True, exist_ok=True)
    guias = []
    enlaces = 0
    for ruta in sorted(ORIGEN.glob('[a-z]*.md')):
        meta, md = leer(ruta)
        cuerpo = a_html(md)
        n = len(re.findall(r'<a rel="noopener noreferrer" href="https?://', cuerpo))
        if n == 0:
            sys.exit('La guía %s sale sin ningún enlace a sus fuentes: revisar el conversor' % ruta.name)
        enlaces += n
        # El h1 del Markdown pasa al encabezado de la página.
        m = re.search(r'<h1[^>]*>(.*?)</h1>\s*', cuerpo, re.S)
        titulo = m.group(1) if m else html.escape(meta['profesion'])
        if m:
            cuerpo = cuerpo[:m.start()] + cuerpo[m.end():]
        secciones = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', cuerpo)
        fecha = fecha_larga(meta['comprobado'])
        indice = ('<nav class="indice" aria-label="Índice de la guía"><p class="rotulo">En esta guía</p><ol>' + ''.join(
            '<li><a href="#%s"><span>%s</span></a></li>' % (i, t) for i, t in secciones) + '</ol></nav>')
        cabeza = ('<header class="cabeza"><p class="rotulo">La Barbarie · Guía de profesión</p><h1>%s</h1>'
                  '<p class="meta">Profesión de %s · comprobada el %s</p></header>') % (titulo, html.escape(meta['tipo']), html.escape(fecha))
        cuerpo = (cabeza + '<div class="reticula"><aside aria-label="Sobre esta guía">' + AVISO.format(fecha=html.escape(fecha)) + indice
                  + '</aside><article>' + cuerpo + '</article></div>')
        nav = ('<a href="../index.html#mmo-prof">← Volver al asesor</a>'
               '<a href="index.html">Todas las guías</a>')
        (DESTINO / (meta['slug'] + '.html')).write_text(pagina(meta['profesion'], cuerpo, nav), encoding='utf-8')
        guias.append(meta)
    cuerpo = ('<header class="cabeza"><p class="rotulo">La Barbarie · World of Warcraft: Forever</p><h1>Guías de profesiones</h1>\n'
              '<p class="entradilla">Una guía por profesión, para la hermandad La Barbarie. Redactadas a partir de páginas públicas; '
              'cada dato lleva su fuente y lo dudoso está marcado.</p></header>\n<ul class="lista">' + ''.join(
                  '<li><a href="%s.html"><span class="nombre">%s</span><span class="detalle">%s · comprobada el %s</span>'
                  '<span class="flecha" aria-hidden="true">›</span></a></li>' % (
                      g['slug'], html.escape(g['profesion']), html.escape(g['tipo']), html.escape(fecha_larga(g['comprobado']))) for g in guias) + '</ul>')
    nav = '<a href="../index.html#mmo-prof">← Volver al asesor</a>'
    (DESTINO / 'index.html').write_text(pagina('Guías de profesiones', cuerpo, nav), encoding='utf-8')
    print('Guías generadas:', len(guias), '→', DESTINO, '· enlaces a fuentes:', enlaces)


if __name__ == '__main__':
    main()
