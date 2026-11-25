/**
 * Láminas destacadas en la portada de cada módulo (Rol 9, 2026-11-25).
 * El DJ pidió que la parte gráfica se viera: en las secciones las imágenes quedan
 * muy abajo (la Orphika y Lazarus, a más de 10 000 px), así que la portada las
 * reúne y enlaza cada una a tamaño completo (los rótulos de los mapas no se leen
 * a 46rem) y a la sección donde se usa.
 * Imágenes del DJ, hechas con IA, CC0 (decisión 28). Nombres en castellano (decisión 30).
 */
import type { ImageMetadata } from "astro";
import mapaNuminia from "../assets/rol/navegantes/04-mapa-numinia-distritos.jpg";
import orphika from "../assets/rol/navegantes/01-orphika-plano.jpg";
import lazarus from "../assets/rol/navegantes/02-isla-lazarus-mapa.jpg";
import vortice from "../assets/rol/navegantes/07-ouroboros-vortice-de-los-suenos.jpg";
import barrioViejo from "../assets/rol/navegantes/06-ouroboros-barrio-viejo.jpg";

export interface Lamina {
  imagen: ImageMetadata;
  titulo: string;
  alt: string;
  pie: string;
  /** slug de la sección del módulo donde se usa */
  seccion: string;
}

const laminas: Record<string, Lamina[]> = {
  "los-navegantes-del-sueno": [
    {
      imagen: mapaNuminia,
      titulo: "Mapa de Numinia",
      alt: "Esquema ilustrado de Numinia: cuatro distritos alrededor de una plaza central, con sus lugares rotulados.",
      pie: "Los cuatro distritos alrededor del Ágora. La aventura transcurre casi entera en Ouroboros. Algunos rótulos están en inglés: «Taberna Hyperborean» es la Taberna Hiperbórea y «Agora Plaza», el Ágora.",
      seccion: "investigacion",
    },
    {
      imagen: barrioViejo,
      titulo: "Ouroboros: el Barrio Viejo",
      alt: "Calle de mercado vista desde lo alto, de noche; en un arco, una figura espectral violeta.",
      pie: "El sustrato más popular de Ouroboros: calles estrechas, plazas y viejos establecimientos; uno de los focos de actividad clandestina de la ciudad.",
      seccion: "investigacion",
    },
    {
      imagen: vortice,
      titulo: "Ouroboros: el Vórtice de los Sueños",
      alt: "Figuras encapuchadas en círculo alrededor de un fuego, bajo un arco con una serpiente azul luminosa.",
      pie: "Espacio interior del Templo de Khepri dedicado a la oniromancia, entre hogueras, vapores psicotrópicos y murmullos.",
      seccion: "investigacion",
    },
    {
      imagen: orphika,
      titulo: "Plano de la Orphika",
      alt: "Plano ilustrado de una goleta de tres palos: alzado, cubiertas y sección, con rótulos.",
      pie: "La goleta oniromántica de tres palos; el camarote del capitán fue de Aurelian Thalos.",
      seccion: "reflexion-y-accion",
    },
    {
      imagen: lazarus,
      titulo: "Mapa de la isla de Lazarus",
      alt: "Mapa ilustrado de una isla con una torre, una pirámide escalonada en el centro, una playa, un bosque, acantilados y la entrada de una gruta; a la derecha, un recuadro de presencias.",
      pie: "Mapa parcial. Ojo: el recuadro de presencias recoge lecturas de la mesa original, no hechos del módulo; el DJ decide cuándo enseñarlo.",
      seccion: "reflexion-y-accion",
    },
  ],
};

export const laminasDeModulo = (modulo: string): Lamina[] => laminas[modulo] ?? [];
