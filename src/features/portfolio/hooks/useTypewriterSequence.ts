"use client";

import { useEffect, useState } from "react";

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
