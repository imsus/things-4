---
name: Things 4
description: A Things 3-inspired local-first task management PWA
colors:
  bg: "#FFFFFF"
  sidebar: "#F5F5F7"
  content-bg: "#FFFFFF"
  text: "#1C1C1E"
  secondary: "#8E8E93"
  muted: "#AEAEB2"
  accent: "#007AFF"
  yellow: "#FFCC00"
  red: "#FF3B30"
  pink: "#FF2D55"
  green: "#34C759"
  orange: "#FF9500"
  purple: "#AF52DE"
  divider: "#E5E5EA"
  hover: "#F2F2F7"
  card-bg: "#F2F2F7"
  tag-bg: "#E8E8ED"
  tag-text: "#636366"
  badge-bg: "#FF3B30"
  checkbox-border: "#C7C7CC"
  checklist-circle: "#007AFF"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.01em"
  section:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  content-x: "48px"
  content-top: "48px"
  task-y: "12px"
  task-x: "16px"
  sidebar-x: "20px"
  sidebar-y: "4px"
  section-gap: "32px"
components:
  checkbox:
    width: "16px"
    height: "16px"
    border: "1.5px solid {colors.checkbox-border}"
    rounded: "{rounded.sm}"
    checked-bg: "{colors.accent}"
    checked-border: "{colors.accent}"
  checklist-circle:
    width: "16px"
    height: "16px"
    border: "2px solid {colors.checklist-circle}"
    rounded: "{rounded.full}"
  nav-item:
    padding: "4px 8px"
    rounded: "{rounded.sm}"
    hover-bg: "{colors.hover}"
    active-bg: "{colors.hover}"
    active-text: "{colors.text}"
    inactive-text: "{colors.secondary}"
  task-item:
    padding: "12px 16px"
    rounded: "{rounded.md}"
    hover-bg: "#F8F8FA"
  section-header:
    color: "{colors.accent}"
    border-bottom: "1px solid {colors.divider}"
    padding-bottom: "8px"
  tag-pill:
    background: "{colors.tag-bg}"
    color: "{colors.tag-text}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
    fontSize: "11px"
  badge:
    background: "{colors.badge-bg}"
    color: "#FFFFFF"
    rounded: "{rounded.full}"
    minWidth: "18px"
    height: "18px"
    fontSize: "11px"
    fontWeight: 600
  dialog:
    rounded: "{rounded.xl}"
    padding: "24px"
    shadow: "0 20px 60px -15px rgba(0,0,0,0.3)"
    backdrop: "rgba(0,0,0,0.4)"
  fab:
    width: "56px"
    height: "56px"
    rounded: "{rounded.full}"
    background: "{colors.accent}"
    shadow: "0 4px 12px rgba(0,122,255,0.4)"
---

# Design System: Things 4

## 1. Overview

**Creative North Star: "The Focus Instrument"**

Things 4 is a precision tool for task management. Like a well-calibrated instrument, it provides exactly the feedback you need and nothing more. The interface recedes into the background, leaving only your tasks and the actions you can take on them.

This system rejects the busy, cluttered aesthetic of Todoist and the bare-bones minimalism of Google Tasks. It rejects the cream-and-gradient warmth of generic SaaS tools. Instead, it finds its identity in the clinical precision of Apple's design language: system fonts, iOS-standard colors, generous whitespace, and interactions that feel native to the platform.

