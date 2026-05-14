"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import Lenis from "lenis";

interface AppProvidersProps {
  children: React.ReactNode;
}

type ScrollToTarget = string | number | HTMLElement;
type ScrollToOptions = Parameters<Lenis["scrollTo"]>[1];

type LenisContextValue = {
  scrollTo: (target: ScrollToTarget, options?: ScrollToOptions) => void;
};

const LenisContext = createContext<LenisContextValue>({ scrollTo: () => {} });

export function useLenis() {
  return useContext(LenisContext);
}

function LenisProvider({ children }: AppProvidersProps) {
  const shouldReduceMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  const scrollTo = useCallback((target: ScrollToTarget, options?: ScrollToOptions) => {
    lenisRef.current?.scrollTo(target as never, options);
  }, []);

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

  return (
    <LenisContext.Provider value={{ scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LenisProvider>{children}</LenisProvider>
    </MotionConfig>
  );
}

export { AppProviders };
