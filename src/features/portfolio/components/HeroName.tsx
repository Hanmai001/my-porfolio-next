"use client";

import { useEffect, useState } from "react";

import { motion, type MotionValue } from "framer-motion";

import { cn } from "@/shared/lib/utils";

import { nameTextClassName } from "../constants/hero";
import { SelectionBox } from "./SelectionBox";

export type Phase = "greeting" | "erasing" | "name" | "done";

const GREETING = "Hello there!";
const GREETING_SPEED = 120;
const ERASE_SPEED = 80;
const NAME_SPEED = 150;
const PAUSE_AFTER_GREETING = 1000;
const PAUSE_BEFORE_NAME = 1000;
const CURSOR_LINGER = 1200;

export function useTypewriterSequence(name: string, enabled: boolean, reducedMotion: boolean) {
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<Phase>("greeting");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (reducedMotion) {
      // Fast-forward: show greeting then name, all deferred to avoid sync setState in effect
      timeout = setTimeout(() => {
        setDisplayText(GREETING);
        setPhase("greeting");
        const swap = setTimeout(() => {
          setDisplayText(name);
          setPhase("done");
          setShowCursor(false);
        }, 800);
        return () => clearTimeout(swap);
      }, 0);
      return () => clearTimeout(timeout);
    }

    // Full typewriter sequence
    let i = 0;
    function typeGreeting() {
      setDisplayText(GREETING.slice(0, ++i));
      if (i < GREETING.length) {
        timeout = setTimeout(typeGreeting, GREETING_SPEED);
      } else {
        timeout = setTimeout(startErasing, PAUSE_AFTER_GREETING);
      }
    }

    function startErasing() {
      setPhase("erasing");
      let j = GREETING.length;
      function erase() {
        setDisplayText(GREETING.slice(0, --j));
        if (j > 0) {
          timeout = setTimeout(erase, ERASE_SPEED);
        } else {
          timeout = setTimeout(startName, PAUSE_BEFORE_NAME);
        }
      }
      erase();
    }

    function startName() {
      setPhase("name");
      let k = 0;
      function typeName() {
        setDisplayText(name.slice(0, ++k));
        if (k < name.length) {
          timeout = setTimeout(typeName, NAME_SPEED);
        } else {
          timeout = setTimeout(() => {
            setPhase("done");
            setShowCursor(false);
          }, CURSOR_LINGER);
        }
      }
      typeName();
    }

    timeout = setTimeout(typeGreeting, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { displayText, phase, showCursor };
}

export function HeroName({
  name,
  style,
  decorative = false,
  maskMode = false,
  isActive = false,
  reducedMotion = false,
  // Shared typewriter state passed from parent when decorative
  sharedDisplayText,
  sharedPhase,
  sharedShowCursor,
}: {
  name: string;
  style: {
    x: MotionValue<number> | 0;
    y: MotionValue<number> | 0;
  };
  decorative?: boolean;
  maskMode?: boolean;
  isActive?: boolean;
  reducedMotion?: boolean;
  sharedDisplayText?: string;
  sharedPhase?: Phase;
  sharedShowCursor?: boolean;
}) {
  // Hook must always be called; when shared state is provided it takes precedence
  const ownState = useTypewriterSequence(name, sharedDisplayText === undefined && !decorative, reducedMotion);

  const displayText = sharedDisplayText ?? ownState.displayText;
  const phase = sharedPhase ?? ownState.phase;
  const showCursor = sharedShowCursor ?? ownState.showCursor;

  const isNamePhase = phase === "name" || phase === "done";

  const nameClassName = cn(
    nameTextClassName,
    maskMode && "text-brand-primary"
  );
  const greetingClassName =
    "font-mono text-[clamp(1.5rem,5vw,4rem)] font-medium text-foreground/75";

  if (decorative) {
    return (
      <motion.div style={style} className="relative">
        {maskMode && isNamePhase && <SelectionBox isActive={isActive} maskMode />}

        {/* Invisible placeholder to hold size */}
        <div aria-hidden className={cn(nameClassName, "invisible select-none")}>
          {name}
        </div>

        {/* Mirror of typewriter text */}
        <div aria-hidden className="absolute inset-0 flex items-center justify-center">
          <span className={cn(isNamePhase ? nameClassName : greetingClassName, "whitespace-nowrap")}>
            {displayText}
            {showCursor && (
              <span className="animate-blink ml-0.5 inline-block select-none font-stretch-normal">
                |
              </span>
            )}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={style}
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
    >
      <SelectionBox isActive={isActive && isNamePhase} maskMode={false} />

      {/* Invisible placeholder — locks the container to "HELEN MAI" size */}
      <div aria-hidden className={cn(nameClassName, "invisible select-none")}>
        {name}
      </div>

      {/* Typewriter text — absolute overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className={cn(isNamePhase ? nameClassName : greetingClassName, "whitespace-nowrap")}>
          {displayText}
          {showCursor && (
            <span aria-hidden className="animate-blink ml-0.5 inline-block select-none font-stretch-normal">
              |
            </span>
          )}
        </h1>
      </div>
    </motion.div>
  );
}
