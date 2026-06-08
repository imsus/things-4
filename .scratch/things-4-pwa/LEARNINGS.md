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
