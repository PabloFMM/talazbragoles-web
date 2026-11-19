import { dosCifras } from "./formato";

export type NavItem = { label: string; href: string };

/** Paso de unas migas de pan (el último es la página actual y no enlaza). */
export type Paso = { texto: string; href?: string };

/** Grupo del índice. Sin título: la entrada va suelta (Inicio). */
export type GrupoNav = { id: string; titulo?: string; items: NavItem[] };

/**
 * Índice del sitio en grupos (2026-11-17): lo histórico (Archivo de las Jornadas)
 * separado de lo que el grupo hace hoy (Comunidad). Sin desplegables: los grupos
 * son solo rótulos encima de sus enlaces.
 *
 * OJO: proyecto/tools/build-asesor.py lee este archivo con expresiones regulares
 * para pintar la misma cabecera en el asesor. Mantener el formato: una entrada
 * por línea `{ label: "…", href: "…" }` y cada grupo con `id: "…"` (y `titulo: "…"`).
 */
export const gruposNav: GrupoNav[] = [
  { id: "portada", items: [
    { label: "Inicio",     href: "/"           },
  ] },
  { id: "archivo", titulo: "Archivo", items: [
    { label: "Ediciones",  href: "/ediciones"  },
    { label: "Cronología", href: "/cronologia" },
    { label: "Sistemas",   href: "/sistemas"   },
    { label: "Personas",   href: "/personas"   },
    { label: "Fuentes",    href: "/fuentes"    },
  ] },
  { id: "comunidad", titulo: "Comunidad", items: [
    { label: "Rol",        href: "/rol"        },
    { label: "MMO",        href: "/mmo"        },
  ] },
];

/** Navegación principal del sitio, en orden. El orden da el número de cada sección (01…08). */
export const mainNav: NavItem[] = gruposNav.flatMap((g) => g.items);

/**
 * Número de una sección en el índice («02» para /ediciones), para el antetítulo
 * de sus páginas. Así no se desincroniza si cambia el orden del menú.
 */
export function numeroSeccion(href: string) {
  const i = mainNav.findIndex((item) => item.href === href);
  if (i < 0) throw new Error(`numeroSeccion: «${href}» no está en mainNav`);
  return dosCifras(i + 1);
}

/**
 * Relación de una ruta con una entrada del índice (sin JS: se calcula en el build).
 * - "page": la entrada ES la página actual.
 * - "true": la página está dentro de esa sección (subpágina). Así lo hace GOV.UK
 *   (service navigation): decir «página actual» en una subpágina sería falso.
 * - undefined: nada que ver.
 */
export function actualDe(ruta: string, href: string): "page" | "true" | undefined {
  const r = ruta.replace(/\/+$/, "") || "/";
  const h = href.replace(/\/+$/, "") || "/";
  if (r === h) return "page";
  if (h !== "/" && r.startsWith(h + "/")) return "true";
  return undefined;
}

/** Entrada del índice que contiene la ruta (para el «Estás en» del menú móvil). */
export function seccionDe(ruta: string): NavItem | undefined {
  return mainNav.find((item) => actualDe(ruta, item.href));
}
