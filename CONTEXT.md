# Things 4

A client-side PWA task management app inspired by Things 3. Runs entirely in the browser with no server — data persists in IndexedDB.

## Language

### Core Entities

**Task**:
The fundamental unit of work. Has a title, optional notes, scheduling dates, and belongs to at most one Project.
_Avoid_: Todo, item, card

**Project**:
A named collection of Tasks with a color. Tasks are assigned to a Project or left in Inbox.
_Avoid_: Folder, list, board

**Tag**:
A cross-cutting label that can be applied to multiple Tasks. Has a name and color.
_Avoid_: Label, category

**ChecklistItem**:
A sub-step embedded within a Task. Has a title, checked state, and order. Lives inside the Task's `checklist` array, not a separate entity.
_Avoid_: Subtask, checkbox

**Heading**:
A Task with `heading: true`. Acts as a section divider within a Project. Not completable.
_Avoid_: Section, divider, group

### Scheduling Buckets

**Inbox**:
The default location for Tasks with no Project. A computed view, not a stored entity.
_Areat_: Unassigned, default

**Today**:
Tasks whose StartDate is today or in the past. A computed view.
_Avoid_: Due today, active

**Upcoming**:
Tasks whose StartDate is in the future. A computed view.
_Avoid_: Scheduled, future

**Anytime**:
Tasks with no StartDate that belong to a Project. A computed view.
_Avoid_: Available, backlog

**Someday**:
Tasks explicitly marked with `someday: true`. Deferred indefinitely. A computed view.
_Avoid_: Maybe, later

**Logbook**:
Tasks with a non-null CompletedAt. Grouped by completion day. A computed view.
_Avoid_: Archive, history, completed

### Dates

**StartDate**:
The date a Task becomes available. Determines which scheduling bucket a Task appears in.
_Avoid_: When, scheduled date, available date

**Deadline**:
The date a Task is due. Optional. Displayed separately from StartDate.
_Avoid_: Due date, due

### Scheduling Concepts

**CompletedAt**:
ISO timestamp set when a Task is marked complete. Null means active. Used for Logbook and undo.
_Avoid_: Done date, finished

**DeletedAt**:
ISO timestamp set when a Task is deleted. Null means not deleted. Used for undo (toast with 5-second window).
_Avoid_: Trash date

**Order**:
A fractional number used for sorting Tasks, Projects, and Tags. New items get `Date.now()`, reordering uses fractional values between neighbors.
_Avoid_: Position, rank, sort order

**Someday** (flag):
Boolean on Task. When true, the Task appears in the Someday bucket regardless of dates.
_Avoid_: Deferred, parked

### Visual

**ProjectColor**:
An enum of 12 predefined colors (red, orange, yellow, green, mint, teal, cyan, blue, purple, pink, gray, brown) used by both Projects and Tags.
_Avoid_: Color scheme, palette

### Architectural

**Application Service**:
Orchestrates use cases. Owns view state, calls domain functions and repository, notifies subscribers on state change. The seam between presentation and domain.
_Avoid_: Controller, manager, handler

**Repository**:
Persistence abstraction. Four methods: get, save, query, mutate. Mutate throws on not-found.
_Avoid_: DAO, store, data access

**Bucket**:
A scheduling bucket filter value (Inbox, Today, Upcoming, Anytime, Someday, Logbook). Passed to Repository.query() to retrieve matching Tasks.
_Avoid_: Filter, view, list

**Cascade**:
A pure domain function that produces updated entities when a parent is deleted (e.g., cascadeProjectDeletion moves Tasks to Inbox).
_Avoid_: Cleanup, propagation
