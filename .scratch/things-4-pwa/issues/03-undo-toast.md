# 03 — Undo toast on delete/complete

Status: ready-for-agent

## What to build

Add a toast notification system that appears at the bottom of the screen when a task is deleted or completed. The toast shows a message and an "Undo" button. It stays visible for 5 seconds, then dismisses automatically. If the user clicks Undo within that window, the action is reversed. For delete: set `deletedAt` on the task, start timer, if timer expires the task is permanently removed. For complete: same pattern with `completedAt`.

## Acceptance criteria

- [ ] Toast component renders at bottom-center of screen
- [ ] Toast shows message ("Task deleted", "Task completed") and "Undo" button
- [ ] Toast auto-dismisses after 5 seconds
- [ ] Clicking Undo within 5 seconds reverses the action
- [ ] Delete sets `deletedAt` first (soft), then permanently removes after timer expires
- [ ] Complete sets `completedAt` first, then Undo clears it
- [ ] Multiple toasts can stack (if user deletes two tasks quickly)
- [ ] Toast has a subtle enter/exit animation

## Blocked by

- 02-task-lifecycle.md
