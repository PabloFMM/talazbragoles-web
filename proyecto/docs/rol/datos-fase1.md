# Sección Rol · datos de la fase 1 (2026-11-23)

Tarjetas `t_19f76e4c` («Rol 1/4») y `t_c00f4d72` («Rol 1b/4», correcciones de PabloFM), rama `hermes/rol` en `repo-rol/`. Todo comprobado el **2026-11-23** en la página citada en cada ficha (`fuentes[]`: url, qué afirma, fecha). Lo que no se encontró se queda vacío y la página pintará «pendiente».

## Qué hay

| Colección | Fichas | Dónde |
|---|---|---|
| `juegos` | 13 | `src/content/juegos/*.md` |
| `systems` (con `jugadoEn: grupo`) | 9: Powered by the Apocalypse, Carved from Brindlewood, Trophy, Ironsworn, Basic Roleplaying, Sistema de Delta Green, 2d20, D&D 5.ª (SRD), Year Zero Engine | `src/content/systems/*.md` |
| `licencias` | 13: CC BY 3.0, CC BY 4.0, CC BY-NC-SA 4.0, CC0, Dominio público, ORC, YZE Free Tabletop License, Política PbtA, Licencia de terceros de Mothership, Pautas de fans de Delta Green, Material de fans de Chaosium, Contenido de fans de Wizards, Todos los derechos reservados | `src/content/licencias/*.md` |
| `autoria` | 19 personas | `src/content/autoria/*.md` |
| `editoriales` | 20 (originales y en castellano) | `src/content/editoriales/*.md` |

Cómo se garantiza la regla documental: el esquema (`exigeFuentes()` en `content.config.ts`) rechaza el build si un campo tiene valor y ninguna fuente lo nombra en `datos`; lo mismo en cada edición (`ediciones[].fuentes`, mínimo una). `tests/rol-referencias.test.mjs` comprueba que cada referencia (sistema, licencia, autoría, editorial, también las de cada edición) apunta a una ficha que existe, que `traduccionDe` señala otra edición del juego y que las descargas solo salen de ediciones abiertas o gratuitas oficiales. `tests/rol-sin-nombres.test.mjs` falla si una ficha de Rol nombra a PabloFM.

`/sistemas/` (Archivo) sigue enseñando solo los sistemas de las Jornadas (`getSistemasJornadas()`); hoy ninguno, igual que antes.

## Cambios de esquema de Rol 1b (2026-11-23)

- **Ediciones** (`juegos.ediciones[]`): `nombre`, `ano`, `editorial` (ref), `idioma` (`en`/`es`), `traduccionDe` (nombre de otra edición del mismo juego), `licencia` (ref, por edición), `jugadaPorNosotros` (bool, dato del grupo sin fuente web), `descarga` opcional `{url, formato, licencia}` y `fuentes[]` propias (mínimo una).
- `edicion` (texto) solo cuando la edición jugada no se puede marcar en `ediciones[]` (D&D: «5.ª edición», sin saber si 2014 o 2024). Si no, la edición jugada se deriva de `jugadaPorNosotros`.
- **Estado** (`juegos.estado`): vacío = publicado; `en-construccion` (Numinia). Etiquetas en `formato.ts` (`estadoJuego`).
- **Licencias**: tipos nuevos `dominio-publico` (cuenta como abierta) y `con-aprobacion` (licencia para terceros con aprobación caso a caso; no abierta).
- `resuelveJuego()` devuelve además `estado`, `ediciones` resueltas, `edicionesJugadas`, `edicionJugadaTexto`, `descargas` (de las ediciones y el SRD del sistema) y `descargable`; nuevo `juegosDescargables()` para el filtro «Se puede descargar».

## Portadas oficiales (Rol 5, 2026-11-23, tarjeta `t_2e62a9d4`)

Decisión del grupo: se publican las portadas OFICIALES, sin ánimo de lucro, con crédito y enlace a la página de donde sale cada imagen (campo `portada` + fuente con `datos: ["portada"]`). Solo webs de la editorial o del autor; sin portada oficial, hueco tipográfico. Imágenes en `src/assets/rol/portadas/` (recortadas a la portada cuando la web la enseña en maqueta o tableta). Todo consultado el 2026-11-23.

