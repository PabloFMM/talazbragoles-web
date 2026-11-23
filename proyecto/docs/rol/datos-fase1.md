# Sección Rol · datos de la fase 1 (2026-11-23)

Tarjeta `t_19f76e4c` («Rol 1/4»), rama `hermes/rol` en `repo-rol/`. Todo comprobado el **2026-11-23** en la página citada en cada ficha (`fuentes[]`: url, qué afirma, fecha). Lo que no se encontró se queda vacío y la página pintará «pendiente».

## Qué hay

| Colección | Fichas | Dónde |
|---|---|---|
| `juegos` | 10 | `src/content/juegos/*.md` |
| `systems` (con `jugadoEn: grupo`) | 8: Powered by the Apocalypse, Carved from Brindlewood, Trophy, Ironsworn, Basic Roleplaying, Sistema de Delta Green, 2d20, D&D 5.ª (SRD) | `src/content/systems/*.md` |
| `licencias` | 9: CC BY 3.0, CC BY 4.0, CC BY-NC-SA 4.0, ORC, Política PbtA, Pautas de fans de Delta Green, Material de fans de Chaosium, Contenido de fans de Wizards, Todos los derechos reservados | `src/content/licencias/*.md` |
| `autoria` | 16 personas | `src/content/autoria/*.md` |
| `editoriales` | 17 (originales y en castellano) | `src/content/editoriales/*.md` |

Cómo se garantiza la regla documental: el esquema (`exigeFuentes()` en `content.config.ts`) rechaza el build si un campo tiene valor y ninguna fuente lo nombra en `datos`. `tests/rol-referencias.test.mjs` comprueba que cada referencia (sistema, licencia, autoría, editorial) apunta a una ficha que existe, porque Astro no lo comprueba.

`/sistemas/` (Archivo) sigue enseñando solo los sistemas de las Jornadas (`getSistemasJornadas()`); hoy ninguno, igual que antes.

## Juego por juego

«Pendiente» = campo vacío por falta de fuente. «Edición jugada» está pendiente en todos: nadie ha dicho qué edición tiene el grupo en la mesa.

| Juego | Sistema · licencia del sistema | Licencia del juego | Pendiente | Fuentes (secundarias) |
|---|---|---|---|---|
| Alice is Missing (`alice-is-missing`) | pendiente · — | pendiente | edición jugada, sistema, licencia del juego | 5 (1) |
| Call of Cthulhu (`la-llamada-de-cthulhu`) | Basic Roleplaying · ORC | Material de fans de Chaosium | edición jugada, nº de jugadores | 6 (1) |
| Delta Green: The Role-Playing Game (`delta-green`) | Sistema de Delta Green · pendiente | Pautas de fans de Delta Green | edición jugada, nº de jugadores | 6 (2) |
| Dungeon World (`dungeon-world`) | Powered by the Apocalypse · Política PbtA | CC BY 3.0 | edición jugada | 5 (1) |
| Dungeons & Dragons, 5.ª edición (`dungeons-dragons-5`) | D&D 5.ª edición (SRD) · CC BY 4.0 | Contenido de fans de Wizards | edición jugada, autoría, nº de jugadores | 5 (3) |
| Ironsworn (`ironsworn`) | Ironsworn · CC BY 4.0 | CC BY-NC-SA 4.0 | edición jugada, nº de jugadores | 4 (1) |
| Public Access (`public-access`) | Carved from Brindlewood · pendiente | pendiente | edición jugada, licencia del juego, nº de jugadores | 4 (0) |
| Root: The Roleplaying Game (`root`) | Powered by the Apocalypse · Política PbtA | pendiente | edición jugada, año, licencia del juego | 6 (2) |
| Star Trek Adventures (`star-trek-adventures`) | Sistema 2d20 · pendiente | Cerrada | edición jugada, nº de jugadores | 4 (2) |
| Trophy Dark (`trophy-dark`) | Trophy · CC BY 4.0 | Cerrada (solo el SRD es abierto) | edición jugada, año, nº de jugadores | 8 (0) |

