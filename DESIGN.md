---
name: Things 4
description: A Things 3-inspired local-first task management PWA
colors:
  bg: "#FFFFFF"
  sidebar: "#F4F4F6"
  text: "#1C1C1E"
  secondary: "#8E8E93"
  muted: "#AEAEB2"
  accent: "#007AFF"
  yellow: "#FFCC00"
  red: "#FF3B30"
  green: "#34C759"
  orange: "#FF9500"
  mint: "#00C7BE"
  teal: "#30B0C7"
  cyan: "#32ADE6"
  purple: "#AF52DE"
  pink: "#FF2D55"
  brown: "#A2845E"
  divider: "#E5E5EA"
  hover: "#E8E8ED"
  tag-bg: "#E5E5EA"
  tag-active: "#636366"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  content-x: "32px"
  content-y: "32px"
  task-y: "9px"
  sidebar-y: "5px"
  section-gap: "32px"
components:
  checkbox:
    width: "18px"
    height: "18px"
    border: "2px solid {colors.muted}"
    rounded: "{rounded.sm}"
    checked-bg: "{colors.accent}"
    checked-border: "{colors.accent}"
  nav-item:
    padding: "5px 8px"
    rounded: "{rounded.md}"
    hover-bg: "{colors.hover}"
    active-bg: "{colors.hover}"
    active-text: "{colors.text}"
    inactive-text: "{colors.secondary}"
  task-item:
    padding: "9px 8px"
    rounded: "{rounded.md}"
    hover-bg: "{colors.hover}"
  input:
    border: "none"
    border-bottom: "1px solid {colors.divider}"
    padding: "4px 0"
    focus-border: "{colors.accent}"
  dialog:
    rounded: "{rounded.lg}"
    padding: "32px"
    shadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
    backdrop: "rgba(0,0,0,0.3)"
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
- Smooth, fluid transitions with subtle haptic-like feedback
- iOS-standard color palette: blue accent, semantic red/green/yellow

## 2. Colors

The palette is drawn from Apple's HIG color system, providing instant recognition for users of Apple devices. Each color carries a specific semantic role.

