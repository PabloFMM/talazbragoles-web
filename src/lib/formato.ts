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

/** «1 fuente» / «2 fuentes». */
export function plural(n: number, uno: string, varios: string) {
  return `${n} ${n === 1 ? uno : varios}`;
}

/** Ancla de una fuente en /fuentes/. */
export const anclaFuente = (id: string) => `/fuentes#${id}`;