Todos los juegos tienen título, autoría (salvo D&D), editorial original, editorial en castellano, géneros y modo de juego con fuente. Ninguno lleva portada (decisión: hueco tipográfico).

## Correcciones a la propuesta v1

- **Alice is Missing no es de «Spencer Campbell»**: Renegade Game Studios, DriveThruRPG y Devir dan como diseñador a **Spenser Starke**. Editoriales: Hunters Entertainment (desarrollo) y Renegade Game Studios; en castellano, «Alice ha desaparecido», de Devir.
- **Dungeon World**: la licencia CC BY 3.0 NO aparece en `dungeonworldsrd.com/more-info/` (la fuente que citaba la propuesta). Se ha citado el archivo `LICENSE` del repositorio de Sage LaTorra en GitHub.
- **Trophy SRD**: además de CC BY 4.0, exige no usar contenido generado por IA.
- **Delta Green en castellano** es de Devir (Manual del Agente). «La caída de Delta Green» (Edge, sistema GUMSHOE) es otro juego.
- **Política PbtA**: no es una licencia; se registra como «política de uso» y no cuenta como «abierta» en el filtro.

## Preguntas abiertas (para PabloFM; las fichas las muestran como «pendiente»)

- **Trophy**: lo dictó como «Dark Trophy». ¿Es Trophy Dark o Trophy Gold? Son dos juegos distintos. La ficha es de Trophy Dark.
- **Edición** que juega el grupo de D&D (¿2014 o la revisión de 2024?), de Star Trek Adventures (¿1.ª de 2017 o 2.ª de 2024?) y de La llamada de Cthulhu.
- **Public Access / Carved from Brindlewood**: no hay texto oficial de licencia abierta; solo lo mencionan blogs. Se queda «por verificar» hasta tener el apéndice del libro.
- **Root**: año de publicación y licencia del texto sin fuente oficial (consta que tiene licencia oficial de Leder Games, nada más).
- **Alice is Missing**: no tiene un sistema con nombre ni consta licencia.
- **2d20**: hay SRD gratuito y un programa comunitario (2d20 World Builders), pero no una licencia abierta tipo CC u ORC.
- **Número de jugadores**: solo lo dan las editoriales de Dungeon World, Root y Alice is Missing.
- **Webs propias**: solo Jesse Ross tiene web enlazada; las demás personas, pendientes. Sin web: Arc Dream Publishing, Sage Kobold Productions y Wizards of the Coast.

## Datos que solo vienen de fuentes secundarias (marcadas `secundaria: true`)

Conviene sustituirlas por la editorial o el autor cuando se pueda:

- `juegos/alice-is-missing` → año (Wikipedia).
- `juegos/delta-green` → año, ediciones y sistema (Wikipedia).
- `juegos/dungeon-world` → año y editorial original (Wikipedia).
- `juegos/dungeons-dragons-5` → año, ediciones y editorial (Wikipedia); editorial en castellano (tienda Mathom); géneros y modo (Wikipedia en español).
- `juegos/ironsworn` → año (Wikipedia).
- `juegos/la-llamada-de-cthulhu` → año, ediciones, autoría y géneros (Wikipedia).
- `juegos/root` → autoría (Tabletop Gaming) y sistema (Dicebreaker).
- `juegos/star-trek-adventures` → año, ediciones, autoría, sistema y género (Wikipedia).
- `systems/2d20` → alcance del programa World Builders (GeekNative).
- `systems/delta-green-d100` → que deriva de BRP (Wikipedia).
- `systems/srd-5e` → año y editorial (Wikipedia).

## No publicados (a propósito)

«Dark Age», «Bison», «Numenia», «Space Terror»: nombres dictados que no sabemos a qué juego corresponden. No tienen ficha.
