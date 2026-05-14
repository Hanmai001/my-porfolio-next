"use client";

import { motion } from "framer-motion";

import { entranceEase, heroContent } from "../constants/hero";
import { MagneticButton } from "./MagneticButton";

export function HeroContent({ shouldReduceMotion: _ }: { shouldReduceMotion: boolean }) {
  return (
    <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.02, duration: 0.48, ease: entranceEase }}
        className="text-foreground mt-10 max-w-152 text-balance text-2xl font-normal leading-10 tracking-wide sm:mt-14 sm:text-3xl"
      >
        {heroContent.headline}
      </motion.p>

      <div className="mt-7 sm:mt-8">
        <MagneticButton href="#about" label={heroContent.cta} />
      </div>
    </div>
  );
}
