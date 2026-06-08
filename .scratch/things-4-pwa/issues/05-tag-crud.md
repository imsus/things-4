# 05 — Tag CRUD + color

Status: ready-for-agent

## What to build

Implement tag management. Dexie schema for Tag store. Tag domain class. TagService with CRUD operations. Create tag dialog with name and color picker. Tags listed in sidebar with color dot. Click tag in sidebar to view all tasks with that tag. Rename and delete tags. Deleting a tag removes its ID from all task `tags` arrays. Assign tags to tasks from the task detail panel (multi-select). Tags appear as colored pills in the task list.

## Acceptance criteria

- [ ] Dexie schema with `tags` store (id, name, color, order, createdAt, updatedAt)
- [ ] Tag domain class with validation
- [ ] TagService with `create()`, `update()`, `delete()`, `getAll()`, `getById()`
- [ ] Create tag flow: name input + color picker from enum palette
- [ ] Tags appear in sidebar with color dot and name
- [ ] Click tag in sidebar routes to `#/tags/:id` and shows all tasks with that tag
- [ ] Rename tag inline or via edit mode
- [ ] Delete tag — removes tag ID from all task `tags` arrays
- [ ] Task detail panel has tag multi-select to add/remove tags
- [ ] Tags appear as colored pills in task list items
- [ ] Tags appear as colored pills in task detail panel

## Blocked by

- 02-task-lifecycle.md
