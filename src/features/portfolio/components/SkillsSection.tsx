"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { skillsContent } from "../constants/skills";

const ease = [0.22, 1, 0.36, 1] as const;

// One accent per row — icon badge, heading, arrows, hover bg
const ROW_ACCENTS = [
  {
    badge: "border-brand-primary/30 bg-brand-primary/10 text-brand-primary",
    heading: "text-brand-primary",
    arrow: "text-brand-primary",
    hover: "hover:bg-brand-primary/8",
  },
  {
    badge: "border-brand-energy/30 bg-brand-energy/10 text-brand-energy",
    heading: "text-brand-energy",
    arrow: "text-brand-energy",
    hover: "hover:bg-brand-energy/8",
  },
  {
    badge: "border-brand-warning/30 bg-brand-warning/10 text-brand-warning",
    heading: "text-brand-warning",
    arrow: "text-brand-warning",
    hover: "hover:bg-brand-warning/8",
  },
];

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease, delay },
  };
}

export function SkillsSection() {
  const gX = useMotionValue(-9999);
  const gY = useMotionValue(-9999);
  const glowX = useSpring(gX, { stiffness: 80, damping: 20 });
  const glowY = useSpring(gY, { stiffness: 80, damping: 20 });

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    const bounds = e.currentTarget.getBoundingClientRect();
    gX.set(e.clientX - bounds.left);
    gY.set(e.clientY - bounds.top);
  }

  function handlePointerLeave() {
    gX.set(-9999);
    gY.set(-9999);
  }

  return (
    <section
      id="skills"
      className="group relative overflow-hidden bg-background px-4 py-24 sm:py-32"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Cursor glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          left: glowX,
          top: glowY,
          background: "radial-gradient(circle at center, rgb(99 102 241 / 0.08) 0%, transparent 68%)",
        }}
      />

      {/* Bottom gradient fill */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-linear-to-t from-brand-accent/5 via-transparent to-transparent"
      />

      {/* Header zone — empty left slot keeps annotation/heading aligned to right column */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-x-16 lg:grid-cols-[2fr_3fr]">
        <div className="hidden lg:block" aria-hidden />
        <div>
          <motion.p {...reveal(0)} className="font-annotation mb-2 text-lg text-muted-foreground sm:text-xl">
            {skillsContent.annotation}
          </motion.p>
          <motion.h2 {...reveal(0.08)} className="text-5xl font-bold leading-none tracking-tight text-foreground sm:text-6xl">
            {skillsContent.heading}
          </motion.h2>
        </div>
      </div>

      {/* Body — each row: [category card | skill group], co-aligned */}
      <div className="relative mx-auto mt-12 max-w-6xl divide-y divide-border-subtle">
        {skillsContent.categories.map((cat, index) => {
          const group = skillsContent.groups[index];
          const accent = ROW_ACCENTS[index] ?? ROW_ACCENTS[0];
          return (
            <div key={cat.title} className="grid grid-cols-1 gap-x-16 py-10 first:pt-0 lg:grid-cols-[2fr_3fr]">
              {/* Category card */}
              <motion.div {...reveal(index * 0.1)} className="mb-8 flex flex-col gap-3 lg:mb-0">
                <div className={`flex size-12 items-center justify-center rounded-md border font-mono text-2xl ${accent.badge}`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{cat.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{cat.description}</p>
              </motion.div>

              {/* Skill group */}
              {group && (
                <motion.div {...reveal(0.16 + index * 0.1)}>
                  <h4 className={`mb-3 text-xl font-bold ${accent.heading}`}>{group.heading}</h4>
                  <div className="flex flex-col">
                    {group.items.map((item) => (
                      <div
                        key={item}
                        className={`flex cursor-default items-center gap-3 border-b border-dashed border-border-subtle py-3 pl-0 transition-all duration-200 hover:pl-2 ${accent.hover}`}
                      >
                        <ArrowRight className={`size-4 shrink-0 ${accent.arrow}`} />
                        <span className="font-medium text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
