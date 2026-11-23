/**
 * Buscador SIN JavaScript de /rol/juegos/ (decisión 1, 2026-11-23): cada filtro es
 * una página ya generada con su lista de juegos. Un filtro cada vez (no se combinan).
 *
 * Solo hay filtros con datos que tienen fuente (licencias, sistema, género, modo,
 * formato, ediciones). Una opción sin juegos no se publica.
 *
 * Rutas: /rol/juegos/<ruta>/, donde <ruta> es «descargables», «en-castellano» o
 * «<criterio>/<valor>» (licencia, sistema, genero, modo, formato).
 */
import { esAbierta, getAllJuegos, getAllSystems, getSistemasRol, linajeSistema, resuelveJuego, type JuegoResuelto } from "./collections";
import { formatoPartida, generoRol, modoJuego } from "./formato";

export interface OpcionFiltro {
  /** Ruta bajo /rol/juegos/, sin barras: «licencia/abierta», «descargables». */
  ruta: string;
  /** Texto del enlace del filtro. */
  etiqueta: string;
  /** Titular de la página filtrada. */
  titulo: string;
  /** Qué cuenta para entrar, en una frase. */
  explica: string;
  juegos: JuegoResuelto[];
  /** Nota por juego (id → texto), p. ej. «vía Carved from Brindlewood». */
  notas: Map<string, string>;
}
export interface GrupoFiltro {
  id: string;
  titulo: string;
  opciones: OpcionFiltro[];
}

const opcion = (
  ruta: string, etiqueta: string, titulo: string, explica: string, juegos: JuegoResuelto[], notas = new Map<string, string>()
): OpcionFiltro => ({ ruta, etiqueta, titulo, explica, juegos, notas });

async function construye() {
  const fichas = await Promise.all((await getAllJuegos()).map(resuelveJuego));
  const todos = new Map((await getAllSystems()).map((s) => [s.id, s]));
  const conLicencia = fichas.filter((f) => f.licencias.length > 0);

  const licencia: OpcionFiltro[] = [
    opcion(
      "licencia/abierta", "Alguna licencia abierta", "Juegos con alguna licencia abierta",
      "El texto del juego, sus reglas (el sistema) o alguna de sus ediciones tiene una licencia abierta: Creative Commons, ORC, una licencia abierta propia o el dominio público.",
      fichas.filter((f) => f.abierto)
    ),
    opcion(
      "licencia/creative-commons", "Creative Commons", "Juegos con licencia Creative Commons",
      "El juego, su sistema o alguna edición se publica con una licencia Creative Commons.",
      fichas.filter((f) => f.licencias.some((l) => l.data.tipo === "cc"))
    ),
    opcion(
      "licencia/uso-comercial", "Abierta y con uso comercial", "Juegos con licencia abierta que permite vender",
      "Alguna de sus licencias abiertas deja publicar y vender material derivado, según el texto oficial de la licencia.",
      fichas.filter((f) => f.licencias.some((l) => esAbierta(l) && l.data.permite.comercial === true))
    ),
    opcion(
      "licencia/sin-licencia-abierta", "Sin licencia abierta", "Juegos sin licencia abierta",
      "Ni el juego, ni su sistema, ni sus ediciones tienen una licencia abierta: todos los derechos reservados, o solo una política para fans o con aprobación de la editorial.",
      conLicencia.filter((f) => !f.abierto)
    ),
  ];

  const descarga: OpcionFiltro[] = [
    opcion(
      "descargables", "Se puede descargar", "Juegos que se pueden descargar",
      "Alguna edición del juego se descarga de la web oficial porque su licencia lo permite. No cuentan las reglas sueltas del sistema (SRD): esas están en la ficha de cada sistema.",
      fichas.filter((f) => f.descargaJuego)
    ),
    opcion(
      "en-castellano", "En castellano", "Juegos con edición en castellano",
      "Hay alguna edición en castellano, traducida o escrita en castellano.",
      fichas.filter((f) => f.enCastellano)
    ),
  ];

  // Sistema: incluye los juegos de los sistemas de su familia (PbtA → Carved from Brindlewood).
  const sistema = (await getSistemasRol()).map((s) => {
    const notas = new Map<string, string>();
    const juegos = fichas.filter((f) => {
      if (!f.sistema) return false;
      const cadena = linajeSistema(f.sistema.id, todos);
      const i = cadena.findIndex((x) => x.id === s.id);
      if (i > 0) notas.set(f.juego.id, `Vía ${cadena[0].data.name}`);
      return i >= 0;
    });
    const nombre = s.data.nombreCorto ? `${s.data.name} (${s.data.nombreCorto})` : s.data.name;
    return opcion(
      `sistema/${s.id}`, s.data.nombreCorto ?? s.data.name, `Juegos con el sistema ${s.data.nombreCorto ?? s.data.name}`,
      `Juegos que usan ${nombre}, directamente o a través de un sistema de su familia.`,
      juegos, notas
    );
  });

  const tituloGenero: Record<keyof typeof generoRol, string> = {
    fantasia: "Juegos de fantasía",
    "ciencia-ficcion": "Juegos de ciencia ficción",
    terror: "Juegos de terror",
    misterio: "Juegos de misterio",
    historico: "Juegos históricos",
    contemporaneo: "Juegos contemporáneos",
    universal: "Juegos de ambientación universal",
    otro: "Juegos de otros géneros",
  };
  const genero = (Object.keys(generoRol) as (keyof typeof generoRol)[]).map((g) =>
    opcion(`genero/${g}`, generoRol[g], tituloGenero[g], `Su género, según sus fuentes, incluye «${generoRol[g].toLowerCase()}». Un juego puede tener varios.`,
      fichas.filter((f) => f.juego.data.generos.includes(g)))
  );

  const modo = [
    ...(Object.keys(modoJuego) as (keyof typeof modoJuego)[]).map((m) =>
      opcion(`modo/${m}`, modoJuego[m], `Juegos ${modoJuego[m].toLowerCase()}`, `Se juega ${modoJuego[m].toLowerCase()}, según sus fuentes.`,
        fichas.filter((f) => f.juego.data.modo.includes(m)))
    ),
    ...(Object.keys(formatoPartida) as (keyof typeof formatoPartida)[]).map((x) =>
      opcion(`formato/${x}`, formatoPartida[x], `Juegos para ${x === "una-sesion" ? "una sola sesión" : "campaña"}`,
        `Pensado para ${x === "una-sesion" ? "jugarse en una sola sesión" : "jugarse en campaña, sesión tras sesión"}, según sus fuentes.`,
        fichas.filter((f) => f.juego.data.formato.includes(x)))
    ),
  ];

  const grupos: GrupoFiltro[] = [
    { id: "licencia", titulo: "Licencia", opciones: licencia },
    { id: "ediciones", titulo: "Ediciones", opciones: descarga },
    { id: "sistema", titulo: "Sistema", opciones: sistema },
    { id: "genero", titulo: "Género", opciones: genero },
    { id: "modo", titulo: "Cómo se juega", opciones: modo },
  ]
    .map((g) => ({ ...g, opciones: g.opciones.filter((o) => o.juegos.length > 0) }))
    .filter((g) => g.opciones.length > 0);

  return { fichas, grupos, opciones: grupos.flatMap((g) => g.opciones) };
}

let cache: ReturnType<typeof construye> | undefined;
/** Juegos resueltos y grupos de filtros (se calcula una vez por build). */
export function filtrosRol() {
  return (cache ??= construye());
}

/** URL de una página filtrada. */
export const hrefFiltro = (ruta: string) => `/rol/juegos/${ruta}`;
