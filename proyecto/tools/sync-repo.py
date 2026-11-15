#!/usr/bin/env python3
"""Lleva el material de trabajo al clon del repo (rama actual del clon).

Uso (desde la carpeta de trabajo, con el clon en una rama hermes/<tema>):
    python3 tools/sync-repo.py

Hace tres cosas:
1. Copia las guías  docs/guias/<slug>.md  →  repo/src/content/guides/
2. Genera el asesor  web/index.html  →  repo/public/mmo/wow-forever/asesor/index.html
3. Copia docs, tools, tests, data, IDEA.md y web/index.html  →  repo/proyecto/  (archivo; no se publica)
Después: `npm run build` en el repo y commit.
"""
import os, pathlib, shutil, subprocess, sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
# TZ_REPO=<ruta> apunta a otro clon o worktree (p. ej. repo-rediseno, rama hermes/rediseno).
REPO = pathlib.Path(os.environ['TZ_REPO']).resolve() if os.environ.get('TZ_REPO') else RAIZ / 'repo'
if not (REPO / 'astro.config.mjs').exists():
    sys.exit('No encuentro el clon en ' + str(REPO))
rama = subprocess.run(['git', '-C', str(REPO), 'branch', '--show-current'], capture_output=True, text=True).stdout.strip()
if rama == 'main':
    sys.exit('El clon está en main: cambia a una rama hermes/<tema> antes de sincronizar.')

guias = REPO / 'src' / 'content' / 'guides'
guias.mkdir(parents=True, exist_ok=True)
for viejo in guias.glob('*.md'):
    viejo.unlink()
n = 0
for f in sorted((RAIZ / 'docs' / 'guias').glob('[a-z]*.md')):
    shutil.copy(f, guias / f.name)
    n += 1

subprocess.run([sys.executable, str(RAIZ / 'tools' / 'build-asesor.py')], check=True)

arch = REPO / 'proyecto'
for d in ('docs', 'tools', 'tests', 'data'):
    if (arch / d).exists():
        shutil.rmtree(arch / d)
    shutil.copytree(RAIZ / d, arch / d, ignore=shutil.ignore_patterns('__pycache__'))
shutil.copy(RAIZ / 'IDEA.md', arch / 'IDEA.md')
(arch / 'web').mkdir(parents=True, exist_ok=True)
shutil.copy(RAIZ / 'web' / 'index.html', arch / 'web' / 'index.html')
print('Sincronizado en la rama', rama, '·', n, 'guías')
