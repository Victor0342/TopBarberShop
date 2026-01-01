# TopBarberShop

Website complet pentru un Barber Shop, construit cu Next.js App Router, TypeScript, Tailwind, shadcn/ui si Prisma.

## Implementation Plan
1. Setup Next.js + Tailwind + shadcn/ui + icons + framer-motion.
2. Definire Prisma schema, NextAuth, seed initial din `Informatie.MD`.
3. Implementare pagini publice cu animatii, imagine optimizate si continut din DB.
4. Implementare booking (sloturi, validare, CRUD in DB) + rate limiting.
5. Admin Dashboard complet pentru servicii, echipa, galerie, testimoniale, FAQ, pagini, SEO, setari, media.
6. SEO complet (metadata, OpenGraph, sitemap, robots, JSON-LD).

## Sitemap
- `/`
- `/services`
- `/services/[slug]`
- `/booking`
- `/booking/success`
- `/about`
- `/gallery`
- `/contact`
- `/privacy`
- `/terms`
- `/admin`
- `/admin/login`
- `/admin/bookings`
- `/admin/services`
- `/admin/team`
- `/admin/gallery`
- `/admin/testimonials`
- `/admin/faqs`
- `/admin/pages`
- `/admin/seo`
- `/admin/media`
- `/admin/schedule`
- `/admin/settings`

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- @phosphor-icons/react
- framer-motion
- Prisma + PostgreSQL
- NextAuth (Credentials)

## Setup rapid
1. Instaleaza dependintele:
```bash
npm install
```
2. Configureaza `.env`:
```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/topbarbershop"
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@topbarbershop.ro"
ADMIN_PASSWORD="parola-puternica"
```
Poti porni de la `.env.example`.
3. Ruleaza migrari + seed:
```bash
npm run prisma:migrate
npm run prisma:seed
```
4. Start dev:
```bash
npm run dev
```

## Comenzi utile
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`
- `npm run dev`

## Continut si administrare
Tot continutul este salvat in DB si editabil in `/admin`:
- Site Settings (brand, contact, program, hero, social)
- Servicii, Echipa, Galerie, Testimoniale, FAQ
- Pagini & sectiuni (texte, CTA, highlights)
- SEO (titlu, descriere, OG)
- Media Manager (upload local in `/public/uploads`)
- Program special (zile libere/override)

## TODO (optional / extern)
- Integrare email (Resend/SMTP) pentru confirmari booking + notificari admin.
- Audit logs pentru admin.
- Politici legale complete (Privacy/Terms).
- Integrare harta Google Maps cu locatie exacta.
