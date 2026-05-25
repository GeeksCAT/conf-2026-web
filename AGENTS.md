Quick operational notes for OpenCode agents working on this repo.

Node / package manager
- Use Node 22 LTS (>=22.12.0). package.json requires Node >=22.12.0.
- Use pnpm (v11 recommended). Commands below assume pnpm.

Install
- pnpm install

Common commands (exact)
- Start dev server: pnpm dev        # opens Astro dev on :4321
- Build (SSG): pnpm build           # writes static site to dist/
- Preview built output: pnpm preview
- Check (types + tooling): pnpm check
- Lint: pnpm lint                  # runs Biome checks
- Format: pnpm format               # runs Biome formatter

Order and verification
- Typical local flow: pnpm install → pnpm dev (iterate) → pnpm build → pnpm preview.
- CI / pre-merge should run: pnpm install → pnpm check → pnpm lint → pnpm build. "pnpm check" runs Astro typecheck and should be run before build.

Tooling and quirks
- Framework: Astro v6 (SSG) + TypeScript strict. Codegen / routing may rely on file layout in src/ (standard Astro conventions).
- Formatter & linter: Biome. Use the repo scripts (pnpm lint / pnpm format) rather than calling biome globally to ensure version parity.
- Tailwind v4 via @tailwindcss/vite plugin — dev server and build use Vite under the hood via Astro.
- package.json uses "type": "module" — prefer ESM imports when editing Node scripts.

Deployment
- Hosted on Cloudflare Pages. Production build command: pnpm build. Output directory: dist/.
- Use Node 22 runtime on the Pages environment.

Files of truth
- README.md and package.json are authoritative for scripts, engines, and high-level stack.

What not to assume
- Do not attempt to run npm or yarn commands unless the user asks — this repo expects pnpm.
- Don't assume a monorepo; this is a single-package site (no workspaces detected).

When editing or adding scripts
- If you add tooling that requires a lockfile update, run pnpm install to update pnpm-lock.yaml and commit it.

Quick checkpoints for PRs
- Verify pnpm install runs and lockfile updated if deps changed.
- Run pnpm check and pnpm lint locally; fix Biome errors rather than disabling rules.
- Run pnpm build and pnpm preview to spot SSG issues.

If you need more context
- Read README.md and package.json first. They contain the minimal, authoritative developer commands.
- Interrogate the engineer until you have precisely specified what you have to do.
- Expose to the engineer the different alternative solutions to complete the requested task.
  Explain the pros and cons and have to be done for each alternative.
- Don't make any change until you interrogate the engineer and they have replied and indicated
  which approach to take and they confirm you to make the changes.
- Don't commit any change unless that the engineers explicitly say it.
