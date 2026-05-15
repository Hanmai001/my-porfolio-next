"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { WorkItem } from "../../types";
import { reveal } from "../../constants/animations";
import { ACCENT, handleSpotlightMove, spotlightStyle } from "../../constants/workStyles";
import { Magnetic } from "../Magnetic";
import { WorkTagChip } from "./WorkTagChip";

export function WorkProjectCard({ project, index }: { project: WorkItem; index: number }) {
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
            <WorkTagChip key={tag} label={tag} accent={project.accent} />
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
      {project.detail && (
        <Link
          href={`/projects/${project.slug}`}
          className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover/card:translate-y-0"
        >
          <div className={`flex items-center justify-center gap-1.5 py-2.5 font-mono text-[0.65rem] font-black uppercase tracking-widest ${a.bg} ${a.text}`}>
            View Project <ArrowUpRight size={11} />
          </div>
        </Link>
      )}
    </motion.div>
  );
}
