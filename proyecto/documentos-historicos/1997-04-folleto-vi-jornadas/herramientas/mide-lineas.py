"""Mide cuánto se inclinan/curvan las líneas de texto: compara el perfil
horizontal de tinta de franjas verticales con el de la franja central.
Salida: desfase vertical (px) de cada franja respecto al centro."""
import cv2, numpy as np, sys
g = cv2.imread(sys.argv[1], 0).astype(np.float32)
y0, y1, x0, x1 = map(int, sys.argv[2:6])
reg = 255 - g[y0:y1, x0:x1]
w = reg.shape[1]; n = 6
prof = [reg[:, i * w // n:(i + 1) * w // n].mean(1) for i in range(n)]
prof = [(p - p.mean()) / (p.std() + 1e-6) for p in prof]
ref = prof[n // 2]
out = []
for p in prof:
    best = max(range(-25, 26), key=lambda s: float(np.dot(np.roll(p, s)[30:-30], ref[30:-30])))
    out.append(best)
print('desfase por franja (px):', out)
