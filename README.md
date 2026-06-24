# Creative Coding NYC Virtual Showcase

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## SQL Featured Posters

The `Featured this week` section is backed by a SQLite-powered Next API route:

```bash
/api/featured-posters/
```

Locally, the database is created at `data/ccnyc.sqlite` unless `SQLITE_PATH` is set.

## Deploy on Render

This repo includes `render.yaml` for a Render Web Service deployment.

Render settings:

- Type: Web Service
- Runtime: Node
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Node version: `24.14.1`
- `SQLITE_PATH`: `/tmp/ccnyc.sqlite`

The SQLite database is seeded by the app at runtime. On Render, it is intentionally stored in `/tmp` because the current featured-poster data comes from code and does not need persistent writes.
