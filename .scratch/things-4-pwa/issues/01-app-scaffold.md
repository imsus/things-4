# 01 — App scaffold + shell layout

Status: ready-for-agent

## What to build

Set up the Vite + TypeScript project with Tailwind CSS v4.3, lit-html, and Dexie.js. Create the layered architecture (data, domain, services, presentation). Build the sidebar with all navigation items (Inbox, Today, Upcoming, Anytime, Someday, Projects, Tags, Logbook). Implement hash routing. Create the three-panel layout shell: fixed sidebar on left, task list content area in middle, detail panel placeholder on right. Sidebar slides in on mobile.

## Acceptance criteria

- [ ] Vite project with TypeScript, lit-html, Dexie.js, Tailwind CSS v4.3
- [ ] Layered directory structure: `src/data/`, `src/domain/`, `src/services/`, `src/presentation/`
- [ ] Sidebar renders all navigation items matching Things 3 layout
- [ ] Hash routing works for all routes (`#/inbox`, `#/today`, `#/upcoming`, `#/anytime`, `#/someday`, `#/projects/:id`, `#/tags/:id`, `#/logbook`)
- [ ] Three-panel layout: sidebar, content area, detail panel area
- [ ] Sidebar is fixed on desktop, slides in from left on mobile
- [ ] Active route is highlighted in sidebar
- [ ] ProjectColor enum defined (red, orange, yellow, green, mint, teal, cyan, blue, purple, pink, gray, brown)

## Blocked by

None — can start immediately
