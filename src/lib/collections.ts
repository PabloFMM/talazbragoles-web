import { getCollection } from "astro:content";

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

/** Ediciones con al menos un dato verificado. */
export async function getVerifiedEditions() {
  const all = await getAllEditions();
  return all.filter((e) => e.data.verified || e.data.status !== "pendiente");
}

/** Personas publicadas (no draft). */
export async function getAllPeople() {
  return getCollection("people", ({ data }) => !data.draft);
}

/** Sistemas publicados (no draft). */
export async function getAllSystems() {
  return getCollection("systems", ({ data }) => !data.draft);
}

/** Entradas de cronología ordenadas por fecha. */
export async function getAllTimeline() {
  const all = await getCollection("timeline");
  return all.sort((a, b) => a.data.date.localeCompare(b.data.date));
}
