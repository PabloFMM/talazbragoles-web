# Sección Rol · contactos oficiales de editoriales y autoría (2026-11-23)

Tarjeta `t_c23d2b03`. Lista de trabajo para escribir a cada editorial y a cada persona de autoría de `talazbragoles.com/rol/` (confirmar el permiso de las portadas, pedir imágenes mejores, corregir datos y abrir colaboraciones). El correo modelo va aparte, en `docs/rol/correo-modelo.md`. **No se ha enviado nada.**

## Reglas con las que se ha hecho

- Solo canales que publica la propia editorial o persona en **su propia web**: un correo, un formulario o su página de contacto. Cada uno con la URL exacta donde aparece.
- Nada sacado de otros sitios: ni correos vistos en entrevistas, foros, redes, LinkedIn, Kickstarter, agregadores ni WHOIS.
- Si una persona no tiene web propia pero es dueña o fundadora de la editorial que sí publica un canal, se anota ese canal como **«vía editorial»** (llega a la empresa, no a la persona).
- Si no hay nada que cumpla lo anterior: **«sin contacto oficial»**. No se inventa.
- Todo consultado el **2026-11-23** (curl o navegador; en las webs con Cloudflare se abrió con navegador o se descodificó el correo protegido de la propia página).
- Lista sacada de `repo-rol/src/content/editoriales/` (20) y `repo-rol/src/content/autoria/` (19), rama `hermes/rol-respuestas` (commit `55a2a96`).

## Qué usamos de cada cual (para personalizar el correo)

Hoy, en todas las fichas:

- **Ficha del juego** `https://www.talazbragoles.com/rol/juegos/<slug>/`: título, ediciones (año, editorial, idioma, licencia de cada edición), sistema, licencia del juego y del sistema, autoría, editoriales, número de jugadores si lo da la editorial, enlaces a la descarga oficial cuando la licencia lo permite y la fuente de cada dato (casi siempre su propia web).
- **Ficha de la editorial** `/rol/editoriales/<slug>/` o **de la persona** `/rol/autoria/<slug>/`: nombre, web oficial si la conocemos y los juegos que salen en el registro.
- **Portada**: hoy la ficha pinta un hueco tipográfico (título + sistema), sin imagen. Está decidido publicar la **portada oficial** con crédito (editorial/ilustración) y enlace a la página oficial de donde sale; a fecha de hoy ninguna ficha lleva aún imagen (campo `portada` vacío en los 13 juegos). En el correo conviene hablar de «la portada que queremos mostrar».

## Resumen

| Sección | Total | Correo | Formulario / página de contacto | Sin contacto oficial |
|---|---|---|---|---|
| Editoriales | 20 | 15 | 4 | 1 |
| Autoría | 19 | 9 (4 propios, 1 de su editorial unipersonal, 4 vía editorial) | 3 (vía editorial) | 7 |
| **Total** | **39** | **24** | **7** | **8** |

## Editoriales (20)

