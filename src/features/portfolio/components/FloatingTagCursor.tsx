"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { entranceEase } from "../constants/hero";
import type { TagTone } from "../types";

const bubbleSpring = { type: "spring", stiffness: 200, damping: 25 } as const;

const toneCircle: Record<TagTone, string> = {
  secondary: "bg-brand-secondary text-[#022c1a]",
  warning:   "bg-brand-warning text-[#1a0e00]",
  primary:   "bg-brand-primary text-white",
  energy:    "bg-brand-energy text-white",
  accent:    "bg-brand-accent text-[#1a1b40]",
};

const toneText: Record<TagTone, string> = {
  secondary: "text-brand-secondary",
  warning:   "text-brand-warning",
  primary:   "text-brand-primary",
  energy:    "text-[#ff8fb1]",
  accent:    "text-brand-accent",
};

export function FloatingTagCursor({
  text,
  abbr,
  tone,
  className,
  index,
}: {
  text: string;
  abbr: string;
  tone: TagTone;
  className: string;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: [0, 8, -6, 3, 0],
        y: [0, -8, 6, -3, 0],
      }}
      transition={{
        opacity: { delay: 0.68 + index * 0.12, duration: 0.35 },
        scale: { delay: 0.68 + index * 0.12, duration: 0.35, ease: entranceEase },
        x: { delay: 0.68 + index * 0.12, duration: 9, repeat: Infinity, ease: "easeInOut" },
        y: { delay: 0.68 + index * 0.12, duration: 8, repeat: Infinity, ease: "easeInOut" },
      }}
      className={cn("absolute z-20 pointer-events-auto", className)}
    >
      <motion.button
        type="button"
        onHoverStart={() => setIsOpen(true)}
        onHoverEnd={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onTap={() => setIsOpen((v) => !v)}
        className="flex h-10 items-center overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        aria-label={text}
      >
        {/* Solid tone circle with abbr */}
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-full font-mono text-[0.6rem] font-black uppercase tracking-wider shadow-[0_4px_14px_rgb(0_0_0/0.3)]", toneCircle[tone])}>
          {abbr}
        </span>

        {/* Expanding text bubble */}
        <motion.span
          animate={{
            width: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
            x: isOpen ? 0 : -6,
          }}
          transition={isOpen ? bubbleSpring : { duration: 0.15, ease: "easeOut" }}
          className="overflow-hidden whitespace-nowrap rounded-r-full bg-surface-base/90 backdrop-blur-md"
          aria-hidden={!isOpen}
        >
          <span className={cn("block pl-2 pr-4 font-mono text-[0.65rem] font-black uppercase tracking-[0.1em]", toneText[tone])}>
            {text}
          </span>
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
