"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import type { ProjectPreviewSlide, TagTone } from "@/shared/types/work-project";
import { accentStyles, hiddenSlot, spreadSlots, stackSlots } from "../constants/styles";
import { PreviewSlideCard } from "./PreviewSlideCard";

export function HorizontalStackedImageSlider({
  slides,
  accent,
}: {
  slides: ProjectPreviewSlide[];
  accent: TagTone;
}) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [spread, setSpread] = useState(false);
  const accentDotClass = accentStyles[accent].point;

  useEffect(() => {
    if (reducedMotion || paused || slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length]);

  return (
    <div>
      <div
        className="relative min-h-82 perspective-[1000px] sm:min-h-96"
        onPointerEnter={() => {
          setPaused(true);
          setSpread(true);
        }}
        onPointerLeave={() => {
          setPaused(false);
          setSpread(false);
        }}
      >
        {slides.map((slide, index) => {
          const slotIndex = (index - activeIndex + slides.length) % slides.length;
          const slot =
            slotIndex < 3
              ? spread ? spreadSlots[slotIndex] : stackSlots[slotIndex]
              : hiddenSlot;
          const isActive = slotIndex === 0;

          return (
            <motion.div
              key={`${slide.alt}-${index}`}
              layout
              animate={{
                x: slot.x,
                scale: reducedMotion ? 1 : slot.scale,
                opacity: slot.opacity,
                zIndex: slot.zIndex,
              }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 26 }}
              className={`absolute inset-0 mx-auto w-full max-w-xl ${isActive ? "" : "max-md:hidden"}`}
            >
              <PreviewSlideCard slide={slide} />
            </motion.div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`rounded-full transition-all duration-300 ${isActive
                  ? `h-1.5 w-5 ${accentDotClass}`
                  : "size-1.5 bg-white/25 hover:bg-white/50"
                  }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
