#!/usr/bin/env python3
"""Lleva el material de trabajo al clon del repo (rama actual del clon).

Uso (desde la carpeta de trabajo, con el clon en una rama hermes/<tema>):
    python3 tools/sync-repo.py                          # clon en repo/
    TZ_REPO=repo-rediseno python3 tools/sync-repo.py    # otro clon o worktree

Hace tres cosas:
1. Copia las guías  docs/guias/<slug>.md  →  <repo>/src/content/guides/
2. Genera el asesor  web/index.html  →  <repo>/public/mmo/wow-forever/asesor/index.html
3. Copia docs, tools, tests, data, IDEA.md, web/index.html y web/datos  →  <repo>/proyecto/  (archivo; no se publica)
Después: `npm run build` en el repo y commit.

Idempotente: ejecutarlo dos veces deja el clon igual (las copias conservan la fecha
del original). Se niega a seguir si al sustituir <repo>/proyecto/ se perdería trabajo
hecho allí a mano (archivo sin guardar en git que no está en el origen o es más nuevo
que él). TZ_FORZAR=1 sustituye igualmente.
"""
import os
import shutil
import subprocess
import sys

sys.dont_write_bytecode = True  # sin __pycache__ en tools/ (se copia al repo)
from _repo import RAIZ, repo  # noqa: E402

REPO = repo()
ARCH = REPO / 'proyecto'
CARPETAS = ('docs', 'tools', 'tests', 'data', 'web/datos')
SUELTOS = ('IDEA.md', 'web/index.html')

if RAIZ == ARCH.resolve():
    sys.exit('El origen y el destino son la misma carpeta (%s): ejecuta sync-repo.py desde la carpeta de trabajo, '
             'no desde <repo>/proyecto.' % RAIZ)


def git(*args):
    r = subprocess.run(['git', '-C', str(REPO), *args], capture_output=True, text=True)
    if r.returncode:
        sys.exit('git %s ha fallado en %s:\n%s' % (' '.join(args), REPO, r.stderr.strip()))
    return r.stdout


rama = git('branch', '--show-current').strip()
if not rama:
    sys.exit('El clon %s no está en ninguna rama (HEAD suelto): cambia a una rama hermes/<tema>.' % REPO)
if rama == 'main':
    sys.exit('El clon está en main: cambia a una rama hermes/<tema> antes de sincronizar.')

# ¿Hay en proyecto/ trabajo sin guardar que la copia borraría?
if not os.environ.get('TZ_FORZAR'):
    perdidos = []
    entradas = git('-c', 'core.quotePath=false', 'status', '--porcelain', '-z', '--untracked-files=all', '--',
                   *('proyecto/' + x for x in CARPETAS + SUELTOS)).split('\0')
    i = 0
    while i < len(entradas):
        e = entradas[i]
        i += 1
        if not e:
            continue
        if e[0] in 'RC':
            i += 1  # con -z, tras un renombrado viene la ruta antigua
        dest = REPO / e[3:]
        if not dest.is_file() or '__pycache__' in dest.parts:
            continue
        origen = RAIZ / dest.relative_to(ARCH)
        if not origen.is_file():
            perdidos.append(e[3:] + ' (no está en el origen)')
        elif dest.stat().st_mtime > origen.stat().st_mtime + 1 and dest.read_bytes() != origen.read_bytes():
            perdidos.append(e[3:] + ' (editado en el repo después que el origen)')
    if perdidos:
        sys.exit('No sincronizo: se perdería trabajo sin guardar en %s:\n  %s\n'
                 'Pásalo a la carpeta de trabajo (o haz commit) y repite; TZ_FORZAR=1 lo sustituye igualmente.'
                 % (ARCH, '\n  '.join(perdidos)))

# 1. Guías.
guias = REPO / 'src' / 'content' / 'guides'
guias.mkdir(parents=True, exist_ok=True)
for viejo in guias.glob('*.md'):
    viejo.unlink()
n = 0
for f in sorted((RAIZ / 'docs' / 'guias').glob('[a-z]*.md')):
    shutil.copy2(f, guias / f.name)
    n += 1
if n == 0:
    sys.exit('No hay guías en %s' % (RAIZ / 'docs' / 'guias'))

# 2. Asesor (mismo repo: TZ_REPO pasa a build-asesor.py).
subprocess.run([sys.executable, str(RAIZ / 'tools' / 'build-asesor.py')], check=True,
               env={**os.environ, 'TZ_REPO': str(REPO)})

# 3. Archivo del proyecto.
for d in CARPETAS:
    if (ARCH / d).exists():
        shutil.rmtree(ARCH / d)
    shutil.copytree(RAIZ / d, ARCH / d, ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
for f in SUELTOS:
    (ARCH / f).parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(RAIZ / f, ARCH / f)

cambios = git('status', '--porcelain', '--', 'proyecto', 'src/content/guides', 'public/mmo').splitlines()
print('Sincronizado en la rama %s · %d guías · %d archivos con cambios sin guardar' % (rama, n, len(cambios)))
