"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "@/shared/providers/AppProviders";

const SNAP_DEBOUNCE = 200;
const SNAP_THRESHOLD = 0.70; // >30% of MainContent visible → snap forward
const SNAP_DURATION = 1.1;
const snapEasing = (t: number) => 1 - Math.pow(1 - t, 4);

export function ScrollSnap() {
  const { scrollTo } = useLenis();
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    function handleScrollStop() {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        // Only act in the transition zone between Hero and MainContent
        if (scrollY <= 0 || scrollY >= vh) return;

        const mainEl = document.getElementById("main-content");
        if (!mainEl) return;

        const top = mainEl.getBoundingClientRect().top;

        if (top < vh * SNAP_THRESHOLD) {
          // More than 30% visible → snap to MainContent
          scrollTo(mainEl, { duration: SNAP_DURATION, easing: snapEasing });
        } else {
          // Less than 30% visible → snap back to Hero
          scrollTo(0, { duration: SNAP_DURATION, easing: snapEasing });
        }
      }, SNAP_DEBOUNCE);
    }

    window.addEventListener("wheel", handleScrollStop, { passive: true });
    window.addEventListener("touchend", handleScrollStop, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleScrollStop);
      window.removeEventListener("touchend", handleScrollStop);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scrollTo, reducedMotion]);

  return null;
}
