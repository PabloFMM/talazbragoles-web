"""Restaura la foto de un díptico doblado (geometría).

Cada mitad se endereza por separado con un parche de Coons cuyos lados son
los bordes reales del papel (ajuste robusto, admite leve curvatura) y el
doblez (lado común). Así desaparece el quiebro del pliegue y las líneas de
texto quedan paralelas.

uso: restaura.py foto.jpg prefijo_salida
salida: <prefijo>-geo-0.png (mitad superior de la foto), -geo-1.png, -control.jpg
"""
import cv2, numpy as np, sys, json

src, pref = sys.argv[1], sys.argv[2]
img = cv2.imread(src)
H0, W0 = img.shape[:2]

# ---------- 1. máscara del papel (fondo oscuro) ----------
s = 0.25
sm = cv2.resize(img, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
hsv = cv2.cvtColor(sm, cv2.COLOR_BGR2HSV)
vb = cv2.medianBlur(hsv[..., 2], 9)
mask = ((vb > 130) & (cv2.medianBlur(hsv[..., 1], 9) < 70)).astype(np.uint8) * 255
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
n, lab, st, _ = cv2.connectedComponentsWithStats(mask)
k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
mask = (lab == k).astype(np.uint8) * 255
cnts, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
mask = np.zeros_like(mask)
cv2.drawContours(mask, cnts, -1, 255, -1)
M = cv2.resize(mask, (W0, H0), interpolation=cv2.INTER_LINEAR) > 127

# esquinas aproximadas
c = max(cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0], key=cv2.contourArea)
hull = cv2.convexHull(c); peri = cv2.arcLength(hull, True)
for eps in np.linspace(0.01, 0.1, 60):
    ap = cv2.approxPolyDP(hull, eps * peri, True)
    if len(ap) == 4:
        break
P = ap.reshape(-1, 2).astype(float) / s
ssum = P.sum(1); dif = P[:, 1] - P[:, 0]
TL, BR = P[np.argmin(ssum)], P[np.argmax(ssum)]
TR, BL = P[np.argmin(dif)], P[np.argmax(dif)]


# ---------- 2. bordes en bruto ----------
def raw(side):
    if side in 'LR':
        any_ = M.any(1)
        v = np.argmax(M, 1) if side == 'L' else W0 - 1 - np.argmax(M[:, ::-1], 1)
    else:
        any_ = M.any(0)
        v = np.argmax(M, 0) if side == 'T' else H0 - 1 - np.argmax(M[::-1, :], 0)
    v = v.astype(float); v[~any_] = np.nan
    return v


RAW = {k: raw(k) for k in 'LRTB'}


def robust_fit(v, a, b, deg=2):
    """Polinomio recortado sobre v[a:b]: ignora muescas, sombras y restos."""
    a, b = int(min(a, b)), int(max(a, b))
    m = int((b - a) * 0.05); a, b = a + m, b - m
    t = np.arange(a, b, dtype=float); y = v[a:b]
    ok = ~np.isnan(y); t, y = t[ok], y[ok]
    keep = np.ones(len(t), bool)
    for _ in range(10):
        cc = np.polyfit(t[keep], y[keep], deg)
        r = np.abs(y - np.polyval(cc, t))
        thr = max(2.5, np.percentile(r[keep], 60) * 2.5)
        keep = r < thr
    return cc


# ---------- 3. doblez ----------
labi = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
dy = 0
for ch in range(3):  # el cambio de plano cambia luz (L) y tono (a, b)
    gb = cv2.GaussianBlur(labi[..., ch], (0, 0), 12)
    d = np.abs(cv2.Sobel(gb, cv2.CV_32F, 0, 1, ksize=5))
    dy = dy + d / (np.percentile(d, 99) + 1e-6)
ya_, yb_ = (TL[1] + TR[1]) / 2, (BL[1] + BR[1]) / 2
ymid = (ya_ + yb_) / 2; span = (yb_ - ya_) * 0.12
y0, y1 = int(ymid - span), int(ymid + span)
xs_, ys_ = [], []
for x in range(int(TL[0] + 150), int(TR[0] - 150), 15):
    xs_.append(x); ys_.append(y0 + int(np.argmax(dy[y0:y1, x])))
xs_, ys_ = np.array(xs_, float), np.array(ys_, float)
keep = np.ones(len(xs_), bool)
for _ in range(10):
    fc = np.polyfit(xs_[keep], ys_[keep], 1)
    r = np.abs(ys_ - np.polyval(fc, xs_)); keep = r < max(4, np.percentile(r[keep], 60) * 2.5)
