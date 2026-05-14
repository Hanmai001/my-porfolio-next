import type { TagTone } from "../types";

export const heroContent = {
  name: "HELEN MAI",
  annotation: "My name is",
  status: "OPEN TO SELECTIVE OPPORTUNITIES",
  headline:
    "Building modern, high-performance digital experiences with thoughtful interaction and scalable frontend architecture.",

  cta: "About Me",
  headerTags: [
    {
      text: "Crafting polished AI-powered interfaces",
      abbr: "AI",
      tone: "secondary" as TagTone,
      className: "left-[8%] top-[5%] rotate-[12deg]",
    },
    {
      text: "Motion systems • UX engineering • scalability",
      abbr: "UX",
      tone: "warning" as TagTone,
      className: "right-[5%] top-[5%] -rotate-[12deg]",
    },
  ],

  footerTags: [
    {
      text: "FRONTEND ENGINEER",
      abbr: "FE",
      tone: "primary" as TagTone,
      className: "bottom-[12%] left-0 -rotate-[10deg]",
    },
    {
      text: "HO CHI MINH CITY",
      abbr: "HC",
      tone: "energy" as TagTone,
      className: "bottom-[12%] right-0 rotate-[8deg]",
    },
  ],

  cursors: [
    {
      name: "Emma",
      message: "The interaction feels much smoother now.",
      className: "left-[7%] top-[60%]",
      delay: 1.2,
    },
    {
      name: "Lucas",
      message: "Refining micro-interactions and motion timing.",
      className: "right-[8%] top-[55%]",
      delay: 1.45,
    },
    {
      name: "Alex",
      message: "The UI responsiveness is noticeably improved.",
      className: "right-[18%] bottom-[26%]",
      delay: 1.7,
    },
  ],
};
export const spring = { stiffness: 120, damping: 18, mass: 0.35 };
export const lensSpring = { stiffness: 430, damping: 34, mass: 0.28 };
export const entranceEase = [0.34, 1.56, 0.64, 1] as const;

export const nameTextClassName =
  "text-foreground relative z-10 px-2 font-mono text-[clamp(2.8rem,8vw,8rem)] font-medium leading-[0.82] tracking-normal [font-stretch:expanded] sm:px-8";

export const tagToneClasses: Record<TagTone, string> = {
  secondary:
    "border-brand-secondary/50 bg-brand-secondary/90 text-[#022c1a] shadow-[var(--hero-shadow-soft)]",
  primary:
    "border-brand-primary/50 bg-brand-primary/90 text-white shadow-[var(--hero-shadow-soft)]",
  accent:
    "border-brand-accent/50 bg-brand-accent/90 text-[#1a1b40] shadow-[var(--hero-shadow-soft)]",
  warning:
    "border-brand-warning/50 bg-brand-warning/90 text-[#1a0e00] shadow-[var(--hero-shadow-soft)]",
  energy:
    "border-brand-energy/50 bg-brand-energy/90 text-white shadow-[var(--hero-shadow-soft)]",
};

export const maskTagToneClasses: Record<TagTone, string> = {
  secondary:
    "border-brand-secondary/40 bg-[#061f14] text-brand-secondary shadow-[0_0_0_1px_rgb(16_185_129/0.18),0_0_16px_rgb(16_185_129/0.2)]",
  primary:
    "border-brand-primary/50 bg-[#0c0c2a] text-brand-primary shadow-[0_0_0_1px_rgb(99_102_241/0.2),0_0_16px_rgb(99_102_241/0.22)]",
  accent:
    "border-brand-accent/50 bg-[#120e28] text-brand-accent shadow-[0_0_0_1px_rgb(167_139_250/0.2),0_0_16px_rgb(167_139_250/0.22)]",
  warning:
    "border-brand-warning/50 bg-[#1f1503] text-brand-warning shadow-[0_0_0_1px_rgb(236_179_46/0.18),0_0_16px_rgb(236_179_46/0.22)]",
  energy:
    "border-brand-energy/50 bg-[#1f0610] text-[#ff8fb1] shadow-[0_0_0_1px_rgb(224_29_90/0.2),0_0_16px_rgb(224_29_90/0.22)]",
};
