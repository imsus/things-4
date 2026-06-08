# 02 — Task lifecycle (create, list, edit, complete)

Status: ready-for-agent

## What to build

Implement the full task lifecycle end-to-end. Dexie schema for Task store. Task domain class with validation. TaskService with CRUD operations, scheduling queries, and soft delete. Inbox view showing tasks with no project. Fixed input bar at the bottom for quick task creation. Task list renders each task with circle (completion), title, tags, dates. Click task to open detail panel on the right. Detail panel allows editing title, notes, tags (multi-select), start date, deadline, checklist items, someday flag. Click circle to complete (sets completedAt). Uncomplete from task detail. Tasks ordered by fractional indexing.

## Acceptance criteria

- [ ] Dexie schema with `tasks` store and all Task fields
- [ ] Task domain class with `complete()`, `uncomplete()`, `addChecklistItem()`, `removeChecklistItem()` methods
- [ ] TaskService with `create()`, `update()`, `delete()`, `complete()`, `uncomplete()`, `getInboxTasks()`, `getById()`
- [ ] Inbox view shows tasks where `projectId` is null, ordered by `order`
- [ ] Fixed input bar at bottom — type title, press Enter to create task
- [ ] Task list item shows: circle, title, tag pills, start date icon, deadline icon
- [ ] Click circle to complete task (sets `completedAt` to now)
- [ ] Click task title to open detail panel
- [ ] Detail panel: editable title, notes textarea, tag multi-select, start date picker, deadline picker, checklist with add/check/reorder, someday toggle
- [ ] Changes in detail panel persist to IndexedDB immediately
- [ ] Fractional indexing for task ordering (new tasks get `Date.now()` as order)
- [ ] ChecklistItem embedded as JSON array on Task
- [ ] Dates stored as ISO strings
- [ ] IDs generated with `crypto.randomUUID()`

## Blocked by

- 01-app-scaffold.md
