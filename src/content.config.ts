import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { buscaPersonas } from "./lib/privacidad.mjs";

// ─── 1. sources — bibliografía / fuentes documentales ─────────────────

const sources = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/sources" }),
  schema: z.object({
    title: z.string(),
    url: z.url(),
    asserts: z.string(),
    caveat: z.string().optional(),
    type: z.enum(["testimonio", "prensa", "documento-oficial", "documento-de-epoca", "web-archivo", "foto", "video", "otro"]),
    date: z.string().optional(),
    accessDate: z.string().optional(),
    broken: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    relatedEditions: z.array(z.string()).default([]),
    relatedPeople: z.array(z.string()).default([]),
  }),
});

// ─── 2. editions — archivo de ediciones / jornadas ────────────────────

const editions = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/editions" }),
  schema: z.object({
    // El id de la entrada (nombre del archivo) ES la ruta: "1997" → /ediciones/1997/,
    // "sin-fecha" → /ediciones/sin-fecha/. Las rutas viejas redirigen (public/_redirects).
    year: z.union([z.number().int().min(1980).max(2099), z.literal("desconocida")]),
    title: z.string(),
    /** Número de la edición: { romano: "VI", entero: 6 }. Sin fuente → se omite. */
    numero: z
      .object({
        romano: z.string().regex(/^[IVXLC]+$/),
        entero: z.number().int().min(1),
        /** true si ningún documento de la edición dice el número (p. ej. se cuenta
         *  hacia atrás desde el «sexto año consecutivo» del folleto de 1997). */
        deducido: z.boolean().default(false),
      })
      .optional(),
    /** ¿El año lo dice un documento de la edición, se deduce o solo se atribuye?
     *  confirmado = lo escribe un documento de la edición (folleto, pin con año);
     *  deducido = se cuenta desde otra fuente; atribuido = el objeto no lleva año y
     *  se toma el que le da la colección de la que procede. Siempre con fuente. */
    anioEstado: z
      .object({
        estado: z.enum(["confirmado", "deducido", "atribuido"]),
        sourceIds: z.array(z.string()).min(1),
        nota: z.string().optional(),
      })
      .optional(),
    verified: z.boolean().default(false),
    status: z.enum(["documentada", "parcial", "pendiente"]).default("pendiente"),
    /** Resumen (bloque 01). Texto libre; vacío = «pendiente». */
    fechas: z.string().optional(),
    horario: z.string().optional(),
    apoyo: z.string().optional(),
    asistencia: z.string().optional(),
    venue: z
      .object({
        name: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
        /** Cómo se llegaba entonces (autobús, tren…). */
        comoLlegar: z.string().optional(),
        /** Qué es hoy el edificio. */
        hoy: z.string().optional(),
      })
      .optional(),
    /** «Organiza» del resumen: una línea. El detalle va en `organizacion`. */
    organizer: z.string().optional(),
    /** Bloque 03: el equipo cambiaba cada año. */
    organizacion: z
      .object({
        equipo: z.array(z.string()).default([]),
        asociacion: z.string().optional(),
        patrocinadores: z.array(z.string()).default([]),
        nota: z.string().optional(),
      })
      .optional(),
    /** Imagen principal (cartel o portada del folleto). Si falta: hueco tipográfico con el año. */
    portada: z
      .object({
        imagen: z.string().startsWith("/"),
        ancho: z.number().int(),
        alto: z.number().int(),
        alt: z.string(),
        /** slug del documento del que sale (enlaza a /ediciones/<año>/<slug>/). */
        documento: z.string().optional(),
      })
      .optional(),
    description: z.string().optional(),
    activities: z
      .array(
        z.object({
          type: z.enum(["partida-rol", "torneo", "charla", "demo", "exposicion", "otro"]),
          name: z.string(),
          description: z.string().optional(),
          gm: z.string().optional(),
          system: z.string().optional(),
        })
      )
      .default([]),
    sourceIds: z.array(z.string()).default([]),
    peopleIds: z.array(z.string()).default([]),
    assets: z
      .object({
        poster: z.string().optional(),
        program: z.string().optional(),
        photos: z.array(z.string()).default([]),
      })
      .optional(),
    /** Documentos de la edición (bloque 05), por apartado: papeles (folletos,
     *  programas, carteles, inscripciones, permisos), objetos (pines y otros
     *  objetos de época), prensa, fotos, recuerdos (testimonios). Un documento con
     *  caras tiene su página /ediciones/<año>/<slug>/ (imagen en public/ +
     *  transcripción literal, [sic]). Un objeto lleva UNA cara: su foto, con la
     *  inscripción en `texto` y el motivo en `nota`. */
    documentos: z
      .array(
        z.object({
          slug: z.string().regex(/^[a-z0-9-]+$/),
          apartado: z.enum(["papeles", "objetos", "prensa", "fotos", "recuerdos"]),
          titulo: z.string(),
          descripcion: z.string().optional(),
          sourceId: z.string(),
          caras: z.array(
            z.object({
              titulo: z.string(),
              imagen: z.string().startsWith("/"),
              ancho: z.number().int(),
              alto: z.number().int(),
              alt: z.string(),
              texto: z.array(z.string()).default([]),
              nota: z.string().optional(),
            })
          ).default([]),
          /** Tabla transcrita del documento (p. ej. la lista de mesas de 1995): se
           *  pinta como tabla accesible en su página, además de la imagen. La primera
           *  columna es la cabecera de cada fila; «—» = celda vacía en el original. */
          tabla: z
            .object({
              titulo: z.string(),
              nota: z.string().optional(),
              columnas: z.array(z.string()).min(2),
              filas: z.array(z.array(z.string())).min(1),
            })
            .refine((t) => t.filas.every((f) => f.length === t.columnas.length), "Cada fila de la tabla debe tener tantas celdas como columnas")
            .optional(),
        })
      )
      .default([])
      .refine((ds) => new Set(ds.map((d) => d.slug)).size === ds.length, "Dos documentos con el mismo slug"),
  }),
});

