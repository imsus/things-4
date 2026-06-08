# Things 4 — Client-Side PWA Todo App

Status: ready-for-agent

## Problem Statement

I want a Things 3-like task management app that runs entirely in the browser as a PWA. No server, no account, no cloud sync — just local data that persists across sessions. The app should capture the core workflow of Things 3 (projects, tags, scheduling buckets, checklist) while being extensible to support multiple views (list, table, kanban, calendar, feed) in the future.

## Solution

A Vite-built PWA using TypeScript, lit-html for rendering, Dexie.js for IndexedDB storage, and Tailwind CSS v4.3 for styling. The app mirrors Things 3's sidebar navigation (Inbox, Today, Upcoming, Anytime, Someday, Projects, Tags, Logbook) with a task list on the left and a detail panel on the right. Data lives entirely in the browser's IndexedDB. The app works offline after first load via a service worker.

## User Stories

1. As a user, I want to create a new task by typing in a fixed input bar at the bottom of the current view, so that I can quickly capture thoughts without friction
2. As a user, I want to mark a task as complete by clicking its circle, so that it moves to the Logbook with a timestamp
3. As a user, I want to uncomplete a task from the Logbook, so that I can restore accidentally completed tasks
4. As a user, I want to delete a task and see a toast with an undo option for 5 seconds, so that I can recover from accidental deletions
5. As a user, I want to edit a task's title, notes, tags, start date, deadline, and checklist in a right-side detail panel, so that I can manage task details without losing context of the task list
6. As a user, I want to create projects to group related tasks, so that I can organize my work by context
7. As a user, I want to assign a color to each project from a predefined palette, so that I can visually distinguish projects in the sidebar
8. As a user, I want to create headings within a project to section tasks (e.g., "Backlog", "In Progress"), so that I can organize tasks within a project
9. As a user, I want to create tags and assign them to tasks, so that I can cross-cutting categorize tasks across projects
10. As a user, I want to assign a color to each tag, so that tags are visually distinct
11. As a user, I want to view my Inbox (tasks with no project), so that I can process unassigned tasks
12. As a user, I want to view Today (tasks with start date today or past), so that I know what's actionable now
13. As a user, I want to view Upcoming (tasks with future start dates), so that I can plan ahead
14. As a user, I want to view Anytime (tasks with no start date that have a project), so that I can pick from available work
15. As a user, I want to view Someday (tasks explicitly marked as someday), so that I can park ideas without losing them
16. As a user, I want to view the Logbook grouped by day, so that I can review what I've accomplished
17. As a user, I want to click a project in the sidebar to see its tasks, so that I can focus on one project at a time
18. As a user, I want to click a tag in the sidebar to see all tasks with that tag, so that I can filter by context
19. As a user, I want to add checklist items to a task, so that I can break down complex tasks into sub-steps
20. As a user, I want to reorder tasks within a view using fractional indexing, so that I can control the order of my work
21. As a user, I want to search tasks by title from the sidebar, so that I can quickly find specific tasks
22. As a user, I want to use keyboard shortcuts (N for new task, Escape to close panel, Delete to delete task), so that I can work efficiently without the mouse
23. As a user, I want the app to be installable as a PWA on my device, so that it feels like a native app
24. As a user, I want the app to work offline after the first load, so that I can use it without an internet connection
25. As a user, I want the sidebar to be fixed on desktop and slide-in on mobile, so that the app works on both screen sizes
26. As a user, I want to delete a project and have its tasks move to Inbox, so that I don't lose work when removing a project
27. As a user, I want to delete a tag and have it removed from all tasks, so that cleanup is automatic
28. As a user, I want to assign a start date and deadline to a task, so that I can schedule my work
29. As a user, I want to mark a task as "someday", so that I can defer it indefinitely without losing it
30. As a user, I want to add plain text notes to a task, so that I can capture additional context
31. As a user, I want the app to remember my data across browser sessions, so that I don't lose my tasks when I close the tab
32. As a user, I want to see task metadata (tags, dates) in the task list, so that I can scan tasks without opening the detail panel

## Implementation Decisions

### Architecture

- **Layered architecture** with four layers: data, domain, services, presentation
- Dependency rule: `presentation` → `services` → `domain` → `data`. No layer reaches up or sideways.
- **Class-based** for data, domain, and services layers
- **Lit-html functions** for presentation (not LitElement, not class-based components)

### Data Layer

- **Dexie.js** as the ORM wrapper on top of IndexedDB
- Schema versioned with Dexie's built-in migration system
- Three stores: `tasks`, `projects`, `tags`
- **IDs**: `crypto.randomUUID()` for all entities
- **Dates**: ISO 8601 strings (`"2025-01-15T10:30:00Z"`) for all date fields
- **Dexie live queries** as the reactivity layer — no separate state management

