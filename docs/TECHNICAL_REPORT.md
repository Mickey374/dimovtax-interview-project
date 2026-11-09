# Technical Report

## Executive summary

Dimovtax is implemented as a small full stack project management system. The implementation uses Next.js server rendering and route handlers, Prisma with PostgreSQL for persistence, Upstash Redis for project list caching, and NextAuth for authentication.

## Implementation decisions

### Next.js App Router

The App Router provides protected layouts, server rendered data loading, and route handlers in one application. Server pages handle access checks before rendering. Client components are limited to interactions that need browser state.

### Prisma and PostgreSQL

Prisma provides typed database queries and keeps the model relationships close to the application code. PostgreSQL supplies durable relational storage for users, projects, notifications, and comments.

### JWT sessions

NextAuth uses JWT sessions so the session can carry the user identity and role without a session table. API handlers still call `auth()` and verify permissions for every protected operation.

### Redis caching

Project list reads are suitable for caching because they are frequently loaded and can be invalidated after writes. Notifications remain database backed because they need consistent unread state and are fetched with a small limit.

### Transactional activity writes

Project assignment and status change notifications are created in the same Prisma transaction as the project update. Comment creation and comment notifications also share one transaction. This prevents the primary action from succeeding while its activity record fails.

### Polling instead of real time delivery

The notification bell refreshes on open, focus, visibility changes, project mutations, and a 30 second interval. This keeps the implementation small and avoids WebSockets, push infrastructure, or external notification services.

## Validation and authorization

Zod validates project and comment input. API handlers use the authenticated session as the source of the current user ID.

Project mutations require an administrator. Comment access is available to administrators and users assigned to the project. Users can edit only their own comments. Administrators can delete any comment.

Client controls improve usability, but the API handlers enforce the actual permissions.

## Challenges addressed

### Prisma client freshness

Deployment initially failed when the generated Prisma Client did not include the new comment relation. The build script now runs `prisma generate` before `next build`, which keeps deployment type checking aligned with the schema.

### Migration ordering

The migration directory includes an initial schema migration before notification and comment migrations. This allows Prisma to build an empty shadow database in the correct order.

### Notification freshness

A fetch only when the notification panel opens made unread counts look stale. The bell now performs an initial read, refreshes while the page is visible, and refreshes when the user returns to the tab.

### Project deep links

Notification project links use `/projects/<id>`. The project detail route verifies access before loading the project and its comments.

## Testing and verification

The repository includes focused tests for project form serialization and project cache key behavior.

The CI workflow runs:

1. Dependency installation with `npm ci`.
2. Prisma Client generation.
3. ESLint.
4. The focused test suite.
5. The production build.

The production build also regenerates Prisma Client through the build script.

## Limitations

1. Notification delivery is not real time. The normal refresh interval is 30 seconds.
2. Notifications are stored in PostgreSQL and are not delivered by email, SMS, push, or WebSockets.
3. Comments do not support replies, reactions, attachments, mentions, rich text, or Markdown.
4. The current test suite does not provide complete route integration coverage for comments and notifications.
5. The project assignment model supports one assigned user per project.
6. The application requires configured external PostgreSQL, Redis, and authentication services.
7. The seed script uses demo credentials and should not be used as production account data.

## Future improvements

1. Add route integration tests for permissions and notification creation.
2. Add optimistic UI updates with rollback for comment operations.
3. Add a background or real time notification delivery strategy if product requirements grow.
4. Add audit history for project changes.
5. Add stronger environment validation during deployment.
6. Add pagination for very large comment threads and notification histories.

## Conclusion

The implementation provides a focused project management workflow with relational persistence, role based security, collaborative comments, and activity notifications. The architecture keeps the assessment scope small while leaving clear extension points for richer collaboration and delivery features.
