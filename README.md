# CEO SUITE

Workspace booking website: search and book private offices, coworking spaces and meeting rooms.

Built with Next.js (App Router, Cache Components), TypeScript, Tailwind CSS v4, shadcn/ui (Base UI) and Motion.

## Getting started

Requires Node.js 20.9+ and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Scripts

| Script              | Purpose                                |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Start the dev server                   |
| `pnpm build`        | Production build                       |
| `pnpm start`        | Serve the production build             |
| `pnpm lint`         | ESLint                                 |
| `pnpm typecheck`    | Generate route types and run `tsc`     |
| `pnpm format`       | Format with Prettier (+ class sorting) |
| `pnpm format:check` | Check formatting                       |

## Environment

| Variable               | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata, sitemap and OG |
