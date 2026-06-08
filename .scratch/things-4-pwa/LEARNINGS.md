# Learnings

## Issue #1: App scaffold + shell layout

- **Vite vanilla-ts template cancels when directory has existing files.** Set up manually instead: create package.json, tsconfig.json, vite.config.ts, index.html by hand.
- **Vitest needs `jsdom` environment for DOM tests.** Add `test: { environment: 'jsdom' }` to vite.config.ts and install `jsdom` as dev dep.
- **CSS import needs `vite-env.d.ts`** with `/// <reference types="vite/client" />` for TypeScript to recognize `.css` imports.
- **Tailwind v4.3 uses `@tailwindcss/vite` plugin.** Just `@import "tailwindcss"` in CSS file, no config needed.
- **Router:** keep it simple — hash-based, ~50 lines. No library needed. `addRoute(pattern, paramNames)` with regex conversion.
- **Test counts:** 6 tests total (3 colors, 3 router). Good foundation.
- **Build output:** ~11.7kb JS, ~13.5kb CSS (gzipped: ~4.7kb + ~3.5kb). Tiny.
