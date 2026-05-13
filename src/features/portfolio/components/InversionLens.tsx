"use client";

import { motion, type MotionValue } from "framer-motion";

import { cn } from "@/shared/lib/utils";

export function InversionLens({
  isVisible,
  x,
  y,
  className,
}: {
  isVisible: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  className?: string;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none absolute left-0 top-0 z-40 hidden md:block", className)}
      style={{ x, y }}
    >
      <motion.div
        className="relative size-[150px] -translate-x-1/2 -translate-y-1/2 lg:size-[200px]"
        initial={false}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.5,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="absolute inset-0 border-2 border-primary/90 bg-transparent shadow-[0_0_0_1px_rgb(248_250_252/0.16),0_18px_44px_rgb(0_0_0/0.24),0_0_24px_rgb(56_189_248/0.22)]" />

        {["left-0 top-0", "right-0 top-0", "bottom-0 left-0", "bottom-0 right-0"].map(
          (corner) => (
            <span
              key={corner}
              className={cn(
                "absolute z-10 size-3 border-2 border-primary bg-background shadow-[0_0_12px_rgb(56_189_248/0.4)] lg:size-4",
                corner,
                corner.includes("right") ? "translate-x-1/2" : "-translate-x-1/2",
                corner.includes("bottom") ? "translate-y-1/2" : "-translate-y-1/2"
              )}
            />
          )
        )}
      </motion.div>
    </motion.div>
  );
}
