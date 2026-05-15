"use client";

import { type MotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const GRID_SIZE = 50;
const MAX_STREAKS = 30;
const MAX_DOTS = 42;
const CURSOR_RADIUS = 180;

type Orientation = "horizontal" | "vertical";

type Streak = {
  x: number;
  y: number;
  orientation: Orientation;
  direction: 1 | -1;
  speed: number;
  length: number;
  age: number;
  life: number;
  intensity: number;
};

type SparkDot = {
  x: number;
  y: number;
  age: number;
  life: number;
  intensity: number;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function distanceToMouse(x: number, y: number, mouseX: number, mouseY: number) {
  if (mouseX < 0 || mouseY < 0) return Infinity;
  return Math.hypot(x - mouseX, y - mouseY);
}

function drawStreak(ctx: CanvasRenderingContext2D, streak: Streak) {
  const fade = 1 - streak.age / streak.life;
  const alpha = 0.46 * fade * streak.intensity;

  if (streak.orientation === "horizontal") {
    const tailX = streak.direction === 1 ? streak.x - streak.length : streak.x + streak.length;
    const gradient = ctx.createLinearGradient(tailX, streak.y, streak.x, streak.y);
    gradient.addColorStop(0, "rgba(99,102,241,0)");
    gradient.addColorStop(0.76, `rgba(99,102,241,${alpha * 0.42})`);
    gradient.addColorStop(1, `rgba(248,250,252,${alpha})`);
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(tailX, streak.y);
    ctx.lineTo(streak.x, streak.y);
    ctx.stroke();
    return;
  }

  const tailY = streak.direction === 1 ? streak.y - streak.length : streak.y + streak.length;
  const gradient = ctx.createLinearGradient(streak.x, tailY, streak.x, streak.y);
  gradient.addColorStop(0, "rgba(99,102,241,0)");
  gradient.addColorStop(0.76, `rgba(167,139,250,${alpha * 0.42})`);
  gradient.addColorStop(1, `rgba(248,250,252,${alpha})`);
  ctx.strokeStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(streak.x, tailY);
  ctx.lineTo(streak.x, streak.y);
  ctx.stroke();
}

function drawDot(ctx: CanvasRenderingContext2D, dot: SparkDot) {
  const progress = dot.age / dot.life;
  const alpha = Math.sin(progress * Math.PI) * 0.5 * dot.intensity;
  const radius = 1.45 + alpha * 3.8;
  const glow = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, radius * 4);
  glow.addColorStop(0, `rgba(248,250,252,${alpha})`);
  glow.addColorStop(0.45, `rgba(167,139,250,${alpha * 0.42})`);
  glow.addColorStop(1, "rgba(167,139,250,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2);
  ctx.fill();
}

export function AnimatedTechGrid({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streaksRef = useRef<Streak[]>([]);
  const dotsRef = useRef<SparkDot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  useMotionValueEvent(mouseX, "change", (value) => {
    mouseRef.current.x = value;
  });
  useMotionValueEvent(mouseY, "change", (value) => {
    mouseRef.current.y = value;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.offsetWidth * dpr);
      canvas.height = Math.round(canvas.offsetHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (reducedMotion) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      return () => observer.disconnect();
    }

    let previousTime = 0;
    let streakAccumulator = 0;
    let dotAccumulator = 0;

    function spawnStreak(width: number, height: number) {
      if (streaksRef.current.length >= MAX_STREAKS) return;

      const mouse = mouseRef.current;
      const nearMouse = mouse.x >= 0 && mouse.y >= 0 && Math.random() < 0.42;
      const orientation: Orientation = Math.random() > 0.5 ? "horizontal" : "vertical";
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;

      const gridX = Math.round(
        (nearMouse ? mouse.x + randomBetween(-CURSOR_RADIUS, CURSOR_RADIUS) : randomBetween(0, width)) / GRID_SIZE,
      ) * GRID_SIZE;
      const gridY = Math.round(
        (nearMouse ? mouse.y + randomBetween(-CURSOR_RADIUS, CURSOR_RADIUS) : randomBetween(0, height)) / GRID_SIZE,
      ) * GRID_SIZE;

      const x = orientation === "horizontal" ? (direction === 1 ? -70 : width + 70) : gridX;
      const y = orientation === "vertical" ? (direction === 1 ? -70 : height + 70) : gridY;
      const cursorDistance = distanceToMouse(gridX, gridY, mouse.x, mouse.y);
      const cursorBoost = cursorDistance < CURSOR_RADIUS ? 1.28 : 1;

      streaksRef.current.push({
        x,
        y,
        orientation,
        direction,
        speed: randomBetween(110, 180),
        length: randomBetween(72, 138),
        age: 0,
        life: randomBetween(1.2, 2.1),
        intensity: randomBetween(0.78, 1.08) * cursorBoost,
      });
    }

    function spawnDot(width: number, height: number) {
      if (dotsRef.current.length >= MAX_DOTS) return;

      const mouse = mouseRef.current;
      const nearMouse = mouse.x >= 0 && mouse.y >= 0 && Math.random() < 0.38;
      const x = Math.round(
        (nearMouse ? mouse.x + randomBetween(-CURSOR_RADIUS, CURSOR_RADIUS) : randomBetween(0, width)) / GRID_SIZE,
      ) * GRID_SIZE;
      const y = Math.round(
        (nearMouse ? mouse.y + randomBetween(-CURSOR_RADIUS, CURSOR_RADIUS) : randomBetween(0, height)) / GRID_SIZE,
      ) * GRID_SIZE;
      const cursorDistance = distanceToMouse(x, y, mouse.x, mouse.y);
      const cursorBoost = cursorDistance < CURSOR_RADIUS ? 1.24 : 1;

      dotsRef.current.push({
        x,
        y,
        age: 0,
        life: randomBetween(1, 2),
        intensity: randomBetween(0.7, 1.08) * cursorBoost,
      });
    }

    function drawVignette(width: number, height: number) {
      const gradient = context.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.22,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.76,
      );
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(0.66, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,1)");
      context.globalCompositeOperation = "destination-out";
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
    }

    function loop(time: number) {
      if (!canvas) return;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const delta = previousTime === 0 ? 0 : Math.min((time - previousTime) / 1000, 0.04);
      previousTime = time;
      streakAccumulator += delta;
      dotAccumulator += delta;

      context.clearRect(0, 0, width, height);
      context.lineWidth = 1.1;
      context.lineCap = "round";

      const mouseActive = mouseRef.current.x >= 0 && mouseRef.current.y >= 0;
      const streakInterval = mouseActive ? 0.28 : 0.4;
      const dotInterval = mouseActive ? 0.36 : 0.54;

      if (streakAccumulator >= streakInterval) {
        spawnStreak(width, height);
        streakAccumulator = 0;
      }
      if (dotAccumulator >= dotInterval) {
        spawnDot(width, height);
        dotAccumulator = 0;
      }

      streaksRef.current = streaksRef.current.filter((streak) => {
        streak.age += delta;
        if (streak.orientation === "horizontal") {
          streak.x += streak.direction * streak.speed * delta;
        } else {
          streak.y += streak.direction * streak.speed * delta;
        }
        const alive = streak.age < streak.life;
        if (alive) drawStreak(context, streak);
        return alive;
      });

      dotsRef.current = dotsRef.current.filter((dot) => {
        dot.age += delta;
        const alive = dot.age < dot.life;
        if (alive) drawDot(context, dot);
        return alive;
      });

      drawVignette(width, height);
      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
      streaksRef.current = [];
      dotsRef.current = [];
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
