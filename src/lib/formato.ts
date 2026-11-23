/** Formato de fechas y etiquetas del Archivo (sin datos: solo presentación). */
import type { CollectionEntry } from "astro:content";

type Campo<C extends "sources" | "editions" | "people" | "timeline" | "campaigns", K extends keyof CollectionEntry<C>["data"]> =
  CollectionEntry<C>["data"][K];

/** Estado documental de una edición (mismo enum que el esquema). */
export type EstadoDocumental = Campo<"editions", "status">;

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/**
 * Parte una fecha ISO o parcial («1996», «1996-04», «1996-04-13») en año y resto
 * («13 de abril»), respetando la precisión declarada en la colección.
 */
export function partesFecha(fecha: string, precision: Campo<"timeline", "precision"> = "year") {
  const [ano, mes, dia] = fecha.split("-");
  const m = mes ? MESES[Number(mes) - 1] : undefined;
  let resto: string | undefined;
  if (precision === "day" && m && dia) resto = `${Number(dia)} de ${m}`;
  else if (precision !== "year" && m) resto = m.charAt(0).toUpperCase() + m.slice(1);
  return { ano, resto };
}

// Etiquetas de los enums de content.config.ts. Al ser Record<enum, string>,
// un valor nuevo en el esquema sin su etiqueta aquí es un error de tipos (astro check).

export const estadoDocumental: Record<EstadoDocumental, string> = {
  documentada: "Documentada",
  parcial: "Parcial",
  pendiente: "Pendiente",
};

export const categoriaCronologia: Record<Campo<"timeline", "category">, string> = {
  edicion: "Edición",
  prensa: "Prensa",
  fundacion: "Fundación",
  comunidad: "Testimonio de la comunidad",
  sistema: "Sistema",
  otra: "Otro",
};

export const estadoCampana: Record<Campo<"campaigns", "status">, string> = {
  "en-curso": "En curso",
  "en-pausa": "En pausa",
  terminada: "Terminada",
  pendiente: "Pendiente",
};

export const tipoFuente: Record<Campo<"sources", "type">, string> = {
  testimonio: "Testimonio",
  prensa: "Prensa",
  "documento-oficial": "Documento oficial",
  "documento-de-epoca": "Documento de época",
  "web-archivo": "Web archivada",
  foto: "Foto",
  video: "Vídeo",
  otro: "Otro",
};

export const tipoActividad: Record<Campo<"editions", "activities">[number]["type"], string> = {
  "partida-rol": "Partida de rol",
  torneo: "Torneo",
  charla: "Charla",
  demo: "Demostración",
  exposicion: "Exposición",
  otro: "Otra",
};

/** Apartado de un documento de edición (bloque 05), en el orden en que se pintan. */
export type ApartadoDocumento = Campo<"editions", "documentos">[number]["apartado"];
export const APARTADOS: ApartadoDocumento[] = ["papeles", "prensa", "fotos", "recuerdos"];
export const apartadoDocumento: Record<ApartadoDocumento, string> = {
  papeles: "Papeles",
  prensa: "Prensa",
  fotos: "Fotos",
  recuerdos: "Recuerdos",
};

export const papelPersona: Record<Campo<"people", "roles">[number], string> = {
  organizador: "Organización",
  autor: "Autoría",
  disenador: "Diseño",
  ilustrador: "Ilustración",
  jugador: "Juego",
  periodista: "Prensa",
  otro: "Otro",
};

// ─── Sección Rol (fase 1) ─────────────────────────────────────────────

type CampoRol<C extends "juegos" | "systems" | "licencias", K extends keyof CollectionEntry<C>["data"]> =
  CollectionEntry<C>["data"][K];

export const generoRol: Record<CampoRol<"juegos", "generos">[number], string> = {
  fantasia: "Fantasía",
  "ciencia-ficcion": "Ciencia ficción",
  terror: "Terror",
  misterio: "Misterio",
  historico: "Histórico",
  contemporaneo: "Contemporáneo",
  universal: "Universal",
  otro: "Otro",
};

export const modoJuego: Record<CampoRol<"juegos", "modo">[number], string> = {
  "con-dj": "Con quien dirige",
  "sin-dj": "Sin quien dirija",
  solitario: "En solitario",
};

export const formatoPartida: Record<CampoRol<"juegos", "formato">[number], string> = {
  "una-sesion": "Partida de una sesión",
  campana: "Campaña",
};

export const tipoLicencia: Record<CampoRol<"licencias", "tipo">, string> = {
  cc: "Creative Commons",
  orc: "Licencia ORC",
  "abierta-propia": "Licencia abierta propia",
  "dominio-publico": "Dominio público",
  "politica-de-uso": "Política de uso (no es una licencia)",
  "con-aprobacion": "Con aprobación previa de la editorial (no es abierta)",
  fans: "Solo material de fans, no comercial",
  cerrada: "Cerrada",
};

export const estadoJuego: Record<NonNullable<CampoRol<"juegos", "estado">>, string> = {
  publicado: "Publicado",
  "en-construccion": "En construcción",
};

export const dondeSeJugo: Record<CampoRol<"systems", "jugadoEn">[number], string> = {
  jornadas: "Jornadas Talazbrágoles",
  grupo: "Nuestras mesas",
};

export const permisoPortada: Record<NonNullable<CampoRol<"juegos", "portada">>["permiso"], string> = {
  "oficial-sin-lucro": "Reproducida sin ánimo de lucro, con crédito y enlace a la editorial",
  cita: "Cita",
  licencia: "Licencia",
  "permiso-editor": "Permiso de la editorial",
  "foto-propia": "Foto de nuestro ejemplar",
};

export const idiomaEdicion: Record<CampoRol<"juegos", "ediciones">[number]["idioma"], string> = {
  en: "Inglés",
  es: "Castellano",
};

/** Nombre legible de un campo que respalda una fuente (`fuentes[].datos`). */
const CAMPOS: Record<string, string> = {
  titulo: "título",
  tituloCastellano: "título en castellano",
  estado: "estado",
  ano: "año",
  ediciones: "ediciones",
  autoria: "autoría",
  editorial: "editorial",
  editorialCastellano: "editorial en castellano",
  sistema: "sistema",
  licenciaJuego: "licencia del juego",
  licencia: "licencia",
  generos: "género",
  modo: "cómo se juega",
  formato: "formato de partida",
  jugadores: "jugadores",
  traduccionDe: "de qué edición es traducción",
  descarga: "descarga oficial",
  familia: "familia",
  origen: "origen",
  srd: "SRD",
  nombreCorto: "nombre corto",
  url: "texto oficial",
  permite: "qué permite",
  portada: "imagen de portada",
};
export const etiquetaCampo = (campo: string) => CAMPOS[campo] ?? campo;

/** Lista legible: «a», «a y b», «a, b y c». */
export function listaY(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

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

/** Número de orden a dos cifras: 1 → «01» (índice, fichas, fuentes). */
export const dosCifras = (n: number) => String(n).padStart(2, "0");

/** Ancla de una fuente en /fuentes/. */
export const anclaFuente = (id: string) => `/fuentes#${id}`;
