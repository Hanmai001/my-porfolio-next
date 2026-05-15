"use client";

import Image from "next/image";

import type { ProjectPreviewSlide } from "@/shared/types/work-project";

export function PreviewSlideCard({ slide }: { slide: ProjectPreviewSlide }) {
  return (
    <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.035] p-4 shadow-[0_20px_50px_rgb(0_0_0/0.5)] backdrop-blur-[20px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgb(255_255_255_/_0.1),transparent_42%)]" />
      <div className="relative h-full overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#07090f]">
        {slide.src ? (
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        ) : (
          <div className="flex h-full min-h-72 flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgb(99_102_241_/_0.16),transparent_34%),linear-gradient(180deg,rgb(255_255_255_/_0.04),transparent)] px-6 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_12px_30px_rgb(0_0_0/0.35)]">
              <div className="h-7 w-9 rounded-md border border-white/20 bg-linear-to-br from-white/10 to-white/3" />
            </div>
            <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.2em] text-brand-primary">
              Preview image
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Placeholder will be replaced when real project screenshots are added.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