// ─── 3. people — organizadores, autores, figuras de comunidad ─────────

const people = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/people" }),
  schema: z.object({
    name: z.string(),
    roles: z
      .array(
        z.enum([
          "organizador",
          "autor",
          "disenador",
          "ilustrador",
          "jugador",
          "periodista",
          "otro",
        ])
      )
      .default([]),
    active: z
      .object({
        from: z.number().int().optional(),
        to: z.number().int().optional(),
      })
      .optional(),
    links: z
      .array(z.object({ label: z.string(), url: z.url() }))
      .default([]),
    editionIds: z.array(z.string()).default([]),
    sourceIds: z.array(z.string()).default([]),
    verified: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// ─── Piezas comunes de la sección Rol (fase 1, 2026-11-23) ───────────
// Regla documental hecha código: cada dato rellenado de una ficha de Rol
// necesita al menos una fuente cuyo `datos` lo nombre. Sin fuente → campo
// vacío → la página pinta «pendiente». Ver docs/rol/CONTEXTO-TARJETAS.md.

/** YAML lee «2026-11-23» como Date: se normaliza a texto AAAA-MM-DD. */
const fechaTexto = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

/** Una fuente por dato: dónde se comprobó, qué afirma y cuándo se consultó. */
const fuenteDato = z.object({
  datos: z.array(z.string()).min(1), // campos que respalda («ano», «autoria», «licenciaJuego»…)
  url: z.url(),
  afirma: z.string(), // en castellano, lo que dice la página (sin interpretar)
  consultado: fechaTexto,
  secundaria: z.boolean().default(false), // Wikipedia, prensa, reseñas: no es la editorial ni el autor
});

type FuenteDato = z.infer<typeof fuenteDato>;

/** Comprueba que cada campo con valor tiene una fuente que lo respalda. */
function exigeFuentes<T extends { fuentes: FuenteDato[] }>(campos: (keyof T & string)[]) {
  return (data: T, ctx: z.RefinementCtx) => {
    const cubiertos = new Set(data.fuentes.flatMap((f) => f.datos));
    for (const campo of campos) {
      const v = data[campo] as unknown;
      const vacio =
        v === undefined || v === null || v === "" ||
        (Array.isArray(v) && v.length === 0) ||
        (typeof v === "object" && !Array.isArray(v) && Object.keys(v as object).length === 0);
      if (!vacio && !cubiertos.has(campo)) {
        ctx.addIssue({ code: "custom", path: [campo], message: `«${campo}» tiene valor pero ninguna fuente lo respalda (fuentes[].datos)` });
      }
    }
  };
}

const generoRol = z.enum([
  "fantasia",
  "ciencia-ficcion",
  "terror",
  "misterio",
  "historico",
  "contemporaneo",
  "universal",
  "otro",
]);

const enlace = z.object({ etiqueta: z.string(), url: z.url() });

/**
 * Una edición de un juego (dato de primera clase, 2026-11-23): cada una con su
 * editorial, idioma, licencia y fuentes propias. Las traducciones son entradas
 * aparte que dicen de qué edición vienen (`traduccionDe` = `nombre` de otra
 * entrada del mismo juego; lo comprueba tests/rol-referencias.test.mjs).
 */
const edicionJuego = z
  .object({
    nombre: z.string(), // «7.ª edición», «Manual v0.6.0»
    ano: z.number().int().optional(),
    editorial: reference("editoriales").optional(),
    idioma: z.enum(["en", "es"]).default("en"),
    traduccionDe: z.string().optional(),
    licencia: reference("licencias").optional(), // puede cambiar de una edición a otra
    // Dato del grupo (la jugamos), sin fuente web. Se marca en la edición
    // original salvo que conste el idioma del ejemplar.
    jugadaPorNosotros: z.boolean().default(false),
    // Solo si la licencia de ESTA edición lo permite (abierta o gratuita
    // oficial). Siempre la descarga oficial: no alojamos archivos.
    descarga: z
      .object({ url: z.url(), formato: z.string(), licencia: reference("licencias") })
      .optional(),
    fuentes: z.array(fuenteDato).min(1),
  })
  .superRefine(exigeFuentes(["ano", "editorial", "traduccionDe", "licencia", "descarga"]));

// ─── 4. systems — sistemas de juego de rol ────────────────────────────
// Colección ÚNICA (decisión 2026-11-23): `jugadoEn` dice si es de las Jornadas
// (se ve en /sistemas/, Archivo) o del grupo actual (se ve en /rol/sistemas/).
// Los campos en inglés son los de las Jornadas; los de Rol, en castellano.

const systems = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/systems" }),
  schema: z.object({
    name: z.string(),
    // Dónde se jugó. Sin valor = Jornadas (lo que había antes de la sección Rol).
    jugadoEn: z.array(z.enum(["jornadas", "grupo"])).default(["jornadas"]),
    nombreCorto: z.string().optional(), // «PbtA», «BRP»
    familia: reference("systems").optional(), // sistema padre (Carved from Brindlewood → PbtA)
    origen: z.string().optional(), // juego del que sale el sistema, en texto
    ano: z.number().int().optional(),
    autoria: z.array(reference("autoria")).default([]),
    editorial: z.array(reference("editoriales")).default([]),
    licencia: reference("licencias").optional(), // licencia del sistema (SRD o motor)
    srd: z.object({ nombre: z.string(), url: z.url(), alcance: z.string().optional() }).optional(),
    enlaces: z.array(enlace).default([]),
    dudas: z.array(z.string()).default([]),
    fuentes: z.array(fuenteDato).default([]),
    publisher: z.string().optional(),
    year: z.number().int().optional(),
    country: z.string().optional(),
    genre: z.array(generoRol).default([]),
    editions: z
      .array(
        z.object({
          name: z.string(),
          year: z.number().int().optional(),
          language: z.string().optional(),
          publisher: z.string().optional(),
        })
      )
      .default([]),
    playedAtEditionIds: z.array(z.string()).default([]),
    sourceIds: z.array(z.string()).default([]),
    links: z
      .array(z.object({ label: z.string(), url: z.url() }))
      .default([]),
    draft: z.boolean().default(false),
  }).superRefine(exigeFuentes(["nombreCorto", "familia", "origen", "ano", "autoria", "editorial", "licencia", "srd"])),
});