**Key Characteristics:**
- System-native typography (SF Pro) with clear hierarchy through weight and size
- Flat surfaces with tonal layering for depth (no shadows except on floating elements)
- Generous whitespace that lets content breathe
- Inline task expansion instead of separate panels (Things 3's signature interaction)
- Blue section headers with thin underlines as visual anchors
- iOS-standard color palette: blue accent, semantic red/green/yellow

## 2. Colors

The palette is drawn from Apple's HIG color system, providing instant recognition for users of Apple devices. Each color carries a specific semantic role.

### Primary
- **iOS Blue** (#007AFF): Primary accent. Used for interactive elements, active states, section headers, checklist circles, and the primary action button. Appears sparingly: checkbox fills, active nav indicators, focus rings, section header text.

### Semantic
- **Sunflower Yellow** (#FFCC00): "Today" indicator. Used exclusively for the Today star icon and today-related scheduling badges.
- **Signal Red** (#FF3B30): Urgency, deadlines, and notification badges. Used for deadline text, delete actions, urgent indicators, and the red badge count on Today.
- **Mint Green** (#34C759): Completion and success. Used for the Logbook icon and completed state indicators.

### Neutral
- **Pure White** (#FFFFFF): Main content background. The primary canvas where tasks live.
- **Cloud Gray** (#F5F5F7): Sidebar background. A cool off-white that separates navigation from content without a hard border.
- **Ink Black** (#1C1C1E): Primary text. High contrast against white for maximum readability.
- **Stone Gray** (#8E8E93): Secondary text. Subtitles, metadata, project names under tasks.
- **Mist Gray** (#AEAEB2): Muted text. Placeholders, inactive states, dates.
- **Divider Gray** (#E5E5EA): Borders, underlines, and dividers. Used sparingly; most separation is achieved through whitespace.
- **Hover Gray** (#F2F2F7): Hover state background and card backgrounds. Subtle highlight on interactive elements.
- **Checkbox Gray** (#C7C7CC): Checkbox and checklist circle borders in default state.
- **Tag Gray** (#E8E8ED): Tag pill background.
- **Tag Text** (#636366): Tag pill text color.

### Named Rules
**The 10% Accent Rule.** The blue accent appears on less than 10% of any given screen. Its rarity creates visual hierarchy and prevents the interface from feeling "blue-heavy." When in doubt, use the secondary or muted text color instead.

## 3. Typography

**Display Font:** SF Pro Display (system fallback: -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif)
**Body Font:** SF Pro Text (same stack)
**Label Font:** SF Pro Text (same stack, smaller sizes)

**Character:** A single, unified system font that feels native to Apple devices. Hierarchy is achieved through size and weight contrast, not through font family variety. The typography is invisible when done well; it communicates structure without calling attention to itself.

### Hierarchy
- **Display** (700 weight, 28px, line-height 1.2, letter-spacing -0.01em): Screen titles ("Today", "Vacation in Rome"). Appears once per view. Bold, commanding, but not shouting.
- **Title** (600 weight, 20px, line-height 1.3): Task titles when expanded in detail view, project names in sidebar.
- **Body** (400 weight, 15px, line-height 1.4): Task titles in list, primary content text. The workhorse of the type system.
- **Caption** (400 weight, 13px, line-height 1.4): Task notes, secondary content.
- **Label** (500 weight, 11px, letter-spacing 0.01em): Metadata, timestamps, project names under tasks, tag pills.
- **Section** (700 weight, 15px, line-height 1.3): Section headers within projects ("Slides and notes", "This Evening"). Always blue.

### Named Rules
**The One-Weight Rule.** All text uses the same font family. Bold is reserved for display headings, section headers, and active navigation items. Regular weight carries 90% of the interface. This creates a calm, uniform texture that lets content, not typography, dominate.

## 4. Elevation

The system is flat by default. Depth is conveyed through tonal layering: the sidebar's cool gray sits behind the white content area without shadows or borders. Floating elements (dialogs, toasts, search dropdown) use a single level of elevation via a soft drop shadow.

### Shadow Vocabulary
- **Floating** (`box-shadow: 0 20px 60px -15px rgba(0,0,0,0.3)`): Dialogs and modals. The only truly elevated element in the system.
- **Search** (`box-shadow: 0 10px 40px -10px rgba(0,0,0,0.2)`): Search dropdown overlay.
- **Toast** (`box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1)`): Notification toasts. Lower elevation than dialogs.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only on truly floating elements (dialogs, toasts, search dropdown) that脱离 the main layout. List items, cards, and content blocks never have shadows; their position in the hierarchy is communicated through spacing and tonal contrast.

## 5. Components

### Checkboxes
- **Shape:** Rounded square (4px radius), 16x16px
- **Default:** 1.5px border in checkbox gray (#C7C7CC), transparent background
- **Checked:** Solid blue fill (#007AFF), white checkmark via CSS border trick
- **Hover:** Border shifts to blue (#007AFF)
- **Interaction:** Smooth 150ms transition on all state changes

### Checklist Circles
- **Shape:** Perfect circle (full radius), 16x16px
- **Default:** 2px border in blue (#007AFF), transparent background (open circle)
- **Checked:** Solid blue fill (filled circle)
- **Usage:** Used for sub-items within an expanded task, distinct from main task checkboxes

### Navigation Items
- **Shape:** Rounded rectangle (4px radius)
- **Default:** Transparent background, secondary text (#8E8E93)
- **Hover:** Light gray background (#F2F2F7), text darkens to primary (#1C1C1E)
- **Active:** Light gray background (#F2F2F7), text primary (#1C1C1E), icon turns blue (#007AFF)
- **Typography:** 13px, regular weight
- **Internal padding:** 4px vertical, 8px horizontal
- **Icons:** 16-18px, colored per view (blue Inbox, yellow Today star, red Upcoming calendar, green Anytime layers, teal Someday box, green Logbook check, gray Trash)

### Task Items
- **Shape:** No background by default, rounded rectangle (8px radius) on hover
- **Default:** Transparent background
- **Hover:** Very light gray background (#F8F8FA)
- **Layout:** Checkbox (16px) + content (flex-1) + metadata (tags, dates, flags)
- **Typography:** 15px body text for title, 11px label for project name below
- **Internal padding:** 12px vertical, 16px horizontal
- **Sub-text:** Project name appears directly below task title in muted gray

### Section Headers
- **Style:** Blue text (#007AFF), bold (700 weight), 15px
- **Underline:** 1px solid divider gray (#E5E5EA) below the header
- **Menu:** "..." (three dots) on the right side for section actions
- **Usage:** Divide tasks within a project into groups ("Slides and notes", "Preparation", "This Evening")

### Tag Pills
- **Style:** Rounded full capsule, light gray background (#E8E8ED), dark gray text (#636366)
- **Typography:** 11px, medium weight
- **Padding:** 2px vertical, 8px horizontal
- **Usage:** Inline on task items, after the task title

### Date Badges
- **Style:** Rounded full capsule, light gray background (#F2F2F7), blue text (#007AFF)
- **Typography:** 11px, medium weight
- **Usage:** Inline on task items showing start date or deadline

### Notification Badges
- **Style:** Red circle (#FF3B30), white text
- **Shape:** Full radius, minimum 18px width, 18px height
- **Typography:** 11px, semibold (600 weight)
- **Usage:** Count badges on sidebar items (Today shows "1" badge with "8" total)

### Input Fields
- **Style:** No border, bottom border only (1px solid #E5E5EA)
- **Focus:** Bottom border shifts to blue (#007AFF)
- **Typography:** 15px body text
- **Placeholder:** Muted gray (#AEAEB2)
- **Padding:** 4px vertical

### Dialogs
- **Shape:** Rounded corners (16px radius)
- **Background:** White (#FFFFFF)
- **Shadow:** Floating elevation (0 20px 60px -15px rgba(0,0,0,0.3))
- **Backdrop:** Semi-transparent black with blur (rgba(0,0,0,0.4))
- **Internal padding:** 24px
- **Buttons:** Blue fill for primary (#007AFF), text-only for cancel

### Toast Notifications
- **Shape:** Rounded rectangle (12px radius)
- **Background:** Near-black (#1C1C1E)
- **Text:** White
- **Action:** Blue text (#007AFF) for undo
- **Shadow:** Toast elevation
- **Position:** Bottom center, stacked

### Search Dropdown
- **Style:** Floating panel with shadow, rounded corners (12px radius)
- **Input:** Search icon + text input at top
- **Results:** List of locations (projects/views) with icons, then tasks with checkboxes
- **Active:** Blue checkmark on current location
- **Shadow:** Search elevation

### Floating Action Button (Mobile)
- **Shape:** Perfect circle, 56x56px
- **Background:** Blue (#007AFF)
- **Icon:** White plus (+) icon, 24px
- **Shadow:** 0 4px 12px rgba(0,122,255,0.4)
- **Position:** Bottom-right corner, 24px from edges

## 6. Do's and Don'ts

### Do:
- **Do** use the system font stack (-apple-system, BlinkMacSystemFont) for all text. It provides instant platform familiarity.
- **Do** use whitespace as the primary separator between content blocks. Reserve borders for critical divisions only (sidebar/content, section underlines).
- **Do** keep the blue accent (#007AFF) under 10% of screen area. Its power comes from restraint.
- **Do** use the semantic colors exactly as defined: red for deadlines/badges, yellow for today, green for completion.
- **Do** provide smooth, 150ms transitions on all interactive state changes (hover, focus, active).
- **Do** use 28px for screen titles, 15px for body text, 11px for metadata. This hierarchy is the visual rhythm of the app.
- **Do** use inline expansion for task details (click to expand in place), not a separate panel.
- **Do** use blue section headers with thin underlines to divide task groups within projects.
- **Do** use open blue circles for checklist sub-items, distinct from the rounded-square checkboxes for main tasks.

### Don't:
- **Don't** use cream, sand, beige, or warm-tinted backgrounds. This is the "generic SaaS" anti-reference. The background is pure white (#FFFFFF).
- **Don't** add gradient text, glassmorphism, or decorative blur effects. This is the "generic SaaS" anti-reference.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent on list items or cards. This is the "Todoist" anti-reference.
- **Don't** use shadows on list items, cards, or content blocks. Shadows are reserved for floating elements only (dialogs, toasts, search dropdown).
- **Don't** pair two similar sans-serif font families. Use the single system font stack with weight contrast for hierarchy.
- **Don't** animate layout properties (width, height, padding) unless truly necessary. Use transform and opacity for transitions.
- **Don't** use `border-radius` greater than 16px on cards or dialogs. Full-pill (9999px) is fine for tags and buttons; squares stay at 4px.
- **Don't** use a right-side detail panel for task editing. Things 3 expands tasks inline within the list.
