import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const speakers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/speakers' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    topic: z.enum(['open-source', 'devops-sre', 'ai-data', 'soft-engineering', 'leadership']).optional(),
    links: z
      .object({
        web: z.url().optional(),
        x: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
      })
      .default({}),
    photo: z.string(),
    locale: z.enum(['ca', 'en', 'es']),
    draft: z.boolean(),
  }),
});

// Fixed structure: all fields required and no defaults. Only fields currently
// used by the site are present here.
// Sessions cover talks/workshops/etc. Both session and spacer are required to
// provide start `time` and explicit `end` fields. Sessions represent speaker-led
// items and no longer carry `duration`, `track`, or `level` metadata.
const sessionSchema = z.object({
  type: z.literal('session'),
  slug: z.string(),
  title: z.string(),
  speakerSlug: z.string(),
  // Start and end time (HH:MM)
  time: z.string(),
  end: z.string(),
  // Explicit day number (1 or 2).
  day: z.number(),
  draft: z.boolean(),
  // Language shown in the UI and for content filtering.
  lang: z.enum(['ca', 'en', 'es']),
  locale: z.enum(['ca', 'en', 'es']),
});

// Spacer entries are short non-talk rows (breaks, lunches). All fields are
// required to keep the data structure fixed.
const spacerSchema = z.object({
  type: z.literal('spacer'),
  slug: z.string(),
  // Use `title` for spacer entries to be consistent with other content.
  title: z.string(),
  time: z.string(),
  end: z.string(),
  day: z.number(),
  draft: z.boolean(),
  locale: z.enum(['ca', 'en', 'es']),
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/agenda' }),
  schema: z.discriminatedUnion('type', [sessionSchema, spacerSchema]),
});


const sponsors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/sponsors' }),
  schema: z.object({
    name: z.string(),
    tier: z.enum(['mb', 'gb', 'tb', 'pb', 'collaborator']),
    logo: z.string().optional(),
    url: z.url(),
    order: z.number().default(99),
    locale: z.enum(['ca', 'en', 'es']).default('ca'),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/pages' }),
  schema: z.object({
    slug: z.string(),
    section: z.string(),
    locale: z.enum(['ca', 'en', 'es']).default('ca'),
  }),
});

export const collections = { speakers, talks, sponsors, pages };