// ─── 4 bis. juegos — fichas de juegos de rol del grupo (sección /rol/) ──
// Un .md por juego; el cuerpo son 2-4 frases propias de qué es el juego.
// «Licencia del juego» va aparte de la del sistema (la del sistema está en systems).

const juegos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/juegos" }),
  schema: ({ image }) => z.object({
    titulo: z.string(),
    tituloCastellano: z.string().optional(),
    // Vacío = publicado. «en-construccion»: el juego aún se está escribiendo.
    estado: z.enum(["publicado", "en-construccion"]).optional(),
    // Edición que juega el grupo, en texto, SOLO cuando no se puede marcar una
    // entrada de `ediciones[]` (p. ej. «5.ª edición» sin saber si 2014 o 2024).
    // Dato del grupo: sin fuente web. Si no, se deriva de `jugadaPorNosotros`.
    edicion: z.string().optional(),
    ano: z.number().int().optional(), // primera publicación
    ediciones: z.array(edicionJuego).default([]),
    autoria: z.array(reference("autoria")).default([]),
    editorial: z.array(reference("editoriales")).default([]),
    editorialCastellano: z.array(reference("editoriales")).default([]),
    sistema: reference("systems").optional(),
    licenciaJuego: z
      .array(z.object({ licencia: reference("licencias"), alcance: z.string().optional() }))
      .default([]),
    generos: z.array(generoRol).default([]),
    modo: z.array(z.enum(["con-dj", "sin-dj", "solitario"])).default([]),
    formato: z.array(z.enum(["una-sesion", "campana"])).default([]),
    jugadores: z
      .object({ min: z.number().int(), max: z.number().int(), nota: z.string().optional() })
      .optional(),
    // Que lo jugamos es dato del grupo: no lleva fuente web.
    jugado: z.object({ nosotros: z.boolean().default(false), ultima: fechaTexto.optional() }).default({ nosotros: false }),
    // Portada (decisión 2026-11-23, Rol 5): la OFICIAL, sacada de la web de la
    // editorial o del autor, guardada en src/assets/rol/portadas/ y procesada con
    // astro:assets. Sin portada oficial → hueco tipográfico (PortadaTipografica).
    // La url de donde sale la imagen va en `fuentes[]` con «portada» en `datos`
    // (lo exige exigeFuentes y la usa el crédito como enlace).
    portada: z
      .object({
        archivo: image(), // ruta relativa al .md: "../../assets/rol/portadas/<slug>.jpg"
        titulo: z.string().optional(), // título impreso en la portada, si no es `titulo` («Manual del Guardián»)
        edicion: z.string(), // edición de esa portada, para el alt: «7.ª edición en castellano»
        credito: z.string(), // quién la publica (editorial o autor), corto: es el texto del enlace
        ilustracion: z.string().optional(), // solo si la web oficial acredita la ilustración
        permiso: z.enum(["oficial-sin-lucro", "cita", "licencia", "permiso-editor", "foto-propia"]),
      })
      .optional(),
    enlaces: z.array(enlace).default([]), // web oficial, SRD, compra en la editorial
    dudas: z.array(z.string()).default([]), // preguntas abiertas: se pintan como «pendiente»
    fuentes: z.array(fuenteDato).default([]),
    draft: z.boolean().default(false),
  }).superRefine(
    exigeFuentes([
      "tituloCastellano", "estado", "ano", "autoria", "editorial", "editorialCastellano",
      "sistema", "licenciaJuego", "generos", "modo", "formato", "jugadores", "portada",
    ])
  ),
});

