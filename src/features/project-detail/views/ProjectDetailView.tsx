"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

import type { WorkItem } from "@/shared/types/work-project";
import { AnimatedTechGrid } from "@/shared/components/AnimatedTechGrid";
import { ProjectEdgeToc } from "../components/ProjectEdgeToc";
import { ProjectOverviewSection } from "../components/sections/ProjectOverviewSection";
import { ProjectBriefSection } from "../components/sections/ProjectBriefSection";
import { ProjectEngineeringSection } from "../components/sections/ProjectEngineeringSection";
import { ProjectFeaturesSection } from "../components/sections/ProjectFeaturesSection";
import { useActiveSection } from "../hooks/useActiveSection";
import { useActiveFeature } from "../hooks/useActiveFeature";

export function ProjectDetailView({ project }: { project: WorkItem }) {
  const detail = project.detail;
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const glowX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const activeSection = useActiveSection();
  const { activeIndex: activeFeatureIndex, setRef: setFeatureRef } = useActiveFeature(
    detail?.features.length ?? 0,
  );

  if (!detail) return null;

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  }

  function handlePointerLeave() {
    mouseX.set(-9999);
    mouseY.set(-9999);
  }

  return (
    <main
      className="group relative bg-[#030303]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="works-grid absolute inset-0" />
        <AnimatedTechGrid mouseX={mouseX} mouseY={mouseY} />
      </div>
      {!reducedMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-0 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            left: glowX,
            top: glowY,
            background: "radial-gradient(circle at center, rgb(167 139 250 / 0.07) 0%, transparent 68%)",
          }}
        />
      ) : null}

      <ProjectEdgeToc activeId={activeSection} accent={project.accent} />

      <div className="relative z-10 mx-auto max-w-7xl overflow-x-clip px-4 pb-24 pt-6 sm:pb-28 sm:pt-8">
        <ProjectOverviewSection project={project} detail={detail} />
        <ProjectBriefSection detail={detail} accent={project.accent} />
        <ProjectEngineeringSection detail={detail} accent={project.accent} />
        <ProjectFeaturesSection
          detail={detail}
          accent={project.accent}
          activeFeatureIndex={activeFeatureIndex}
          setFeatureRef={setFeatureRef}
        />
      </div>
    </main>
  );
}
