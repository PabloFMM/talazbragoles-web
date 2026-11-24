/** Rutas de las páginas de la sección Rol (un solo sitio para no repetirlas). */
export const hrefJuego = (id: string) => `/rol/juegos/${id}`;
export const hrefSistema = (id: string) => `/rol/sistemas/${id}`;
// Con barra final: los ids de licencia llevan puntos («cc-by-3.0») y sin ella
// algún servidor podría tomar «.0» por una extensión de archivo.
export const hrefLicencia = (id: string) => `/rol/licencias/${id}/`;
export const hrefAutoria = (id: string) => `/rol/autoria/${id}`;
export const hrefEditorial = (id: string) => `/rol/editoriales/${id}`;
// Crónicas de mesa (Rol 7/8, 2026-11-24). Con barra final, como el resto de páginas nuevas.
export const hrefModulo = (id: string) => `/rol/modulos/${id}/`;
export const hrefSeccionModulo = (modulo: string, seccion: string) => `/rol/modulos/${modulo}/${seccion}/`;
/** El módulo entero en Markdown (CC0), generado por pages/rol/modulos/[modulo].md.ts. */
export const hrefModuloMd = (id: string) => `/rol/modulos/${id}.md`;
export const hrefCampana = (id: string) => `/rol/campanas/${id}/`;
export const hrefMesa = (id: string) => `/rol/mesas/${id}/`;
/** Ancla de una aportación dentro de la página de su campaña. */
export const anclaAportacion = (nombre: string) =>
  "aportacion-" + nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
