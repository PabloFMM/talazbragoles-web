"""Recorta y limpia fotos de pines (objeto metálico sobre fondo oscuro).

uso: pines.py salida_dir
Las cajas (x0, y0, x1, y1, en píxeles de la foto) se miden a ojo con margen y
se comprueban en la hoja de contactos que genera el script.
"""
import cv2, numpy as np, sys, os

A = '/opt/data/attachments/'
PINES = {
    # año: (archivo, caja)
    '1994': ('web-6c17d7afbdc89698-pin-del-94.jpeg', (200, 280, 1060, 1430)),
    '1995': ('web-38a6e8feb83ec606-pin-del-95.jpeg', (160, 380, 1204, 1220)),
    '1996': ('web-4473e69b4e920a71-pin-del-96.jpeg', (230, 260, 1080, 1540)),
    '1997': ('web-d368d449071e806a-pin-del-97.jpeg', (100, 150, 1260, 1400)),
    '1998': ('web-432a90d4d583dd55-pin-del-98.jpeg', (140, 370, 1060, 1380)),
    '1999': ('web-644021252810be0b-pin-del-99.jpeg', (240, 260, 1090, 1360)),
    '2002': ('web-fafdbfc99d8f9a62-pin-del-2002.jpeg', (60, 360, 1160, 1330)),
    '2003': ('web-14a017d22a341f0c-Pin-del-93.jpeg', (110, 120, 1090, 1540)),
}
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
hoja = []
for anio, (f, (x0, y0, x1, y1)) in PINES.items():
    img = cv2.imread(A + f)
    c = img[y0:y1, x0:x1]
    g = cv2.cvtColor(c, cv2.COLOR_BGR2GRAY).astype(np.float32)
    # luz: quitar el degradado lento del fondo (la foto tiene un foco arriba)
    bg = cv2.GaussianBlur(g, (0, 0), max(g.shape) / 4)
    g = g - (bg - np.median(bg)) * 0.4
    u8 = np.clip(g, 0, 255).astype(np.uint8)
    u8 = cv2.fastNlMeansDenoising(u8, None, h=5, templateWindowSize=7, searchWindowSize=21)
    f32 = u8.astype(np.float32)
    lo, hi = np.percentile(f32, 0.2), np.percentile(f32, 99.9)
    f32 = np.clip((f32 - lo) / (hi - lo), 0, 1) ** 0.95 * 248 + 6
    b = cv2.GaussianBlur(f32, (0, 0), 1.2)
    f32 = f32 + 0.3 * (f32 - b)
    r = np.clip(f32, 0, 255).astype(np.uint8)
    cv2.imwrite(os.path.join(out, f'pin-{anio}.jpg'), r, [cv2.IMWRITE_JPEG_QUALITY, 92])
    t = cv2.resize(r, (300, int(300 * r.shape[0] / r.shape[1])))
    t = cv2.copyMakeBorder(t, 30, 10, 5, 5, cv2.BORDER_CONSTANT, value=255)
    cv2.putText(t, anio, (10, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.8, 0, 2)
    hoja.append(t)
H = max(t.shape[0] for t in hoja)
hoja = [cv2.copyMakeBorder(t, 0, H - t.shape[0], 0, 0, cv2.BORDER_CONSTANT, value=255) for t in hoja]
cv2.imwrite(os.path.join(out, '_contactos.jpg'), np.vstack([np.hstack(hoja[:4]), np.hstack(hoja[4:])]))
print('ok', len(hoja))