print('doblez: y = %.4f x + %.1f (%d/%d)' % (fc[0], fc[1], keep.sum(), len(xs_)))

# ---------- 4. bordes ajustados (por tramos: el doblez parte los laterales) ----------
fy_mid = np.polyval(fc, (TL[0] + TR[0]) / 2)
Lu = robust_fit(RAW['L'], TL[1], fy_mid); Ld = robust_fit(RAW['L'], fy_mid, BL[1])
Ru = robust_fit(RAW['R'], TR[1], fy_mid); Rd = robust_fit(RAW['R'], fy_mid, BR[1])
Tt = robust_fit(RAW['T'], TL[0], TR[0]); Bb = robust_fit(RAW['B'], BL[0], BR[0])


def meet_xy(cx, cy, x0, y0):
    """Intersección de x=cx(y) con y=cy(x) (iteración de punto fijo)."""
    x, y = x0, y0
    for _ in range(50):
        y = np.polyval(cy, x); x = np.polyval(cx, y)
    return np.array([x, y])


TL = meet_xy(Lu, Tt, TL[0], TL[1]); TR = meet_xy(Ru, Tt, TR[0], TR[1])
BL = meet_xy(Ld, Bb, BL[0], BL[1]); BR = meet_xy(Rd, Bb, BR[0], BR[1])
FL = (meet_xy(Lu, fc, TL[0], fy_mid) + meet_xy(Ld, fc, BL[0], fy_mid)) / 2
FR = (meet_xy(Ru, fc, TR[0], fy_mid) + meet_xy(Rd, fc, BR[0], fy_mid)) / 2
print('esquinas', np.round([TL, TR, BL, BR, FL, FR]).tolist())


# ---------- 5. Coons por panel ----------
def cx_curve(cc, ya, yb, n):
    y = np.linspace(ya, yb, n); return np.stack([np.polyval(cc, y), y], 1)


def cy_curve(cc, xa, xb, n):
    x = np.linspace(xa, xb, n); return np.stack([x, np.polyval(cc, x)], 1)


def arclen(cv):
    return np.linalg.norm(np.diff(cv, axis=0), axis=1).sum()


def coons(top, bot, left, right):
    Wn, Hn = len(top), len(left)
    u = np.linspace(0, 1, Wn)[None, :, None]; v = np.linspace(0, 1, Hn)[:, None, None]
    S = (1 - v) * top[None] + v * bot[None] + (1 - u) * left[:, None] + u * right[:, None] \
        - ((1 - u) * (1 - v) * top[0] + u * (1 - v) * top[-1] + (1 - u) * v * bot[0] + u * v * bot[-1])
    return S[..., 0].astype(np.float32), S[..., 1].astype(np.float32)


n = 600
panels = [
    (cy_curve(Tt, TL[0], TR[0], n), cy_curve(fc, FL[0], FR[0], n),
     cx_curve(Lu, TL[1], FL[1], n), cx_curve(Ru, TR[1], FR[1], n)),
    (cy_curve(fc, FL[0], FR[0], n), cy_curve(Bb, BL[0], BR[0], n),
     cx_curve(Ld, FL[1], BL[1], n), cx_curve(Rd, FR[1], BR[1], n)),
]
Wout = int(round(max(max(arclen(p[0]), arclen(p[1])) for p in panels)))
Hs = [int(round(max(arclen(p[2]), arclen(p[3])))) for p in panels]
Hout = max(Hs)  # las dos mitades del díptico miden lo mismo


def rs(cv, m):
    t = np.r_[0, np.cumsum(np.linalg.norm(np.diff(cv, axis=0), axis=1))]; t /= t[-1]
    tt = np.linspace(0, 1, m)
    return np.stack([np.interp(tt, t, cv[:, 0]), np.interp(tt, t, cv[:, 1])], 1)


dbg = img.copy()
for i, (top, bot, left, right) in enumerate(panels):
    mx, my = coons(rs(top, Wout), rs(bot, Wout), rs(left, Hout), rs(right, Hout))
    out = cv2.remap(img, mx, my, cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
    cv2.imwrite(pref + '-geo-%d.png' % i, out)
    for cv in (top, bot, left, right):
        cv2.polylines(dbg, [cv.astype(np.int32)], False, (0, 0, 255), 5)
cv2.imwrite(pref + '-control.jpg', cv2.resize(dbg, None, fx=0.25, fy=0.25))
print(json.dumps({'panel': [Hout, Wout], 'alturas_medidas': Hs}))
