import { getCollection, getEntry, getEntries, type CollectionEntry } from "astro:content";

const porNombre = (a: { data: { name: string } }, b: { data: { name: string } }) =>
  a.data.name.localeCompare(b.data.name, "es");

/** Fuentes ordenadas por fecha (más recientes al final). */
export async function getAllSources() {
  const all = await getCollection("sources");
  return all.sort((a, b) => (a.data.date ?? "").localeCompare(b.data.date ?? ""));
}

/** Ediciones de la MÁS RECIENTE a la MÁS ANTIGUA; año desconocido al final. */
export async function getAllEditions() {
  const all = await getCollection("editions");
  return all.sort((a, b) => {
    const ya = a.data.year === "desconocida" ? -1 : a.data.year;
    const yb = b.data.year === "desconocida" ? -1 : b.data.year;
    return yb - ya;
  });
}

/** Ruta de una edición: el id del archivo es el año («1997») o «sin-fecha». */
export const hrefEdicion = (id: string) => `/ediciones/${id}/`;
/** Ruta de un documento con caras de una edición. */
export const hrefDocumento = (edicionId: string, slug: string) => `/ediciones/${edicionId}/${slug}/`;

/** Personas publicadas (no draft), por orden alfabético. */
export async function getAllPeople() {
  return (await getCollection("people", ({ data }) => !data.draft)).sort(porNombre);
}

/** Sistemas publicados (no draft), por orden alfabético: Jornadas y grupo. */
export async function getAllSystems() {
  return (await getCollection("systems", ({ data }) => !data.draft)).sort(porNombre);
}

/** Sistemas jugados en las Jornadas (lo que enseña /sistemas/, en Archivo). */
export async function getSistemasJornadas() {
  return (await getAllSystems()).filter((s) => s.data.jugadoEn.includes("jornadas"));
}

// ─── Sección Rol (fase 1): juegos, sistemas, licencias, autoría, editoriales ──

const porTitulo = (a: { data: { titulo: string } }, b: { data: { titulo: string } }) =>
  a.data.titulo.localeCompare(b.data.titulo, "es");
const porNombreRol = (a: { data: { nombre: string } }, b: { data: { nombre: string } }) =>
  a.data.nombre.localeCompare(b.data.nombre, "es");

/** Tipos de licencia que cuentan como «abierta» en el filtro (decisión 2026-11-23). */
const TIPOS_ABIERTOS = new Set(["cc", "orc", "abierta-propia", "dominio-publico"]);

/** ¿Es abierta esta licencia? Política PbtA, pautas de fans y cerrada: no. */
export function esAbierta(lic: CollectionEntry<"licencias">) {
  return TIPOS_ABIERTOS.has(lic.data.tipo);
}

/** Juegos publicados (no draft), por título. */
export async function getAllJuegos() {
  return (await getCollection("juegos", ({ data }) => !data.draft)).sort(porTitulo);
}

/** Sistemas que juega el grupo (lo que enseña /rol/sistemas/). */
export async function getSistemasRol() {
  return (await getAllSystems()).filter((s) => s.data.jugadoEn.includes("grupo"));
}

export async function getAllLicencias() {
  return (await getCollection("licencias")).sort(porNombreRol);
}

export async function getAllAutoria() {
  return (await getCollection("autoria")).sort(porNombreRol);
}

export async function getAllEditoriales() {
  return (await getCollection("editoriales")).sort(porNombreRol);
}

/**
 * Ficha de un juego con sus referencias ya resueltas: sistema (y su licencia),
 * licencias del juego, autoría, editoriales y ediciones. Lo que falte queda
 * undefined/vacío y la página lo pinta «pendiente».
 */
