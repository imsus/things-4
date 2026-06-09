# ADR-0001: Application Service Architecture

## Status

Accepted

## Context

The codebase had a 487-line god module (app.ts) with 15+ module-level state variables, 12 handler functions, and mixed rendering/business logic. The TaskService was shallow — 18 methods that each repeated a get-mutate-save pattern. Cascade operations leaked across entity seams.

## Decision

Adopt Application Service pattern with deepened repositories:

1. **Application Service** — owns view state, orchestrates use cases, exposes `subscribe(listener)` for reactive rendering. The seam between presentation and domain.
2. **Task Repository** — 4 methods: `get(id)`, `save(task)`, `query(bucket)`, `mutate(id, fn)`. `mutate` throws on not-found.
3. **Scheduling Buckets** — filter values passed to `query(bucket)`, not separate methods.
4. **Cascade functions** — pure domain functions for entity deletion cascades (e.g., `cascadeProjectDeletion`).
5. **Toast** — rendered through lit-html as part of app state, not via separate DOM manipulation.

## Consequences

- **Positive:** State transitions testable without DOM or IndexedDB. Render functions become pure. Repository interface shrinks from 18 to 4 methods. Cascade logic testable in isolation.
- **Negative:** More files (services, repositories). Slightly more indirection for simple operations.
- **Trade-off:** Application Service pattern over Command/Event pattern. Less ceremony, same testability at this scale. May revisit if event sourcing becomes needed.

## Alternatives Considered

- **Command/Event pattern** — more DDD-pure but triples file count for 12 user actions. Rejected for being over-engineered at this scale.
- **setState(partial)** — simpler but doesn't create a testable seam. Rejected in favor of Application Service.
- **Keep cascade in services** — tolerable coupling at 3 entities, but pure functions are trivially testable.
