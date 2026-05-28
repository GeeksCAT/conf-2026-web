# GeeksCAT Conf 2026 — Web

Official website for GeeksCAT Conf 2026, the geeks' conference for geeks in Catalonia.

## Stack

- [Astro](https://astro.build) v6 (SSG) + TypeScript strict
- [Tailwind CSS](https://tailwindcss.com) v4 via `@tailwindcss/vite`
- [Biome](https://biomejs.dev) for lint + format
- pnpm 11 + Node 22 LTS

## Dev

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # SSG → dist/
pnpm preview   # serve dist/
pnpm check     # Astro type check + Biome
```

## Deploy

Cloudflare Pages — build command `pnpm build`, output directory `dist/`, Node version `22`.

Canonical domain: `conf.geeks.cat` · Alias: `conf.geekscat.org`

## Data file schemas

This repository stores content in small Markdown files under `src/data`. We maintain
explicit, fixed schemas for those files so tooling and the site can rely on every
field being present. New content should follow these rules; the schema is enforced
by `src/content.config.ts` using zod.

### Agenda (`src/data/agenda/*.md`)

- Two entry kinds: `session` and `spacer`. They are discriminated by `type`.
- Both kinds must declare explicit `time` (start) and `end` (end) fields. There
  are no `duration` fields anymore — compute end time in the frontmatter.

- Fields required for `session` (all required):
  - `type`: literal `session`
  - `slug`: string
  - `title`: string
  - `abstract`: string
  - `speakerSlug`: string (must match a speaker file slug)
  - `time`: string (format `HH:MM`)
  - `end`: string (format `HH:MM`)
  - `day`: number (1 or 2)
  - `draft`: boolean
  - `lang`: one of `ca`, `en`, `es`
  - `locale`: one of `ca`, `en`, `es`

- Fields required for `spacer` (all required):
  - `type`: literal `spacer`
  - `slug`: string
  - `title`: string (short label like `PAUSA`)
  - `abstract`: string
  - `time`: string (start time `HH:MM`)
  - `end`: string (end time `HH:MM`)
  - `day`: number (1 or 2)
  - `draft`: boolean
  - `locale`: one of `ca`, `en`, `es`

Example templates
- Two example template files were added under `src/data/agenda/`:
  - `_example-talk.md` — example `session` (draft: true)
  - `_example-spacer.md` — example `spacer` (draft: true)
  These are safe templates you can copy and edit to create new agenda items.

Validation
- The content schema is enforced by `src/content.config.ts` (zod). The site
  build will fail if any Markdown file under `src/data/agenda` does not match
  the schema (this ensures strict conformance to the structure above).

Abstract vs body
- `abstract` (frontmatter) is a short plain-text summary used in the compact
  listing and the session/spacer summary. Keep it short (one or two sentences).
- The file body (the Markdown content after the `---` frontmatter) is rendered
  when a user expands the session (the details view). Use the body for longer
  descriptions, speaker notes, links, or formatted content. Markdown is supported
  in the body and will be rendered into the page.

When creating agenda items: put the short blurb in `abstract` so the schedule
looks tidy; put detailed content (examples, bios, extended abstracts) in the
file body so it appears in the expanded detail view.

### Speakers (`src/data/speakers/*.md`)

All speaker files follow a fixed schema with required and optional fields.

Required fields:
- `slug`: string (unique identifier, kebab-case, should match filename)
- `name`: string (full name of the speaker)
- `role`: string (job title or role)
- `bio`: string (multi-line biography, use YAML pipe `|` syntax)
- `photo`: string (path to speaker photo, e.g. `/assets/speakers/name.jpg`)
- `locale`: one of `ca`, `en`, `es`

Optional fields:
- `topic`: string (optional, single value)
  - Allowed values: `open-source`, `devops-sre`, `ai-data`, `soft-engineering`, `leadership`
- `links`: object (defaults to `{}`)
  - `web`: URL string (speaker website)
  - `x`: string (X/Twitter handle, without @)
  - `linkedin`: string (LinkedIn profile identifier)
  - `github`: string (GitHub username)

Example template:
- A complete example template is provided at `src/data/speakers/_example-speaker.md`
  with `draft: true`. Copy and edit it to create new speaker profiles.
- Note: `draft` field is not currently in the schema but can be added if needed
  for filtering speakers during development.

Validation:
- The speaker schema is enforced by `src/content.config.ts` (zod). The build
  will fail if any Markdown file under `src/data/speakers` does not match the
  required schema structure.

Bio format:
- Use the YAML pipe `|` syntax for multi-line bios in the frontmatter.
- Keep the bio concise but informative (2-3 paragraphs recommended).
- The file body (Markdown after frontmatter) is available but not currently
  used by the site templates.

### Sponsors (`src/data/sponsors/*.md`)

All sponsor files follow a fixed schema with all fields required except `order`.

Required fields:
- `name`: string (sponsor/company name)
- `tier`: enum (sponsorship tier level)
  - Allowed values: `pb` (Petabyte), `tb` (Terabyte), `gb` (Gigabyte), `mb` (Megabyte), `collaborator`
- `logo`: string (path to logo image, e.g. `/img/sponsors/company-logo.png`)
- `url`: URL string (sponsor website, must be a valid URL)
- `locale`: one of `ca`, `en`, `es` (defaults to `ca`)
- `draft`: boolean (set to `false` to publish, `true` to hide from production)

Optional fields:
- `order`: number (display order within the tier, lower numbers first, defaults to `99`)

Draft behavior:
- Sponsors with `draft: true` are excluded from the sponsors page
- Set `draft: false` when the sponsor is confirmed and ready to display
- Use `draft: true` for sponsors in negotiation or pending confirmation

Tier slot behavior:
- Each tier has a minimum number of display slots defined in the page:
  - `pb` (Petabyte): 1 slot
  - `tb` (Terabyte): 1 slot
  - `gb` (Gigabyte): 2 slots
  - `mb` (Megabyte): 3 slots
  - `collaborator`: dynamic (shows all, no minimum)
- If actual sponsors < minimum slots: placeholders fill remaining slots
- If actual sponsors ≥ minimum slots: all sponsors are displayed (no cutting)

Example template:
- A complete example template is provided at `src/data/sponsors/_example-sponsor.md`.
  Copy and edit it to create new sponsor entries.

Validation:
- The sponsor schema is enforced by `src/content.config.ts` (zod). The build
  will fail if any Markdown file under `src/data/sponsors` does not match the
  required schema structure.
- The `url` field must be a valid URL (enforced by zod).

Logo format:
- Place logo images in `/public/img/sponsors/` or `/public/assets/sponsors/`.
- Use PNG or SVG format for best quality.
- Logos should have transparent backgrounds when possible.
- The file body (Markdown after frontmatter) is available but not currently
  used by the site templates.