| Juego | Portada publicada | Crédito | Fuente (página oficial) |
|---|---|---|---|
| Alice is Missing | «Alice ha desaparecido», edición en castellano | Devir | https://devir.es/alice-ha-desaparecido |
| Call of Cthulhu | Manual del Guardián, 7.ª en castellano (la que jugamos) | Edge Studio | https://es.edge-studio.net/games/cthulhu7-manual-del-guardian/ |
| Delta Green | Agent's Handbook, original en inglés | Arc Dream Publishing | https://shop.arcdream.com/products/delta-green-agents-handbook |
| Dungeon World | edición en castellano | Nosolorol | https://www.nosolorol.com/indie/285-dungeon-world-papel |
| Dungeons & Dragons 5.ª | Player's Handbook de 2014 (la que jugamos), versión digital con logotipo de D&D Beyond | Wizards of the Coast | https://marketplace.dndbeyond.com/all-rulebooks/players-handbook?pid=SRC-00002 |
| Ironsworn | libro básico | Tomkin Press | https://tomkinpress.com/pages/ironsworn |
| Mothership | Player's Survival Guide **1.ª edición** (jugamos la 0e: su portada no está en la web oficial; el alt y el crédito lo dicen) | Tuesday Knight Games | https://www.tuesdayknightgames.com/products/mothership-players-survival-guide |
| Numinia | **hueco tipográfico**: numinia.org y numinia.com no tienen portada del juego (solo ilustraciones sueltas y una tarjeta del archivo NWOS) | — | — |
| Public Access | original en inglés | The Gauntlet | https://www.gauntlet-rpg.com/public-access.html |
| Root | Core Book, original en inglés | Magpie Games | https://magpiegames.com/collections/root/products/root-the-roleplaying-game |
| Star Trek Adventures | 2.ª edición, libro básico (la que jugamos) | Modiphius | https://modiphius.us/products/star-trek-adventures-the-roleplaying-game-second-edition-core-rulebook |
| Trophy Dark | original en inglés | The Gauntlet y Hedgemaze Press | https://trophyrpg.com/ |
| Vaesen | libro básico, original en inglés | Free League | https://freeleaguepublishing.com/shop/vaesen-2/vaesen-nordic-horror-roleplaying/ |

Pendiente:
- **Ilustración**: ninguna página oficial consultada acredita al ilustrador junto a la imagen; el campo `portada.ilustracion` existe y queda vacío.
- **Numinia** sigue con hueco: si Numen Games publica una portada del manual, añadirla con su fuente.
- **Mothership 0e**: si aparece su portada en la web de Tuesday Knight Games, cambiarla.
- Ediciones jugadas pendientes (Alice, Delta Green, Dungeon World, Ironsworn, Public Access, Root, Trophy Dark, Vaesen): se ha usado la portada de la edición que da la web oficial; cuando se sepa cuál jugamos, revisar si cambia.
- Correo modelo a editoriales (`docs/rol/correo-modelo.md`): da por hecho que la portada ya está publicada. Cierto para 12 de 13 juegos; para **Numinia** no hay portada (es el proyecto de Numen Games: no hace falta escribir) y para **Mothership** la publicada es la de la 1.ª edición.

## Juego por juego

«Pendiente» = campo vacío por falta de fuente.

