# Linkbird Platform (Next.js + Prisma + Better Auth)

A production-ready scaffold for a Linkbird-like platform.

## Tech
- Next.js App Router, TypeScript
- Tailwind CSS + shadcn-compatible tokens
- PostgreSQL + Prisma ORM
- TanStack Query, Zustand
- Better Auth (email/password + Google) [auth wiring next]

## Getting Started
1. Install deps
```
npm i
```
2. Environment
- Create `.env` with:
  - `DATABASE_URL`
  - `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (after auth wiring)
3. Prisma
```
npx prisma migrate dev --name init
npx prisma generate
```
4. Dev
```
npm run dev
```

## Database Schema
Prisma models for `User`, `Campaign`, `Lead`. See `prisma/schema.prisma`.

## API Routes
- `GET /api/leads?q=&status=&cursor=`: infinite leads
- `GET /api/leads/[id]`, `PATCH /api/leads/[id]`: lead details/update
- `GET /api/campaigns`: campaigns listing with counts

## Deployment (Vercel)
- Add env vars in Vercel
- Ensure `postinstall` runs `prisma generate`
- Deploy

## Roadmap
- Wire Better Auth, session, protected routes
- Google OAuth
- shadcn/ui components and polished UI states
