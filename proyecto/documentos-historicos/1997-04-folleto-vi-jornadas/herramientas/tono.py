"""Tono, enfoque y montaje del díptico tras restaura.py.

uso: tono.py prefijo carpeta_salida nombre_izq nombre_der nombre_pliego
- Corrige la iluminación: estima la luz con una superficie suave (polinomio
  de grado 3) ajustada solo a los bloques de papel claro, así ni el texto ni
  la ilustración cuentan como «sombra». Quita el degradado del pliegue sin
  tocar la textura impresa.
- Pasa a escala de grises (el folleto está impreso a una tinta).
- Quita ruido de la foto y enfoca.
- Recorta la franja del pliegue y une las dos caras.
"""
import cv2, numpy as np, sys, os

pref, outdir, n_izq, n_der, n_pliego = sys.argv[1:6]
IGUALAR = len(sys.argv) > 6 and sys.argv[6] == 'igualar'  # mismo fondo a los dos lados del pliegue
caras = []
for i in (0, 1):
    g = cv2.imread('%s-geo-%d.png' % (pref, i))
    caras.append(cv2.rotate(g, cv2.ROTATE_90_COUNTERCLOCKWISE))  # foto vertical -> apaisado
# en la foto, el panel 0 estaba arriba -> tras girar queda a la izquierda


