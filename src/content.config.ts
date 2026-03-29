import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// ─── 1. sources — bibliografía / fuentes documentales ─────────────────

const sources = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/sources" }),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
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
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
    editionIds: z.array(z.string()).default([]),
    sourceIds: z.array(z.string()).default([]),
    verified: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// ─── 4. systems — sistemas de juego de rol ────────────────────────────

const systems = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/systems" }),
  schema: z.object({
    name: z.string(),
    publisher: z.string().optional(),
    year: z.number().int().optional(),
    country: z.string().optional(),
    genre: z
      .array(
        z.enum([
          "fantasia",
          "ciencia-ficcion",
          "terror",
          "historico",
          "contemporaneo",
          "universal",
          "otro",
        ])
      )
      .default([]),
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
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
    draft: z.boolean().default(false),
  }),
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

export const collections = { sources, editions, people, systems, timeline };
