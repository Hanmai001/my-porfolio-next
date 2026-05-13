<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project Identity

This repository is a modern portfolio website focused on premium UI/UX, polished interactions, animation-rich moments, and a smooth responsive experience.

Agents working here should optimize for visual quality, clarity, and motion that supports the content rather than distracting from it.

# Architecture

- Use the App Router under `src/app` as the source of truth for routing and layouts.
- Treat route groups like `src/app/(home)` as composition shells for shared UI, not as URL segments.
- Keep feature-specific code in `src/features` and shared primitives in `src/shared`.
- Prefer reusable, composable UI building blocks over one-off page-specific implementations.
- Keep route components thin: pages should assemble views, not contain most of the UI logic.
- Use `src/shared/config/constants.ts` for route and app constants instead of scattering hard-coded strings.

# Next.js Rules

- Assume Server Components by default.
- Add `"use client"` only when a component needs state, effects, event handlers, browser APIs, or client-side animation orchestration.
- Keep client boundaries as small as possible so the browser bundle stays lean.
- Use `metadata` or `generateMetadata` for SEO and social metadata on pages and layouts.
- Use `loading.tsx` for route-level skeletons and progressive reveal states.
- Prefer `Link` for navigation, `Image` for images, and `next/font` for fonts.
- Use route groups, nested layouts, and loading states to structure the experience cleanly.
- Be intentional with data fetching and caching because `cacheComponents: true` is enabled in `next.config.ts`.
- Avoid request-time APIs in shared root layouts unless the entire app should become dynamic.
- Keep performance-sensitive work on the server when possible, and only move data to the client when interactivity requires it.

# UI/UX Principles

- Build clean, spacious, responsive-first layouts.
- Keep typography intentional, with strong hierarchy for headings and softer secondary text.
- Favor balanced whitespace, clear alignment, and calm visual rhythm.
- Make hover, focus, pressed, loading, and disabled states feel refined and consistent.
- Preserve accessible semantics, keyboard support, and visible focus handling.
- Use subtle micro-interactions to add polish, not noise.
- Avoid generic, overly safe, or visually inconsistent UI patterns.
- When in doubt, align with the existing design language rather than introducing a new one.

# Palette Usage

- Treat the palette as a semantic system, not a set of random accent colors.
- Actively inspect existing tokens before introducing new colors or gradients.
- Use dark slate background surfaces to create layered depth with subtle contrast.
- Use `#38BDF8` for CTAs, active states, important highlights, links, and interaction focus.
- Use `#34D399` for success states, skills, completed interactions, and subtle glow cues.
- Use `#818CF8` for animated highlights, gradients, motion accents, and hover transitions.
- Use primary text for headings and key content that needs the strongest contrast.
- Use secondary text for descriptions, supporting copy, and quieter UI labels.
- Avoid arbitrary accent colors unless there is a clear semantic reason that the system does not already cover.
- Keep color usage consistent across cards, buttons, badges, navigation, and status indicators.

# Visual Consistency

- Keep every component aligned to the same surface, border, and spacing language.
- Prefer modern card and panel styling with soft borders, restrained elevation, and layered depth.
- Use subtle gradients, faint glows, and glass-like treatment only when they add clarity or premium feel.
- Avoid cluttered layouts, excessive shadows, and neon-style saturation.
- Keep spacing and corner radius choices consistent across related components.
- Preserve a cohesive technology-focused look across shells, controls, navigation, and content cards.
- Make motion, color, and typography reinforce the same visual system instead of competing with each other.

# Animation Rules

- Use Framer Motion as the default animation engine for component and page motion.
- Use Lenis for global smooth scrolling, and keep it mounted from a single client boundary.
- Use GSAP only for advanced cases such as complex timelines, SplitText-style work, or text choreography.
- Treat animation as part of UX, not decoration.
- Keep motion purposeful, smooth, and lightweight.
- Favor subtle fades, slides, staggered reveals, hover micro-interactions, and soft glow effects.
- Avoid aggressive bouncing, distracting motion, and over-animation.
- Prefer transform and opacity-based animation so updates stay GPU-friendly.
- Aim for 60fps where possible and avoid layout-thrashing animation patterns.
- Respect `prefers-reduced-motion` and provide calmer alternatives when needed.
- Avoid decorative motion that competes with reading, navigation, or task completion.
- Keep animation code inside the smallest practical Client Component boundary.
- Match animation style to the product tone: polished, modern, and restrained rather than flashy.

# Component Design

- Ensure every new component preserves palette harmony and typography hierarchy.
- Design for hover, active, loading, and transition states from the start.
- Keep responsive behavior explicit so layouts remain balanced on small and large screens.
- Prefer visual cohesion across buttons, cards, badges, inputs, and navigation elements.
- Use motion and color to clarify state, not to create noise.
- Check that each component feels like it belongs to the same premium system before merging it in.

# Inspiration

- Aim for a visual direction inspired by Vercel, Linear, Raycast, and modern AI/devtool products.
- The interface should feel developer-centric, futuristic-but-minimal, elegant, and performant.
- Use that inspiration as a quality bar, not as permission to copy familiar patterns without adapting them to the product.

# Styling and Components

- Prefer Tailwind utilities plus shared design tokens over ad hoc CSS.
- Keep global styling centralized in `src/app/globals.css` and extend existing tokens before adding new visual systems.
- Reuse the shared primitives in `src/shared/components/ui` before creating new variants.
- Extend existing primitives instead of duplicating button, card, input, badge, or label behavior.
- Build components composition-first: small, focused, and easy to combine.
- Keep responsive behavior explicit and test at narrow and wide breakpoints.
- Maintain consistency in spacing, radius, border treatment, and interaction states across components.

# Code Quality

- Prefer readability over cleverness.
- Keep naming explicit and aligned with the domain.
- Minimize duplication by extracting shared logic and visual patterns.
- Use typed props and explicit data shapes for feature and UI components.
- Keep components and modules small enough to scan quickly.
- Avoid over-engineering abstractions unless they clearly reduce repetition or improve maintainability.

# Performance Expectations

- Lazy-load heavy client-only features when they are not needed immediately.
- Optimize images and avoid layout shift.
- Avoid unnecessary client state, rerenders, and prop churn.
- Keep server-rendered content as server-rendered content whenever possible.
- Use skeletons, streaming, and progressive disclosure where they improve perceived speed.
- Favor simple, predictable data flows that keep the UI responsive.

# AI Agent Behavior

- Inspect the existing patterns before making changes.
- Match the current structure in `src/app`, `src/features`, and `src/shared`.
- Stay aligned with the established visual direction instead of introducing a conflicting style.
- Proactively suggest polish improvements when they fit the design, but do not over-engineer.
- Prefer incremental improvements that preserve maintainability and cohesion.
- If a new dependency or animation library is proposed, justify it against the current stack and the user experience benefit.

# Practical Defaults

- Use the repo’s current tooling and conventions first.
- Follow the existing feature-slice organization when adding new work.
- Keep changes focused, scalable, and easy for the next agent to extend.
