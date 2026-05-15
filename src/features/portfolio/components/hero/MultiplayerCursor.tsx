"use client";

import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";

import { entranceEase } from "../../constants/hero";

const bubbleSpring = { type: "spring", stiffness: 200, damping: 25 } as const;

export function MultiplayerCursor({
  name,
  message,
  className,
  delay,
  tone,
}: {
  name: string;
  message: string;
  className: string;
  delay: number;
  tone: "primary" | "accent" | "secondary";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  const [paused, setPaused] = useState(false);

  const textRowRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const contentWidthRef = useRef(0);
  const xVal = useMotionValue(0);

  const dotTone =
    tone === "accent"
      ? "after:shadow-[0_0_22px_rgb(129_140_248/0.45)]"
      : tone === "secondary"
        ? "after:shadow-[0_0_22px_rgb(52_211_153/0.45)]"
        : "after:shadow-[0_0_22px_rgb(56_189_248/0.45)]";

  // Measure overflow after bubble opens
  useEffect(() => {
    if (!isOpen || !textRowRef.current) return;
    const el = textRowRef.current;
    setShouldMarquee(el.scrollWidth > el.offsetWidth + 1);
  }, [isOpen, message]);

  // Measure one-copy width once marquee is confirmed
  useEffect(() => {
    if (!shouldMarquee || !trackRef.current) return;
    contentWidthRef.current = trackRef.current.scrollWidth / 2;
  }, [shouldMarquee, message]);

  // Reset position and state when message changes
  useEffect(() => {
    xVal.set(0);
    contentWidthRef.current = 0;
    setShouldMarquee(false);
  }, [message, xVal]);

  // Reset position when bubble closes
  useEffect(() => {
    if (!isOpen) xVal.set(0);
  }, [isOpen, xVal]);

  // Frame ticker — drives x in pixels; wraps atomically; pauses by skipping increment
  const speed = Math.max(3, message.length * 0.1);
  useAnimationFrame((_, delta) => {
    if (!shouldMarquee || !isOpen || paused || contentWidthRef.current === 0) return;
    const pxPerSec = contentWidthRef.current / speed;
    let next = xVal.get() - pxPerSec * (delta / 1000);
    if (next <= -contentWidthRef.current) {
      next += contentWidthRef.current;
    }
    xVal.set(next);
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: [0, 12, -8, 4, 0],
        y: [0, -10, 7, -4, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.35 },
        scale: { delay, duration: 0.35, ease: entranceEase },
        x: { delay, duration: 8, repeat: Infinity, ease: "easeInOut" },
        y: { delay, duration: 7.2, repeat: Infinity, ease: "easeInOut" },
      }}
      className={cn("absolute z-30", className)}
    >
      <motion.button
        type="button"
        onHoverStart={() => setIsOpen(true)}
        onHoverEnd={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onTap={() => setIsOpen((current) => !current)}
        data-expanded={isOpen}
        className="cursor-border-beam group/cursor relative flex h-12 max-w-[min(22rem,calc(100vw-2rem))] items-center overflow-hidden rounded-full p-0 text-left outline-none focus-visible:ring-4 focus-visible:ring-ring/40 sm:h-14"
        aria-label={`${name}: ${message}`}
      >
        {/* Inner background — inset 2px to reveal the gradient border */}
        <span
          className="pointer-events-none absolute inset-0.5 rounded-full backdrop-blur-md data-[expanded=false]:bg-transparent data-[expanded=true]:bg-black/80"
          data-expanded={isOpen}
          aria-hidden="true"
        />

        <span className="relative z-10 grid size-12 shrink-0 place-items-center sm:size-14">
          <motion.span
            animate={{ scale: [1, 1.045, 1], opacity: [0.82, 1, 0.82] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="cursor-gradient-halo absolute inset-[-18%] rounded-full"
            aria-hidden="true"
          />

          <motion.span
            animate={{ scale: [1, 1.045, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className={cn(
              "cursor-gradient-dot relative grid size-full place-items-center rounded-full p-[2px] after:absolute after:inset-[2px] after:rounded-full after:bg-background",
              dotTone,
            )}
          >
            <span className="relative z-10 grid size-full place-items-center rounded-full bg-background font-mono text-xs font-black text-white shadow-[inset_0_0_18px_rgb(0_0_0/0.65)] sm:text-sm">
              {name.slice(0, 2).toUpperCase()}
            </span>
          </motion.span>
        </span>

        <motion.span
          animate={{
            width: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
            x: isOpen ? 0 : -8,
          }}
          transition={isOpen ? bubbleSpring : { duration: 0.18, ease: "easeOut" }}
          className="relative z-10 flex min-w-0 items-center overflow-hidden"
          aria-hidden={!isOpen}
        >
          <span className="flex min-w-0 flex-col gap-0.5 pl-3 pr-4">
            <span className="whitespace-nowrap font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-brand-primary">
              {name}
            </span>

            {/* Message row — marquee container */}
            <span
              ref={textRowRef}
              className="relative overflow-hidden"
              style={
                shouldMarquee
                  ? {
                      maskImage:
                        "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                    }
                  : undefined
              }
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <motion.span
                ref={trackRef}
                style={{ x: xVal, willChange: "transform" }}
                className="flex shrink-0 whitespace-nowrap"
              >
                <span className="pr-10 font-mono text-xs font-semibold text-white sm:text-sm">
                  {message}
                </span>
                <span
                  className="pr-10 font-mono text-xs font-semibold text-white sm:text-sm"
                  aria-hidden
                >
                  {message}
                </span>
              </motion.span>
            </span>
          </span>
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
