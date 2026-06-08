# 07 — Search + keyboard shortcuts + PWA

Status: ready-for-agent

## What to build

Add the remaining polish features. Client-side search: search input in the sidebar that filters the current view's tasks by title (case-insensitive `String.includes()`). Keyboard shortcuts: N to focus the task input bar, Escape to close the detail panel, Delete to delete the selected task. PWA: configure vite-plugin-pwa to generate manifest.json and service worker. App is installable on desktop/mobile. Works offline after first load (cache-first strategy for static assets).

## Acceptance criteria

- [ ] Search input in sidebar (or top of content area)
- [ ] Search filters current view's tasks by title (case-insensitive)
- [ ] Search results update as you type (debounced)
- [ ] `N` key focuses the task input bar (when not in an input field)
- [ ] `Escape` key closes the detail panel
- [ ] `Delete` key deletes the currently selected task (with undo toast)
- [ ] vite-plugin-pwa configured with manifest.json (app name, icons, theme color)
- [ ] Service worker caches all static assets
- [ ] App installable via browser's "Add to Home Screen" / install prompt
- [ ] App works offline after first load

## Blocked by

- 01-app-scaffold.md
- 03-undo-toast.md
