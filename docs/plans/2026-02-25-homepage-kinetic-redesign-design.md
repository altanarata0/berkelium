# Homepage Kinetic Redesign — Design Document

**Date:** 2026-02-25
**Direction:** Bold & kinetic scroll theater
**Scope:** Homepage only (`storefront/src/app/(main)/page.tsx`)

## New Dependency

- `framer-motion` — scroll-triggered animations, spring physics, staggered reveals

## New Components

### `AnimatedSection.tsx`
Reusable wrapper using Framer Motion `whileInView` — fades up content with spring when entering viewport. Accepts optional delay and direction props.

### `StaggerText.tsx`
Splits a heading into words, staggers them in with spring physics. Used for hero and section headlines.

### `AnimatedLine.tsx`
A horizontal gold divider line that "draws" itself (width 0% → 100%) when scrolled into view.

## Section Design

### 1. Hero — Cinematic Entrance
- Staggered entrance sequence with `staggerChildren`:
  1. "97" fades in + scales 1.2 → 1.0
  2. "Bk" springs in from below
  3. "Berkelium" label fades in
  4. "Wear the Element" staggers word-by-word
  5. Subtext fades up
  6. CTA button slides up with spring
- Background grid gets slow CSS pulse on opacity
- Floating "97" gets slow vertical float (translateY bob)

### 2. Brand Story — Split Reveal
- Periodic table card slides in from left with spring on scroll
- Text block staggers in from right: label → heading → paragraphs
- Gold line draws itself as section divider

### 3. Featured Products — Staggered Cards
- Label + heading fade up
- Cards stagger in from below (0.15s stagger)
- Hover: scale(1.02) + shadow lift with spring
- "View All" arrow extends on hover

### 4. CTA Banner — Parallax + Scale
- Background pattern gets parallax via `useScroll` + `useTransform`
- Content fades up + scales 0.95 → 1.0
- Elements stagger: gold text → heading → button

### 5. Micro-interactions
- All buttons: `whileHover` scale(1.03), `whileTap` scale(0.98)
- Gold gradient divider lines draw on scroll between sections

## Mobile
- All `whileInView` animations trigger with `once: true`
- Parallax disabled on mobile
- Reduced stagger delays

## Unchanged
- Color palette, typography, layout structure, content
- All other pages, Header, Footer
