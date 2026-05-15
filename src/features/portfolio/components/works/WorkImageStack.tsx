"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

import type { TagTone } from "../../types";
import { cardSpring } from "../../constants/animations";
import { SCREEN_TINTS, STACK_SLOTS, FAN_STACK_SLOTS } from "../../constants/workStyles";
import { WorkScreenSkeleton } from "./WorkScreenSkeleton";

export function WorkImageStack({ accent }: { accent: TagTone }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 140, damping: 22, mass: 0.35 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 140, damping: 22, mass: 0.35 });
  const tints = SCREEN_TINTS[accent];

  useEffect(() => {
    if (reducedMotion || paused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, reducedMotion]);

  function handleStackMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateX.set(y * -7);
    rotateY.set(x * 9);
  }

  function resetStack() {
    setHovered(false);
    setPaused(false);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      className="relative w-full perspective-[900px]"
      style={{ aspectRatio: "16/10", rotateX: smoothRotateX, rotateY: smoothRotateY }}
      onPointerEnter={() => {
        setHovered(true);
        setPaused(true);
      }}
      onPointerMove={handleStackMove}
      onPointerLeave={resetStack}
    >
      {([0, 1, 2] as const).map((cardIndex) => {
        const slotIndex = (cardIndex - activeIndex + 3) % 3;
        const slots = hovered ? FAN_STACK_SLOTS : STACK_SLOTS;
        const slot = reducedMotion ? STACK_SLOTS[0] : slots[slotIndex];
        return (
          <motion.div
            key={cardIndex}
            animate={{
              x: slot.x,
              y: slot.y,
              rotate: slot.rotate,
              scale: slot.scale,
              opacity: reducedMotion && slotIndex !== 0 ? 0 : slot.opacity,
              zIndex: slot.zIndex,
            }}
            transition={reducedMotion ? { duration: 0 } : cardSpring}
            className={`absolute inset-0 cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-linear-to-br ${tints[cardIndex]} shadow-2xl ${cardIndex === 0 ? "" : "max-md:hidden"}`}
            onClick={() => setActiveIndex(cardIndex)}
          >
            <WorkScreenSkeleton />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
