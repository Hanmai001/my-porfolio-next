"use client";

import { useRef } from "react";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { gsap } from "@/shared/lib/gsap";

import { entranceEase } from "../constants/hero";

const PADDING = 80;

function canUseMagnetic() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export function MagneticButton({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !canUseMagnetic() || !buttonRef.current) return;

    const bounds = buttonRef.current.getBoundingClientRect();
    const relX = e.clientX - (bounds.left + bounds.width / 2);
    const relY = e.clientY - (bounds.top + bounds.height / 2);

    gsap.to(buttonRef.current, {
      x: relX * 0.20,
      y: relY * 0.20,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(textRef.current, {
      x: relX * 0.3,
      y: relY * 0.3,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  function handleMouseLeave() {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.3)",
      overwrite: "auto",
    });
    gsap.to(textRef.current, {
      x: 0,
      y: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.3)",
      overwrite: "auto",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.12, duration: 0.48, ease: entranceEase }}
      style={{ padding: PADDING, margin: -PADDING }}
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <a
        ref={buttonRef}
        href={href}
        onClick={onClick}
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm border border-white/15 bg-white/95 px-6 font-mono text-base font-black uppercase tracking-widest text-surface-base shadow-[0_8px_24px_rgb(0_0_0/0.3)] backdrop-blur-sm outline-none focus-visible:ring-4 focus-visible:ring-ring/40 sm:h-16 sm:px-6 sm:text-lg"
        style={{ display: "inline-flex" }}
      >
        <span ref={textRef} className="relative z-10 flex items-center gap-3">
          {label}
          <span className="grid size-8 place-items-center rounded-full bg-brand-primary/15 text-brand-primary transition-transform duration-300 group-hover:translate-y-0.5 sm:size-9">
            <ArrowDown className="size-4 sm:size-5" strokeWidth={3} />
          </span>
        </span>
      </a>
    </motion.div>
  );
}
