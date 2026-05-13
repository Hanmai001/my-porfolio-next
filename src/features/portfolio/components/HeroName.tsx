"use client";

import { motion, type MotionValue } from "framer-motion";

import { cn } from "@/shared/lib/utils";

import { entranceEase, nameTextClassName } from "../constants/hero";
import { SelectionBox } from "./SelectionBox";

export function HeroName({
  name,
  style,
  decorative = false,
  maskMode = false,
}: {
  name: string;
  style: {
    x: MotionValue<number> | 0;
    y: MotionValue<number> | 0;
  };
  decorative?: boolean;
  maskMode?: boolean;
}) {
  const textMotion = {
    initial: {
      opacity: 0,
      scale: 0.92,
      filter: "blur(16px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    transition: { delay: 0.28, duration: 0.72, ease: entranceEase },
  };
  const textClassName = cn(
    nameTextClassName,
    maskMode &&
      "text-brand-primary drop-shadow-[0_0_18px_rgb(56_189_248/0.42)] [text-shadow:0_1px_0_rgb(248_250_252/0.18)]"
  );

  return (
    <motion.div style={style} className="relative">
      {decorative ? null : <SelectionBox />}
      {decorative ? (
        <motion.div {...textMotion} aria-hidden="true" className={textClassName}>
          {name}
        </motion.div>
      ) : (
        <motion.h1 {...textMotion} className={textClassName}>
          {name}
        </motion.h1>
      )}
    </motion.div>
  );
}
