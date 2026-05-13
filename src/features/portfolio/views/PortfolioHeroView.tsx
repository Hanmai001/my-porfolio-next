"use client";

import { useState } from "react";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent } from "react";

import { FloatingTag } from "../components/FloatingTag";
import { HeroContent } from "../components/HeroContent";
import { HeroHeader } from "../components/HeroHeader";
import { LiveClock } from "../components/LiveClock";
import { MultiplayerCursor } from "../components/MultiplayerCursor";
import { PortfolioCursor } from "../components/PortfolioCursor";
import { heroContent } from "../constants/hero";

export function PortfolioHeroView() {
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 24, mass: 0.5 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 24, mass: 0.5 });
  const gridX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const gridY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const nameX = useTransform(smoothX, [-1, 1], [-14, 14]);
  const nameY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const tagsX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const tagsY = useTransform(smoothY, [-1, 1], [-12, 12]);

  const cursorAbsX = useMotionValue(0);
  const cursorAbsY = useMotionValue(0);
  const smoothCursorX = useSpring(cursorAbsX, { stiffness: 600, damping: 32 });
  const smoothCursorY = useSpring(cursorAbsY, { stiffness: 600, damping: 32 });
  const [isPointerInside, setIsPointerInside] = useState(false);

  function updatePointer(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    cursorAbsX.set(event.clientX - bounds.left);
    cursorAbsY.set(event.clientY - bounds.top);
    if (shouldReduceMotion) return;
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
    setIsPointerInside(false);
  }

  return (
    <main className="bg-background text-foreground overflow-hidden">
      <section
        className="relative flex h-[100svh] cursor-default flex-col items-center justify-center overflow-hidden px-5 py-10 [@media(hover:hover)_and_(pointer:fine)]:cursor-none sm:px-8 lg:px-12"
        onPointerMove={updatePointer}
        onPointerLeave={resetPointer}
        onPointerEnter={() => setIsPointerInside(true)}
      >
        {/* Background grid */}
        <motion.div
          aria-hidden="true"
          className="blueprint-grid absolute inset-0 opacity-80"
          style={{
            x: shouldReduceMotion ? 0 : gridX,
            y: shouldReduceMotion ? 0 : gridY,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />

        {/* Clock overlay */}
        <div className="text-muted-foreground pointer-events-none absolute inset-x-0 top-3 z-10 text-center font-mono text-sm font-black tracking-[0.12em] sm:text-base">
          <LiveClock />
        </div>

        {/* Footer tags — absolute at bottom corners of the section */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-30 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12"
          style={{
            x: shouldReduceMotion ? 0 : tagsX,
            y: shouldReduceMotion ? 0 : tagsY,
          }}
        >
          {heroContent.footerTags.map((tag, index) => (
            <FloatingTag
              key={tag.text}
              text={tag.text}
              className={tag.className}
              index={index + heroContent.headerTags.length}
              tone={tag.tone}
            />
          ))}
        </motion.div>

        {/* Decorative cursors */}
        {heroContent.cursors.map((cursor, cursorIndex) => (
          <MultiplayerCursor
            key={cursor.name}
            name={cursor.name}
            message={cursor.message}
            className={cursor.className}
            delay={cursor.delay}
            tone={cursorIndex === 1 ? "accent" : cursorIndex === 2 ? "secondary" : "primary"}
          />
        ))}

        {/* Custom cursor */}
        <PortfolioCursor x={smoothCursorX} y={smoothCursorY} isVisible={isPointerInside} />

        {/* Main content stack */}
        <div className="relative z-20 flex w-full flex-col items-center gap-4 sm:gap-16">
          <HeroHeader
            shouldReduceMotion={Boolean(shouldReduceMotion)}
            nameX={nameX}
            nameY={nameY}
            tagsX={tagsX}
            tagsY={tagsY}
          />

          <HeroContent shouldReduceMotion={Boolean(shouldReduceMotion)} />
        </div>
      </section>
    </main>
  );
}
