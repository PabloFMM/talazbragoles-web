export type NavItem = { label: string; href: string };

/** Navegación principal del sitio. */
export const mainNav: NavItem[] = [
  { label: "Inicio",     href: "/"           },
  { label: "Ediciones",  href: "/ediciones"  },
  { label: "Cronología", href: "/cronologia" },
  { label: "Sistemas",   href: "/sistemas"   },
  { label: "Personas",   href: "/personas"   },
  { label: "Fuentes",    href: "/fuentes"    },
];

/** Navegación de la home (anclas internas). */
export const homeNav: NavItem[] = [
  { label: "Inicio",          href: "/#top"       },
  { label: "Historia",        href: "/#historia"  },
  { label: "Ediciones",       href: "/#ediciones" },
  { label: "Recuerdos",       href: "/#red"       },
  { label: "Fuentes",         href: "/fuentes"    },
  { label: "El Legado",       href: "/#legado"    },
];
