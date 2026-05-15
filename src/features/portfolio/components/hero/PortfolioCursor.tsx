"use client";

import { motion } from "framer-motion";
import type { MotionValue } from "framer-motion";

export function PortfolioCursor({
  x,
  y,
  isVisible,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  isVisible: boolean;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-50 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.6,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="relative size-3 rounded-full border border-white/40 bg-white/90 backdrop-blur-sm" />
      <span className="absolute left-1/2 mt-2.5 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-white/60">
        YOU
      </span>
    </motion.div>
  );
}
