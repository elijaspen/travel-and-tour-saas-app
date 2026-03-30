# Travel & Tour SaaS App

Full-stack travel-and-tour platform (WorkWanders): Next.js, Supabase, and shadcn-style UI.

## Documentation

| Doc | Purpose |
| --- | ------- |
| [**Architecture**](docs/architecture.md) | **Canonical** folder layout, layers (`app` / `components` / `modules`), patterns, and tech stack. |
| [**Plan**](docs/plan.md) | Product phases and checklists. |

For structure and conventions, prefer **architecture.md** over this README so details stay in one place.

## Tech stack (summary)

- **Next.js 16** (App Router), React 19, Server Actions, Tailwind CSS 4  
- **Supabase** — Postgres, Auth, Storage (RLS)  
- **Forms** — react-hook-form, Zod 4  
- **UI** — shadcn-style primitives under `src/components/ui`  
- **Deploy** — Cloudflare Workers via OpenNext (see architecture doc)

## Repository layout (high level)

- `src/app/` — routes, layouts, API routes  
- `src/components/ui` — primitives · `src/components/shared` — cross-cutting UI · `src/components/features/<domain>` — domain-specific UI  
- `src/modules/<domain>` — server logic (`*.service.ts`, `*.actions.ts`, `*.validation.ts`, …) · `src/modules/shared` — shared server helpers  
- `src/config`, `src/lib`, `src/hooks` — routes/navigation, pure utils, shared hooks  
- `supabase/` — schemas, migrations, generated `types/`, clients under `supabase/utils` (import `@supabase/utils/...`)  

**Full tree and naming rules:** [docs/architecture.md §2](docs/architecture.md).

## Prerequisites

- **Node.js 22** (recommended; use the active LTS line — see [nodejs.org](https://nodejs.org/) for current releases)  
- **npm** (this repo uses `package-lock.json`)  
- A Supabase project for local/remote development  

## Getting started

1. **Environment**

   ```bash
   cp .env.example .env.local
   ```

   Set at least: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`).

2. **Install & run**

   ```bash
   npm install
   npm run dev
   ```

3. **Database** — follow the workflow in [docs/architecture.md](docs/architecture.md) and [`.cursor/rules/supabase-migrations.mdc`](.cursor/rules/supabase-migrations.mdc) (`migrate`, `types`, etc.).

## Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build / server |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` / `npm run test:e2e` | Jest / Playwright |
| `npm run migrate` | Local DB push + regenerate types |
| `npm run types` | Regenerate `supabase/types/database.ts` |

See `package.json` for Cloudflare/OpenNext and other scripts.

## Testing

- **Unit:** `__tests__/` — `npm test`  
- **E2E:** `e2e/` — `npm run test:e2e`  

## Supabase

- **Generated types:** `supabase/types/database.ts` (do not hand-edit; use `npm run types`)  
- **Clients:** `@supabase/utils/server`, `@supabase/utils/client`, etc. (see `tsconfig` paths)  

## shadcn-style UI

Add primitives with the shadcn CLI; components live in `src/components/ui`. See [architecture doc](docs/architecture.md) and [`.cursor/rules/shadcn-best-practices.mdc`](.cursor/rules/shadcn-best-practices.mdc).

## License

[MIT](LICENSE)