### Primary
- **iOS Blue** (#007AFF): Primary accent. Used for interactive elements, active states, links, and the primary action button. Appears sparingly: checkbox fills, active nav indicators, focus rings.

### Semantic
- **Sunflower Yellow** (#FFCC00): "Today" indicator. Used exclusively for the Today star icon and today-related scheduling badges.
- **Signal Red** (#FF3B30): Urgency and deadlines. Used for deadline text, delete actions, and urgent indicators.
- **Mint Green** (#34C759): Completion and success. Used for the Logbook icon and completed state indicators.

### Neutral
- **Pure White** (#FFFFFF): Main content background. The primary canvas where tasks live.
- **Cloud Gray** (#F4F4F6): Sidebar background. A warm off-white that separates navigation from content without a hard border.
- **Ink Black** (#1C1C1E): Primary text. High contrast against white for maximum readability.
- **Stone Gray** (#8E8E93): Secondary text. Subtitles, metadata, project names under tasks.
- **Mist Gray** (#AEAEB2): Muted text. Placeholders, inactive states, dates.
- **Divider Gray** (#E5E5EA): Borders and dividers. Used sparingly; most separation is achieved through whitespace.
- **Hover Gray** (#E8E8ED): Hover state background. Subtle highlight on interactive elements.

### Named Rules
**The 10% Accent Rule.** The blue accent appears on less than 10% of any given screen. Its rarity creates visual hierarchy and prevents the interface from feeling "blue-heavy." When in doubt, use the secondary or muted text color instead.

## 3. Typography

**Display Font:** SF Pro Text (system fallback: -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif)
**Body Font:** SF Pro Text (same stack)
**Label Font:** SF Pro Text (same stack, smaller sizes)

**Character:** A single, unified system font that feels native to Apple devices. Hierarchy is achieved through size and weight contrast, not through font family variety. The typography is invisible when done well; it communicates structure without calling attention to itself.

### Hierarchy
- **Display** (600 weight, 26px, line-height 1.2): Screen titles ("Today", "Prepare Presentation"). Appears once per view.
- **Title** (500 weight, 15px, line-height 1.4): Section headers within views ("Slides and notes", "This Evening").
- **Body** (400 weight, 14px, line-height 1.5): Task titles, primary content text. The workhorse of the type system.
- **Label** (500 weight, 11px, letter-spacing 0.02em, uppercase for section headers): Metadata, timestamps, project names under tasks, sidebar section headers.

### Named Rules
**The One-Weight Rule.** All text uses the same font family. Bold is reserved for display headings and active navigation items. Regular weight carries 90% of the interface. This creates a calm, uniform texture that lets content, not typography, dominate.

## 4. Elevation

The system is flat by default. Depth is conveyed through tonal layering: the sidebar's warm gray sits behind the white content area without shadows or borders. Floating elements (dialogs, toasts, detail panels) use a single level of elevation via a soft drop shadow.

### Shadow Vocabulary
- **Floating** (`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)`): Dialogs and modals. The only elevated element in the system.
- **Toast** (`box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1)`): Notification toasts. Lower elevation than dialogs.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only on truly floating elements (dialogs, toasts) that脱离 the main layout. List items, cards, and content blocks never have shadows; their position in the hierarchy is communicated through spacing and tonal contrast.

## 5. Components

### Checkboxes
- **Shape:** Rounded square (4px radius), 18x18px
- **Default:** 2px border in muted gray (#AEAEB2), transparent background
- **Checked:** Solid blue fill (#007AFF), white checkmark via CSS border trick
- **Hover:** Border shifts to blue (#007AFF)
- **Interaction:** Smooth 150ms transition on all state changes

### Navigation Items
- **Shape:** Rounded rectangle (8px radius)
- **Default:** Transparent background, secondary text (#8E8E93)
- **Hover:** Light gray background (#E8E8ED), text darkens to primary (#1C1C1E)
- **Active:** Light gray background (#E8E8ED), text primary (#1C1C1E), icon turns blue (#007AFF)
- **Typography:** 13px, regular weight
- **Internal padding:** 5px vertical, 8px horizontal

### Task Items
- **Shape:** Rounded rectangle (8px radius)
- **Default:** Transparent background
- **Hover:** Light gray background (#E8E8ED)
- **Layout:** Checkbox (18px) + content (flex-1) + metadata (tags, dates)
- **Typography:** 14px body text, 11px metadata in muted gray
- **Internal padding:** 9px vertical, 8px horizontal

### Input Fields
- **Style:** No border, bottom border only (1px solid #E5E5EA)
- **Focus:** Bottom border shifts to blue (#007AFF)
- **Typography:** 14px body text
- **Placeholder:** Muted gray (#AEAEB2)
- **Padding:** 4px vertical

### Dialogs
- **Shape:** Rounded corners (12px radius)
- **Background:** White (#FFFFFF)
- **Shadow:** Floating elevation (0 25px 50px -12px rgba(0,0,0,0.25))
- **Backdrop:** Semi-transparent black with blur (rgba(0,0,0,0.3))
- **Internal padding:** 32px
- **Buttons:** Blue fill for primary (#007AFF), text-only for cancel

### Toast Notifications
- **Shape:** Rounded rectangle (12px radius)
- **Background:** Near-black (#1C1C1E)
- **Text:** White
- **Action:** Blue text (#007AFF) for undo
- **Shadow:** Toast elevation
- **Position:** Bottom center, stacked

## 6. Do's and Don'ts

### Do:
- **Do** use the system font stack (-apple-system, BlinkMacSystemFont) for all text. It provides instant platform familiarity.
- **Do** use whitespace as the primary separator between content blocks. Reserve borders for critical divisions only (sidebar/content, content/panel).
- **Do** keep the blue accent (#007AFF) under 10% of screen area. Its power comes from restraint.
- **Do** use the semantic colors exactly as defined: red for deadlines, yellow for today, green for completion.
- **Do** provide smooth, 150ms transitions on all interactive state changes (hover, focus, active).
- **Do** use 26px for screen titles, 14px for body text, 11px for metadata. This hierarchy is the visual rhythm of the app.

### Don't:
- **Don't** use cream, sand, beige, or warm-tinted backgrounds. This is the "generic SaaS" anti-reference. The background is pure white (#FFFFFF).
- **Don't** add gradient text, glassmorphism, or decorative blur effects. This is the "generic SaaS" anti-reference.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent on list items or cards. This is the "Todoist" anti-reference.
- **Don't** use shadows on list items, cards, or content blocks. Shadows are reserved for floating elements only (dialogs, toasts).
- **Don't** pair two similar sans-serif font families. Use the single system font stack with weight contrast for hierarchy.
- **Don't** animate layout properties (width, height, padding) unless truly necessary. Use transform and opacity for transitions.
- **Don't** use `border-radius` greater than 12px on cards or dialogs. Full-pill (9999px) is fine for tags and buttons; squares stay at 4px.
