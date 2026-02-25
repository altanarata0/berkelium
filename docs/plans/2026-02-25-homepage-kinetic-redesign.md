# Homepage Kinetic Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the static homepage into a bold, kinetic scroll theater with Framer Motion animations on every section.

**Architecture:** Add `framer-motion` as a dependency. Create 3 small animation components (`FadeIn`, `StaggerText`, `AnimatedLine`) in `storefront/src/components/animation/`. Split the homepage into a server component (data fetching) and a client component (`HomeContent`) that handles all animations. Each section gets scroll-triggered reveals with staggered children and spring physics.

**Tech Stack:** Framer Motion, Next.js App Router (client/server split), Tailwind CSS v4, React 19

---

### Task 1: Install framer-motion

**Files:**
- Modify: `storefront/package.json`

**Step 1: Install the dependency**

Run: `cd /Users/altanarata/berkelium/storefront && pnpm add framer-motion`

**Step 2: Verify installation**

Run: `cd /Users/altanarata/berkelium/storefront && node -e "require('framer-motion')"`
Expected: No errors

**Step 3: Commit**

```bash
cd /Users/altanarata/berkelium/storefront
git add package.json pnpm-lock.yaml
git commit -m "feat: add framer-motion dependency"
```

---

### Task 2: Create FadeIn animation component

**Files:**
- Create: `storefront/src/components/animation/FadeIn.tsx`

**Step 1: Create the component**

```tsx
"use client"

import { motion } from "framer-motion"
import { type ReactNode } from "react"

type FadeInProps = {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right" | "none"
  delay?: number
  duration?: number
  once?: boolean
}

const directionOffset = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
}

export function FadeIn({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = true,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay,
        duration,
      }}
    >
      {children}
    </motion.div>
  )
}
```

**Step 2: Verify build**

Run: `cd /Users/altanarata/berkelium/storefront && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add storefront/src/components/animation/FadeIn.tsx
git commit -m "feat: add FadeIn animation component"
```

---

### Task 3: Create StaggerText animation component

**Files:**
- Create: `storefront/src/components/animation/StaggerText.tsx`

**Step 1: Create the component**

```tsx
"use client"

import { motion } from "framer-motion"

type StaggerTextProps = {
  text: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  className?: string
  staggerDelay?: number
  once?: boolean
}

const containerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
}

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

export function StaggerText({
  text,
  as: Tag = "h1",
  className,
  staggerDelay = 0.08,
  once = true,
}: StaggerTextProps) {
  const words = text.split(" ")

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        className="inline"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.5 }}
        custom={staggerDelay}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.25em]"
            variants={wordVariants}
            aria-hidden="true"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}
```

**Step 2: Verify build**

Run: `cd /Users/altanarata/berkelium/storefront && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add storefront/src/components/animation/StaggerText.tsx
git commit -m "feat: add StaggerText animation component"
```

---

### Task 4: Create AnimatedLine component

**Files:**
- Create: `storefront/src/components/animation/AnimatedLine.tsx`

**Step 1: Create the component**

```tsx
"use client"

import { motion } from "framer-motion"

type AnimatedLineProps = {
  className?: string
  delay?: number
}

export function AnimatedLine({ className, delay = 0 }: AnimatedLineProps) {
  return (
    <div className={className}>
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-california-gold/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay,
        }}
        style={{ transformOrigin: "center" }}
      />
    </div>
  )
}
```

**Step 2: Verify build**

Run: `cd /Users/altanarata/berkelium/storefront && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add storefront/src/components/animation/AnimatedLine.tsx
git commit -m "feat: add AnimatedLine component"
```

---

### Task 5: Add CSS animations for hero background

**Files:**
- Modify: `storefront/src/app/globals.css`

**Step 1: Add keyframes to globals.css**

Append after the existing `slideIn` keyframe block (after line 53):

```css
/* Hero background pulse */
@keyframes gridPulse {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.06; }
}

/* Floating element bob */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

**Step 2: Verify build**

Run: `cd /Users/altanarata/berkelium/storefront && npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add storefront/src/app/globals.css
git commit -m "feat: add hero CSS keyframe animations"
```

---

### Task 6: Create HomeContent client component and rewrite Hero section

This is the main task. The current `page.tsx` is an async server component. We need to:
1. Create a `HomeContent` client component with all the animated sections
2. Keep `page.tsx` as the server component that fetches data and passes it to `HomeContent`

**Files:**
- Create: `storefront/src/components/home/HomeContent.tsx`
- Modify: `storefront/src/app/(main)/page.tsx`

**Step 1: Create HomeContent.tsx with all 4 animated sections**

```tsx
"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { FadeIn } from "@/components/animation/FadeIn"
import { StaggerText } from "@/components/animation/StaggerText"
import { AnimatedLine } from "@/components/animation/AnimatedLine"
import { ProductCard } from "@/components/product/ProductCard"

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const heroItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
}

