/** Rutas de las páginas de la sección Rol (un solo sitio para no repetirlas). */
export const hrefJuego = (id: string) => `/rol/juegos/${id}`;
export const hrefSistema = (id: string) => `/rol/sistemas/${id}`;
// Con barra final: los ids de licencia llevan puntos («cc-by-3.0») y sin ella
// algún servidor podría tomar «.0» por una extensión de archivo.
export const hrefLicencia = (id: string) => `/rol/licencias/${id}/`;
export const hrefAutoria = (id: string) => `/rol/autoria/${id}`;
export const hrefEditorial = (id: string) => `/rol/editoriales/${id}`;
