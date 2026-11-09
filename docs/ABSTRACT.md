# Abstract

## Problem

Small project teams need a simple place to manage work, assign projects, track progress, and communicate. Without a shared dashboard, project information can become scattered across messages, spreadsheets, and separate tools.

## Objective

Dimovtax provides a focused project management dashboard for a small organization. The system combines project administration, role based access, collaboration, and activity awareness in one web application.

## Target users

### Administrators

Administrators manage the project workspace. They can view users, create projects, assign projects, update project details, change project status, and delete projects.

### Assigned users

Assigned users view their projects, open project details, post comments, edit or delete their own comments, and receive notifications about relevant activity.

## Main features

1. Credentials and Google authentication.
2. Administrator and regular user roles.
3. Project creation, editing, assignment, and deletion.
4. Project search, filtering, pagination, and dashboard charts.
5. Project detail pages with deadlines, budgets, status, and assignee information.
6. Project comments with author information and basic editing.
7. In app notifications for assignments, status changes, and comments.
8. Redis caching for project list reads.
9. Responsive desktop and mobile navigation.
10. Prisma migrations and seed data for repeatable setup.

## Scope decisions

The application intentionally uses in app notifications only. It does not include email, SMS, push delivery, WebSockets, file attachments, nested comments, reactions, mentions, rich text, or Markdown.

## Expected outcome

The result is a small but complete project management workflow. An administrator can assign work, an assigned user can collaborate through comments, and relevant users can see activity through the notification bell.