const heroBadgeItem = {
  hidden: { opacity: 0, scale: 1.2 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
}

type HomeContentProps = {
  products: any[]
}

export function HomeContent({ products }: HomeContentProps) {
  const ctaRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  })
  const ctaParallaxY = useTransform(ctaProgress, [0, 1], ["-10%", "10%"])

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-berkeley-blue min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background pattern — periodic table grid with pulse */}
        <div
          className="absolute inset-0"
          style={{
            animation: "gridPulse 6s ease-in-out infinite",
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(253,181,21,1) 1px, transparent 1px), linear-gradient(90deg, rgba(253,181,21,1) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Floating element number with bob animation */}
        <div
          className="absolute top-1/4 left-8 md:left-16 opacity-[0.06] select-none"
          style={{ animation: "float 8s ease-in-out infinite" }}
        >
          <span className="text-[12rem] md:text-[20rem] font-heading font-bold text-california-gold leading-none">
            97
          </span>
        </div>

        {/* Main content — staggered entrance */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Element badge */}
          <motion.div
            className="inline-flex flex-col items-center mb-8"
            variants={heroBadgeItem}
          >
            <div className="w-32 h-40 border-2 border-california-gold/30 flex flex-col items-center justify-center mb-8 hover:border-california-gold/60 transition-colors duration-500">
              <motion.span
                className="text-xs text-california-gold/60 font-body tracking-[0.3em]"
                variants={heroItem}
              >
                97
              </motion.span>
              <motion.span
                className="text-6xl font-heading font-bold text-california-gold leading-none mt-1"
                variants={heroItem}
              >
                Bk
              </motion.span>
              <motion.span
                className="text-[10px] text-california-gold/60 font-body tracking-[0.2em] uppercase mt-2"
                variants={heroItem}
              >
                Berkelium
              </motion.span>
            </div>
          </motion.div>

          {/* Headline — word-by-word stagger */}
          <motion.div variants={heroItem}>
            <StaggerText
              text="Wear the Element"
              as="h1"
              className="text-off-white font-heading text-4xl md:text-6xl lg:text-7xl tracking-tight mb-6"
              staggerDelay={0.1}
            />
          </motion.div>

          {/* Subtext */}
          <motion.p
            className="text-off-white/50 font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            variants={heroItem}
          >
            High quality apparel inspired by element 97.
          </motion.p>

          {/* CTA button with spring hover/tap */}
          <motion.div variants={heroItem}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              <Link
                href="/shop"
                className="inline-block bg-california-gold text-berkeley-blue font-body text-sm tracking-[0.3em] uppercase px-10 py-4 hover:bg-california-gold/90 transition-colors duration-300"
              >
                Shop Now
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-california-gold/30 to-transparent" />
      </section>

      {/* ── Animated divider ─────────────────────────────────────── */}
      <AnimatedLine />

      {/* ── Brand Story ───────────────────────────────────────────── */}
      <section id="story" className="bg-off-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left — element detail, slides in from left */}
            <FadeIn direction="right" className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="w-48 h-56 border-2 border-berkeley-blue/15 flex flex-col items-center justify-center">
                  <span className="text-xs text-berkeley-blue/40 font-body tracking-[0.3em]">
                    97
                  </span>
                  <span className="text-7xl font-heading font-bold text-berkeley-blue leading-none mt-1">
                    Bk
                  </span>
                  <span className="text-[10px] text-berkeley-blue/40 font-body tracking-[0.2em] uppercase mt-2">
                    Berkelium
                  </span>
                  <span className="text-[9px] text-berkeley-blue/30 font-body tracking-wider mt-1">
                    (247)
                  </span>
                </div>
                {/* Decorative atomic number */}
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-california-gold flex items-center justify-center">
                  <span className="text-berkeley-blue text-xs font-bold font-body">
                    97
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Right — narrative, staggers in from right */}
            <div>
              <FadeIn direction="left" delay={0.1}>
                <span className="text-xs font-body tracking-[0.4em] uppercase text-california-gold mb-4 block">
                  The Element
                </span>
              </FadeIn>
              <FadeIn direction="left" delay={0.2}>
                <StaggerText
                  text="Element 97. Berkelium."
                  as="h2"
                  className="font-heading text-3xl md:text-4xl text-charcoal mb-6 leading-tight"
                  staggerDelay={0.08}
                />
              </FadeIn>
              <FadeIn direction="left" delay={0.3}>
                <div className="space-y-4 text-charcoal/70 font-body leading-relaxed">
                  <p>
                    In 1949, researchers at the University of California, Berkeley
                    synthesized element 97 — Berkelium. Named after the city and the
                    university, it became part of the periodic table forever.
                  </p>
                  <p>
                    We put it on hoodies, tees, and hats. A mark rooted in
                    discovery, worn with intention.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── Animated divider ─────────────────────────────────────── */}
      <AnimatedLine />

      {/* ── Featured Products ─────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-body tracking-[0.4em] uppercase text-california-gold mb-3 block">
                  Collection
                </span>
                <StaggerText
                  text="Featured"
                  as="h2"
                  className="font-heading text-3xl md:text-4xl text-charcoal"
                />
              </div>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link
                  href="/shop"
                  className="text-sm font-body tracking-[0.2em] uppercase text-berkeley-blue hover:text-california-gold transition-colors duration-300 hidden md:block"
                >
                  View All &rarr;
                </Link>
              </motion.div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product: any, i: number) => (
              <FadeIn key={product.id} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="mt-10 text-center md:hidden">
            <Link
              href="/shop"
              className="text-sm font-body tracking-[0.2em] uppercase text-berkeley-blue hover:text-california-gold transition-colors duration-300"
            >
              View All Products &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── Animated divider ─────────────────────────────────────── */}
      <AnimatedLine />

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section ref={ctaRef} className="bg-berkeley-blue py-20 md:py-28 relative overflow-hidden">
        {/* Subtle diagonal line decoration with parallax */}
        <motion.div
          className="absolute inset-0 opacity-[0.04]"
          style={{ y: ctaParallaxY }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(253,181,21,1) 40px, rgba(253,181,21,1) 41px)",
            }}
          />
        </motion.div>

        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <FadeIn delay={0}>
            <p className="text-california-gold/60 font-body text-xs tracking-[0.5em] uppercase mb-6">
              Actinide Series &middot; Period 7
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <StaggerText
              text="Wear the element."
              as="h2"
              className="font-heading text-3xl md:text-5xl text-off-white mb-2 leading-tight"
              staggerDelay={0.1}
            />
            <StaggerText
              text="Element 97."
              as="h2"
              className="font-heading text-3xl md:text-5xl text-off-white mb-8 leading-tight"
              staggerDelay={0.1}
            />
          </FadeIn>
          <FadeIn delay={0.3}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              <Link
                href="/shop"
                className="inline-block border-2 border-california-gold text-california-gold font-body text-sm tracking-[0.3em] uppercase px-10 py-4 hover:bg-california-gold hover:text-berkeley-blue transition-all duration-300"
              >
                Shop the Collection
              </Link>
            </motion.div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
```

**Step 2: Update page.tsx to use HomeContent**

Replace the entire contents of `storefront/src/app/(main)/page.tsx` with:

```tsx
import { getProducts } from "@/lib/data"
import { HomeContent } from "@/components/home/HomeContent"

export default async function HomePage() {
  const products = await getProducts(3)

  return <HomeContent products={products} />
}
```

**Step 3: Verify build**

Run: `cd /Users/altanarata/berkelium/storefront && npx next build`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add storefront/src/components/home/HomeContent.tsx storefront/src/app/\(main\)/page.tsx
git commit -m "feat: animated homepage with scroll theater"
```

---

### Task 7: Final verification

**Step 1: Full build**

Run: `cd /Users/altanarata/berkelium/storefront && npx next build`
Expected: Build succeeds cleanly

**Step 2: Grep for old patterns**

Run: `grep -r "rejected\|offered.*mark\|picked it up" storefront/src/`
Expected: Zero matches

**Step 3: Verify no TypeScript errors**

Run: `cd /Users/altanarata/berkelium/storefront && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit if any fixes were needed, otherwise done**
