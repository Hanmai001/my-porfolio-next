import type { PointerEvent } from "react";
import type { TagTone, SpotlightStyle } from "../types";

export const ACCENT: Record<TagTone, { border: string; bg: string; text: string; bar: string }> = {
  primary:   { border: "border-brand-primary/30",   bg: "bg-brand-primary/8",   text: "text-brand-primary",   bar: "bg-brand-primary" },
  secondary: { border: "border-brand-secondary/30", bg: "bg-brand-secondary/8", text: "text-brand-secondary", bar: "bg-brand-secondary" },
  accent:    { border: "border-brand-accent/30",    bg: "bg-brand-accent/8",    text: "text-brand-accent",    bar: "bg-brand-accent" },
  warning:   { border: "border-brand-warning/30",   bg: "bg-brand-warning/8",   text: "text-brand-warning",   bar: "bg-brand-warning" },
  energy:    { border: "border-brand-energy/30",    bg: "bg-brand-energy/8",    text: "text-brand-energy",    bar: "bg-brand-energy" },
};

// 3 gradient screens per accent tone (static — Tailwind needs full class strings)
export const SCREEN_TINTS: Record<TagTone, [string, string, string]> = {
  primary:   ["from-brand-primary/25 via-surface-elevated to-brand-accent/10",    "from-surface-elevated to-brand-primary/15",    "from-brand-accent/15 via-surface-elevated to-brand-primary/20"],
  secondary: ["from-brand-secondary/25 via-surface-elevated to-brand-primary/10", "from-surface-elevated to-brand-secondary/15",  "from-brand-primary/15 via-surface-elevated to-brand-secondary/20"],
  accent:    ["from-brand-accent/25 via-surface-elevated to-brand-secondary/10",  "from-surface-elevated to-brand-accent/15",     "from-brand-secondary/15 via-surface-elevated to-brand-accent/20"],
  warning:   ["from-brand-warning/25 via-surface-elevated to-brand-accent/10",    "from-surface-elevated to-brand-warning/15",    "from-brand-accent/15 via-surface-elevated to-brand-warning/20"],
  energy:    ["from-brand-energy/25 via-surface-elevated to-brand-primary/10",    "from-surface-elevated to-brand-energy/15",     "from-brand-primary/15 via-surface-elevated to-brand-energy/20"],
};

export const STACK_SLOTS = [
  { x: 0,  y: 0,  rotate: -1, scale: 1,    opacity: 1,    zIndex: 30 },
  { x: 14, y: 10, rotate:  2, scale: 0.94, opacity: 0.65, zIndex: 20 },
  { x: 28, y: 20, rotate:  4, scale: 0.87, opacity: 0.38, zIndex: 10 },
] as const;

export const FAN_STACK_SLOTS = [
  { x: -8, y: -4, rotate: -3, scale: 1,    opacity: 1,    zIndex: 30 },
  { x: 28, y: 12, rotate:  4, scale: 0.94, opacity: 0.72, zIndex: 20 },
  { x: 58, y: 28, rotate:  8, scale: 0.86, opacity: 0.45, zIndex: 10 },
] as const;

export function handleSpotlightMove(event: PointerEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
}

export function spotlightStyle(accent: TagTone): SpotlightStyle {
  const tint =
    accent === "secondary"
      ? "rgb(52 211 153 / 0.15)"
      : accent === "accent"
        ? "rgb(129 140 248 / 0.15)"
        : accent === "warning"
          ? "rgb(236 179 46 / 0.13)"
          : accent === "energy"
            ? "rgb(224 29 90 / 0.14)"
            : "rgb(56 189 248 / 0.15)";

  return {
    "--spotlight-x": "50%",
    "--spotlight-y": "0%",
    background: `radial-gradient(circle at var(--spotlight-x) var(--spotlight-y), ${tint}, transparent 34rem), rgb(5 8 14 / 0.72)`,
  } as SpotlightStyle;
}
