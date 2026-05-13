"use client";

import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { PointerEvent } from "react";
import { useState } from "react";

import { entranceEase, heroContent, lensSpring } from "../constants/hero";
import { FloatingTag } from "./FloatingTag";
import { HeroName } from "./HeroName";
import { InversionLens } from "./InversionLens";

const lensHalfSize = 100;
const maskTextClassName =
  "text-brand-primary drop-shadow-[0_0_12px_rgb(56_189_248/0.36)] [text-shadow:0_1px_0_rgb(248_250_252/0.14)]";

function canUseHeaderMask(shouldReduceMotion: boolean) {
  return (
    !shouldReduceMotion &&
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function Annotation({
  decorative = false,
  maskMode = false,
}: {
  decorative?: boolean;
  maskMode?: boolean;
}) {
  return (
    <motion.div
      aria-hidden={decorative}
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.16, duration: 0.58, ease: entranceEase }}
      className="text-foreground mb-20 font-mono text-xl font-black lowercase leading-none tracking-normal sm:mb-24 sm:text-3xl"
    >
      <span className={maskMode ? `-rotate-3 inline-block ${maskTextClassName}` : "-rotate-3 inline-block"}>
        {heroContent.annotation}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 160 24"
        className={maskMode ? "text-foreground mx-auto mt-1 h-4 w-28 sm:w-40" : "text-primary mx-auto mt-1 h-4 w-28 sm:w-40"}
      >
        <motion.path
          d="M4 10 C36 4, 82 5, 154 9 M12 17 C44 13, 94 13, 149 16"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.48, duration: 0.58, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

function Status({
  decorative = false,
  maskMode = false,
}: {
  decorative?: boolean;
  maskMode?: boolean;
}) {
  return (
    <motion.div
      aria-hidden={decorative}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.88, duration: 0.48, ease: entranceEase }}
      className="pt-4 flex items-center justify-center gap-3 font-mono text-sm font-black uppercase tracking-[0.08em] text-muted-foreground sm:mt-10 sm:text-lg"
    >
      <span className="glow-mint size-4 rounded-full border border-secondary/40 bg-secondary sm:size-5" />
      <span className={maskMode ? maskTextClassName : "text-foreground"}>{heroContent.status}</span>
    </motion.div>
  );
}

function HeaderArtwork({
  shouldReduceMotion,
  nameX,
  nameY,
  tagsX,
  tagsY,
  decorative = false,
  maskMode = false,
}: {
  shouldReduceMotion: boolean;
  nameX: MotionValue<number>;
  nameY: MotionValue<number>;
  tagsX: MotionValue<number>;
  tagsY: MotionValue<number>;
  decorative?: boolean;
  maskMode?: boolean;
}) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-30"
        style={{
          x: shouldReduceMotion ? 0 : tagsX,
          y: shouldReduceMotion ? 0 : tagsY,
        }}
      >
        {heroContent.headerTags.map((tag, index) => (
          <FloatingTag
            key={tag.text}
            text={tag.text}
            className={tag.className}
            index={index}
            tone={tag.tone}
            maskMode={maskMode}
          />
        ))}
      </motion.div>

      <div className="relative z-20 mx-auto flex w-full flex-col items-center text-center">
        <Annotation decorative={decorative} maskMode={maskMode} />

        <HeroName
          name={heroContent.name}
          decorative={decorative}
          maskMode={maskMode}
          style={{
            x: shouldReduceMotion ? 0 : nameX,
            y: shouldReduceMotion ? 0 : nameY,
          }}
        />

        <Status decorative={decorative} maskMode={maskMode} />
      </div>
    </>
  );
}

export function HeroHeader({
  shouldReduceMotion,
  nameX,
  nameY,
  tagsX,
  tagsY,
}: {
  shouldReduceMotion: boolean;
  nameX: MotionValue<number>;
  nameY: MotionValue<number>;
  tagsX: MotionValue<number>;
  tagsY: MotionValue<number>;
}) {
  const [isLensVisible, setIsLensVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const lensX = useMotionValue(0);
  const lensY = useMotionValue(0);
  const smoothLensX = useSpring(lensX, lensSpring);
  const smoothLensY = useSpring(lensY, lensSpring);
  const clipPath = useMotionTemplate`inset(calc(${smoothLensY}px - ${lensHalfSize}px) calc(100% - ${smoothLensX}px - ${lensHalfSize}px) calc(100% - ${smoothLensY}px - ${lensHalfSize}px) calc(${smoothLensX}px - ${lensHalfSize}px))`;
  const shouldDisableMask = shouldReduceMotion || Boolean(prefersReducedMotion);

  function updateLens(event: PointerEvent<HTMLDivElement>) {
    if (!canUseHeaderMask(shouldDisableMask)) {
      setIsLensVisible(false);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    lensX.set(event.clientX - bounds.left);
    lensY.set(event.clientY - bounds.top);
  }

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (!canUseHeaderMask(shouldDisableMask)) return;

    updateLens(event);
    setIsLensVisible(true);
  }

  function handlePointerLeave() {
    setIsLensVisible(false);
  }

  return (
    <div
      className="relative z-20 mx-auto w-full max-w-6xl cursor-default overflow-visible [@media(hover:hover)_and_(pointer:fine)]:cursor-none"
      onPointerEnter={handlePointerEnter}
      onPointerMove={updateLens}
      onPointerLeave={handlePointerLeave}
    >
      <HeaderArtwork
        shouldReduceMotion={shouldReduceMotion}
        nameX={nameX}
        nameY={nameY}
        tagsX={tagsX}
        tagsY={tagsY}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 overflow-visible"
        style={{
          clipPath,
          WebkitClipPath: clipPath,
          opacity: isLensVisible ? 1 : 0,
        }}
      >
        <HeaderArtwork
          shouldReduceMotion={shouldReduceMotion}
          nameX={nameX}
          nameY={nameY}
          tagsX={tagsX}
          tagsY={tagsY}
          decorative
          maskMode
        />
      </motion.div>

      <InversionLens isVisible={isLensVisible} x={smoothLensX} y={smoothLensY} />
    </div>
  );
}
