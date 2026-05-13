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
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.6 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="bg-foreground border-border relative size-4 rounded-full border shadow-sm" />
      <span className="bg-background border-border absolute left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest text-foreground">
        YOU
      </span>
    </motion.div>
  );
}
