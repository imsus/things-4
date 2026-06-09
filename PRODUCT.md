# Product

## Register

product

## Users

Developer power users who want a local-first, keyboard-driven task management tool. They value privacy (no server, data stays in the browser), speed, and keyboard efficiency. They use it daily for personal productivity, managing projects and tasks across work and life contexts.

## Product Purpose

A Things 3-inspired PWA that runs entirely in the browser. No accounts, no cloud sync, no server. Tasks persist in IndexedDB. The app should feel instant, distraction-free, and keyboard-navigable. Success is a tool that gets out of the way and lets you focus on your work.

## Brand Personality

Clean, calm, focused. The interface should feel like a quiet, well-organized desk. No visual noise, no unnecessary elements. Every pixel earns its place.

## Anti-references

- **Google Tasks**: Bare-bones, uninspired, Google Material default. Feels like an afterthought.
- **Generic SaaS**: Cream/sand backgrounds, gradient text, marketing buzzwords, hero-metric templates. Feels AI-generated and impersonal.
- **Todoist**: Busy, cluttered, red-heavy interface. Too much visual noise for a calm productivity tool.

## Design Principles

1. **Local-first, privacy-by-default**: No server, no accounts, no telemetry. Data stays in the browser.
2. **Keyboard-first**: Every action reachable without the mouse. Shortcuts should feel natural, not mnemonic.
3. **Minimal chrome**: The interface disappears. Content (tasks, projects) is the UI.
4. **Instant feedback**: No loading states, no spinners. IndexedDB is fast; the app should feel instant.
5. **Progressive complexity**: Simple by default, powerful when you need it. Headings, tags, scheduling are there when you want them, invisible when you don't.

## Accessibility & Inclusion

- WCAG 2.1 AA compliance target
- Keyboard navigation for all interactive elements
- Reduced motion support via `prefers-reduced-motion`
- Sufficient contrast ratios (4.5:1 body text, 3:1 large text)
- Screen reader friendly: semantic HTML, ARIA labels where needed
