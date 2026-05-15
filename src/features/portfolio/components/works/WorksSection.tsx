"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties, PointerEvent } from "react";

import { worksContent, type WorkCategory, type WorkItem } from "../../constants/works";
import type { TagTone } from "../../types";
import { Magnetic } from "../Magnetic";
import { AnimatedTechGrid } from "./AnimatedTechGrid";

const ease = [0.22, 1, 0.36, 1] as const;
const cardSpring = { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] as const };
const workFilters = ["All", "AI/LLM", "E-commerce", "Web3"] as const;
type WorkFilter = (typeof workFilters)[number];

type SpotlightStyle = CSSProperties & {
  "--spotlight-x"?: string;
  "--spotlight-y"?: string;
};

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease, delay },
  };
}

function revealDrop(delay = 0) {
  return {
    initial: { opacity: 0, y: -18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.55, ease, delay },
  };
}

function handleSpotlightMove(event: PointerEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
}

function spotlightStyle(accent: TagTone): SpotlightStyle {
  const tint =
    accent === "secondary"
      ? "rgb(52 211 153 / 0.15)"
      : accent === "accent"
        ? "rgb(129 140 248 / 0.15)"
        : accent === "warning"
          ? "rgb(236 179 46 / 0.13)"
          : accent === "energy"
            ? "rgb(224 29 90 / 0.14)"
            : "rgb(56 189 248 / 0.15)";

  return {
    "--spotlight-x": "50%",
    "--spotlight-y": "0%",
    background: `radial-gradient(circle at var(--spotlight-x) var(--spotlight-y), ${tint}, transparent 34rem), rgb(5 8 14 / 0.72)`,
  };
}

// ─── Accent tokens ────────────────────────────────────────────────────────────

const ACCENT: Record<TagTone, {
  border: string; bg: string; text: string; bar: string;
}> = {
  primary:   { border: "border-brand-primary/30",   bg: "bg-brand-primary/8",   text: "text-brand-primary",   bar: "bg-brand-primary" },
  secondary: { border: "border-brand-secondary/30", bg: "bg-brand-secondary/8", text: "text-brand-secondary", bar: "bg-brand-secondary" },
  accent:    { border: "border-brand-accent/30",    bg: "bg-brand-accent/8",    text: "text-brand-accent",    bar: "bg-brand-accent" },
  warning:   { border: "border-brand-warning/30",   bg: "bg-brand-warning/8",   text: "text-brand-warning",   bar: "bg-brand-warning" },
  energy:    { border: "border-brand-energy/30",    bg: "bg-brand-energy/8",    text: "text-brand-energy",    bar: "bg-brand-energy" },
};

// 3 gradient screens per accent tone (static — Tailwind needs full class strings)
const SCREEN_TINTS: Record<TagTone, [string, string, string]> = {
  primary:   ["from-brand-primary/25 via-surface-elevated to-brand-accent/10",   "from-surface-elevated to-brand-primary/15",   "from-brand-accent/15 via-surface-elevated to-brand-primary/20"],
  secondary: ["from-brand-secondary/25 via-surface-elevated to-brand-primary/10","from-surface-elevated to-brand-secondary/15", "from-brand-primary/15 via-surface-elevated to-brand-secondary/20"],
  accent:    ["from-brand-accent/25 via-surface-elevated to-brand-secondary/10", "from-surface-elevated to-brand-accent/15",    "from-brand-secondary/15 via-surface-elevated to-brand-accent/20"],
  warning:   ["from-brand-warning/25 via-surface-elevated to-brand-accent/10",   "from-surface-elevated to-brand-warning/15",   "from-brand-accent/15 via-surface-elevated to-brand-warning/20"],
  energy:    ["from-brand-energy/25 via-surface-elevated to-brand-primary/10",   "from-surface-elevated to-brand-energy/15",    "from-brand-primary/15 via-surface-elevated to-brand-energy/20"],
};

