"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { reveal } from "../../constants/animations";
import { ACCENT, handleSpotlightMove, spotlightStyle } from "../../constants/workStyles";
import type { WorkItem } from "../../types";
import { Magnetic } from "../Magnetic";
import { WorkImageStack } from "./WorkImageStack";
import { WorkTagChip } from "./WorkTagChip";

export function WorkFeaturedCard({ project }: { project: WorkItem }) {
  const a = ACCENT[project.accent];
  return (
    <motion.div
      {...reveal(0.24)}
      layoutId={project.detail ? `project-card-${project.slug}` : undefined}
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
              <WorkTagChip key={tag} label={tag} accent={project.accent} />
            ))}
          </div>

          <div className="min-h-8">
            <div className="flex flex-wrap gap-3">
              {project.detail ? (
                <Magnetic strength={0.1}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`inline-flex items-center gap-1.5 font-mono text-sm font-black uppercase tracking-widest transition-opacity duration-200 hover:opacity-70 ${a.text}`}
                  >
                    View Project <ArrowUpRight size={14} />
                  </Link>
                </Magnetic>
              ) : null}
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
          <WorkImageStack accent={project.accent} />
        </div>
      </div>
    </motion.div>
  );
}
