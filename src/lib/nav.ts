export type NavItem = { label: string; href: string };

/** Paso de unas migas de pan (el último es la página actual y no enlaza). */
export type Paso = { texto: string; href?: string };

/** Navegación principal del sitio. El orden da el número de cada sección (01…08). */
export const mainNav: NavItem[] = [
  { label: "Inicio",     href: "/"           },
  { label: "Ediciones",  href: "/ediciones"  },
  { label: "Cronología", href: "/cronologia" },
  { label: "Sistemas",   href: "/sistemas"   },
  { label: "Personas",   href: "/personas"   },
  { label: "Rol",        href: "/rol"        },
  { label: "MMO",        href: "/mmo"        },
  { label: "Fuentes",    href: "/fuentes"    },
];

/**
 * Número de una sección en el índice («02» para /ediciones), para el antetítulo
 * de sus páginas. Así no se desincroniza si cambia el orden del menú.
 */
export function numeroSeccion(href: string) {
  const i = mainNav.findIndex((item) => item.href === href);
  if (i < 0) throw new Error(`numeroSeccion: «${href}» no está en mainNav`);
  return String(i + 1).padStart(2, "0");
}
