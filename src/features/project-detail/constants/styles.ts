import type { TagTone } from "@/shared/types/work-project";

export const ease = [0.22, 1, 0.36, 1] as const;

export const accentStyles: Record<TagTone, { text: string; border: string; bg: string; glow: string; point: string }> = {
  primary: {
    text: "text-brand-primary",
    border: "border-brand-primary/35",
    bg: "bg-brand-primary/10",
    glow: "shadow-[0_0_50px_rgb(99_102_241/0.18)]",
    point: "bg-brand-primary shadow-[0_0_18px_rgb(99_102_241/0.75)]",
  },
  secondary: {
    text: "text-brand-secondary",
    border: "border-brand-secondary/35",
    bg: "bg-brand-secondary/10",
    glow: "shadow-[0_0_50px_rgb(16_185_129/0.18)]",
    point: "bg-brand-secondary shadow-[0_0_18px_rgb(16_185_129/0.75)]",
  },
  accent: {
    text: "text-brand-accent",
    border: "border-brand-accent/35",
    bg: "bg-brand-accent/10",
    glow: "shadow-[0_0_50px_rgb(167_139_250/0.18)]",
    point: "bg-brand-accent shadow-[0_0_18px_rgb(167_139_250/0.75)]",
  },
  warning: {
    text: "text-brand-warning",
    border: "border-brand-warning/35",
    bg: "bg-brand-warning/10",
    glow: "shadow-[0_0_50px_rgb(236_179_46/0.18)]",
    point: "bg-brand-warning shadow-[0_0_18px_rgb(236_179_46/0.75)]",
  },
  energy: {
    text: "text-brand-energy",
    border: "border-brand-energy/35",
    bg: "bg-brand-energy/10",
    glow: "shadow-[0_0_50px_rgb(224_29_90/0.18)]",
    point: "bg-brand-energy shadow-[0_0_18px_rgb(224_29_90/0.75)]",
  },
};

export const supportStyles = {
  status: accentStyles.secondary,
  insight: accentStyles.warning,
  tension: accentStyles.energy,
  ambient: accentStyles.accent,
};

export const toneGlowRgb: Record<TagTone, string> = {
  primary: "rgb(99 102 241 / 0.6)",
  secondary: "rgb(16 185 129 / 0.6)",
  accent: "rgb(167 139 250 / 0.6)",
  warning: "rgb(236 179 46 / 0.6)",
  energy: "rgb(224 29 90 / 0.6)",
};

export const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "brief", label: "Brief" },
  { id: "engineering", label: "Engineering" },
  { id: "features", label: "Features" },
] as const;

export const stackSlots = [
  { x: "0%", scale: 1, opacity: 1, zIndex: 30 },
  { x: "-18%", scale: 0.9, opacity: 0.58, zIndex: 20 },
  { x: "18%", scale: 0.9, opacity: 0.58, zIndex: 10 },
] as const;

export const spreadSlots = [
  { x: "0%", scale: 1, opacity: 1, zIndex: 30 },
  { x: "-24%", scale: 0.88, opacity: 0.72, zIndex: 20 },
  { x: "24%", scale: 0.88, opacity: 0.72, zIndex: 10 },
] as const;

export const hiddenSlot = { x: "0%", scale: 0.85, opacity: 0, zIndex: 0 } as const;

export const CHALLENGE_TONES = [
  supportStyles.tension,
  supportStyles.insight,
  supportStyles.status,
  supportStyles.ambient,
] as const;

export const CHALLENGE_LABELS = ["Architecture", "State", "Export", "DX"] as const;
