# 06 — Scheduling buckets + Logbook

Status: ready-for-agent

## What to build

Implement the scheduling bucket views and Logbook. Each bucket is a computed view that queries tasks based on their fields — no separate storage. Today view: tasks where startDate is today or past. Upcoming: tasks where startDate is in the future. Anytime: tasks with no startDate that have a projectId. Someday: tasks where someday is true. Logbook: tasks where completedAt is not null, grouped by completion day. Each view uses the same task list component with the same detail panel.

## Acceptance criteria

- [ ] Today view: queries tasks where `startDate <= today` and `completedAt` is null
- [ ] Upcoming view: queries tasks where `startDate > today` and `completedAt` is null
- [ ] Anytime view: queries tasks where `startDate` is null and `projectId` is not null and `completedAt` is null
- [ ] Someday view: queries tasks where `someday` is true and `completedAt` is null
- [ ] Logbook view: queries tasks where `completedAt` is not null
- [ ] Logbook groups tasks by completion day (Today, Yesterday, Monday Jan 13, etc.)
- [ ] Each bucket view shows task count in sidebar
- [ ] Each bucket view uses the same task list and detail panel as Inbox
- [ ] Date fields (startDate, deadline) are editable from task detail panel
- [ ] Project view (`#/projects/:id`) shows tasks for that project
- [ ] Tag view (`#/tags/:id`) shows tasks with that tag
- [ ] Empty states for each view ("No tasks for today", etc.)

## Blocked by

- 02-task-lifecycle.md
- 04-project-crud.md
