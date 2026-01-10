# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains Next.js App Router pages, layouts, and route handlers.
- `src/components/` holds reusable UI grouped by `ui/`, `site/`, and `admin/`.
- `src/lib/` stores shared utilities, data access helpers, and auth logic.
- `prisma/` includes schema, migrations, and the seed script.
- `public/` serves static assets; uploads live in `public/uploads` via the admin.
- `Imagini/` keeps optional raw image sources used during content prep.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the local dev server at `http://localhost:3000`.
- `npm run build` creates a production build.
- `npm run start` runs the production server after `build`.
- `npm run lint` runs ESLint checks.
- `npm run prisma:generate` generates the Prisma client.
- `npm run prisma:migrate` applies local database migrations.
- `npm run prisma:seed` loads initial data.

## Coding Style & Naming Conventions
- TypeScript + React with functional components.
- Use 2-space indentation, double quotes, and semicolons.
- File names use kebab-case (for example `booking-form.tsx`).
- Component exports use PascalCase (for example `BookingForm`).
- Tailwind CSS handles styling; keep class lists grouped and readable.
- Run `npm run lint` before opening a PR.

## Testing Guidelines
- No automated test runner is configured yet; verify changes by running the app and walking the relevant flows (booking, admin, auth).
- If you add tests, document the runner and add an `npm test` script.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative sentences (example: "Harden service image fallbacks").
- PRs should include a clear summary, testing notes, and screenshots for UI changes.
- Link related issues and call out any Prisma schema or migration updates.

## Security & Configuration Tips
- Copy `.env.example` to `.env` and set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and admin credentials.
- Do not commit secrets; keep them in local environment variables.
