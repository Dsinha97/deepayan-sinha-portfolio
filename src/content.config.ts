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
  schema: ({ image }) => z.object({
    title: z.string(),
    tagline: z.string(),
    role: z.string(),
    period: z.string(),
    stack: z.array(z.string()),
    /* Imported through astro:assets, not served from public/, so every cover
     * ships resized with a srcset and truthful width and height. Covers fill
     * their frame edge to edge (object-cover), which crops. */
    cover: image(),
    /* Shown instead of `cover` in light theme, when a screenshot's own UI is
     * theme-specific and a single image can't read correctly in both. `cover`
     * remains the dark-theme (and no-JS/reduced-motion-irrelevant) image. */
    coverLight: image().optional(),
    /* Which edge survives the crop. A cover whose subject sits off-centre (the
     * Fort Monroe title panel is on the left) names that edge here, or the
     * crop cuts through it. */
    coverFocus: z.enum(['center', 'left', 'right', 'top']).default('center'),
    /* The kind of work, first in the card's meta line: "Solo build", "Consulting". */
    kicker: z.string(),
    /* `tall` spans two rows beside two ordinary tiles — the portrait-photo
     * tile in the portrait.so reference. */
    bentoSize: z.enum(['lg', 'md', 'sm', 'tall']),
    order: z.number(),
    claimScope: z.enum(['own-outcomes', 'engagement-outcomes']),
    /* A "Recent updates" panel synced at build time from the project's own
     * changelog. Only FPL Decision has one — see src/lib/fpl-updates.ts. */
    updates: z.enum(['fpl-timeline']).optional(),
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
  schema: ({ image }) => z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    /* Where the card goes. With an href the card is a link to the issuer's
     * verification page and `image` is its preview; without one, `image` is
     * the certificate itself and the card opens it in a viewer. */
    href: z.string().url().optional(),
    image: image().optional(),
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
  schema: ({ image }) => z.object({
    kind: z.enum(['honor', 'publication']),
    title: z.string(),
    date: z.string().optional(),
    venue: z.string().optional(),
    href: z.string().url().optional(),
    summary: z.string().optional(),
    abstract: z.string().optional(),
    image: image().optional(),
    order: z.number(),
  }),
});

export const collections = { work, experience, education, certifications, skills, recognition };
