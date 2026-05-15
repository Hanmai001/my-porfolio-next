"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

import { worksContent } from "../../constants/works";
import type { WorkCategory, WorkFilter, WorkItem } from "../../types";
import { AnimatedTechGrid } from "./AnimatedTechGrid";
import { WorkFilterBar } from "./WorkFilterBar";
import { WorkFeaturedCard } from "./WorkFeaturedCard";
import { WorkProjectCard } from "./WorkProjectCard";
import { revealDrop } from "../../constants/animations";

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
      <div aria-hidden className="works-grid pointer-events-none absolute inset-0 z-0" />
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
          <WorkFilterBar activeFilter={activeFilter} onChange={setActiveFilter} />
        </div>
      </div>

      {/* Featured project */}
      <div key={`${activeFilter}-featured`} className="relative z-10 mx-auto max-w-6xl">
        {featured && <WorkFeaturedCard project={featured} />}
      </div>

      {/* Regular projects grid */}
      <div key={`${activeFilter}-grid`} className="relative z-10 mx-auto mt-5 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2">
        {rest.map((project, index) => (
          <WorkProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