export async function resuelveJuego(juego: CollectionEntry<"juegos">) {
  const d = juego.data;
  const sistema = d.sistema ? await getEntry(d.sistema) : undefined;
  const licenciaSistema = sistema?.data.licencia ? await getEntry(sistema.data.licencia) : undefined;
  const licenciasJuego = await Promise.all(
    d.licenciaJuego.map(async (l) => ({ licencia: await getEntry(l.licencia), alcance: l.alcance }))
  );
  const ediciones = await Promise.all(
    d.ediciones.map(async (e) => ({
      ...e,
      editorial: e.editorial ? await getEntry(e.editorial) : undefined,
      licencia: e.licencia ? await getEntry(e.licencia) : undefined,
      descarga: e.descarga ? { ...e.descarga, licencia: await getEntry(e.descarga.licencia) } : undefined,
    }))
  );
  const jugadas = ediciones.filter((e) => e.jugadaPorNosotros);
  // Descargas oficiales: las de cada edición y el SRD del sistema.
  const descargas = [
    ...ediciones.flatMap((e) => (e.descarga ? [{ nombre: e.nombre, url: e.descarga.url, formato: e.descarga.formato, licencia: e.descarga.licencia }] : [])),
    ...(sistema?.data.srd && licenciaSistema
      ? [{ nombre: sistema.data.srd.nombre, url: sistema.data.srd.url, formato: "SRD del sistema", licencia: licenciaSistema }]
      : []),
  ];
  // Todas las licencias que tocan al juego, sin repetir: la del juego, la del
  // sistema, la de cada edición y la de cada descarga (filtros de licencia).
  const todas = new Map<string, CollectionEntry<"licencias">>();
  for (const l of [
    ...licenciasJuego.map((x) => x.licencia),
    licenciaSistema,
    ...ediciones.flatMap((e) => [e.licencia, e.descarga?.licencia]),
  ])
    if (l) todas.set(l.id, l);
  const licencias = [...todas.values()];
  return {
    juego,
    estado: d.estado ?? "publicado",
    licencias,
    sistema,
    licenciaSistema,
    licenciasJuego,
    autoria: await getEntries(d.autoria),
    editorial: await getEntries(d.editorial),
    editorialCastellano: await getEntries(d.editorialCastellano),
    ediciones,
    // Edición que juega el grupo: las marcadas en ediciones[] o, si no se puede
    // señalar una, el texto de `edicion`. Ninguna = «pendiente».
    edicionesJugadas: jugadas,
    edicionJugadaTexto: jugadas.length ? jugadas.map((e) => e.nombre).join(" · ") : d.edicion,
    descargas,
    // Filtro «Abierta»: mira la licencia del juego Y la del sistema (decisión 6)
    // y también la de cada edición (la licencia se evalúa por edición, 2026-11-23).
    abierto: licencias.some(esAbierta),
    enCastellano: d.editorialCastellano.length > 0 || d.ediciones.some((e) => e.idioma === "es"),
    descargable: descargas.length > 0,
    // Filtro «Se puede descargar»: alguna EDICIÓN del juego tiene descarga oficial
    // (su licencia lo permite). El SRD del sistema solo trae las reglas, no el juego.
    descargaJuego: ediciones.some((e) => e.descarga),
  };
}

export type JuegoResuelto = Awaited<ReturnType<typeof resuelveJuego>>;

/** Juegos con alguna edición descargable de la web oficial: filtro «Se puede descargar». */
export async function juegosDescargables() {
  const fichas = await Promise.all((await getAllJuegos()).map(resuelveJuego));
  return fichas.filter((f) => f.descargaJuego).map((f) => f.juego);
}

/**
 * Cadena de familias de un sistema, de él hacia arriba: Carved from Brindlewood →
 * [Carved from Brindlewood, Powered by the Apocalypse].
 */
export function linajeSistema(id: string, sistemas: Map<string, CollectionEntry<"systems">>) {
  const cadena: CollectionEntry<"systems">[] = [];
  const vistos = new Set<string>();
  let actual = sistemas.get(id);
  while (actual && !vistos.has(actual.id)) {
    vistos.add(actual.id);
    cadena.push(actual);
    actual = actual.data.familia ? sistemas.get(actual.data.familia.id) : undefined;
  }
  return cadena;
}

/**
 * Juegos que usan un sistema: directamente o a través de un sistema de su familia
 * (Public Access usa Carved from Brindlewood, que es de la familia PbtA).
 * `via` = el sistema hijo por el que entra, si no es directo.
 */
