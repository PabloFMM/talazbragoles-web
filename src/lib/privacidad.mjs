/**
 * Privacidad de las crónicas de mesa (sección Rol, fase 2, 2026-11-24).
 *
 * En `campanas` y `mesas` los jugadores salen SOLO con su personaje y quien dirige,
 * como «DJ». Ningún campo puede guardar a una persona real. Lo usan:
 *  - src/content.config.ts (superRefine de `campanas` y `mesas`: el build falla);
 *  - tests/rol-sin-nombres.test.mjs (revisa el frontmatter y el cuerpo).
 *
 * JS sin dependencias para que lo importen igual Astro y `node --test`.
 */

/** Claves que delatan un campo de persona real (en cualquier nivel del objeto). */
export const CLAVE_PERSONA =
  /^(jugador(a|es|as)?|player(s)?|gm|dm|master|director(a)?|dirige|narrador(a)?|persona(s)?|nombre_?real|nombreReal|autor(a)?|email|correo|discord|usuario|user(name)?)$/i;

/** Nombres reales que no pueden salir en una campaña ni en una mesa. El único
 *  nombre real publicado en Rol fase 2 es la autoría del módulo base, y va en
 *  `modulos`, no aquí. */
export const NOMBRE_REAL = /PabloFM|Pablo\s+Fern|Christian|M[äa]rtens/i;

/**
 * Devuelve la lista de problemas (vacía si no hay): rutas de claves de persona y
 * textos con nombres reales.
 * @param {unknown} valor
 * @param {string} [ruta]
 * @returns {string[]}
 */
export function buscaPersonas(valor, ruta = "") {
  const problemas = [];
  if (typeof valor === "string") {
    if (NOMBRE_REAL.test(valor)) problemas.push(`${ruta || "(texto)"}: nombra a una persona real («${valor.slice(0, 60)}»)`);
  } else if (Array.isArray(valor)) {
    valor.forEach((v, i) => problemas.push(...buscaPersonas(v, `${ruta}[${i}]`)));
  } else if (valor && typeof valor === "object" && !(valor instanceof Date)) {
    for (const [k, v] of Object.entries(valor)) {
      const r = ruta ? `${ruta}.${k}` : k;
      if (CLAVE_PERSONA.test(k)) problemas.push(`${r}: campo de persona real (solo personaje o «DJ»)`);
      problemas.push(...buscaPersonas(v, r));
    }
  }
  return problemas;
}
