# 04 — Project CRUD + color

Status: ready-for-agent

## What to build

Implement project management. Dexie schema for Project store. Project domain class. ProjectService with CRUD operations. Create project dialog/modal with name and color picker (enum colors). Projects listed in sidebar with color dot. Click project in sidebar to view its tasks. Rename and delete projects from sidebar context menu or edit mode. Deleting a project moves all its tasks to Inbox (projectId set to null). Assign tasks to projects from the task detail panel (project dropdown). Headings: create heading within a project (task with `heading: true` flag), render as section dividers in the task list.

## Acceptance criteria

- [ ] Dexie schema with `projects` store (id, name, color, order, createdAt, updatedAt)
- [ ] Project domain class with validation
- [ ] ProjectService with `create()`, `update()`, `delete()`, `getAll()`, `getById()`
- [ ] Create project flow: name input + color picker from enum palette
- [ ] Projects appear in sidebar with color dot and name
- [ ] Click project in sidebar routes to `#/projects/:id` and shows that project's tasks
- [ ] Rename project inline or via edit mode
- [ ] Delete project with confirmation — tasks move to Inbox
- [ ] Task detail panel has project dropdown to assign/reassign task
- [ ] Task detail panel has "Add heading" action within a project
- [ ] Headings render as section dividers (not completable) in project task list
- [ ] Tasks below a heading are visually grouped under it

## Blocked by

- 02-task-lifecycle.md
