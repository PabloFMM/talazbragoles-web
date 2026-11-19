# GitHub App de Hermes para `talazbragoles-web` — decisiones

Fecha: 2026-11-13. Tarjeta Kanban: `t_29d0b62b`.

**Decidido por PabloFM (2026-11-13):** las tarjetas no esperan su visto bueno. Hermes trabaja y publica solo; PabloFM aprueba haciendo QA directamente en la web en producción. La App debe ayudar a trocear el trabajo en piezas pequeñas y a orquestar.

## Estado del repo (comprobado 2026-11-13)

- Remoto `https://github.com/PabloFMM/talazbragoles-web.git`, solo rama `main`.
- No hay `.github/workflows/` ni script `test` (solo `dev`, `build`, `preview`). Hermes crea el workflow de build; PabloFM añade sus tests cuando estén.

## Decisiones aplicadas

| Punto | Decisión |
|---|---|
| Permisos | Contents RW, Pull requests RW, Issues RW (trocear trabajo), Workflows RW (CI), Administration RW (protección de `main`), Checks R, Actions R, Statuses R, Metadata R. Sin permisos de cuenta ni de organización. Webhook desactivado. |
| Instalación | Solo `PabloFMM/talazbragoles-web` («Only select repositories»). |
| Flujo | Rama `hermes/<tema>` → PR → checks (build + tests) y preview de Vercel → **Hermes fusiona solo si todo está en verde** → Vercel despliega `main` a producción. |
| Protección de `main` | PR obligatorio y checks en verde obligatorios, sin force-push ni borrado. Sin aprobación humana obligatoria. La configura Hermes. |
| QA | PabloFM, en talazbragoles.com. Si algo falla, se revierte con un PR de `git revert`. |
| Clave privada | `/opt/data/secrets/github-app/talazbragoles-web/` (carpeta 700): `private-key.pem` (600) y `app.json` (App ID, Installation ID). Tokens de 1 h generados al vuelo. Nunca en el repo, en logs ni en `.git/config`. |
| «Plataforma» | Pendiente de definir. Fuera de alcance. |

## Único paso manual (no es una aprobación: GitHub exige que el dueño cree la App)

Abrir `docs/crear-github-app.html` con sesión de PabloFMM en GitHub, pulsar el botón, pegar a Hermes la dirección con `?code=…` (caduca en 1 h) e instalar la App solo en `talazbragoles-web`. Hermes canjea el código por la clave directamente con la API de GitHub (`POST /app-manifests/{code}/conversions`), así la clave nunca pasa por el chat.
