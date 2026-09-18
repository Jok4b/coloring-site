# Coloring site

Free printable coloring pages with Print, PDF download, online coloring,
name coloring pages, instant search and an admin dashboard.

Built with Next.js + Payload CMS + PostgreSQL. Runs on CapRover.

## What's inside

- **Website**: home, all pages, categories, each coloring page, search,
  name pages (hub, A–Z letters, one page per published name), sitemap.xml, robots.txt.
- **Admin** at `/admin`: add coloring pages and categories, upload name designs,
  import baby names, publish in batches, see what visitors searched for and didn't find.
- **Print** (`/print/...`): one clean sheet, US Letter or A4, portrait or landscape detected automatically.
- **PDF** (`/pdf/...`): a real PDF file, made from your image.
- **Color online**: tap-to-fill tool that works on phones, with undo/redo, eraser, zoom, save and print.

## Environment variables

See `.env.example`. Three are required: `DATABASE_URL`, `PAYLOAD_SECRET`, `SITE_URL`.

## Persistent folder (important)

Uploaded images are stored in `/app/media` inside the container.
In CapRover, add a **Persistent Directory** with path in app `/app/media`,
otherwise images disappear on every redeploy.

## Database changes

The database tables are created automatically on first start (migrations in `src/migrations`).
If you add fields later, a developer runs `npx payload migrate:create` and redeploys.

## Local development (optional)

1. `cp .env.example .env` and point `DATABASE_URL` to a local Postgres.
2. `npm install`
3. `npm run dev` and open http://localhost:3000/admin