const STACK_SLOTS = [
  { x: 0,  y: 0,  rotate: -1, scale: 1,    opacity: 1,    zIndex: 30 },
  { x: 14, y: 10, rotate:  2, scale: 0.94, opacity: 0.65, zIndex: 20 },
  { x: 28, y: 20, rotate:  4, scale: 0.87, opacity: 0.38, zIndex: 10 },
];

const FAN_STACK_SLOTS = [
  { x: -8, y: -4, rotate: -3, scale: 1,    opacity: 1,    zIndex: 30 },
  { x: 28, y: 12, rotate:  4, scale: 0.94, opacity: 0.72, zIndex: 20 },
  { x: 58, y: 28, rotate:  8, scale: 0.86, opacity: 0.45, zIndex: 10 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TagChip({ label, accent }: { label: string; accent: TagTone }) {
  const a = ACCENT[accent];
  return (
    <Magnetic strength={0.08} className="inline-flex">
      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-black uppercase tracking-wider ${a.border} ${a.bg} ${a.text}`}>
        {label}
      </span>
    </Magnetic>
  );
}

function FilterBar({
  activeFilter,
  onChange,
}: {
  activeFilter: WorkFilter;
  onChange: (filter: WorkFilter) => void;
}) {
  return (
    <motion.div
      {...reveal(0.16)}
      className="mt-6 flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter works"
    >
      {workFilters.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <Magnetic key={filter} strength={0.1}>
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(filter)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] backdrop-blur-[20px] transition-colors duration-200 ${
                isActive
                  ? "border-brand-primary/60 bg-brand-primary text-primary-foreground shadow-[0_0_24px_rgb(56_189_248/0.2)]"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          </Magnetic>
        );
      })}
    </motion.div>
  );
}

function ScreenSkeleton() {
  return (
    <div aria-hidden className="flex h-full flex-col gap-3 p-5">
      {/* Fake nav bar */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 rounded bg-white/10" />
        <div className="h-2 flex-1 rounded bg-white/5" />
        <div className="h-2 w-8 rounded bg-white/10" />
      </div>
      {/* Fake content rows */}
      <div className="mt-2 flex flex-col gap-2">
        <div className="h-6 w-40 rounded bg-white/8" />
        <div className="h-2 w-full rounded bg-white/5" />
        <div className="h-2 w-4/5 rounded bg-white/5" />
      </div>
      {/* Fake table/grid */}
      <div className="mt-1 grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 rounded bg-white/5" />
        ))}
      </div>
      {/* Fake status row */}
      <div className="mt-auto flex items-center gap-2">
        <div className="size-2 rounded-full bg-white/20" />
        <div className="h-2 w-20 rounded bg-white/8" />
      </div>
    </div>
  );
}

function ProjectImageStack({ accent }: { accent: TagTone }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 140, damping: 22, mass: 0.35 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 140, damping: 22, mass: 0.35 });
  const tints = SCREEN_TINTS[accent];

  useEffect(() => {
    if (reducedMotion || paused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, reducedMotion]);

  function handleStackMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateX.set(y * -7);
    rotateY.set(x * 9);
  }

  function resetStack() {
    setHovered(false);
    setPaused(false);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      className="relative w-full perspective-[900px]"
      style={{ aspectRatio: "16/10", rotateX: smoothRotateX, rotateY: smoothRotateY }}
      onPointerEnter={() => {
        setHovered(true);
        setPaused(true);
      }}
      onPointerMove={handleStackMove}
      onPointerLeave={resetStack}
    >
      {([0, 1, 2] as const).map((cardIndex) => {
        const slotIndex = (cardIndex - activeIndex + 3) % 3;
        const slots = hovered ? FAN_STACK_SLOTS : STACK_SLOTS;
        const slot = reducedMotion ? STACK_SLOTS[0] : slots[slotIndex];
        return (
          <motion.div
            key={cardIndex}
            animate={{
              x: slot.x,
              y: slot.y,
              rotate: slot.rotate,
              scale: slot.scale,
              opacity: reducedMotion && slotIndex !== 0 ? 0 : slot.opacity,
              zIndex: slot.zIndex,
            }}
            transition={reducedMotion ? { duration: 0 } : cardSpring}
            className={`absolute inset-0 cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-linear-to-br ${tints[cardIndex]} shadow-2xl ${cardIndex === 0 ? "" : "max-md:hidden"}`}
            onClick={() => setActiveIndex(cardIndex)}
          >
            <ScreenSkeleton />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── Featured card ────────────────────────────────────────────────────────────

function FeaturedCard({ project }: { project: WorkItem }) {
  const a = ACCENT[project.accent];
  return (
    <motion.div
      {...reveal(0.24)}
      onPointerMove={handleSpotlightMove}
      style={spotlightStyle(project.accent)}
      className="group/card relative mt-12 overflow-hidden rounded-2xl border-[0.5px] border-white/[0.12] p-8 shadow-[0_24px_80px_rgb(0_0_0/0.42)] backdrop-blur-[20px] transition-colors duration-300 hover:border-brand-primary/25 sm:p-10"
    >
      {/* Accent bar */}
      <div className={`pointer-events-none absolute left-0 top-0 h-full w-1 rounded-l-2xl ${a.bar}`} />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[3fr_2fr]">
        {/* Left — content */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-md border px-2.5 py-1 font-mono text-xs font-black uppercase tracking-widest ${a.border} ${a.bg} ${a.text}`}>
              {project.subtitle}
            </span>
            <span className="font-mono text-[0.8rem] font-bold text-foreground/70">{project.period}</span>
          </div>

          <h3 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {project.title}
          </h3>

          <p className="line-clamp-3 text-base leading-[1.65] text-muted-foreground sm:text-lg">
            {project.description}
          </p>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Role</span>
            <span className="h-px flex-1 bg-border-subtle" />
            <span className={`font-mono text-xs font-black uppercase tracking-[0.1em] ${a.text}`}>{project.role}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TagChip key={tag} label={tag} accent={project.accent} />
            ))}
          </div>

          <div className="min-h-8">
            <div className="flex flex-wrap gap-3">
              {project.links?.demo ? (
                <Magnetic strength={0.1}>
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 font-mono text-sm font-black uppercase tracking-widest transition-opacity duration-200 hover:opacity-70 ${a.text}`}>
                    Live Demo <ArrowUpRight size={14} />
                  </a>
                </Magnetic>
              ) : null}
              {project.links?.github ? (
                <Magnetic strength={0.1}>
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-sm font-black uppercase tracking-widest text-muted-foreground transition-opacity duration-200 hover:text-foreground">
                    GitHub <ArrowUpRight size={14} />
                  </a>
                </Magnetic>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right — stacked image carousel */}
        <div className="w-full px-4 py-2 lg:px-0">
          <ProjectImageStack accent={project.accent} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Small project card ───────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: WorkItem; index: number }) {
  const a = ACCENT[project.accent];
  return (
    <motion.div
      {...reveal(0.34 + index * 0.1)}
      onPointerMove={handleSpotlightMove}
      style={spotlightStyle(project.accent)}
      className={`group/card relative flex min-h-76 flex-col gap-4 overflow-hidden rounded-xl border-[0.5px] border-white/[0.12] p-6 shadow-[0_18px_60px_rgb(0_0_0/0.32)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1.5 hover:border-opacity-100 ${a.border}`}
    >
      {/* Accent top bar — slides in on hover */}
      <div className={`pointer-events-none absolute left-0 top-0 h-0.5 w-full ${a.bar} opacity-0 transition-opacity duration-300 group-hover/card:opacity-100`} />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-md border font-mono text-base font-black ${a.border} ${a.bg} ${a.text}`}>
          {project.title[0]}
        </div>
        <span className="font-mono text-[0.78rem] font-bold text-foreground/65">{project.period}</span>
      </div>

      {/* Title + subtitle */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold leading-tight text-foreground">{project.title}</h3>
        <p className={`mt-0.5 font-mono text-xs font-black uppercase tracking-widest ${a.text}`}>{project.subtitle}</p>
      </div>

      {/* Description */}
      <p className="line-clamp-2 text-sm leading-[1.65] text-muted-foreground">{project.description}</p>

      {/* Footer: tags + optional link */}
      <div className="mt-auto flex min-h-16 items-end justify-between gap-3 pb-6 pt-2">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} label={tag} accent={project.accent} />
          ))}
          {project.tags.length > 3 && (
            <span className="font-mono text-[0.6rem] text-muted-foreground">+{project.tags.length - 3}</span>
          )}
        </div>
        {project.links?.demo && (
          <Magnetic strength={0.12}>
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer"
              aria-label={`View ${project.title}`}
              className={`pointer-events-auto relative z-10 shrink-0 transition-opacity duration-200 hover:opacity-70 ${a.text}`}>
              <ArrowUpRight size={16} />
            </a>
          </Magnetic>
        )}
      </div>

      {/* Slide-up "View Project" bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover/card:translate-y-0">
        <div className={`flex items-center justify-center gap-1.5 py-2.5 font-mono text-[0.65rem] font-black uppercase tracking-widest ${a.bg} ${a.text}`}>
          View Project <ArrowUpRight size={11} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function WorksSection() {
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("All");
  const gX = useMotionValue(-9999);
  const gY = useMotionValue(-9999);
  const glowX = useSpring(gX, { stiffness: 80, damping: 20 });
  const glowY = useSpring(gY, { stiffness: 80, damping: 20 });

  function handlePointerMove(e: PointerEvent<HTMLElement>) {
    const bounds = e.currentTarget.getBoundingClientRect();
    gX.set(e.clientX - bounds.left);
    gY.set(e.clientY - bounds.top);
  }

  function handlePointerLeave() {
    gX.set(-9999);
    gY.set(-9999);
  }

  const allProjects: readonly WorkItem[] = worksContent.projects;
  const categoryFilter: WorkCategory | null = activeFilter === "All" ? null : activeFilter;
  const visibleProjects = categoryFilter
    ? allProjects.filter((project) => project.categories.includes(categoryFilter))
    : allProjects;
  const [featured, ...rest] = visibleProjects;

  return (
    <section
      id="works"
      className="group relative overflow-hidden bg-[#030303] px-4 py-24 sm:py-32"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Static section texture */}
      <div
        aria-hidden
        className="works-grid pointer-events-none absolute inset-0 z-0"
      />
      <AnimatedTechGrid mouseX={gX} mouseY={gY} />

      {/* Cursor glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-0 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          left: glowX,
          top: glowY,
          background: "radial-gradient(circle at center, rgb(167 139 250 / 0.08) 0%, transparent 68%)",
        }}
      />

      {/* Bottom gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-72 bg-linear-to-t from-brand-primary/5 via-transparent to-transparent"
      />

      {/* Header zone */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-x-16 lg:grid-cols-[2fr_3fr]">
        <div className="hidden lg:block" aria-hidden />
        <div>
          <motion.p {...revealDrop(0)} className="font-annotation mb-2 text-lg text-muted-foreground sm:text-xl">
            {worksContent.annotation}
          </motion.p>
          <motion.h2 {...revealDrop(0.08)} className="text-5xl font-bold leading-none tracking-tight text-foreground sm:text-6xl">
            {worksContent.heading}
          </motion.h2>
          <FilterBar activeFilter={activeFilter} onChange={setActiveFilter} />
        </div>
      </div>

      {/* Featured project */}
      <div key={`${activeFilter}-featured`} className="relative z-10 mx-auto max-w-6xl">
        {featured && <FeaturedCard project={featured} />}
      </div>

      {/* Regular projects grid */}
      <div key={`${activeFilter}-grid`} className="relative z-10 mx-auto mt-5 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2">
        {rest.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
