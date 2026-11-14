# Reglas y formato de las guías de profesión

Brief único para quien escriba o revise una guía (persona o IA). Creado el 2026-11-14 por la sesión coordinadora.

Contexto: web de asesoría de la hermandad «La Barbarie» (Horda, 4 jugadores de más de 50 años, poco expertos) en World of Warcraft: Forever (salió el 2026-11-04). Una guía por archivo, en español de España.

REGLAS OBLIGATORIAS (el proyecto las aplica sin excepción):
1. Nada inventado. Solo datos que hayas leído hoy en una página web que hayas abierto (web_search + web_extract). No uses tu memoria de WoW Classic para rellenar huecos: si un dato no aparece en una fuente de Forever, escribe «pendiente».
2. Cada dato lleva su fuente al lado (nombre del sitio) y la guía termina con la lista de enlaces. Fecha de comprobación: 2026-11-14.
3. Números clave (habilidad que pide una receta, nivel de personaje, rangos): intenta confirmarlos en 2 fuentes independientes. Si solo hay una, pon «(una sola fuente)». Si dos fuentes se contradicen, NO elijas: anótalo en «Dudas y contradicciones» con lo que dice cada una.
4. Si una fuente dice que el dato es de la beta o de Classic, etiquétalo: «(dato de beta)» o «(dato de Classic, sin confirmar en Forever)».
5. Si la fuente es un sitio que vende servicios (boosting, oro), dilo: «(vende servicios)».
6. No copies frases de las fuentes: redacta con tus palabras, frases cortas, una idea por línea. Explica cada término la primera vez. Sin relleno.
7. Nombres de objetos, recetas y zonas: el nombre del cliente en español si lo encuentras en una fuente (p. ej. wowhead.com/forever/es/...). Si no, deja el nombre en inglés y añade «(nombre en español: pendiente)». No traduzcas por tu cuenta nombres propios.
8. Fuentes sugeridas (abre varias; hay más): www.wowhead.com/forever/guide/professions/... y /forever/es/..., www.icy-veins.com/wow-forever/..., www.warcrafttavern.com/forever/guides/..., wow-forever.gg/guides/professions/..., foreverdb.net/profession/..., wowfdb.com/professions/..., www.wow-professions.com/forever/..., rankedboost.com/world-of-warcraft/forever/professions/, www.zockify.com/forever/professions/. Si una página no carga, pruébala con otra; no te quedes con el fragmento del buscador como si fuera la página.
9. Escribe SOLO el archivo indicado. No toques ningún otro archivo del proyecto. No uses git.

FORMATO EXACTO DEL ARCHIVO (respeta los títulos):
---
profesion: <nombre en español>
slug: <slug>
tipo: <recolección | producción | secundaria>
comprobado: 2026-11-14
---
# <Profesión>
## En dos líneas
(qué es y a quién le sirve)
## Cómo empezar
(instructor, herramienta necesaria, coste si consta)
## Rangos de habilidad
(tabla: Rango | Habilidad | Nivel de personaje que pide | Dónde se aprende | Fuente)
## Ruta para subir
(tabla: De–a | Qué hacer | Materiales o zona | Fuente). Tramos de 1 hasta el tope que tenga Forever.
## Novedades de Forever
(lo que cambia respecto a Classic según las fuentes; incluye el «campamento» de la profesión si consta)
## Con qué combina
## Dudas y contradicciones
## Pendiente
(lista de lo que no has podido confirmar)
## Fuentes
(lista: nombre — URL — qué has sacado de ella)

Al terminar, devuelve un resumen breve: ruta del archivo, número de fuentes abiertas de verdad, contradicciones encontradas, y la lista de «pendientes».