// ─── 4 ter. licencias — qué permite cada licencia, en castellano llano ──

const licencias = defineCollection({
  // El id es el nombre del archivo tal cual: el id por defecto quita los puntos
  // («cc-by-3.0» → «cc-by-30») y las referencias de juegos y sistemas no casarían.
  loader: glob({ pattern: "**/*.md", base: "./src/content/licencias", generateId: ({ entry }) => entry.replace(/\.md$/, "") }),
  schema: z.object({
    nombre: z.string(),
    nombreCorto: z.string(),
    // cc / orc / abierta-propia / dominio-publico = abierta. politica-de-uso: deja
    // publicar juegos inspirados sin ser una licencia. con-aprobacion: licencia
    // para terceros que la editorial aprueba caso a caso. fans: solo material no
    // comercial. cerrada.
    tipo: z.enum(["cc", "orc", "abierta-propia", "dominio-publico", "politica-de-uso", "con-aprobacion", "fans", "cerrada"]),
    url: z.url().optional(), // texto oficial
    permite: z
      .object({
        comercial: z.boolean().optional(),
        adaptar: z.boolean().optional(),
        atribucion: z.boolean().optional(), // exige citar la autoría
        compartirIgual: z.boolean().optional(), // las obras derivadas, con la misma licencia
      })
      .default({}),
    fuentes: z.array(fuenteDato).default([]),
  }).superRefine(exigeFuentes(["url", "permite"])),
});

