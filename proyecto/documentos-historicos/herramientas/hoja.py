"""Endereza y limpia la foto de una hoja suelta (cartel, artículo, lista).

uso: hoja.py foto.jpg salida.jpg [x1,y1,x2,y2,x3,y3,x4,y4] [--rot 90|180|270] [--color]
- Sin esquinas: busca el papel claro más grande y su cuadrilátero.
- Con esquinas (sup-izq, sup-der, inf-der, inf-izq, en píxeles de la foto):
  usa esas (útil para recortar un artículo dentro de una página).
- Luz igualada (superficie ajustada al papel claro), ruido fuera, enfoque suave.
- Por defecto en escala de grises; --color conserva el tono del papel.
Guarda también <salida>-control.jpg con el cuadrilátero sobre la foto.
"""
import cv2, numpy as np, sys

args = [a for a in sys.argv[1:]]
rot = None
if '--rot' in args:
    i = args.index('--rot'); rot = int(args[i + 1]); del args[i:i + 2]
color = '--color' in args
args = [a for a in args if a != '--color']
src, out = args[0], args[1]
img = cv2.imread(src)
H0, W0 = img.shape[:2]

if len(args) > 2:
    q = np.array([float(v) for v in args[2].split(',')], np.float32).reshape(4, 2)
else:
    s = 800 / max(H0, W0)
    sm = cv2.resize(img, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    hsv = cv2.cvtColor(sm, cv2.COLOR_BGR2HSV)
    v = cv2.medianBlur(hsv[..., 2], 7)
    thr = max(110, int(np.percentile(v, 45)))
    m = ((v > thr) & (cv2.medianBlur(hsv[..., 1], 7) < 90)).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    c = max(cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0], key=cv2.contourArea)
    hull = cv2.convexHull(c); peri = cv2.arcLength(hull, True)
    for eps in np.linspace(0.01, 0.12, 60):
        ap = cv2.approxPolyDP(hull, eps * peri, True)
        if len(ap) == 4:
            break
    P = ap.reshape(-1, 2).astype(np.float32) / s
    sm_ = P.sum(1); df = P[:, 1] - P[:, 0]
    q = np.array([P[np.argmin(sm_)], P[np.argmin(df)], P[np.argmax(sm_)], P[np.argmax(df)]], np.float32)
tl, tr, br, bl = q
W = int(max(np.linalg.norm(tr - tl), np.linalg.norm(br - bl)))
H = int(max(np.linalg.norm(bl - tl), np.linalg.norm(br - tr)))
M = cv2.getPerspectiveTransform(q, np.array([[0, 0], [W, 0], [W, H], [0, H]], np.float32))
w = cv2.warpPerspective(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
e = int(min(W, H) * 0.006)
w = w[e:H - e, e:W - e]
if rot:
    w = cv2.rotate(w, {90: cv2.ROTATE_90_CLOCKWISE, 180: cv2.ROTATE_180, 270: cv2.ROTATE_90_COUNTERCLOCKWISE}[rot])


def luz(L, blk=40, deg=3):
    h, wd = L.shape
    ys, xs, vs = [], [], []
    for y in range(0, h - blk + 1, blk // 2):
        for x in range(0, wd - blk + 1, blk // 2):
            ys.append(y + blk / 2); xs.append(x + blk / 2)
            vs.append(np.percentile(L[y:y + blk, x:x + blk], 90))
    X, Y, V = np.array(xs) / wd, np.array(ys) / h, np.array(vs)
    terms = [(i, j) for i in range(deg + 1) for j in range(deg + 1 - i)]
    A = np.stack([X ** i * Y ** j for i, j in terms], 1)
    keep = np.ones(len(V), bool)
    for _ in range(12):
        cc, *_ = np.linalg.lstsq(A[keep], V[keep], rcond=None)
        r = V - A @ cc; sd = np.std(r[keep]); keep = r > -1.2 * sd
    gx, gy = np.meshgrid(np.arange(wd) / wd, np.arange(h) / h)
    return sum(cc[k] * gx ** i * gy ** j for k, (i, j) in enumerate(terms))


lab = cv2.cvtColor(w, cv2.COLOR_BGR2LAB).astype(np.float32)
L = lab[..., 0]
bg = luz(L)
Lf = L / np.maximum(bg, 1) * 238
if color:
    lab[..., 0] = np.clip(Lf, 0, 255)
    f = cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR)
    f = cv2.fastNlMeansDenoisingColored(f, None, 4, 4, 7, 21).astype(np.float32)
else:
    u8 = np.clip(Lf, 0, 255).astype(np.uint8)
    f = cv2.fastNlMeansDenoising(u8, None, h=5, templateWindowSize=7, searchWindowSize=21).astype(np.float32)
lo, hi = np.percentile(f, 0.3), np.percentile(f, 99.6)
f = np.clip((f - lo) / (hi - lo), 0, 1) ** 1.1 * 247 + 5
b = cv2.GaussianBlur(f, (0, 0), 1.0)
f = f + 0.5 * (f - b)
cv2.imwrite(out, np.clip(f, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
d = img.copy()
cv2.polylines(d, [q.astype(np.int32)], True, (0, 0, 255), 4)
cv2.imwrite(out.rsplit('.', 1)[0] + '-control.jpg', cv2.resize(d, None, fx=0.5, fy=0.5))
print(out, np.round(q).astype(int).ravel().tolist(), f.shape[:2])
