"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import type { ProjectDetail, WorkItem } from "@/shared/types/work-project";
import { Magnetic } from "@/shared/components/Magnetic";
import { accentStyles, ease } from "../../constants/styles";
import { HorizontalStackedImageSlider } from "../HorizontalStackedImageSlider";

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.62, ease, delay },
  };
}

export function ProjectOverviewSection({ project, detail }: { project: WorkItem; detail: ProjectDetail }) {
  const styles = accentStyles[project.accent];

  return (
    <>
      <header className="mb-14 flex items-center justify-between gap-4">
        <Magnetic strength={0.1}>
          <Link
            href="/#works"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-foreground/80 backdrop-blur-[20px] transition-colors hover:border-white/20 hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back to works
          </Link>
        </Magnetic>
        <span className={`font-mono text-xs font-black uppercase tracking-[0.22em] ${styles.text}`}>
          Case study
        </span>
      </header>

      <motion.section
        id="overview"
        layoutId={`project-card-${project.slug}`}
        className="scroll-mt-8 grid gap-10 pb-24 lg:grid-cols-[1fr_0.95fr] lg:items-end"
      >
        <motion.div {...reveal(0)} className="space-y-7">
          <div className="space-y-4">
            <span className={`inline-flex rounded-full border px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.18em] ${styles.border} ${styles.bg} ${styles.text}`}>
              {project.subtitle}
            </span>
            <h1 className="max-w-4xl text-2xl font-bold leading-none tracking-tight text-foreground sm:text-3xl lg:text-5xl">
              {project.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {detail.tagline}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Role", value: project.role },
              { label: "Timeline", value: project.period },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-[20px]">
                <p className="font-mono text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground sm:text-base">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-3 py-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] ${styles.border} ${styles.bg} ${styles.text}`}
              >
                {tag}
              </span>
            ))}
          </div>

          {project.links?.demo || project.links?.github ? (
            <div className="flex flex-wrap gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_18px_50px_rgb(0_0_0/0.26)] backdrop-blur-[20px]">
              {project.links?.demo ? (
                <Magnetic strength={0.12}>
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] transition-transform ${styles.border} ${styles.bg} ${styles.text}`}
                  >
                    Live demo <ArrowUpRight size={14} />
                  </a>
                </Magnetic>
              ) : null}
              {project.links?.github ? (
                <Magnetic strength={0.12}>
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-foreground transition-colors hover:border-white/20"
                  >
                    Github <ArrowUpRight size={14} />
                  </a>
                </Magnetic>
              ) : null}
            </div>
          ) : null}
        </motion.div>

        <motion.div {...reveal(0.08)}>
          <HorizontalStackedImageSlider slides={detail.previewSlides} accent={project.accent} />
        </motion.div>
      </motion.section>
    </>
  );
}
