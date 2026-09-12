/*
 * Six collections for DSI-98. Markdown for `work`, YAML for everything that is
 * a list of records. See docs/wiki/site-architecture.md for the full shape and
 * docs/wiki/content-guardrails.md for what each field is guarding.
 *
 * `work.claimScope` is required with no default: a new case study cannot be
 * added without choosing `own-outcomes` or `engagement-outcomes`. The layout
 * (not this file) renders the visible footnote for the latter — the rule
 * lives in content-guardrails.md, this schema only enforces that a choice was
 * made.
 *
 * `experience.genericised` marks an entry whose client and vendor names must
 * never appear, so the constraint travels with the data.
 */
import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    role: z.string(),
    period: z.string(),
    stack: z.array(z.string()),
    cover: z.string(),
    bentoSize: z.enum(['lg', 'md', 'sm']),
    order: z.number(),
    claimScope: z.enum(['own-outcomes', 'engagement-outcomes']),
    star: z.object({
      situation: z.string(),
      task: z.string(),
      action: z.string(),
      result: z.string(),
    }),
    metrics: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
          qualifier: z.string().optional(),
        }),
      )
      .max(4)
      .optional(),
    links: z
      .array(
        z.object({
          type: z.enum(['live', 'repo', 'document']),
          href: z.string().url(),
          label: z.string(),
        }),
      )
      .optional(),
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience/roles.yaml'),
  schema: z.object({
    org: z.string(),
    title: z.string(),
    place: z.string(),
    period: z.string(),
    summary: z.string(),
    points: z.array(z.string()),
    /* Rendered with no visible marker (owner decision, 2026-09-11) but never merged into `points`. */
    selfReported: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
    outcome: z.string().optional(),
    genericised: z.boolean().optional(),
    /* Slug of a `work` entry this role's case study lives at. The "see more" link renders only
     * once that entry actually exists — checked against the collection, not a hand-flipped switch. */
    workSlug: z.string().optional(),
    order: z.number(),
  }),
});

const education = defineCollection({
  loader: file('src/content/education/degrees.yaml'),
  schema: z.object({
    school: z.string(),
    award: z.string(),
    period: z.string(),
    notes: z.array(z.string()).optional(),
    order: z.number(),
  }),
});

const certifications = defineCollection({
  loader: file('src/content/certifications/certificates.yaml'),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    href: z.string().url().optional(),
    group: z.string(),
    order: z.number(),
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills/groups.yaml'),
  schema: z.object({
    group: z.string(),
    items: z.array(z.string()),
    order: z.number(),
  }),
});

const recognition = defineCollection({
  loader: file('src/content/recognition/items.yaml'),
  schema: z.object({
    kind: z.enum(['honor', 'publication']),
    title: z.string(),
    venue: z.string().optional(),
    href: z.string().url().optional(),
    order: z.number(),
  }),
});

export const collections = { work, experience, education, certifications, skills, recognition };
