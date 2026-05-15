"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { aboutContent } from "../../constants/about";
import { PhotoStack } from "./PhotoStack";

const ease = [0.22, 1, 0.36, 1] as const;

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease, delay },
  };
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="cursor-default text-foreground underline decoration-brand-primary/40 decoration-1 underline-offset-2 transition-colors duration-200 hover:decoration-brand-primary/80">
      {children}
    </span>
  );
}

export function AboutSection() {
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
      id="about"
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
          background: "radial-gradient(circle at center, rgb(167 139 250 / 0.09) 0%, transparent 68%)",
        }}
      />

      {/* Bottom gradient fill */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-linear-to-t from-brand-primary/5 via-transparent to-transparent"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-start gap-16 lg:grid-cols-[2fr_3fr]">

        {/* Left column — intro + photo stack */}
        <motion.div {...reveal(0)} className="flex flex-col gap-8">
          <p className="text-2xl font-bold leading-snug sm:text-3xl">
            <span className="text-brand-primary">{aboutContent.intro.accent}</span>
            <br />
            <span className="text-foreground">{aboutContent.intro.rest}</span>
          </p>

          <PhotoStack />
        </motion.div>

        {/* Right column — each block reveals independently */}
        <div className="flex flex-col">

          <motion.p {...reveal(0)} className="font-annotation mb-2 text-lg text-muted-foreground sm:text-xl">
            {aboutContent.annotation}
          </motion.p>

          <motion.h2 {...reveal(0.08)} className="text-5xl font-bold leading-none tracking-tight text-foreground sm:text-6xl">
            {aboutContent.heading}
          </motion.h2>

          {/* Bio paragraphs with keyword highlights */}
          <div className="my-12 grid gap-5 sm:grid-cols-2">
            <motion.p {...reveal(0.16)} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              I build <Highlight>end-to-end web products</Highlight> that combine{" "}
              <Highlight>solid engineering</Highlight> with thoughtful user experience.
            </motion.p>
            <motion.p {...reveal(0.24)} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              I love working at the{" "}
              <Highlight>intersection of engineering and design</Highlight>{" "}
              — crafting interfaces that{" "}
              <Highlight>feel as good as they look</Highlight>.
            </motion.p>
          </div>

          <motion.div {...reveal(0.32)}>
            <div className="mb-5 h-px w-full bg-border-subtle" />
            <h3 className="mb-6 text-xl font-bold text-foreground">
              {aboutContent.jobsHeading}
            </h3>
          </motion.div>

          {/* Bento glassmorphism job cards */}
          <div className="flex flex-col gap-3">
            {aboutContent.jobs.map((job, index) => (
              <motion.div
                key={job.role + job.company + job.from}
                {...reveal(0.36 + index * 0.09)}
                className="flex items-center justify-between gap-4 rounded-xl border border-border-subtle bg-surface-elevated/60 px-5 py-4 backdrop-blur-sm"
              >
                <span className="font-semibold text-foreground">{job.role}</span>
                <span className="hidden text-sm text-muted-foreground sm:block">{job.company}</span>
                <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                  {job.from}&nbsp;→&nbsp;{job.to}
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
