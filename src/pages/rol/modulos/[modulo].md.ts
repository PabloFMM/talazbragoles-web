/**
 * /rol/modulos/<modulo>.md: el módulo entero en un solo Markdown (Rol 7/8, 2026-11-24).
 * Para personas y agentes: cabecera con licencia CC0 y autoría, ficha, «Cómo usar
 * este módulo», índice y las secciones limpias en orden (las mismas de las páginas;
 * sin comentarios internos: los vigila tests/rol-cronicas.test.mjs). Las imágenes
 * apuntan a su copia publicada (JPEG de 1200 px) con URL absoluta. Los
 * «(pendiente: …)» se dejan como texto: así se leen también fuera de la web.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { getEntry } from "astro:content";
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import { getAllModulos, seccionesDeModulo } from "../../../lib/collections";
import { dosCifras } from "../../../lib/formato";
import { hrefLicencia, hrefModulo, hrefSeccionModulo, hrefCampana } from "../../../lib/rol-rutas";

const SITIO = "https://www.talazbragoles.com";
const imagenes = import.meta.glob<ImageMetadata>("/src/assets/rol/**/*.{jpg,jpeg,png,webp}", { eager: true, import: "default" });

export const getStaticPaths = (async () => {
  const modulos = await getAllModulos();
  return modulos.map((m) => ({ params: { modulo: m.id }, props: { modulo: m } }));
}) satisfies GetStaticPaths;

/** `](../../../assets/rol/x/y.jpg)` → `](https://www.talazbragoles.com/_astro/y.<hash>.jpg)` */
async function enlazaImagenes(md: string) {
  const rutas = [...new Set([...md.matchAll(/\]\(((?:\.\.\/)+assets\/[^)\s]+)\)/g)].map((m) => m[1]))];
  for (const ruta of rutas) {
    const clave = "/src/" + ruta.replace(/^(?:\.\.\/)+/, "");
    const meta = imagenes[clave];
    if (!meta) throw new Error(`Imagen del módulo sin encontrar: ${ruta}`);
    const img = await getImage({ src: meta, format: "jpg", width: Math.min(1200, meta.width), quality: 70 });
    md = md.replaceAll(`](${ruta})`, `](${SITIO}${img.src})`);
  }
  return md;
}

export const GET: APIRoute = async ({ props }) => {
  const { modulo } = props as { modulo: Awaited<ReturnType<typeof getAllModulos>>[number] };
  const d = modulo.data;
  const secciones = await seccionesDeModulo(modulo.id);
  const licencia = await getEntry("licencias", d.licencia);
  const juego = await getEntry(d.juego);
  const campana = d.campana ? await getEntry(d.campana) : undefined;
  const url = SITIO + hrefModulo(modulo.id);

  const ficha = [
    ["Juego", juego?.data.titulo],
    ["Autoría", d.autoria],
    ["Licencia", licencia ? `${licencia.data.nombre} (${licencia.data.url ?? SITIO + hrefLicencia(licencia.id)})` : d.licencia],
    ["Dificultad", d.dificultad],
    ["Duración", d.duracion],
    ["Jugadores", d.jugadores],
    ["Dónde transcurre", d.ambito],
  ].map(([k, v]) => `- **${k}:** ${v ?? "(pendiente)"}`);

  const partes = [
    `# ${d.titulo}`,
    `*${d.tipo}.* De ${d.autoria}.`,
    [
      `> **Licencia: ${licencia?.data.nombre ?? d.licencia}.** ${licencia?.body?.trim() ?? ""}`,
      `> Texto de la licencia: ${licencia?.data.url ?? SITIO + hrefLicencia(d.licencia)}`,
      `>`,
      `> Publicado en ${url} (versión web, con índice por secciones).`,
    ].join("\n"),
    d.resumen,
    `## Ficha\n\n${ficha.join("\n")}`,
    d.conflicto ? `## Conflicto de Partida\n\n${d.conflicto}` : "",
    `## Cómo usar este módulo\n\n${(modulo.body ?? "").trim()}` +
      (campana ? `\n\nEjemplo (desvela el misterio): ${SITIO}${hrefCampana(campana.id)}` : ""),
    `## Índice\n\n${secciones.map((s) => `${s.data.orden}. ${s.data.titulo}: ${SITIO}${hrefSeccionModulo(modulo.id, s.data.slug)}`).join("\n")}`,
  ];
  for (const s of secciones) {
    partes.push(`---\n\n# ${dosCifras(s.data.orden)}. ${s.data.titulo}\n\n${await enlazaImagenes((s.body ?? "").trim())}`);
  }
  const texto = partes.filter(Boolean).join("\n\n") + "\n";
  return new Response(texto, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};
