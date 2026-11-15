/** Formato de fechas y etiquetas del Archivo (sin datos: solo presentación). */

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/**
 * Parte una fecha ISO o parcial («1996», «1996-04», «1996-04-13») en año y resto
 * («13 de abril»), respetando la precisión declarada en la colección.
 */
export function partesFecha(fecha: string, precision: "year" | "month" | "day" = "year") {
  const [ano, mes, dia] = fecha.split("-");
  const m = mes ? MESES[Number(mes) - 1] : undefined;
  let resto: string | undefined;
  if (precision === "day" && m && dia) resto = `${Number(dia)} de ${m}`;
  else if (precision !== "year" && m) resto = m.charAt(0).toUpperCase() + m.slice(1);
  return { ano, resto };
}

export const categoriaCronologia: Record<string, string> = {
  edicion: "Edición",
  prensa: "Prensa",
  fundacion: "Fundación",
  comunidad: "Testimonio de la comunidad",
  sistema: "Sistema",
  otra: "Otro",
};

export const estadoCampana: Record<string, string> = {
  "en-curso": "En curso",
  "en-pausa": "En pausa",
  terminada: "Terminada",
  pendiente: "Pendiente",
};

/** «2026-11-14» → «14 de noviembre de 2026». Si no es una fecha completa, la devuelve tal cual. */
export function fechaLarga(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} de ${MESES[Number(m[2]) - 1]} de ${m[1]}`;
}

/** «1 fuente» / «2 fuentes». */
export function plural(n: number, uno: string, varios: string) {
  return `${n} ${n === 1 ? uno : varios}`;
}

/** Ancla de una fuente en /fuentes/. */
export const anclaFuente = (id: string) => `/fuentes#${id}`;
