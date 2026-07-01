# Dimovtax SaaS Dashboard

Mini SaaS dashboard built with Next.js 16, TypeScript, Prisma, PostgreSQL, Redis, NextAuth, and Tailwind CSS. The project was designed around the interview brief in `docs/interview-task.pdf` and supports project management, role-based access, charts, authentication, and seeded demo data.

## Features

- Authentication with credentials and Google sign-in through NextAuth.
- Role-based authorization for `ADMIN` and `USER` accounts.
- Projects table with search, filtering, pagination, create, edit, and delete.
- User directory with role and join-date display.
- Dashboard charts for budget, status, and team workload.
- Profile page that shows the signed-in user and assigned projects.
- Admin profile view that hides project lists because admins oversee the whole workspace.
- Redis-backed caching for project listings with explicit invalidation after writes.
- Responsive navigation for desktop and mobile.
- The project uses seeded sample data for quick evaluation.

## Interview Requirements

The implementation follows the core points in `docs/interview-task.pdf`:

- CRUD project management.
- Search and filtering in table UI.
- Modal-based project form.
- Database-backed persistence.
- Authentication.
- Documentation and deployment readiness.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma
- PostgreSQL
- Upstash Redis
- NextAuth
- Tailwind CSS
- TanStack Table
- Recharts

## Project Structure

- `src/app` - routes, layouts, API handlers.
- `src/components` - dashboard, navigation, project, user, and UI components.
- `src/lib` - auth, db, schemas, project helpers, and data access.
- `prisma/schema.prisma` - database schema.
- `prisma/seed.ts` - demo data seed script.

## Prerequisites

- Node.js 20 or newer.
- PostgreSQL database.
- Upstash Redis database.
- Google OAuth credentials if you want Google login.
- NextAuth secret.

## Environment Variables

Create a `.env` file with values similar to these:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
AUTH_SECRET="your-long-secret"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

## Local Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open `http://localhost:3000`.

## Seeded Demo Accounts

The seed script creates one admin and five demo users.

- Admin email: `` /_Will be shared in email _/
- Password: ``

## Available Scripts

- `npm run dev` - start the development server.
- `npm run build` - production build.
- `npm run start` - run the production server.
- `npm run lint` - lint the codebase.
- `npm run test` - run the focused helper tests.

## Authentication and Authorization

- The app uses session-based auth through NextAuth.
- Public routes are limited to sign-in and sign-up.
- All dashboard routes are protected in `src/proxy.ts`.
- Admin-only routes and UI actions are guarded on both the client and server.

## Caching Behavior

Project lists are cached in Redis for faster reads. The write handlers invalidate every list variant after project create, update, and delete so the UI refreshes with the latest data immediately.

## Docker

The repo includes a production-ready `Dockerfile` and `.dockerignore`.

Build the image:

```bash
docker build -t dimovtax-dashboard .
```

Run the container:

```bash
docker run --rm -p 3000:3000 --env-file .env dimovtax-dashboard
```

If you want to connect to external services in production, keep the same environment variables available in the container.

## Notes

- The profile page renders a summary card and the assigned projects for regular users.
- Admin profiles intentionally hide assigned projects because the admin oversees the full project set.
- The navigation profile button opens a menu with Profile and Sign Out actions.
- The sign-out actions terminate the session and redirect back to the sign-in page.

## Troubleshooting

- If the app shows stale project data, verify Redis cache invalidation and confirm the API route is using the latest cache keys.
- If authentication redirects behave unexpectedly, check `src/proxy.ts` and the session configuration in `src/lib/auth.config.ts`.
- If Docker builds fail, ensure `npx prisma generate` can access the database schema and that all environment variables are available during build and runtime.