### Domain Layer

- **Task** class with: id, title, notes, projectId, tags (array of tag IDs), checklist (embedded array), heading (boolean), startDate, deadline, someday, completedAt, deletedAt, order, createdAt, updatedAt
- **ChecklistItem** embedded on Task: id, title, checked, order
- **Project** class with: id, name, color, order, createdAt, updatedAt
- **Tag** class with: id, name, color, order, createdAt, updatedAt
- **ProjectColor** enum: red, orange, yellow, green, mint, teal, cyan, blue, purple, pink, gray, brown
- **Fractional indexing** for task, project, and tag ordering

### Service Layer

- **TaskService** — CRUD, scheduling bucket queries, search, soft delete/undo
- **ProjectService** — CRUD, deletion moves tasks to Inbox
- **TagService** — CRUD, deletion removes tag from all task tag arrays
- Services orchestrate domain + data, expose clean interfaces to presentation

### Presentation Layer

- **Hash routing** — tiny custom router (~30 lines), no library
- Routes: `#/inbox`, `#/today`, `#/upcoming`, `#/anytime`, `#/someday`, `#/projects/:id`, `#/tags/:id`, `#/logbook`
- **Sidebar** — fixed on desktop, slide-in on mobile. Exact Things 3 layout: Inbox, Today, Upcoming, Anytime, Someday, Projects (with colors), Tags (with colors), Logbook
- **Task list** — left side, shows tasks for current view
- **Detail panel** — right side, slides in when a task is clicked. Edit title, notes, tags, start date, deadline, checklist
- **Fixed input bar** — bottom of task list for quick task creation
- **Toast with undo** — 5-second undo on delete/complete
- **Keyboard shortcuts**: N (new task), Escape (close panel), Delete (delete task)
- **Client-side search** — `String.includes()` filtering on task title

### Styling

- **Tailwind CSS v4.3**
- Things 3 aesthetic: clean, minimal, polished

### PWA

- **vite-plugin-pwa** for manifest generation and service worker
- Cache-first strategy for static assets
- Installable via manifest.json

### Testing

- **Vitest** for domain and service layers
- Test seams: data layer (in-memory IndexedDB), domain layer (pure TS), service layer (mock data layer)
- Presentation layer testing deferred (can add @web/test-runner later)

### Storage Details

- **Soft delete** — `completedAt` and `deletedAt` fields (nullable ISO strings)
- **Undo pattern** — task gets `deletedAt` set, toast shown for 5 seconds, timer commits deletion (sets a permanent flag or actually deletes)
- **Scheduling buckets** — computed from task fields, not stored:
  - Inbox: `projectId` is null
  - Today: `startDate` is today or past
  - Upcoming: `startDate` is in the future
  - Anytime: no `startDate` and has a `projectId`
  - Someday: `someday` is true
- **Logbook** — queries `completedAt != null`, grouped by day at render time

### Deletion Behavior

- Delete project → tasks move to Inbox (`projectId` set to null)
- Delete tag → tag ID removed from all task `tags` arrays

## Testing Decisions

- Test external behavior, not implementation details
- Domain layer: test that Task, Project, Tag classes enforce business rules correctly
- Service layer: test that TaskService, ProjectService, TagService correctly orchestrate domain + data (use in-memory Dexie)
- Data layer: test that Dexie schema and queries work correctly with real IndexedDB (via fake-indexeddb polyfill)
- Prior art: Vitest with standard patterns, no custom test utilities needed for v1

## Out of Scope

- **Areas** — hierarchical grouping of projects. Can be added later with nullable `areaId` on Project.
- **Drag and drop** — task reordering via drag. Deferred; use keyboard or "move to" actions for now.
- **Rich text / markdown** in task notes — plain text only for v1.
- **Multiple views** — list only for v1. Table, kanban, calendar, feed views are future work.
- **Cloud sync** — fully client-side, no server.
- **Import/export** — not in v1.
- **Batch operations** — select multiple tasks for bulk actions. Deferred.
- **Headings as separate entity** — headings are tasks with `heading: boolean` flag.

## Further Notes

- The data model is designed for backward compatibility — adding Areas later requires only a nullable `areaId` field on Project, no migration of existing data.
- Adding new views (kanban, calendar, etc.) requires only new files in `src/presentation/views/` — no changes to data or service layers.
- The enum color palette can be extended without breaking existing data.
- The layered architecture makes it possible to swap any layer independently (e.g., replace lit-html with something else, or replace Dexie with raw IndexedDB).
