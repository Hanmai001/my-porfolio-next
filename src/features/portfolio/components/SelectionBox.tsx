"use client";

import { motion } from "framer-motion";

import { cn } from "@/shared/lib/utils";

import { entranceEase } from "../constants/hero";

export function SelectionBox() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scaleX: 0.92 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay: 0.38, duration: 0.65, ease: entranceEase }}
      className="selection-outline pointer-events-none absolute inset-x-[-0.6rem] bottom-[-2em] top-[-2em] border-2 sm:inset-x-[-1.2rem]"
    >
      {[
        { pos: "left-0 top-0",     translate: "-translate-x-1/2 -translate-y-1/2" },
        { pos: "right-0 top-0",    translate: "translate-x-1/2 -translate-y-1/2" },
        { pos: "left-0 bottom-0",  translate: "-translate-x-1/2 translate-y-1/2" },
        { pos: "right-0 bottom-0", translate: "translate-x-1/2 translate-y-1/2" },
      ].map(({ pos, translate }) => (
        <span
          key={pos}
          className={cn(
            "selection-handle absolute size-4 border-[3px] sm:size-5",
            pos,
            translate
          )}
        />
      ))}
    </motion.div>
  );
}
