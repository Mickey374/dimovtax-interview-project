# Dimovtax SaaS Dashboard

Dimovtax is a project management dashboard built for the interview assessment. It supports authenticated users, role based access, project management, comments, notifications, dashboards, and cached project lists.

## Features

### Authentication

The application supports credentials sign in and Google sign in through NextAuth. Sessions use JWTs. Users have one of two roles:

1. `ADMIN`, who can manage all projects and users.
2. `USER`, who can view and work with projects assigned to them.

### Project management

Admins can create, edit, and delete projects. Projects contain a title, description, status, deadline, budget, and optional assigned user.

### Comments

Authorized users can view and create comments on a project. Users can edit and delete their own comments. Admins can delete any comment. Each comment shows its author, profile image, content, and creation time.

### Notifications

The dashboard includes a notification bell with an unread count and recent notification list. Notifications are created for:

1. Project assignment.
2. Project status changes.
3. New comments.

The bell refreshes when opened, when the page becomes active, and at a modest polling interval.

### Dashboard

The dashboard includes project tables, search, filtering, pagination, status information, budget information, and workload charts.

## Technology

1. Next.js 16 App Router
2. React 19
3. TypeScript
4. Prisma ORM
5. PostgreSQL
6. Upstash Redis
7. NextAuth
8. Tailwind CSS
9. TanStack Table
10. Recharts
11. Sonner

## Requirements

You can use Node.js 20 or newer. The CI workflow uses Node.js 22.

You also need:

1. A PostgreSQL database.
2. An Upstash Redis database.
3. An authentication secret.
4. Google OAuth credentials if Google sign in is enabled.

## Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
DIRECT_URL="postgresql://user:password@host:5432/database"
AUTH_SECRET="replace-with-a-long-random-secret"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

Keep secrets out of source control.

Google sign in is optional during CI and local credentials only development. Configure both Google variables to enable the Google sign in button. The CI workflow still needs PostgreSQL, Redis, and `AUTH_SECRET` secrets for the production build.

## Installation

```bash
npm install
npx prisma generate
```

## Local database setup

For local development, create and apply migrations with:

```bash
npx prisma migrate dev
npx prisma db seed
```

The seed creates one admin account, five regular users, and twenty sample projects.

## Cloud database setup

For a deployed database, apply committed migrations with:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Use `migrate dev` for local development only. Do not use `migrate reset` against a shared or production database.

## Start the application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm run start
```

Open `http://localhost:3000`.

The build command regenerates Prisma Client before building Next.js.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma Client and create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the focused helper tests |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev` | Create and apply a local migration |
| `npx prisma migrate deploy` | Apply committed migrations |
| `npx prisma db seed` | Load demo data |

## Project structure

```text
src/app                 Next.js pages, layouts, and API routes
src/components          Reusable dashboard and form components
src/constants            Shared route and navigation constants
src/lib                  Authentication, database, validation, and cache helpers
prisma/schema.prisma    Database schema
prisma/migrations       Committed database migrations
prisma/seed.ts          Demo data seed script
public                   Images and icons
```

## Docker

Build the image:

```bash
docker build -t dimovtax-dashboard .
```

Run the container:

```bash
docker run --rm -p 3000:3000 --env-file .env dimovtax-dashboard
```

## Troubleshooting

If Prisma reports a missing relation during deployment, make sure the deployment includes both `prisma/schema.prisma` and the matching migration files. The build script runs `prisma generate`, so a fresh deployment should regenerate the client.

If project data looks stale, check the Upstash Redis variables and the project cache invalidation logic.

If authentication fails, check `AUTH_SECRET`, `AUTH_URL`, the Google credentials, and the route protection in `src/proxy.ts`.