| Juego | Sistema · licencia del sistema | Licencia del juego | Edición que jugamos | Descarga oficial | Pendiente |
|---|---|---|---|---|---|
| Alice is Missing (`alice-is-missing`) | — | — | pendiente | — | sistema, licencia, edición jugada |
| Call of Cthulhu (`la-llamada-de-cthulhu`) | Basic Roleplaying · ORC | Material de fans de Chaosium | **7.ª en castellano (Edge)** | texto de BRP bajo ORC (enlace del sistema) | nº de jugadores |
| Delta Green (`delta-green`) | Sistema de Delta Green · — | Pautas de fans | pendiente | — | edición jugada, nº de jugadores |
| Dungeon World (`dungeon-world`) | PbtA · Política PbtA | CC BY 3.0 | pendiente | texto CC BY 3.0 (GitHub de Sage LaTorra) | edición jugada |
| Dungeons & Dragons 5.ª (`dungeons-dragons-5`) | D&D 5.ª (SRD) · CC BY 4.0 | Contenido de fans de Wizards | **5.ª (2014)** | SRD 5.1/5.2 (sistema) | autoría, nº de jugadores |
| Ironsworn (`ironsworn`) | Ironsworn · CC BY 4.0 | CC BY-NC-SA 4.0 | pendiente | edición digital gratuita (Tomkin Press) + SRD | edición jugada, nº de jugadores |
| Mothership (`mothership`) **nuevo** | — | Licencia de terceros con aprobación | **0e** | Player's Survival Guide 1e, PDF gratis | sistema, nº de jugadores, edición en castellano |
| Numinia (`numinia`) **nuevo, en construcción** | — | Dominio público (manual) · CC0 (objetos de numinia.com) | pendiente | manual v0.6.0 (numinia.org) | año, autoría, sistema, nº de jugadores |
| Public Access (`public-access`) | Carved from Brindlewood · — | — | pendiente | — | licencia, edición jugada, nº de jugadores |
| Root (`root`) | PbtA · Política PbtA | — | pendiente | — | licencia, edición jugada (año 2021: blog de Magpie) |
| Star Trek Adventures (`star-trek-adventures`) | 2d20 · — | Cerrada | **2.ª** | — (el SRD de 2d20 no tiene licencia abierta) | nº de jugadores |
| Trophy Dark (`trophy-dark`) | Trophy · CC BY 4.0 | Cerrada | pendiente | SRD de Trophy (sistema) | año del libro, edición jugada, nº de jugadores |
| Vaesen (`vaesen`) **nuevo** | Year Zero Engine · YZE Free Tabletop License | Cerrada (fuera del programa de licencias de Free League) | pendiente | SRD del YZE (sistema) | edición jugada |

Ediciones jugadas (dato de PabloFM, 2026-11-23; en la web sale como dato del grupo, sin nombrarle): D&D 5.ª, La llamada de Cthulhu 7.ª, Star Trek Adventures 2.ª. Trophy = Trophy Dark (confirmado por PabloFM).

## Fuentes de los juegos nuevos

- **Vaesen**: Free League (página del juego: 2-6 jugadores; libro: Nils Hintze a partir de la obra de Johan Egerkrans, Year Zero Engine adaptado), nota de prensa de 2020 (sale el 28-7-2020, con pantalla del director), página oficial de licencias de Free League (solo Dragonbane, Drakar och Demoner, Forbidden Lands, Symbaroum y los dos Coriolis; Vaesen fuera; el YZE SRD bajo la Free Tabletop License) y GeekNative 230469 (secundaria). En castellano: Devir.
- **Mothership**: Tuesday Knight Games (página del juego, caja básica con Warden's Operation Manual, Player's Survival Guide 1e con PDF gratis), artículo de ayuda de la licencia de terceros (acuerdo + aprobación del manuscrito) y Wikipedia (2018 0e, 2024 1e; secundaria). Sin edición oficial en castellano encontrada (hay una traducción de aficionados en Scribd: no se cita).
- **Numinia**: numinia.com (Numen Games, Madrid; objetos CC0), numinia.org (archivo de Numen Games; «en alfa») y numinia.org/manual (juego de rol de mesa v0.6.0, original en castellano y traducción al inglés, dominio público, descarga `manual.md`). Sin relación personal ni LinkedIn en la web.

## Preguntas abiertas (las fichas las muestran como «pendiente»)

