# Learnings

## Issue #1: App scaffold + shell layout

- **Vite vanilla-ts template cancels when directory has existing files.** Set up manually instead: create package.json, tsconfig.json, vite.config.ts, index.html by hand.
- **Vitest needs `jsdom` environment for DOM tests.** Add `test: { environment: 'jsdom' }` to vite.config.ts and install `jsdom` as dev dep.
- **CSS import needs `vite-env.d.ts`** with `/// <reference types="vite/client" />` for TypeScript to recognize `.css` imports.
- **Tailwind v4.3 uses `@tailwindcss/vite` plugin.** Just `@import "tailwindcss"` in CSS file, no config needed.
- **Router:** keep it simple — hash-based, ~50 lines. No library needed. `addRoute(pattern, paramNames)` with regex conversion.
- **Test counts:** 6 tests total (3 colors, 3 router). Good foundation.
- **Build output:** ~11.7kb JS, ~13.5kb CSS (gzipped: ~4.7kb + ~3.5kb). Tiny.

## Issue #2: Task lifecycle (create, list, edit, complete)

- **Dexie `equals('')` for null fields.** Dexie indexes don't store null well — use empty string as sentinel for "no value" when querying with `.where().equals()`.
- **`fake-indexeddb`** is needed for testing Dexie in Vitest. Import `'fake-indexeddb/auto'` at top of test file.
- **Domain model: pure functions, no classes.** `createTask()`, `completeTask()`, `uncompleteTask()` return new objects. Easier to test, easier to reason about.
- **Service layer: async methods that call domain functions, then persist.** `TaskService.complete(id)` → `get task` → `completeTask(task)` → `db.tasks.put(updated)`.
- **Live queries from Dexie for reactivity.** `liveQuery(() => db.tasks.where(...).and(...).sortBy(...))` returns an Observable. Subscribe in the app to re-render.
- **Test count: 22 total** (3 colors, 3 router, 8 task domain, 8 task service).
- **Build output: ~116kb JS** (includes Dexie + fake-indexeddb in bundle). Gzipped: ~38kb. Still reasonable.

## Issue #3: Undo toast on delete/complete

- **lit-html `render()` doesn't play well with `document.body.innerHTML = ''` in tests.** Use direct DOM manipulation (`document.createElement`) for standalone UI pieces like toasts that live outside the lit-html render tree.
- **Toast: module-level singleton container** appended to `document.body`. `showToast()` creates elements directly, no lit-html needed.
- **Undo pattern:** perform action first, show toast, if undo clicked within 5s reverse it. Simple and effective.
- **Test count: 26 total** (+4 toast tests).

## Issue #4: Project CRUD + color

- **Dexie `where().equals()` works for indexed fields.** `projectId` is indexed, so querying tasks by project is fast.
- **Delete cascade:** when deleting a project, iterate tasks and set `projectId = null` (move to Inbox).
- **Dialog pattern:** create a DOM element, use lit-html `render()` inside it, resolve a Promise on close. Clean separation from the main app render tree.
- **Test count: 32 total** (+2 project domain, +4 project service).

## Issue #5: Tag CRUD + color

- **Array fields can't be indexed in Dexie.** `tags: string[]` on Task means you can't use `.where('tags').equals(id)`. Query all tasks and filter in memory instead.
- **Delete cascade for tags:** iterate all tasks, filter out the deleted tag ID from each task's `tags` array.
- **Test count: 36 total** (+4 tag service).

## Issue #6: Scheduling buckets + Logbook

- **Scheduling buckets are computed views, not stored entities.** Today/Upcoming/Anytime/Someday are just different filter functions on the same task data.
- **Date comparison:** use ISO string comparison (`startDate <= today`) since dates are stored as ISO strings.
- **Test count: 36 total** (no new tests — queries are just filters on existing data).

## Issue #7: Search + keyboard shortcuts + PWA

- **Search:** simple `String.toLowerCase().includes()` — no fuzzy search needed for a personal todo app.
- **Keyboard shortcuts:** listen on `document`, check `target.tagName` to avoid triggering in inputs.
- **vite-plugin-pwa:** just add to vite.config.ts, it generates manifest.json and service worker automatically.
- **Test count: 36 total** (no new tests — presentation-layer features).
