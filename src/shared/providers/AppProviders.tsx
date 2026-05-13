"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

interface AppProvidersProps {
  children: React.ReactNode;
}

function LenisProvider({ children }: AppProvidersProps) {
  const shouldReduceMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.05,
      lerp: 0.12,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();

      if (lenisRef.current === lenis) {
        lenisRef.current = null;
      }
    };
  }, [shouldReduceMotion]);

  return <>{children}</>;
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LenisProvider>{children}</LenisProvider>
    </MotionConfig>
  );
}

export { AppProviders };
