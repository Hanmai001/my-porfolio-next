"use client";

import { useEffect, useRef } from "react";
import { type MotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";

const GRID_SIZE = 40;
const DOT_RADIUS = 1;
const BASE_OPACITY = 0.06;
const SPARKLE_AMPLITUDE = 0.72;
const REPULSION_RADIUS = 120;
const REPULSION_MAX_GLOW = 0.55;
const DOT_COLOR: [number, number, number] = [248, 250, 252];

interface Dot {
  x: number;
  y: number;
  phase: number;
  speed: number;
  intensity: number;
}

function buildDots(width: number, height: number): Dot[] {
  const dots: Dot[] = [];
  const cols = Math.ceil(width / GRID_SIZE) + 1;
  const rows = Math.ceil(height / GRID_SIZE) + 1;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      dots.push({
        x: col * GRID_SIZE,
        y: row * GRID_SIZE,
        phase: Math.random() * Math.PI * 2,
        speed: 0.9 + Math.random() * 1.4,
        intensity: 0.3 + Math.random() * 0.7,
      });
    }
  }
  return dots;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  dots: Dot[],
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  time: number,
  reducedMotion: boolean,
) {
  ctx.clearRect(0, 0, width, height);

  const [r, g, b] = DOT_COLOR;

  for (const dot of dots) {
    // pow(abs(sin(...)), 4) creates sharp brief flashes from near-zero baseline
    const sparkle = reducedMotion ? 0 : Math.pow(Math.abs(Math.sin(time * dot.speed + dot.phase)), 4);
    let opacity = BASE_OPACITY + SPARKLE_AMPLITUDE * sparkle * dot.intensity;

    if (!reducedMotion && mouseX >= 0 && mouseY >= 0) {
      const dx = dot.x - mouseX;
      const dy = dot.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPULSION_RADIUS) {
        const t = 1 - dist / REPULSION_RADIUS;
        opacity += REPULSION_MAX_GLOW * t * t;
      }
    }

    opacity = Math.min(1, opacity);
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
    ctx.fill();
  }

  // Radial vignette: fade dots toward edges
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.25,
    width / 2, height / 2, Math.max(width, height) * 0.72,
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.6, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,1)");

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";
}

export function DotGridBackground({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  useMotionValueEvent(mouseX, "change", (v) => { mouseRef.current.x = v; });
  useMotionValueEvent(mouseY, "change", (v) => { mouseRef.current.y = v; });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      dotsRef.current = buildDots(canvas.width, canvas.height);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (reducedMotion) {
      drawFrame(ctx, dotsRef.current, canvas.width, canvas.height, -9999, -9999, 0, true);
      return () => observer.disconnect();
    }

    let startTime: number | null = null;

    function loop(ts: number) {
      if (!canvas || !ctx) return;
      if (startTime === null) startTime = ts;
      const time = (ts - startTime) / 1000;
      drawFrame(ctx, dotsRef.current, canvas.width, canvas.height, mouseRef.current.x, mouseRef.current.y, time, false);
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
