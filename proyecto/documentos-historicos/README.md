# Documentos históricos de Talazbrágoles

Material de época (folletos, programas, carteles, fotos, prensa, testimonios) ordenado por edición, **de la más reciente a la más antigua** (decisión de PabloFM, 2026-11-23). Sirve para documentar el Archivo de las Jornadas y como inspiración. Se va completando poco a poco. Propuesta de cómo se verá en la web: `docs/ediciones/propuesta-v1/index.html`.

## Ediciones

| Ed. | Año | Estado | Documentos | Carpeta |
|---|---|---|---|---|
| VI | 1997 | parcial | folleto original | `1997-vi-jornadas/` |
| V | 1996 (deducido, dos indicios) | parcial | reseña de La Runa (fuente secundaria) | `1996-v-jornadas/` |
| IV | 1995 (deducido) | pendiente | — | `1995-iv-jornadas/` |
| III | 1994 (deducido) | pendiente | — | `1994-iii-jornadas/` |
| II | 1993 (deducido) | pendiente | — | `1993-ii-jornadas/` |
| I | 1992 (deducido) | pendiente | — | `1992-i-jornadas/` |
| ¿? | sin fechar | — | 2 testimonios | `sin-fechar/` |

Cada edición se ordena por dentro así: lo visual (cartel, portada del folleto) y resumen · qué se hizo · organización (cambiaba cada año) · lugar exacto · papeles, prensa y fotos (subcarpetas `folleto/`, `prensa/`, `fotos/`…) · fuentes.

Años de la I a la IV: deducidos del folleto de 1997 («por sexto año consecutivo»). Si aparece un documento que diga otra cosa, manda el documento.

Ediciones posteriores a 1997: se añaden con el mismo formato (`AAAA-<romano>-jornadas/`) en cuanto haya un dato con fuente.

## Formato

- Una carpeta por edición, con `README.md`: tabla «Lo que sabemos» (dato · valor · fuente), documentos y pendientes. Lo desconocido va «pendiente».
- Dentro, una subcarpeta por documento (p. ej. `1997-vi-jornadas/folleto/`) con:
  - `originales/`: fotos o escaneos tal como llegaron (no se tocan).
  - `restaurado/`: enderezado, recortado al borde del papel, luz igualada, en grises y enfocado; un pliego completo y una imagen por cara.
  - `<documento>.md`: transcripción literal (erratas con [sic], lecturas dudosas con ¿?), qué aporta y qué NO dice.
- `herramientas/`: scripts de restauración, compartidos (Python + OpenCV).

En el repo de la web (`proyecto/documentos-historicos/`) se copia esta carpeta SIN `originales/` ni `restaurado/` (pesan ~19 MB): las caras reducidas que se publican (JPEG gris de 1000 px) están en `public/documentos/<documento>/` y los datos de cada edición en `src/content/editions/<año>.json`.

## Cómo restaurar una foto nueva (díptico doblado, foto en vertical sobre fondo oscuro)

```sh
P=/opt/data/cache/venv-img/bin/python      # venv con opencv-python-headless + numpy
H=herramientas
$P $H/restaura.py foto.jpg tmp/x            # geometría: mirar tmp/x-control.jpg (bordes y doblez en rojo)
$P $H/tono.py tmp/x restaurado izq.jpg der.jpg pliego.jpg igualar   # «igualar» si las dos caras tienen el mismo fondo; si no, «no»
$P $H/mide-lineas.py restaurado/izq.jpg y0 y1 x0 x1                  # comprobación: desfase de las líneas por franjas (0 ± 1 = rectas)
```

1. `restaura.py`: detecta el papel, ajusta cada borde con una curva robusta (ignora muescas) y el doblez como recta; cada mitad se endereza por separado (parche de Coons), así el quiebro del pliegue no tuerce el texto.
2. `tono.py`: gira a apaisado, quita la luz desigual (superficie ajustada solo al papel claro, no al dibujo), escala de grises, quita ruido y enfoca; endereza lo que queda con las propias líneas de texto; recorta la franja del pliegue y, con `igualar`, iguala el tono y funde 48 px entre las dos caras.

Supone que en la foto el doblez va en horizontal y que la cara de arriba queda a la izquierda al girar. Otro tipo de documento (tríptico, hoja suelta) pide adaptar los scripts.
