# Fernway dashboard

The Fernway customer dashboard, with a local copy of one customer's account data.

## Setup

You need Node.js 26 or later. The version is pinned in `.node-version`.

With [Nix](https://nixos.org/download), run `nix develop` to get the right Node.js version. With direnv, run `direnv allow` once.

1. Run `npm run setup`. This installs the dependencies and builds the local database in less than a minute.
2. Run `npm run dev`, then open http://localhost:3000.
3. Add a `/ping` route that returns HTTP 200.

## Commands

Each command works with npm or with the [Vite+](https://viteplus.dev) `vp` CLI.

| Task                        | npm                | Vite+             |
| --------------------------- | ------------------ | ----------------- |
| Install dependencies        | `npm install`      | `vp install`      |
| Build the database          | `npm run db:setup` | `vp run db:setup` |
| Start the dev server        | `npm run dev`      | `vp run dev`      |
| Format, lint and type check | `npm run check`    | `vp check`        |
| Run the tests               | `npm test`         | `vp test`         |
| Production build            | `npm run build`    | `vp run build`    |
| Share a public URL          | `npm run share`    | `vp run share`    |

Use `vp run dev`, not `vp dev`. `vp dev` starts a plain Vite server, not Next.js.

`npm run share` gives your local dev server a temporary public HTTPS URL through Cloudflare. You do not need an account. Keep `npm run dev` running in a second terminal.

## Data

`npm run db:setup` builds `data/fernway.db` (SQLite) from `data/events.csv.gz`. The data is a 1-in-5 sample of the account's messages for the last 90 days. The monthly budget in `fernway.config.ts` is scaled to the sample.

The data ends at 18 November 2026, 12:00 UTC, and the app treats that time as now. Use `now()` from `lib/clock.ts`, not `new Date()`.

## UI components

The UI uses [shadcn/ui](https://ui.shadcn.com) and [ReUI](https://reui.io) on Radix, with Tailwind CSS v4. Installed components go in `components/`. To add more, run `npx shadcn@latest add <name>` for a shadcn/ui component or `npx shadcn@latest add @reui/<name>` for a ReUI component. The theme colours are in `app/globals.css`.
