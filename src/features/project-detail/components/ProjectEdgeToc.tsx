"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { List } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { WheelEvent } from "react";

import type { TagTone } from "@/shared/types/work-project";
import { useLenis } from "@/shared/providers/AppProviders";
import { accentStyles, ease, tocItems } from "../constants/styles";

type TocActiveId = (typeof tocItems)[number]["id"];

export function ProjectEdgeToc({
  activeId,
  accent,
}: {
  activeId: TocActiveId;
  accent: TagTone;
}) {
  const { scrollTo } = useLenis();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progressTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wheelFocus, setWheelFocus] = useState<number | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const styles = accentStyles[accent];
  const activeIndex = tocItems.findIndex((item) => item.id === activeId);
  const focusedIndex = wheelFocus ?? activeIndex;

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  function navigate(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    scrollTo(target, { offset: -28, duration: 1.05 });
    setMobileOpen(false);
  }

  function openDesktop() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setWheelFocus(null);
    setDesktopOpen(true);
  }

  function scheduleClose() {
    closeTimerRef.current = setTimeout(() => setDesktopOpen(false), 500);
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 1 : -1;
    setWheelFocus((current) =>
      Math.min(tocItems.length - 1, Math.max(0, (current ?? activeIndex) + direction)),
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open project sections"
        className="fixed right-0 top-1/2 z-40 hidden h-[42vh] w-10 -translate-y-1/2 lg:block"
        onMouseEnter={openDesktop}
        onMouseLeave={scheduleClose}
        onFocus={openDesktop}
      >
        <div aria-hidden className="absolute right-3 top-0 h-full w-px bg-white/12" />
        <div aria-hidden className="absolute right-2.5 top-0 flex h-full flex-col justify-between py-2">
          {tocItems.map((item) => (
            <span
              key={item.id}
              className={`size-1.5 rounded-full transition-colors ${item.id === activeId ? "bg-white/80" : "bg-white/20"}`}
            />
          ))}
        </div>
        <motion.span
          aria-hidden
          className={`absolute right-2 top-0 size-2.5 -translate-y-1/2 rounded-full ${styles.point}`}
          style={{ top: progressTop }}
        />
      </button>

      <AnimatePresence>
        {desktopOpen ? (
          <motion.aside
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.24, ease }}
            className="fixed right-10 top-1/2 z-40 hidden h-96 w-48 -translate-y-1/2 lg:block"
            onMouseEnter={openDesktop}
            onMouseLeave={scheduleClose}
            onFocusCapture={openDesktop}
            onWheel={handleWheel}
          >
            <nav aria-label="Project sections" className="flex h-full flex-col justify-between py-2">
              {tocItems.map((item, index) => {
                const active = item.id === activeId;
                const focused = index === focusedIndex;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    animate={{
                      scale: focused ? 1.04 : 1,
                      opacity: active ? 1 : focused ? 0.92 : 0.7,
                    }}
                    className={`self-end rounded-full border px-3 py-2 font-mono text-[0.66rem] font-black uppercase tracking-[0.16em] backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${active
                      ? `${styles.border} ${styles.bg} ${styles.text}`
                      : "border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </nav>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Open project sections"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full border border-white/10 bg-black/55 text-foreground shadow-[0_18px_40px_rgb(0_0_0/0.4)] backdrop-blur-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 lg:hidden"
      >
        <List size={18} />
      </button>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close project sections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/45 lg:hidden"
            />
            <motion.aside
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: shouldReduceMotion ? 0.12 : 0.22, ease }}
              className="fixed inset-x-4 bottom-4 z-50 rounded-[1.75rem] border border-white/10 bg-black/65 p-4 shadow-[0_24px_80px_rgb(0_0_0/0.48)] backdrop-blur-[12px] lg:hidden"
            >
              <p className={`mb-3 font-mono text-[0.65rem] font-black uppercase tracking-[0.18em] ${styles.text}`}>
                Sections
              </p>
              <nav aria-label="Project sections" className="grid gap-2">
                {tocItems.map((item) => {
                  const active = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.id)}
                      className={`rounded-2xl border px-4 py-3 text-left font-mono text-xs font-black uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${active
                        ? `${styles.border} ${styles.bg} ${styles.text}`
                        : "border-white/10 bg-white/[0.03] text-muted-foreground"
                        }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
