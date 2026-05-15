"use client";

import { motion, type MotionValue } from "framer-motion";

import { cn } from "@/shared/lib/utils";

function LensCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const isTop = position.startsWith("t");
  const isLeft = position.endsWith("l");

  return (
    <span
      className={cn(
        "absolute",
        isTop ? "top-2" : "bottom-2",
        isLeft ? "left-2" : "right-2"
      )}
    >
      <span
        className={cn(
          "absolute bg-white/25",
          isTop ? "top-0" : "bottom-0",
          isLeft ? "left-0" : "right-0",
          "h-px w-3"
        )}
      />
      <span
        className={cn(
          "absolute bg-white/25",
          isTop ? "top-0" : "bottom-0",
          isLeft ? "left-0" : "right-0",
          "h-3 w-px"
        )}
      />
    </span>
  );
}

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
        className="relative size-37.5 -translate-x-1/2 -translate-y-1/2 rounded-full lg:size-50"
        initial={false}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.5,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="absolute inset-0 rounded-full border border-white/15" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.03),transparent)]" />

        <LensCorner position="tl" />
        <LensCorner position="tr" />
        <LensCorner position="bl" />
        <LensCorner position="br" />
      </motion.div>
    </motion.div>
  );
}