- Resuelto (PabloFM, 2026-11-23): D&D = 2014; Mothership = 0e; Cthulhu 7.ª = edición en castellano de Edge.
- **Edición jugada** de Trophy Dark, Delta Green, Dungeon World, Ironsworn, Public Access, Root, Alice, Vaesen y Numinia.
- **Public Access / Carved from Brindlewood**: no hay texto oficial de licencia abierta; solo lo mencionan blogs (uno dice que nació en un tuit de Jason Cordova y otro que el texto va dentro del libro de Brindlewood Bay). Revisado otra vez el 2026-11-23: no está en gauntlet-rpg.com (páginas de Public Access y Brindlewood Bay). Sigue «pendiente».
- **Root**: licencia del texto sin fuente oficial (revisado 2026-11-23; solo un módulo de Foundry de terceros cita «© 2021 Magpie Games. All rights reserved»: no se usa). Año 2021 resuelto con el blog de Magpie (PDF a la venta el 15-12-2021).
- **Alice is Missing**: no tiene un sistema con nombre ni consta licencia. Revisado 2026-11-23: las webs de Hunters Entertainment y Renegade no la dan; el aviso «All rights reserved» solo aparece en copias del libro en webs no oficiales (no se citan).
- **Mothership y Numinia**: reglas propias sin nombre de sistema aparte.
- **2d20**: hay SRD gratuito y un programa comunitario (2d20 World Builders), pero no una licencia abierta tipo CC u ORC.
- **Número de jugadores**: solo lo dan las editoriales de Dungeon World, Root, Alice is Missing y Vaesen.
- **Webs propias**: solo Jesse Ross tiene web enlazada; las demás personas, pendientes. Sin web: Arc Dream Publishing, Sage Kobold Productions y Wizards of the Coast.

## Datos que solo vienen de fuentes secundarias (marcadas `secundaria: true`)

Conviene sustituirlas por la editorial o el autor cuando se pueda:

- `juegos/alice-is-missing` → año (Wikipedia).
- `juegos/delta-green` → años de las ediciones y sistema (Wikipedia).
- `juegos/dungeon-world` → año y editorial original (Wikipedia).
- `juegos/dungeons-dragons-5` → años de las ediciones (Wikipedia); edición en castellano (tienda Mathom); géneros y modo (Wikipedia en español).
- `juegos/ironsworn` → año (Wikipedia).
- `juegos/la-llamada-de-cthulhu` → años de las ediciones, autoría y géneros (Wikipedia).
- `juegos/mothership` → años de 0e y 1.ª y autoría (Wikipedia).
- `juegos/root` → autoría (Tabletop Gaming) y sistema (Dicebreaker).
- `juegos/star-trek-adventures` → años de las ediciones, autoría, sistema, género y la edición de Holocubierta (Wikipedia).
- `juegos/vaesen` → que Free League lo dejó fuera en 2026 (GeekNative; la página oficial de licencias lo confirma por omisión) y género «misterio» (Wikipedia).
- `systems/2d20` → alcance del programa World Builders (GeekNative).
- `systems/delta-green-d100` → que deriva de BRP (Wikipedia).
- `systems/srd-5e` → año y editorial (Wikipedia).

## Correcciones a la propuesta v1

- **Alice is Missing no es de «Spencer Campbell»**: Renegade Game Studios, DriveThruRPG y Devir dan como diseñador a **Spenser Starke**.
- **Dungeon World**: la licencia CC BY 3.0 NO aparece en `dungeonworldsrd.com/more-info/`. Se cita el archivo `LICENSE` del repositorio de Sage LaTorra en GitHub.
- **Trophy SRD**: además de CC BY 4.0, exige no usar contenido generado por IA.
- **Delta Green en castellano** es de Devir (Manual del Agente). «La caída de Delta Green» (Edge, GUMSHOE) es otro juego.
- **Política PbtA**: no es una licencia; se registra como «política de uso» y no cuenta como «abierta».
- **Numinia** sí tiene reglamento propio publicado (numinia.org/manual, dominio público): lo que decía «licencia del reglamento pendiente» queda resuelto.

## Fase posterior (idea, NO hacer ahora)

- **Material adicional**: zona de imprimibles 2D/3D y artefactos para ambientar partidas (petición de PabloFM, 2026-11-23). Sin colección ni páginas en la fase 1; se diseñará cuando toque, con la misma regla de licencias (solo material propio o con licencia que lo permita).

## No publicados (a propósito)

«Dark Age» era Dungeon World (no es otro juego). Ya no quedan nombres dictados sin identificar.