export async function juegosDeSistema(sistemaId: string) {
  const sistemas = new Map((await getAllSystems()).map((s) => [s.id, s]));
  return (await getAllJuegos()).flatMap((j) => {
    if (!j.data.sistema) return [];
    const cadena = linajeSistema(j.data.sistema.id, sistemas);
    if (!cadena.some((s) => s.id === sistemaId)) return [];
    return [{ juego: j, via: cadena[0].id === sistemaId ? undefined : cadena[0] }];
  });
}

/** Sistemas hijos directos de un sistema (los que lo tienen como familia). */
export async function derivadosDeSistema(sistemaId: string) {
  return (await getSistemasRol()).filter((s) => s.data.familia?.id === sistemaId);
}

/** Sistemas del grupo que usan una licencia. */
export async function sistemasDeLicencia(licenciaId: string) {
  return (await getSistemasRol()).filter((s) => s.data.licencia?.id === licenciaId);
}

/**
 * Para qué usa un juego una licencia, en texto: «licencia del juego», «licencia
 * del sistema Trophy», «edición “Manual v0.6.0”», «descarga de …». Vacío = no la usa.
 */
export function usosDeLicencia(f: JuegoResuelto, licenciaId: string) {
  const usos: string[] = [];
  if (f.licenciasJuego.some((l) => l.licencia.id === licenciaId)) usos.push("Licencia del juego");
  if (f.licenciaSistema?.id === licenciaId) usos.push(`Licencia del sistema ${f.sistema?.data.nombreCorto ?? f.sistema?.data.name ?? ""}`.trim());
  for (const e of f.ediciones) {
    if (e.licencia?.id === licenciaId) usos.push(`Edición «${e.nombre}»`);
    else if (e.descarga?.licencia.id === licenciaId) usos.push(`Descarga de «${e.nombre}»`);
  }
  return usos;
}

/** Sistemas del grupo en los que aparece una persona o editorial. */
export async function sistemasDeAutoria(personaId: string) {
  return (await getSistemasRol()).filter((s) => s.data.autoria.some((a) => a.id === personaId));
}
export async function sistemasDeEditorial(editorialId: string) {
  return (await getSistemasRol()).filter((s) => s.data.editorial.some((e) => e.id === editorialId));
}

/** Qué papel tiene una editorial en un juego: original, en castellano, o editorial de alguna edición. */
export function papelesDeEditorial(j: CollectionEntry<"juegos">, editorialId: string) {
  const papeles: string[] = [];
  if (j.data.editorial.some((e) => e.id === editorialId)) papeles.push("Editorial original");
  if (j.data.editorialCastellano.some((e) => e.id === editorialId)) papeles.push("Edición en castellano");
  for (const e of j.data.ediciones)
    if (e.editorial?.id === editorialId && !papeles.includes(`Edición «${e.nombre}»`)) papeles.push(`Edición «${e.nombre}»`);
  return papeles;
}

/** Juegos con una licencia: la del juego o la de su sistema. */
export async function juegosDeLicencia(licenciaId: string) {
  const sistemas = await getSistemasRol();
  const conLicencia = new Set(sistemas.filter((s) => s.data.licencia?.id === licenciaId).map((s) => s.id));
  return (await getAllJuegos()).filter(
    (j) =>
      j.data.licenciaJuego.some((l) => l.licencia.id === licenciaId) ||
      j.data.ediciones.some((e) => e.licencia?.id === licenciaId || e.descarga?.licencia.id === licenciaId) ||
      (j.data.sistema && conLicencia.has(j.data.sistema.id))
  );
}

/** Juegos de una persona autora. */
export async function juegosDePersona(personaId: string) {
  return (await getAllJuegos()).filter((j) => j.data.autoria.some((a) => a.id === personaId));
}

/**
 * Juegos parecidos a uno: mismo sistema, alguna licencia en común (del juego o
 * de su sistema) o alguien de la autoría en común. Cada uno con sus motivos,
 * en texto, y ordenados por número de motivos.
 */
