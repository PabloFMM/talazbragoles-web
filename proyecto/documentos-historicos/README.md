# Documentos históricos de Talazbrágoles

Material de época (folletos, programas, carteles, fotos) digitalizado para inspirar y documentar el Archivo de las Jornadas.

Una carpeta por documento: `AAAA-MM-<descripcion>/` con

- `originales/`: fotos o escaneos tal como llegaron (no se tocan).
- `restaurado/`: enderezado, recortado al borde del papel, luz igualada, en grises y enfocado; un pliego completo y una imagen por cara.
- `<documento>.md`: transcripción literal (erratas con [sic], lecturas dudosas con ¿?), qué datos aporta y qué NO dice.
- `herramientas/`: scripts usados (Python + OpenCV, venv en `/opt/data/cache/venv-img`).

| Documento | Fecha | Carpeta |
|---|---|---|
| Folleto de las VI Jornadas (Talazbrágoles'97) | 19-20 abril 1997 | `1997-04-folleto-vi-jornadas/` |

## Cómo restaurar una foto nueva (díptico doblado, foto en vertical sobre fondo oscuro)

```sh
P=/opt/data/cache/venv-img/bin/python      # venv con opencv-python-headless + numpy
H=1997-04-folleto-vi-jornadas/herramientas
$P $H/restaura.py foto.jpg tmp/x            # geometría: mirar tmp/x-control.jpg (bordes y doblez en rojo)
$P $H/tono.py tmp/x restaurado izq.jpg der.jpg pliego.jpg igualar   # «igualar» si las dos caras tienen el mismo fondo; si no, «no»
$P $H/mide-lineas.py restaurado/izq.jpg y0 y1 x0 x1                  # comprobación: desfase de las líneas por franjas (0 ± 1 = rectas)
```

1. `restaura.py`: detecta el papel, ajusta cada borde con una curva robusta (ignora muescas) y el doblez como recta; cada mitad se endereza por separado (parche de Coons), así el quiebro del pliegue no tuerce el texto.
2. `tono.py`: gira a apaisado, quita la luz desigual (superficie ajustada solo al papel claro, no al dibujo), escala de grises, quita ruido y enfoca; endereza lo que queda con las propias líneas de texto; recorta la franja del pliegue y, con `igualar`, iguala el tono y funde 48 px entre las dos caras.

Supone que en la foto el doblez va en horizontal y que la cara de arriba queda a la izquierda al girar. Otro tipo de documento (tríptico, hoja suelta) pide adaptar los scripts.