// ─── 4 quater. autoria — personas que diseñan o escriben juegos de rol ──
// Distinta de «people» (personas de las Jornadas).

const autoria = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/autoria" }),
  schema: z.object({
    nombre: z.string(),
    web: z.url().optional(),
    fuentes: z.array(fuenteDato).default([]),
  }).superRefine(exigeFuentes(["web"])),
});

// ─── 4 quinquies. editoriales — originales y en castellano ─────────────

const editoriales = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/editoriales" }),
  schema: z.object({
    nombre: z.string(),
    web: z.url().optional(),
    fuentes: z.array(fuenteDato).default([]),
  }).superRefine(exigeFuentes(["web"])),
});

// ─── 5. timeline — eventos cronológicos ───────────────────────────────

const timeline = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/timeline" }),
  schema: z.object({
    date: z.string(),
    precision: z.enum(["year", "month", "day"]).default("year"),
    title: z.string(),
    description: z.string().optional(),
    category: z
      .enum(["edicion", "prensa", "fundacion", "comunidad", "sistema", "otra"])
      .default("otra"),
    sourceIds: z.array(z.string()).default([]),
    verified: z.boolean().default(false),
    relatedEditionId: z.string().optional(),
    relatedPersonId: z.string().optional(),
    relatedSystemId: z.string().optional(),
  }),
});

// ─── 6. guides — guías de juego (sección MMO) ─────────────────────────
// Redactadas a partir de páginas públicas; cada dato cita su fuente en el texto.
// Origen y reglas: docs/guias/_REGLAS.md del proyecto.

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    profesion: z.string(),
    slug: z.string(),
    tipo: z.string(),
    // YAML lee «2026-11-14» como fecha: se normaliza a texto AAAA-MM-DD.
    comprobado: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v)),
    juego: z.string().default("wow-forever"),
  }),
});

// ─── 7. Crónicas de mesa (sección /rol/, fase 2, 2026-11-24) ──────────
// Sustituyen a la antigua colección `campaigns` (JSON vacío con `gm` y `player`).
// Decisiones en proyecto/docs/rol/cronicas/CONTEXTO.md y CONTEXTO-TARJETAS.md.
//
// PRIVACIDAD: en `campanas` y `mesas` los jugadores salen SOLO con su personaje y
// quien dirige, como «DJ». Los objetos son `.strict()` (un campo que no esté aquí,
// como `jugador` o `gm`, rompe el build) y `sinPersonas` rechaza claves de persona
// y nombres reales en cualquier texto (src/lib/privacidad.mjs; lo repite
// tests/rol-sin-nombres.test.mjs). La única persona real que se nombra es la
// autoría del módulo base, en `modulos` (decisión 52).

/** superRefine: ninguna clave de persona ni nombre real en el objeto. */
function sinPersonas(data: unknown, ctx: z.RefinementCtx) {
  for (const problema of buscaPersonas(data)) ctx.addIssue({ code: "custom", message: problema });
}