def luz(L, blk=48, deg=3):
    h, w = L.shape
    ys, xs, vs = [], [], []
    for y in range(0, h - blk + 1, blk // 2):
        for x in range(0, w - blk + 1, blk // 2):
            ys.append(y + blk / 2); xs.append(x + blk / 2)
            vs.append(np.percentile(L[y:y + blk, x:x + blk], 90))
    X, Y, V = np.array(xs) / w, np.array(ys) / h, np.array(vs)
    terms = [(i, j) for i in range(deg + 1) for j in range(deg + 1 - i)]
    A = np.stack([X ** i * Y ** j for i, j in terms], 1)
    keep = np.ones(len(V), bool)
    for _ in range(12):  # descartar bloques por debajo de la superficie (tinta, dibujo)
        c, *_ = np.linalg.lstsq(A[keep], V[keep], rcond=None)
        r = V - A @ c
        s = np.std(r[keep])
        keep = r > -1.2 * s
    gx, gy = np.meshgrid(np.arange(w) / w, np.arange(h) / h)
    return sum(c[k] * gx ** i * gy ** j for k, (i, j) in enumerate(terms))


def tono(bgr, seam_side):
    L = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)[..., 0].astype(np.float32)
    h, w = L.shape
    e, f = int(w * 0.006), int(w * 0.016)  # borde exterior / franja del pliegue
    L = L[e:h - e, (f if seam_side == 'L' else e):(w - e if seam_side == 'L' else w - f)]
    bg = luz(L)
    flat = L / np.maximum(bg, 1) * 235
    u8 = np.clip(flat, 0, 255).astype(np.uint8)
    u8 = cv2.fastNlMeansDenoising(u8, None, h=5, templateWindowSize=7, searchWindowSize=21)
    f32 = u8.astype(np.float32)
    lo, hi = np.percentile(f32, 0.3), np.percentile(f32, 99.6)
    f32 = np.clip((f32 - lo) / (hi - lo), 0, 1) ** 1.1 * 247 + 5
    for sig, amt in ((1.0, 0.55), (3.0, 0.2)):
        b = cv2.GaussianBlur(f32, (0, 0), sig)
        f32 = f32 + amt * (f32 - b)
    return np.clip(f32, 0, 255).astype(np.uint8)


def endereza(g, nombre):
    """Ajuste fino con el propio texto: mide el desfase vertical de las líneas
    en franjas respecto a la franja central, ajusta d(x, y) suave y lo
    corrige (quita inclinación y combado residual)."""
    h, w = g.shape
    ink = 255 - g.astype(np.float32)
    ink = ink - cv2.GaussianBlur(ink, (0, 0), 25)  # quita la textura lenta del fondo
    nS, band = 8, 260
    pts = []
    for y0 in range(60, h - band - 60, band // 2):
        sl = ink[y0:y0 + band]
        prof = [sl[:, i * w // nS:(i + 1) * w // nS].mean(1) for i in range(nS)]
        ref = prof[nS // 2]
        if ref.std() < 2.5:
            continue
        rz = (ref - ref.mean()) / ref.std()
        for i, p in enumerate(prof):
            if p.std() < 2.5:
                continue
            pz = (p - p.mean()) / p.std()
            sc = {s: float(np.dot(np.roll(pz, s)[20:-20], rz[20:-20])) / (band - 40) for s in range(-15, 16)}
            s = max(sc, key=sc.get)
            if sc[s] > 0.5 and abs(s) < 15:
                xc = (i + 0.5) * w / nS - (nS // 2 + 0.5) * w / nS
                pts.append((xc / w, (y0 + band / 2) / h, -s))
    if len(pts) < 20:
        print(nombre, ': sin texto horizontal suficiente, se deja como está (%d)' % len(pts))
        return g
    P = np.array(pts)
    X, Y, D = P[:, 0], P[:, 1], P[:, 2]
    A = np.stack([X, X * X, X * Y, X * X * Y], 1)  # d=0 en la franja central
    keep = np.ones(len(D), bool)
    for _ in range(6):
        c, *_ = np.linalg.lstsq(A[keep], D[keep], rcond=None)
        r = D - A @ c; keep = np.abs(r) < max(1.5, 2.5 * np.std(r[keep]))
    gx, gy = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    xc = (gx - ((nS // 2) + 0.5) * w / nS) / w
    xc = np.clip(xc, X.min(), X.max())  # sin extrapolar fuera de la zona con texto
    yy = gy / h
    d = c[0] * xc + c[1] * xc ** 2 + c[2] * xc * yy + c[3] * xc ** 2 * yy
    print(nombre, ': %d muestras, corrección máx %.1f px, residuo %.2f px' % (
        keep.sum(), float(np.abs(d).max()), float(np.std(r[keep]))))
    # D = desfase (px) que hay que sumar a la y de la franja para alinearla
    return cv2.remap(g, gx, (gy + d).astype(np.float32), cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


izq = endereza(tono(caras[0], 'R'), n_izq)  # su pliegue está a la derecha
der = endereza(tono(caras[1], 'L'), n_der)
hh = min(izq.shape[0], der.shape[0])
izq, der = izq[:hh], der[:hh]
# Unión: si las dos caras tienen el mismo fondo (no papel blanco contra trama),
# igualar el tono a ambos lados del pliegue con una rampa suave de 250 px.
ml = cv2.GaussianBlur(izq[:, -40:].astype(np.float32).mean(1)[None], (0, 0), 60).ravel()
mr = cv2.GaussianBlur(der[:, :40].astype(np.float32).mean(1)[None], (0, 0), 60).ravel()
sl = izq[:, -120:].astype(np.float32).std(); sr = der[:, :120].astype(np.float32).std()
mismo_fondo = IGUALAR
print('borde: media %.0f/%.0f, textura %.1f/%.1f -> %s' % (np.median(ml), np.median(mr), sl, sr, 'igualar' if mismo_fondo else 'no tocar'))
if mismo_fondo:
    meta = (ml + mr) / 2
    R = 250
    ramp = np.linspace(0, 1, R)[None, :]
    fi = izq.astype(np.float32); fd = der.astype(np.float32)
    fi[:, -R:] *= 1 + ramp * (meta / ml - 1)[:, None]
    fd[:, :R] *= 1 + ramp[:, ::-1] * (meta / mr - 1)[:, None]
    izq, der = np.clip(fi, 0, 255).astype(np.uint8), np.clip(fd, 0, 255).astype(np.uint8)
    print('pliego igualado: %.0f / %.0f -> %.0f' % (np.median(ml), np.median(mr), np.median(meta)))
os.makedirs(outdir, exist_ok=True)
q = [cv2.IMWRITE_JPEG_QUALITY, 93]
if mismo_fondo:
    # fundido de 48 px: las dos caras se solapan y la trama pasa de una a otra sin corte
    O = 48
    a = np.linspace(1, 0, O)[None, :]
    mezcla = (izq[:, -O:].astype(np.float32) * a + der[:, :O].astype(np.float32) * (1 - a)).astype(np.uint8)
    pliego = np.concatenate([izq[:, :-O], mezcla, der[:, O:]], 1)
else:
    pliego = np.concatenate([izq, der], 1)
cv2.imwrite(os.path.join(outdir, n_izq), izq, q)
cv2.imwrite(os.path.join(outdir, n_der), der, q)
cv2.imwrite(os.path.join(outdir, n_pliego), pliego, q)
print(izq.shape, der.shape)
