"use client";

import { motion } from "framer-motion";

import type { ProjectDetail, TagTone } from "@/shared/types/work-project";
import { ease, supportStyles } from "../../constants/styles";

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.62, ease, delay },
  };
}

export function ProjectBriefSection({ detail }: { detail: ProjectDetail; accent: TagTone }) {
  return (
    <motion.section id="brief" {...reveal(0.04)} className="scroll-mt-8 grid gap-5 pb-24 md:grid-cols-2">
      <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[20px] sm:p-8">
        <p className={`mb-4 font-mono text-xs font-black uppercase tracking-[0.2em] ${supportStyles.tension.text}`}>The problem</p>
        <div className="space-y-4">
          {detail.problem.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[20px] sm:p-8">
        <p className={`mb-4 font-mono text-xs font-black uppercase tracking-[0.2em] ${supportStyles.status.text}`}>The solution</p>
        <div className="space-y-4">
          {detail.solution.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </motion.section>
  );
}
