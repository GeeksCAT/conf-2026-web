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

GitHub Pages via GitHub Actions. The workflow at `.github/workflows/deploy.yml` builds on every push to `main` (and manual dispatch) and publishes `dist/` using the `withastro/action@v3` action with Node 22 and pnpm 11.

Custom domain: `conf.geeks.cat` (declared in `public/CNAME`, picked up automatically at build time). The repo's GitHub Pages source must be set to **GitHub Actions** under Settings → Pages.

## Content Management

The site uses two different approaches for managing page content, depending on the page type:

### 1. Translation-based Pages (TypeScript i18n)

Most pages use TypeScript translation files for their content. Translations are stored in modular files under `src/i18n/translations/` and imported by `src/i18n/ui.ts`.

**Pages managed with i18n translations:**
- **Home** (`index.astro`) — Uses `src/i18n/translations/index.ts` and `hero.ts`
- **Call for Papers** (`cfp.astro`) — Uses `src/i18n/translations/cfp.ts`
- **Agenda** (`agenda.astro`) — Uses `src/i18n/translations/agenda.ts`
- **Speakers** (`speakers.astro`) — Uses `src/i18n/translations/speakers.ts`
- **Sponsors** (`sponsors.astro`) — Uses `src/i18n/translations/sponsors.ts`
- **Tickets** (`tickets.astro`) — Currently uses hardcoded content (should be migrated to i18n)

**Common translations:**
- Navigation, footer, and shared UI elements use `src/i18n/translations/nav.ts`, `common.ts`, and `footer.ts`

**How to add/edit translations:**
1. Locate the appropriate translation file in `src/i18n/translations/`
2. Add or modify the translation keys for each locale (`ca`, `en`)
3. Use the `t()` function in your Astro component: `t('page.key')`

**Localized pages structure:**
- Catalan pages (default locale): `src/pages/*.astro` (e.g., `/cfp`)
- English pages: `src/pages/en/*.astro` (e.g., `/en/cfp`)

### 2. Markdown Content Pages

Some pages use Markdown files for their content, managed through Astro's content collections. This approach is ideal for long-form, policy-style content.

**Pages managed with Markdown:**
- **Code of Conduct** (`coc.astro`) — Uses `src/data/pages/coc-{locale}.md`

**How to add/edit Markdown content:**
1. Create or edit the Markdown file in `src/data/pages/`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: "Page Title"
   badge: "[OPTIONAL BADGE]"
   description: "Short description"
   locale: "ca" # or "en"
   ---
   ```
3. Write your content in Markdown below the frontmatter
4. The page component loads the content using `getCollection('pages')` and renders it with Astro's content rendering

**Markdown content benefits:**
- Better for long-form content (policies, legal text, documentation)
- Version control friendly (easier to review changes in plain text)
- Supports full Markdown syntax (lists, headings, bold, links, etc.)
- Automatically styled with custom prose CSS classes

**Adding a new Markdown page:**
1. Create Markdown files for each locale in `src/data/pages/` (e.g., `privacy-ca.md`, `privacy-en.md`)
2. Define the schema in `src/content.config.ts` if needed
3. Create the page component that loads and renders the content
4. Follow the pattern used in `src/pages/coc.astro` as a template

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
- `slug`: string (unique identifier, kebab-case, shared by all locale variants of
  the same speaker)
- `name`: string (full name of the speaker)
- `role`: string (job title or role)
- `bio`: string (multi-line biography, use YAML pipe `|` syntax)
- `photo`: string (path to speaker photo, e.g. `/img/speakers/name.webp`)
- `locale`: one of `ca`, `en`, `es`
- `draft`: boolean (drafts are hidden from the speakers page)

Optional fields:
- `topic`: string (optional, single value)
  - Allowed values: `open-source`, `devops-sre`, `ai-data`, `soft-engineering`, `leadership`
- `links`: object (defaults to `{}`)
  - `web`: URL string (speaker website)
  - `x`: string (X/Twitter handle, without @)
  - `linkedin`: string (LinkedIn profile identifier)
  - `github`: string (GitHub username)
  - `mastodon`: URL string (full profile URL, the instance is part of the identity)
  - `bluesky`: URL string (full profile URL)

One file per locale:
- The speakers page only lists entries whose `locale` matches the page language,
  so a speaker needs one file per locale to appear on all three versions of the
  site: `name-surname-ca.md`, `name-surname-en.md`, `name-surname-es.md`.
- All three files share the same `slug` and `photo`; `name` and `bio` (and `role`
  where it makes sense) are translated.
- Agenda entries reference speakers through `speakerSlug`, which matches that
  shared `slug`.

Example template:
- A complete example template is provided at `src/data/speakers/_example-speaker.md`
  with `draft: true`. Copy and edit it to create new speaker profiles.

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

### Pages (`src/data/pages/*.md`)

Markdown-based page content for long-form policy and documentation pages.

Required fields:
- `title`: string (page title, used in hero and meta tags)
- `locale`: one of `ca`, `en`, `es` (language of the content)

Optional fields:
- `badge`: string (optional badge text shown above the title, e.g. `[ POLICY ]`)
- `description`: string (page description for hero and meta tags)

File naming convention:
- Use format: `{page-slug}-{locale}.md`
- Example: `coc-ca.md`, `coc-en.md`, `privacy-ca.md`, `privacy-en.md`

Markdown body:
- Write the full page content in Markdown after the frontmatter
- Supports all standard Markdown features (headings, lists, bold, links, etc.)
- Lists are automatically styled with cyan bullet points (`.prose` styles)
- Paragraphs have generous spacing (2rem) for readability

Current pages using Markdown:
- Code of Conduct: `coc-ca.md`, `coc-en.md`

Validation:
- The pages schema is enforced by `src/content.config.ts` (zod)
- The build will fail if files don't match the schema

Rendering:
- Pages load content using `getCollection('pages')` and `render()`
- See `src/pages/coc.astro` as a reference implementation
- Custom prose CSS in `src/styles/global.css` provides consistent styling
