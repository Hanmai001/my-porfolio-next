"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ROTATE_INTERVAL = 3000;

const CARD_TINTS = [
  "from-brand-primary/20 via-surface-elevated to-brand-accent/10",
  "from-brand-accent/20 via-surface-elevated to-brand-secondary/10",
  "from-brand-secondary/20 via-surface-elevated to-brand-primary/10",
];

const CARD_LABELS = ["Helen Mai", "Frontend Eng.", "UI Developer"];

// slot[0] = front, slot[1] = middle, slot[2] = back
const SLOTS = [
  { x: 0,  y: 0,  rotate: -2, scale: 1,    opacity: 1,    zIndex: 30 },
  { x: 16, y: 12, rotate: 2,  scale: 0.95, opacity: 0.72, zIndex: 20 },
  { x: 32, y: 24, rotate: 5,  scale: 0.88, opacity: 0.45, zIndex: 10 },
];

const cardSpring = { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] as const };

export function PhotoStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reducedMotion || paused) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, ROTATE_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, reducedMotion]);

  return (
    <div
      className="relative h-80 w-56 sm:h-[22rem] sm:w-64"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {[0, 1, 2].map((cardIndex) => {
        const slotIndex = (cardIndex - activeIndex + 3) % 3;
        const slot = reducedMotion ? SLOTS[0] : SLOTS[slotIndex];

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
            className="absolute inset-0 cursor-pointer rounded-sm border border-border-subtle bg-surface-elevated p-3 shadow-2xl"
            onClick={() => setActiveIndex(cardIndex)}
          >
            {/* Replace div with next/image when photo is ready */}
            <div
              className={`h-full w-full rounded-[2px] bg-gradient-to-br ${CARD_TINTS[cardIndex]} flex items-end p-4`}
            >
              <span className="font-annotation text-base text-muted-foreground">
                {CARD_LABELS[cardIndex]}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