/** Licencia del módulo base (decisión 11): CC0 1.0. Id de `licencias`. */
const licenciaModulo = z.literal("cc0-1.0");
/** Licencia de lo propio de una campaña (decisión 6): CC BY 4.0, atribución a Talazbrágoles. */
const licenciaCampana = z.literal("cc-by-4.0");
/** Autoría del módulo base (decisión 52): la única persona real nombrada en la fase 2. */
const autoriaModulo = z.string().min(1);

/** Ficha de un módulo publicado (`src/content/modulos/<slug>.md`). Cuerpo: «Cómo usar este módulo». */
const modulos = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/modulos" }),
  schema: z.object({
    titulo: z.string(),
    juego: reference("juegos"),
    tipo: z.string(), // «Módulo para el juego de rol Numinia»
    licencia: licenciaModulo,
    autoria: autoriaModulo,
    dificultad: z.string().optional(),
    duracion: z.string().optional(),
    jugadores: z.string().optional(),
    ambito: z.string().optional(),
    conflicto: z.string().optional(), // Conflicto de Partida (plantilla de aventura de Numinia)
    resumen: z.string(),
    /** La aventura de nuestra mesa que sale de este módulo (ejemplo, no respuesta). */
    campana: reference("campanas").optional(),
    draft: z.boolean().default(false),
  }).strict(),
});

/**
 * Secciones del módulo (`src/content/modulos/<modulo>/<nn>-<slug>.md`), una por página.
 * Cuerpo en Markdown LIMPIO: sin comentarios `<!-- -->`, sin «Decisiones de
 * redacción», sin nombres de PJ de nuestra mesa; lo que falta, «(pendiente: …)»
 * (rehype-guias lo pinta como «pendiente»). Imágenes: Markdown con ruta relativa a
 * src/assets/rol/navegantes/ y el pie en cursiva en la línea siguiente.
 * Las versiones anotadas (con fuentes) están en proyecto/material/<modulo>/modulo/.
 */
const seccionesModulo = defineCollection({
  loader: glob({
    pattern: "*/*.md",
    base: "./src/content/modulos",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""), // «los-navegantes-del-sueno/01-raiz»
  }),
  schema: z.object({
    modulo: reference("modulos"),
    orden: z.number().int().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/), // ruta: /rol/modulos/<modulo>/<slug>/
    titulo: z.string(),
    licencia: licenciaModulo,
    autoria: autoriaModulo,
    resumen: z.string(),
  }).strict(),
});

/** Mesa de juego (`src/content/mesas/<slug>.md`): un grupo con una o varias campañas. Cuerpo: quiénes somos, sin nombres. */
const mesas = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/mesas" }),
  schema: z.object({
    nombre: z.string(),
    resumen: z.string(),
    /** Dónde se juega: en línea, en persona o las dos. */
    lugar: z.enum(["en-linea", "presencial", "mixta"]),
    /** Herramientas de juego en línea (Roll20, Discord…). */
    herramientas: z.array(z.string()).default([]),
    /** Quién dirige: siempre la misma persona o va rotando según el juego. Sin nombres. */
    direccion: z.enum(["fija", "rotatoria"]),
    draft: z.boolean().default(false),
  }).strict().superRefine(sinPersonas),
});

/** Ficha «Registro del Tesaurum Verba» (decisión 39): aportación de la mesa al mundo de Numinia. */
const aportacion = z.object({
  nombre: z.string(),
  tipo: z.string(), // «protocolo», «lugar del sueño», «reliquia», «palabra clave»…
  /** aportacion → consolidada (verdad en la aventura) → inscrita (en el Corpus
   *  Numiniense, en una versión del manual); prevista = entrará, aún no está. */
  grado: z.enum(["aportacion", "consolidada", "inscrita", "prevista"]),
  personaje: z.string().optional(), // personaje del reparto que la propuso; vacío = pendiente
  jornada: z.number().int().min(1).optional(), // vacío = pendiente
  minuto: z.string().optional(), // minuto del audio (cuando se enlacen los audios)
  comoSeConsolido: z.string(),
  /** Versión y capítulo del manual donde entró (obligatorio si está inscrita). */
  manual: z.object({ version: z.string(), capitulo: z.string() }).strict().optional(),
  queCambio: z.string().optional(),
  pendiente: z.string().optional(), // lo que falta confirmar (p. ej. con los audios)
}).strict().superRefine((a, ctx) => {
  if (a.grado === "inscrita" && !a.manual) {
    ctx.addIssue({ code: "custom", path: ["manual"], message: "Una aportación inscrita dice en qué versión y capítulo del manual entró" });
  }
});

