"""Rutas comunes de las herramientas de tools/ (las importan sync-repo.py y build-asesor.py).

RAIZ es la carpeta que contiene tools/: la carpeta de trabajo (/opt/data/project-talazbragoles)
o, dentro del repo, <repo>/proyecto.
"""
import os
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent


def repo():
    """Clon o worktree del sitio Astro.

    1. TZ_REPO=<ruta>, si está puesta (p. ej. TZ_REPO=repo-rediseno).
    2. <carpeta de trabajo>/repo, si existe.
    3. Si no, la carpeta de arriba: estas herramientas viven en <repo>/proyecto/tools.
    """
    if os.environ.get('TZ_REPO'):
        r = pathlib.Path(os.environ['TZ_REPO']).resolve()
    elif (RAIZ / 'repo').is_dir():
        r = RAIZ / 'repo'
    else:
        r = RAIZ.parent
    if not (r / 'astro.config.mjs').is_file():
        sys.exit('No encuentro el repo en %s (falta astro.config.mjs). Indica la ruta con TZ_REPO=<clon o worktree>.' % r)
    return r