| Nombre | Slug | Juegos en /rol/ (papel) | Canal | Fuente (URL exacta) | Consulta | Notas |
|---|---|---|---|---|---|---|
| Arc Dream Publishing | `arc-dream-publishing` | Delta Green (original: ambientación 1997, Handler's Guide 2018); sistema «Sistema de Delta Green» | `info@arcdream.com` | https://shop.arcdream.com/pages/about | 2026-11-23 | Página «About» («Contact: info@arcdream.com»). `arcdream.com` lleva a la tienda. Nuestra ficha no tiene su web: se podría añadir `https://www.arcdream.com/`. |
| Chaosium | `chaosium` | La llamada de Cthulhu (original, ediciones 1.ª-7.ª); sistema Basic Roleplaying | `daria@chaosium.com` (licencias) | https://www.chaosium.com/contact-us/ | 2026-11-23 | La página de contacto la da para «Licensing inquiries». En la misma página: prensa `brian@chaosium.com`, consultas de rol `customerservice@chaosium.com`. Es buzón con nombre de una empleada, pero publicado por Chaosium para esto. |
| Devir | `devir` | Alice is Missing, Delta Green (Manual del Agente) y Vaesen: ediciones en castellano | `atencioncliente@devir.com` | https://devir.es/preguntas-frecuentes | 2026-11-23 | En castellano. El correo está protegido por Cloudflare en la página (se lee en navegador). Misma página: formulario de contacto y `comercial@devir.com`. Sin buzón de licencias o prensa. |
| Edge Studio | `edge-studio` | La llamada de Cthulhu 7.ª en castellano (la edición que jugamos) | `contact@edge-studio.net` | https://es.edge-studio.net/contact/ | 2026-11-23 | Página de contacto con formulario y ese correo. Edge es del grupo Asmodee (dirección en Guyancourt, Francia): puede que deriven la consulta. curl recibe 403; abre en navegador. |
| Free League Publishing | `free-league-publishing` | Vaesen (original, 2020); sistema Year Zero Engine | Formulario: https://freeleaguepublishing.com/customer-support/ | https://freeleaguepublishing.com/customer-support/ | 2026-11-23 | Página «FAQ & Contact». Su página de prensa (https://freeleaguepublishing.com/press/) da `pr@uberstrategist.com` (agencia de prensa, no dominio de Free League) para prensa y reseñas, y pide escribir a Free League directamente para permisos de imágenes: por eso se elige el formulario. |
| Hedgemaze Press | `hedgemaze-press` | Trophy Dark (coeditora del libro); sistema Trophy | Formulario: https://www.hedgemazepress.com/contact | https://www.hedgemazepress.com/contact | 2026-11-23 | Solo formulario (nombre, correo, asunto, mensaje; reCAPTCHA). Sin correo publicado. Cloudflare: abrir en navegador. |
| Holocubierta Ediciones | `holocubierta-ediciones` | Star Trek Adventures: libro básico en castellano (2017) | `info@holocubierta.com` | https://neo.holocubierta.com/contactenos | 2026-11-23 | **Cesó su actividad comercial el 31-12-2024** (aviso en https://neo.holocubierta.com/); las webs siguen abiertas para descargas. Puede que nadie responda. |
| Hunters Entertainment | `hunters-entertainment` | Alice is Missing (coeditora original) | `support@huntersentertainment.com` | https://www.huntersentertainment.com/ | 2026-11-23 | En el bloque «Contact us» de la portada; lo ofrecen también para propuestas de colaboración. No hay página `/contact`. |
| Magpie Games | `magpie-games` | Root: The Roleplaying Game (original, 2021) | `info@magpiegames.com` | https://magpiegames.com/pages/faq | 2026-11-23 | Correo general en la FAQ. Además, formulario en https://magpiegames.com/pages/contact-us. Sin buzón de licencias o prensa. |
| Modiphius Entertainment | `modiphius-entertainment` | Star Trek Adventures (original, 1.ª 2017 y 2.ª 2024, la que jugamos); sistema 2d20 | `support@modiphius.com` | https://modiphius.us/pages/contact-us | 2026-11-23 | Misma página con formulario. Sin buzón de licencias comprobado en su web. Star Trek es licencia de Paramount: el permiso de la portada puede depender también de ellos. |
| Nosolorol | `nosolorol` | Dungeon World en castellano | `hola@nosolorol.com` | https://www.nosolorol.com/contacto | 2026-11-23 | En castellano. Misma página con formulario (atención al cliente / webmaster). |
| Numen Games | `numen-games` | Numinia (manual v0.6.0 en castellano e inglés; ficha «En construcción») | `hola@numengames.com` | https://numen.games/en/contacto | 2026-11-23 | El dominio del correo es `numengames.com` (no `numen.games`). El mismo correo sale en https://numinia.com/support. |
| Renegade Game Studios | `renegade-game-studios` | Alice is Missing (editorial original, 2020) | `customerservice@renegadegames.com` | https://renegadegamestudios.com/customer-service | 2026-11-23 | Atención al cliente (en la página sale en mayúsculas); la misma página tiene formulario. Sin buzón de prensa o licencias. |
| Sage Kobold Productions | `sage-kobold-productions` | Dungeon World (editorial original, 2012) | **sin contacto oficial** | — | 2026-11-23 | No tiene web propia que funcione (`sagekobold.com` no carga). Hoy Dungeon World lo vende Burning Wheel y `dungeon-world.com` es un boletín de Dungeon World 2 sin correo. Alternativa: escribir a sus autores (ver Sage LaTorra). |
| Shadowlands Ediciones | `shadowlands-ediciones` | Root en castellano | `info@shadowlands.es` | https://shadowlands.es/aviso-legal/ | 2026-11-23 | En castellano, en el aviso legal. Formulario en https://shadowlands.es/contactar/. |
| The Gauntlet | `the-gauntlet` | Public Access (original, 2014) y Trophy Dark (fanzine Codex – Dark 2, 2018, y libro); sistema Carved from Brindlewood | `gauntletpublish@gmail.com` | https://www.gauntlet-rpg.com/contact-us.html | 2026-11-23 | Correo de Gmail, pero publicado en su propia página de contacto (que también tiene formulario). curl recibe 403; abre en navegador. |
| The Hills Press | `the-hills-press` | Ironsworn, Public Access y Trophy Dark en castellano | `thehillspress@gmail.com` | https://www.thehillspress.es/politica-privacidad/ | 2026-11-23 | En castellano; correo de la empresa en su política de privacidad. Formulario en https://www.thehillspress.es/formulario-de-contacto/. |
| Tomkin Press | `tomkin-press` | Ironsworn (original, 2018); sistema Ironsworn | Formulario: https://tomkinpress.com/pages/connect | https://tomkinpress.com/pages/connect | 2026-11-23 | Formulario «para comentarios, soporte o consultas de negocio». La misma página da `shawn@tomkinpress.com` (su dueño; ver Shawn Tomkin): un solo mensaje sirve para los dos. |
| Tuesday Knight Games | `tuesday-knight-games` | Mothership (original, 0e 2018 —la que jugamos— y 1e 2024) | `support@tuesdayknightgames.com` | https://www.tuesdayknightgames.com/policies/privacy-policy | 2026-11-23 | También en la portada de su web. Centro de ayuda con formulario: https://tuesdayknightgames.zendesk.com/hc/en-us/requests/new. Su licencia de terceros pide aprobación previa: pregunta oportuna. |
| Wizards of the Coast | `wizards-of-the-coast` | Dungeons & Dragons 5.ª (2014, la que jugamos, y revisión 2024; también en castellano); sistema D&D 5.ª (SRD) | Centro de ayuda: https://support.wizards.com/hc/en-us | https://company.wizards.com/en/legal/fancontentpolicy | 2026-11-23 | Su política de contenido de fans manda las preguntas de permisos y propiedad intelectual al «Wizards Help System» (pide iniciar sesión). Sin correo público de permisos. Nuestra ficha no tiene su web: se podría añadir `https://company.wizards.com/`. |

## Autoría (19)

| Nombre | Slug | Juegos en /rol/ | Canal | Fuente (URL exacta) | Consulta | Notas |
|---|---|---|---|---|---|---|
| Adam Koebel | `adam-koebel` | Dungeon World (coautor) | **sin contacto oficial** | — | 2026-11-23 | Su web `adam-koebel.com` está caducada (aviso de Squarespace). No hay otro canal suyo. Dungeon World puede tratarse con Sage LaTorra. |
| Brendan Conway | `brendan-conway` | Root: The Roleplaying Game (codiseño) | Formulario de Magpie Games, **vía editorial**: https://magpiegames.com/pages/contact-us | https://magpiegames.com/pages/contact-us | 2026-11-23 | Sin web propia. Mismo canal que Magpie Games (es socio de la editorial): un solo mensaje para la editorial y sus dos autores de Root. |
| Christopher Gunning | `christopher-gunning` | Delta Green (coautor) | **sin contacto oficial** | — | 2026-11-23 | Sin web propia; es autor por encargo de Arc Dream, no socio. Llega a él, si acaso, por `info@arcdream.com`. |
| Dennis Detwiller | `dennis-detwiller` | Delta Green (cocreador) | `info@arcdream.com`, **vía editorial** | https://shop.arcdream.com/pages/about | 2026-11-23 | Cofundador y director creativo de Arc Dream (lo dice esa misma página). Su dominio antiguo `detwillerdesign.com` está aparcado. Mismo mensaje que Arc Dream. |
| Greg Stolze | `greg-stolze` | Delta Green (coautor) | `gregstolze@comcast.net` | https://gregstolze.com/about-reign/ | 2026-11-23 | Único correo de su web, en el recuadro de la lista de correo de REIGN («send me an email»). No hay página de contacto (`/contact/` da 404). |
| Jason Cordova | `jason-cordova` | Public Access (diseño); sistema Carved from Brindlewood | `gauntletpublish@gmail.com`, **vía editorial** | https://www.gauntlet-rpg.com/contact-us.html | 2026-11-23 | Fundador de The Gauntlet. `jasoncordova.com` es de otra persona (un novelista): no usar. Mismo mensaje que The Gauntlet. |
| Jesse Ross | `jesse-ross` | Trophy Dark (diseño); sistema Trophy | **sin contacto oficial** (ni correo ni formulario) | https://jesseross.com/ | 2026-11-23 | Su web solo invita a escribirle por Mastodon (dice.camp/@jesseross), Bluesky o LinkedIn. No hay correo ni formulario: si se quiere, mensaje por esas redes (decisión de quien envíe). Le llegaría también vía Hedgemaze Press. |
| Johan Egerkrans | `johan-egerkrans` | Vaesen (la obra en que se basa el juego; ilustración) | `johan@egerkrans.com` | https://johan-egerkrans.blogspot.com/ | 2026-11-23 | En la columna de su blog oficial («drop me a line at…»); `egerkrans.com` dice estar «temporalmente muerta» y remite al blog. Clave para el permiso de la portada de Vaesen (su arte). |
| Mark Diaz Truman | `mark-diaz-truman` | Root: The Roleplaying Game (codiseño) | Formulario de Magpie Games, **vía editorial**: https://magpiegames.com/pages/contact-us | https://magpiegames.com/pages/contact-us | 2026-11-23 | Cofundador de Magpie Games. `markdiaztruman.com` ya no es suyo. Mismo mensaje que Magpie. |
| Meguey Baker | `meguey-baker` | Sistema Powered by the Apocalypse (cocreadora); ningún juego del registro a su nombre | **sin contacto oficial** | https://lumpley.games/lumpley-games/ | 2026-11-23 | lumpley.games dice «contactad con Meguey para Night Sky Games» pero no da correo ni formulario suyo; `nightskygames.com` no responde. Le puede llegar vía Vincent Baker. |
| Nathan Dowdell | `nathan-dowdell` | Star Trek Adventures (diseño) | **sin contacto oficial** | — | 2026-11-23 | Sin web propia; es empleado de Modiphius, no socio. Le llega, si acaso, por `support@modiphius.com`. |
| Nils Hintze | `nils-hintze` | Vaesen (texto del libro) | **sin contacto oficial** | — | 2026-11-23 | Sin web propia; escritor por encargo de Free League. Le llega, si acaso, por el formulario de Free League. |
| Sage LaTorra | `sage-latorra` | Dungeon World (coautor); su repositorio en GitHub es la fuente de la licencia CC BY 3.0 | `sagelt@gmail.com` | https://svirfnebl.in/ | 2026-11-23 | Enlace de correo (icono de sobre) al pie de su blog personal, que es la web que enlazan su itch.io y su GitHub. Sirve también para Dungeon World original (Sage Kobold no tiene canal). |
| Sandy Petersen | `sandy-petersen` | La llamada de Cthulhu (creador) | Formulario de Petersen Games, **vía editorial**: https://petersengames.com/pages/contact-us | https://petersengames.com/pages/contact-us | 2026-11-23 | Fundador de Petersen Games. Sin web personal con contacto. |
| Sean McCoy | `sean-mccoy` | Mothership (creador) | `support@tuesdayknightgames.com`, **vía editorial** | https://www.tuesdayknightgames.com/policies/privacy-policy | 2026-11-23 | Cofundador de Tuesday Knight Games (según su página «About»). Buzón de soporte de la empresa, no suyo. Mismo mensaje que Tuesday Knight Games. |
| Shane Ivey | `shane-ivey` | Delta Green (coautor) | `info@arcdream.com`, **vía editorial** | https://shop.arcdream.com/pages/about | 2026-11-23 | Presidente y editor de Arc Dream (lo dice esa página). Mismo mensaje que Arc Dream y Dennis Detwiller. |
| Shawn Tomkin | `shawn-tomkin` | Ironsworn (autor); sistema Ironsworn | `shawn@tomkinpress.com` | https://tomkinpress.com/pages/connect | 2026-11-23 | Tomkin Press es su editorial unipersonal; la página da su correo y un formulario. Mismo mensaje que Tomkin Press. |
| Spenser Starke | `spenser-starke` | Alice is Missing (diseño) | **sin contacto oficial** | — | 2026-11-23 | `spenserstarke.com` es privada (pide contraseña, HTTP 401). No es dueño de ninguna editorial. Le llega, si acaso, vía Renegade o Hunters Entertainment. |
| Vincent Baker | `vincent-baker` | Sistema Powered by the Apocalypse (cocreador); ningún juego del registro a su nombre | `lumpley@lumpley.games` | https://lumpley.games/privacy-policy/ | 2026-11-23 | «I'm Vincent Baker… You can contact me at…» en la política de privacidad de su web; el correo está protegido por Cloudflare en la página (se lee en navegador o descodificando el atributo `data-cfemail`). |

## Agrupar envíos (un mensaje cubre a varias entradas)

- **Arc Dream** (`info@arcdream.com`): Arc Dream Publishing + Dennis Detwiller + Shane Ivey (+ Christopher Gunning, sin canal propio).
- **Magpie Games** (formulario o `info@magpiegames.com`): Magpie + Brendan Conway + Mark Diaz Truman.
- **The Gauntlet** (`gauntletpublish@gmail.com`): The Gauntlet + Jason Cordova.
- **Tomkin Press** (`shawn@tomkinpress.com` o formulario): Tomkin Press + Shawn Tomkin.
- **Tuesday Knight Games** (`support@tuesdayknightgames.com`): la editorial + Sean McCoy.

## Pendiente

- 8 entradas **sin contacto oficial**: Sage Kobold Productions, Adam Koebel, Christopher Gunning, Jesse Ross, Meguey Baker, Nathan Dowdell, Nils Hintze y Spenser Starke.
- Canal, remitente y firma: los decide quien envíe (tarjeta `t_97589435`).
- Fichas que podrían ganar su web oficial (la encontrada aquí): Arc Dream Publishing (`arcdream.com`), Wizards of the Coast (`company.wizards.com`), Johan Egerkrans (blog), Greg Stolze (`gregstolze.com`), Sage LaTorra (`svirfnebl.in`), Vincent y Meguey Baker (`lumpley.games`). Cambio en las fichas = otra tarjeta.
