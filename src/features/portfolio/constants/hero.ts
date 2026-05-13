import type { TagTone } from "../types";

export const heroContent = {
  name: "HELEN MAI",
  annotation: "my name is",
  status: "AVAILABLE FOR THOUGHTFUL PROJECTS",
  headline: "I design outstanding digital products.",
  cta: "ABOUT ME",
  headerTags: [
    {
      text: "Currently building polished web experiences",
      tone: "secondary" as TagTone,
      className: "left-35 top-[5%] rotate-[12deg]",
    },
    {
      text: "Interactive UI + motion systems",
      tone: "warning" as TagTone,
      className: "right-30 top-[5%] -rotate-[12deg] max-sm:hidden",
    },
  ],
  footerTags: [
    {
      text: "FRONTEND ENGINEER",
      tone: "primary" as TagTone,
      className: "bottom-[12%] left-0 -rotate-[10deg] max-sm:hidden",
    },
    {
      text: "HO CHI MINH",
      tone: "energy" as TagTone,
      className: "bottom-[12%] right-0 rotate-[8deg] max-sm:hidden",
    },
  ],
  cursors: [
    {
      name: "Linh",
      message: "Chào bạn! Rất vui được kết nối.",
      className: "left-[7%] top-[60%]",
      delay: 1.2,
    },
    {
      name: "Mai",
      message: "Đang tinh chỉnh từng chi tiết nhỏ.",
      className: "right-[8%] top-[55%]",
      delay: 1.45,
    },
    {
      name: "Alex",
      message: "Motion này mượt hơn khi bạn hover.",
      className: "right-[18%] bottom-[26%] max-md:hidden",
      delay: 1.7,
    },
  ],
};

export const spring = { stiffness: 120, damping: 18, mass: 0.35 };
export const lensSpring = { stiffness: 430, damping: 34, mass: 0.28 };
export const entranceEase = [0.34, 1.56, 0.64, 1] as const;

export const nameTextClassName =
  "text-foreground relative z-10 px-2 font-mono text-[clamp(3.25rem,10vw,10rem)] font-semibold leading-[0.82] tracking-normal [font-stretch:expanded] sm:px-8";

export const tagToneClasses: Record<TagTone, string> = {
  secondary:
    "border-brand-secondary/70 bg-brand-secondary text-[#0a2e1e] shadow-[var(--hero-shadow-soft)] glow-mint",
  primary:
    "border-brand-primary/70 bg-brand-primary text-[#021421] shadow-[var(--hero-shadow-soft)] glow-primary",
  accent:
    "border-brand-accent/70 bg-brand-accent text-[#1a1b40] shadow-[var(--hero-shadow-soft)] glow-accent",
  warning:
    "border-brand-warning/70 bg-brand-warning text-[#1a0e00] shadow-[var(--hero-shadow-soft)] glow-warning",
  energy:
    "border-brand-energy/70 bg-brand-energy text-white shadow-[var(--hero-shadow-soft)] glow-energy",
};

export const maskTagToneClasses: Record<TagTone, string> = {
  secondary:
    "border-brand-secondary/80 bg-[#052617] text-brand-secondary shadow-[0_0_0_1px_rgb(52_211_153/0.22),0_0_22px_rgb(52_211_153/0.28)]",
  primary:
    "border-brand-primary/85 bg-[#031827] text-brand-primary shadow-[0_0_0_1px_rgb(56_189_248/0.24),0_0_22px_rgb(56_189_248/0.28)]",
  accent:
    "border-brand-accent/85 bg-[#10123a] text-brand-accent shadow-[0_0_0_1px_rgb(129_140_248/0.24),0_0_22px_rgb(129_140_248/0.28)]",
  warning:
    "border-brand-warning/85 bg-[#2f1d03] text-brand-warning shadow-[0_0_0_1px_rgb(236_179_46/0.24),0_0_22px_rgb(236_179_46/0.3)]",
  energy:
    "border-brand-energy/85 bg-[#330717] text-[#ff8fb1] shadow-[0_0_0_1px_rgb(224_29_90/0.26),0_0_22px_rgb(224_29_90/0.3)]",
};
