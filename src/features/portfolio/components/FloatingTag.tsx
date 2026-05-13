"use client";

import { motion } from "framer-motion";

import { cn } from "@/shared/lib/utils";

import { entranceEase, maskTagToneClasses, tagToneClasses } from "../constants/hero";
import type { TagTone } from "../types";
import { Magnetic } from "./Magnetic";

export function FloatingTag({
  text,
  className,
  index,
  tone,
  maskMode = false,
}: {
  text: string;
  className: string;
  index: number;
  tone: TagTone;
  maskMode?: boolean;
}) {
  return (
    <Magnetic
      className={cn("absolute z-20", className)}
      strength={index > 1 ? 0.12 : 0.16}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: 0.68 + index * 0.12,
          duration: 0.62,
          ease: entranceEase,
        }}
        whileHover={{ scale: 1.04, rotate: index % 2 === 0 ? -4 : 4 }}
        className={cn(
          "max-w-[13rem] rounded-[1.35rem] border-2 px-4 py-2.5 font-mono text-xs font-black uppercase leading-tight sm:max-w-[16rem] sm:px-5 sm:py-3 sm:text-sm md:max-w-[19rem] md:px-6 md:py-3.5 md:text-base lg:max-w-[21rem] lg:px-7 lg:py-4 lg:text-lg",
          maskMode ? maskTagToneClasses[tone] : tagToneClasses[tone]
        )}
      >
        {text}
      </motion.div>
    </Magnetic>
  );
}
