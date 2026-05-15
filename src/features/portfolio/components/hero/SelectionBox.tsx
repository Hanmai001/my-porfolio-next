"use client";

import { motion } from "framer-motion";

import { cn } from "@/shared/lib/utils";

import { entranceEase } from "../../constants/hero";

function CornerHandle({
  position,
  maskMode,
}: {
  position: "tl" | "tr" | "bl" | "br";
  maskMode: boolean;
}) {
  const isTop = position.startsWith("t");
  const isLeft = position.endsWith("l");

  const lineColor = maskMode ? "bg-white/90" : "bg-brand-primary/70";

  return (
    <span
      className={cn(
        "absolute",
        isTop ? "top-0" : "bottom-0",
        isLeft ? "left-0" : "right-0"
      )}
      style={
        maskMode
          ? undefined
          : { filter: "drop-shadow(0 0 6px rgb(99 102 241 / 0.55))" }
      }
    >
      {/* Horizontal arm */}
      <span
        className={cn(
          "absolute h-[1.5px] w-5",
          lineColor,
          isTop ? "top-0" : "bottom-0",
          isLeft ? "left-0" : "right-0"
        )}
      />
      {/* Vertical arm */}
      <span
        className={cn(
          "absolute w-[1.5px] h-5",
          lineColor,
          isTop ? "top-0" : "bottom-0",
          isLeft ? "left-0" : "right-0"
        )}
      />
    </span>
  );
}

export function SelectionBox({
  isActive = false,
  maskMode = false,
}: {
  isActive?: boolean;
  maskMode?: boolean;
}) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scaleX: 0.92 }}
      animate={{
        scaleX: 1,
        scale: [1, 1.018, 1],
        opacity: isActive ? [0.85, 1, 0.85] : [0.45, 0.72, 0.45],
      }}
      transition={{
        scaleX: { delay: 0.38, duration: 0.65, ease: entranceEase },
        scale: { duration: 3.2, ease: "easeInOut", repeat: Infinity, delay: 1 },
        opacity: { duration: 3.2, ease: "easeInOut", repeat: Infinity, delay: 1 },
      }}
      className="pointer-events-none absolute inset-x-[-1.2rem] bottom-[-2.5em] top-[-2.5em] sm:inset-x-[-1.8rem]"
    >
      <CornerHandle position="tl" maskMode={maskMode} />
      <CornerHandle position="tr" maskMode={maskMode} />
      <CornerHandle position="bl" maskMode={maskMode} />
      <CornerHandle position="br" maskMode={maskMode} />
    </motion.div>
  );
}
