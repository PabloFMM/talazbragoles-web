# Brief para redactar el MÓDULO BASE de «Los Navegantes del Sueño» (leer entero antes de escribir)

Todo bajo `/opt/data/project-talazbragoles/`. Responde y escribe SIEMPRE en castellano.

## Qué es
Módulo de rol para Numinia (Numen Games), licencia CC0, que se publicará en la web. Hay DOS piezas (decisión 32 de `docs/rol/cronicas/CONTEXTO.md`):
1. **MÓDULO BASE** (lo que escribes tú): un esqueleto abierto. NO contiene respuestas al misterio. Las respuestas las crean los jugadores y las dimensiona el DJ a partir del material base (decisiones 38 y 40).
2. **La AVENTURA del club de los miércoles**: lo que hizo una mesa concreta. Va aparte; tú NO la escribes.

## Lee primero
1. `docs/rol/cronicas/CONTEXTO.md`: decisiones 1-44. Son vinculantes; en especial 16, 23, 30 y 32-44.
2. `material/los-navegantes-del-sueno/modulo/00-clasificacion.md`: qué elemento es BASE, ABIERTA, ESCENA, MESA o VARIANTE.
3. `material/los-navegantes-del-sueno/modulo/01-base-raiz-y-hechos.md`: la parte ya escrita (Cabecera, Raíz, Hechos fundacionales, Espacios de Indeterminación, Propuestas potenciales). Copia su FORMATO y su VOZ, y no contradigas sus hechos.
4. `material/los-navegantes-del-sueno/textos/ORDEN-v2.md`: mapa del material y fechas.
5. Los análisis con citas, en `material/los-navegantes-del-sueno/textos/analisis/`: A (Proyecto), B (compilado y combates), C (investigación y mundo), D (jornadas finales).
6. El manual: `textos/analisis/manual-numinia-v0.6.0-es.md`. Usa grep. Capítulo 7, «Construyendo la aventura»: fases, Espacios de Indeterminación, Encrucijada. Capítulo 4: tiradas, estados, Fragmento 6 de enfrentamientos con ANCLAJES. Bestiario: Depredador del Eco, Guardián de Crisálida, Dragón de Voluta, Desgarraformas.
7. La plantilla: `textos/analisis/plantilla-aventura-numinia.md`.
8. Las fuentes: `material/los-navegantes-del-sueno/textos/originales/*.md`, conversión literal de .docx.
   - Morado `{color=7030A0}`: las PREGUNTAS a la mesa son del módulo (se conservan); las RESPUESTAS de jugadores son MESA (se quitan).
   - Naranja `{color=E97132}`: «Elementos interpretables» (base).
   - Azul `{color=0070C0}`: significado dudoso. Los PNJ del portero, el dueño y la recepcionista se citan por su papel; su nombre puede ir entre paréntesis como «nombre sugerido».

## Lo que NUNCA entra en el módulo base (es MESA)
- Nombres de PJ de la mesa (Lyrien, Uruk, Kivrin, Lisander) y sus respuestas.
- Nexum como red neuronal. Sí entra «Nexum Express», la empresa del cartero.
- Elizabeth, EID-5, «Lázarus»/Lazarus como sede de EID-5, las tres llaves, el punto de persistencia, el hijo no nacido.
- La familia Thalos: Lucien, Khalira, la mansión, el trasunto.
- Aurelian como «función» de una isla. El Nivel VI. El Bucle de Retención de Isolde.
- El Tratado de modelaje de realidades y la palabra clave «cereza».
- El ritual de entrada al sueño en la estación abandonada.
- Las representaciones de Lisander.
- El Juego de las Puertas Ciegas: sale de una respuesta de jugadora.

Si una escena reutilizable lleva dentro algo de esta lista, quítalo o conviértelo en pregunta abierta para la mesa («¿Qué buscáis aquí?») y apunta el cambio en «Decisiones de redacción».

## Reglas de redacción
- **Nada inventado.** Cada párrafo o viñeta termina con `<!-- fuente: Archivo.md:línea[, …] -->`. El archivo está en `textos/originales/`, salvo el manual y la plantilla (`textos/analisis/`) y `CONTEXTO.md` (decisión N). Si falta un dato, escribe `[pendiente: qué]`.
- **Puedes adaptar sin inventar.** Puedes cambiar estadísticas antiguas al formato de anclajes del manual. Puedes reformular preguntas y quitar respuestas. Lo que no puedes es crear hechos, PNJ, lugares o tramas nuevos.
- **Manda el manual** (decisiones 16 y 30):
  - Hipótesis de Partida, Aliento del Velo, Círculo Estelar, Ouroboros, Academia del Umbral Anímico, Fase de Investigación.
  - Sin «Energía», «Hostilidad», «1D4» ni «puntos de daño»: se usan los estados y anclajes del manual.
  - El Vórtice de los Sueños y el Templo de Khepri están en Ouroboros.
  - Los nombres en castellano.
- **Voz:** la de un módulo para el DJ. Castellano claro, frases cortas, sobrio. Sin voz de asistente de IA, sin emojis, sin preguntas al autor. Mantén el tono literario de las escenas narradas del DJ (LNDS-01), sin recargarlo.
- **No toques** `originales/`, `analisis/`, `aventura/` ni archivos de otras secciones.
- **Al final del archivo:** `## Decisiones de redacción y [pendiente]`.
- **Al terminar:** ejecuta `python3 /opt/data/project-talazbragoles/tools/vista-modulo.py`. Comprueba con grep, fuera de la sección final, que no aparece `Lyrien|Uruk|Kivrin|Lisander|Elizabeth|EID|Lázarus|persistencia|Lucien|Khalira|Bucle|Nivel VI|red neuronal|Energía|Hipótesis Fragmentaria|Stellar`. Devuelve: ruta, número de palabras, lista de [pendiente] y decisiones de redacción.
