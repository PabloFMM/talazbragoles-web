import { getCollection, getEntry, getEntries, type CollectionEntry } from "astro:content";

const porNombre = (a: { data: { name: string } }, b: { data: { name: string } }) =>
  a.data.name.localeCompare(b.data.name, "es");

/** Fuentes ordenadas por fecha (más recientes al final). */
export async function getAllSources() {
  const all = await getCollection("sources");
  return all.sort((a, b) => (a.data.date ?? "").localeCompare(b.data.date ?? ""));
}

/** Ediciones ordenadas cronológicamente. Las de año desconocido van al final. */
export async function getAllEditions() {
  const all = await getCollection("editions");
  return all.sort((a, b) => {
    const ya = a.data.year === "desconocida" ? 9999 : a.data.year;
    const yb = b.data.year === "desconocida" ? 9999 : b.data.year;
    return ya - yb;
  });
}

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
  return {
    juego,
    estado: d.estado ?? "publicado",
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
    // Filtro «Abierta»: mira la licencia del juego Y la del sistema (decisión 6).
    abierto: licenciasJuego.some((l) => esAbierta(l.licencia)) || (licenciaSistema ? esAbierta(licenciaSistema) : false),
    enCastellano: d.editorialCastellano.length > 0 || d.ediciones.some((e) => e.idioma === "es"),
    descargable: descargas.length > 0,
  };
}

/** Juegos con alguna descarga oficial (de una edición o del SRD de su sistema): filtro «Se puede descargar». */
export async function juegosDescargables() {
  const fichas = await Promise.all((await getAllJuegos()).map(resuelveJuego));
  return fichas.filter((f) => f.descargable).map((f) => f.juego);
}

/** Juegos que usan un sistema (directamente). */
export async function juegosDeSistema(sistemaId: string) {
  return (await getAllJuegos()).filter((j) => j.data.sistema?.id === sistemaId);
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

/** Campañas actuales del grupo (sección /rol/), sin borradores, por título. */
export async function getAllCampaigns() {
  const all = await getCollection("campaigns", ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.title.localeCompare(b.data.title, "es"));
}