/** Campaña o aventura jugada por una mesa (`src/content/campanas/<slug>.md`). Cuerpo: «La verdad de nuestra mesa». */
const campanas = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/campanas" }),
  schema: ({ image }) => z.object({
    titulo: z.string(),
    juego: reference("juegos"),
    mesa: reference("mesas"),
    /** Módulo base del que sale (si se ha publicado). */
    modulo: reference("modulos").optional(),
    estado: z.enum(["en-curso", "en-pausa", "terminada", "pendiente"]),
    estadoNota: z.string().optional(), // p. ej. «deducido de las fechas»
    fechas: z.object({ inicio: z.string().optional(), fin: z.string().optional(), nota: z.string().optional() }).strict().optional(),
    numeroJornadas: z.object({ n: z.number().int().min(1), aproximado: z.boolean().default(false) }).strict().optional(),
    versionManual: z.string().optional(), // edición del juego con la que se jugó
    licencia: licenciaCampana,
    atribucion: z.string(), // «Talazbrágoles»
    /** Quien dirige sale siempre como «DJ» (decisión 1). */
    direccion: z.literal("DJ"),
    /** Aviso de destripe: la aventura desvela el módulo base. */
    aviso: z.string().optional(),
    resumen: z.string(),
    reparto: z.array(
      z.object({
        personaje: z.string(),
        posicion: z.string().optional(), // Posición del manual (Oniromante, Armonauta…)
        especie: z.string().optional(),
        concepto: z.string().optional(),
        escena: z.number().int().min(1).optional(), // escena de la Fase de Presentación
        nota: z.string().optional(),
        /** Retrato del personaje (imagen aportada por el DJ), en `src/assets/rol/<campaña>-aventura/`. */
        retrato: z.object({ archivo: image(), alt: z.string().min(20) }).strict().optional(),
      }).strict()
    ).default([]),
    jornadas: z.array(
      z.object({
        n: z.number().int().min(1),
        titulo: z.string().optional(), // título del episodio del podcast o del guion de la jornada, si lo hay
        quePaso: z.string().optional(), // vacío = «pendiente»
        /** documentado = lo cuenta un resumen de la jornada; deducido = se infiere
         *  de otros textos (se dice de cuáles en `quePaso`); pendiente = sin texto aún. */
        estado: z.enum(["documentado", "deducido", "pendiente"]),
        /** Imágenes de PNJ y criaturas en la jornada en que aparecen por primera vez (decisión 60). */
        imagenes: z.array(z.object({ archivo: image(), alt: z.string().min(20), pie: z.string() }).strict()).default([]),
      }).strict()
    ).default([]),
    aportaciones: z.array(aportacion).default([]),
    draft: z.boolean().default(false),
  }).strict().superRefine(sinPersonas).superRefine((c, ctx) => {
    const ns = c.jornadas.map((j) => j.n);
    if (new Set(ns).size !== ns.length) ctx.addIssue({ code: "custom", path: ["jornadas"], message: "Dos jornadas con el mismo número" });
    const pj = new Set(c.reparto.map((r) => r.personaje));
    c.aportaciones.forEach((a, i) => {
      if (a.personaje && !pj.has(a.personaje)) ctx.addIssue({ code: "custom", path: ["aportaciones", i, "personaje"], message: `«${a.personaje}» no está en el reparto` });
    });
  }),
});

export const collections = {
  sources, editions, people, systems, timeline, guides,
  juegos, licencias, autoria, editoriales,
  modulos, seccionesModulo, mesas, campanas,
};
