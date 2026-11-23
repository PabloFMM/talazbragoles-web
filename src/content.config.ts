import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// ─── 1. sources — bibliografía / fuentes documentales ─────────────────

const sources = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/sources" }),
  schema: z.object({
    title: z.string(),
    url: z.url(),
    asserts: z.string(),
    caveat: z.string().optional(),
    type: z.enum(["testimonio", "prensa", "documento-oficial", "web-archivo", "foto", "video", "otro"]),
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
    year: z.union([z.number().int().min(1980).max(2099), z.literal("desconocida")]),
    title: z.string(),
    verified: z.boolean().default(false),
    status: z.enum(["documentada", "parcial", "pendiente"]).default("pendiente"),
    venue: z
      .object({
        name: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
      })
      .optional(),
    organizer: z.string().optional(),
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
  schema: z.object({
    titulo: z.string(),
    tituloCastellano: z.string().optional(),
    edicion: z.string().optional(), // la que juega el grupo; vacía = pendiente
    ano: z.number().int().optional(), // primera publicación
    ediciones: z
      .array(z.object({ nombre: z.string(), ano: z.number().int().optional(), idioma: z.enum(["en", "es"]).default("en") }))
      .default([]),
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
    // Que lo jugamos lo dijo PabloFM (dictado, 2026-11-23): no lleva fuente web.
    jugado: z.object({ nosotros: z.boolean().default(false), ultima: fechaTexto.optional() }).default({ nosotros: false }),
    // Portadas: hueco tipográfico mientras no haya permiso (decisión 2026-11-23).
    portada: z
      .object({ archivo: z.string(), credito: z.string(), permiso: z.enum(["cita", "licencia", "permiso-editor", "foto-propia"]) })
      .optional(),
    enlaces: z.array(enlace).default([]), // web oficial, SRD, compra en la editorial
    dudas: z.array(z.string()).default([]), // preguntas abiertas: se pintan como «pendiente»
    fuentes: z.array(fuenteDato).default([]),
    draft: z.boolean().default(false),
  }).superRefine(
    exigeFuentes([
      "tituloCastellano", "edicion", "ano", "ediciones", "autoria", "editorial", "editorialCastellano",
      "sistema", "licenciaJuego", "generos", "modo", "formato", "jugadores",
    ])
  ),
});

// ─── 4 ter. licencias — qué permite cada licencia, en castellano llano ──

const licencias = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/licencias" }),
  schema: z.object({
    nombre: z.string(),
    nombreCorto: z.string(),
    // cc / orc / abierta-propia = abierta. politica-de-uso: deja publicar juegos
    // inspirados sin ser una licencia. fans: solo material no comercial. cerrada.
    tipo: z.enum(["cc", "orc", "abierta-propia", "politica-de-uso", "fans", "cerrada"]),
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

// ─── 7. campaigns — partidas y campañas ACTUALES del grupo (sección /rol/) ──
// Distinto de «systems» (lo jugado en las Jornadas históricas). PabloFM, 2026-11-15.
// Nada inventado: sin datos de una campaña, no se crea el archivo.

const campaigns = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/campaigns" }),
  schema: z.object({
    title: z.string(),
    system: z.string(),
    status: z.enum(["en-curso", "en-pausa", "terminada", "pendiente"]).default("pendiente"),
    started: z.string().optional(),        // ISO o parcial: "2026", "2026-09"
    gm: z.string().optional(),             // quien dirige
    summary: z.string().optional(),        // de qué va la campaña
    sessions: z
      .array(
        z.object({
          n: z.number().int().optional(),
          date: z.string().optional(),
          title: z.string().optional(),
          summary: z.string(),
        })
      )
      .default([]),
    characters: z
      .array(
        z.object({
          name: z.string(),
          player: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  sources, editions, people, systems, timeline, guides, campaigns,
  juegos, licencias, autoria, editoriales,
};