export async function juegosParecidos(juego: CollectionEntry<"juegos">) {
  const sistemas = new Map((await getSistemasRol()).map((s) => [s.id, s]));
  const licencias = new Map((await getAllLicencias()).map((l) => [l.id, l]));
  const autoria = new Map((await getAllAutoria()).map((a) => [a.id, a]));
  const licenciasDe = (j: CollectionEntry<"juegos">) => {
    const ids = new Set(j.data.licenciaJuego.map((l) => l.licencia.id));
    const sis = j.data.sistema ? sistemas.get(j.data.sistema.id) : undefined;
    if (sis?.data.licencia) ids.add(sis.data.licencia.id);
    return ids;
  };
  // «Cerrada» no hace parecidos a dos juegos: solo cuenta lo que se comparte de verdad.
  const propias = [...licenciasDe(juego)].filter((id) => licencias.get(id)?.data.tipo !== "cerrada");
  const otros = (await getAllJuegos()).filter((j) => j.id !== juego.id);
  return otros
    .map((j) => {
      const motivos: string[] = [];
      if (juego.data.sistema && j.data.sistema?.id === juego.data.sistema.id) {
        const s = sistemas.get(juego.data.sistema.id);
        motivos.push(`Mismo sistema${s ? `: ${s.data.nombreCorto ?? s.data.name}` : ""}`);
      }
      const suyas = licenciasDe(j);
      for (const id of propias) {
        if (!suyas.has(id)) continue;
        const l = licencias.get(id);
        const politica = l && (l.data.tipo === "politica-de-uso" || l.data.tipo === "fans");
        motivos.push(`${politica ? "Mismas condiciones de uso" : "Misma licencia"}: ${l?.data.nombreCorto ?? id}`);
      }
      for (const a of juego.data.autoria)
        if (j.data.autoria.some((b) => b.id === a.id)) motivos.push(`Misma autoría: ${autoria.get(a.id)?.data.nombre ?? a.id}`);
      return { juego: j, motivos };
    })
    .filter((p) => p.motivos.length > 0)
    .sort((a, b) => b.motivos.length - a.motivos.length || a.juego.data.titulo.localeCompare(b.juego.data.titulo, "es"));
}

/** Juegos de una editorial (original, en castellano o de alguna edición). */
export async function juegosDeEditorial(editorialId: string) {
  return (await getAllJuegos()).filter(
    (j) =>
      j.data.editorial.some((e) => e.id === editorialId) ||
      j.data.editorialCastellano.some((e) => e.id === editorialId) ||
      j.data.ediciones.some((e) => e.editorial?.id === editorialId)
  );
}

/** Entradas de cronología ordenadas por fecha. */
export async function getAllTimeline() {
  const all = await getCollection("timeline");
  return all.sort((a, b) => a.data.date.localeCompare(b.data.date));
}

/** Guías de la sección MMO, por orden alfabético de profesión. */
export async function getAllGuides() {
  const all = await getCollection("guides");
  return all.sort((a, b) => a.data.profesion.localeCompare(b.data.profesion, "es"));
}

// ─── Crónicas de mesa (Rol, fase 2) ───────────────────────────────────

/** Campañas jugadas por nuestras mesas, sin borradores, por título. */
export async function getAllCampanas() {
  const all = await getCollection("campanas", ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.titulo.localeCompare(b.data.titulo, "es"));
}

/** Mesas (grupos de juego), sin borradores, por nombre. */
export async function getAllMesas() {
  const all = await getCollection("mesas", ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.nombre.localeCompare(b.data.nombre, "es"));
}

/** Campañas de una mesa. */
export async function campanasDeMesa(mesa: string) {
  return (await getAllCampanas()).filter((c) => c.data.mesa.id === mesa);
}

/** Módulos publicados (fichas), sin borradores, por título. */
export async function getAllModulos() {
  const all = await getCollection("modulos", ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.titulo.localeCompare(b.data.titulo, "es"));
}

/** Secciones de un módulo, en orden. Id = «<modulo>/<nn>-<slug>»; ruta = data.slug. */
export async function seccionesDeModulo(modulo: string) {
  const all = await getCollection("seccionesModulo", ({ data }) => data.modulo.id === modulo);
  return all.sort((a, b) => a.data.orden - b.data.orden);
}
