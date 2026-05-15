"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

import type { ProjectDetail, TagTone } from "@/shared/types/work-project";
import { accentStyles, CHALLENGE_LABELS, CHALLENGE_TONES, ease } from "../../constants/styles";

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.62, ease, delay },
  };
}

export function ProjectEngineeringSection({ detail, accent }: { detail: ProjectDetail; accent: TagTone }) {
  const styles = accentStyles[accent];

  return (
    <section id="engineering" className="scroll-mt-8 pb-24">
      <motion.div {...reveal(0)} className="mb-8 max-w-2xl">
        <p className={`mb-3 font-mono text-xs font-black uppercase tracking-[0.2em] ${styles.text}`}>Engineering</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Challenges that shaped the system
        </h2>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2">
        {detail.challenges.map((challenge, index) => {
          const tone = CHALLENGE_TONES[index % CHALLENGE_TONES.length];
          const label = CHALLENGE_LABELS[index % CHALLENGE_LABELS.length];
          return (
            <motion.article
              key={challenge.title}
              {...reveal(index * 0.08)}
              className={`flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[20px] ${index === 0 ? "md:col-span-2" : ""}`}
            >
              <span className={`self-start rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] ${tone.border} ${tone.bg} ${tone.text}`}>
                {label}
              </span>

              <h3 className="text-xl font-semibold leading-snug text-foreground">{challenge.title}</h3>

              <p className="text-sm leading-7 text-muted-foreground">{challenge.description}</p>

              {challenge.solution && (
                <div className="flex items-start gap-2">
                  <Zap size={13} className={`mt-1 shrink-0 ${tone.text}`} />
                  <p className={`text-sm italic leading-6 ${tone.text} opacity-90`}>{challenge.solution}</p>
                </div>
              )}

              <p className={`border-l-2 pl-3 text-sm leading-7 text-foreground/80 ${tone.border}`}>
                {challenge.outcome}
              </p>

              {challenge.tags && challenge.tags.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                  {challenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
