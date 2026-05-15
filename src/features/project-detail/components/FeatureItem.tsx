"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

import type { ProjectFeature, TagTone } from "@/shared/types/work-project";
import { accentStyles, toneGlowRgb } from "../constants/styles";

type FeatureItemProps = {
  feature: ProjectFeature;
  index: number;
  isActive: boolean;
  totalCount: number;
  featureTone: (typeof accentStyles)[TagTone];
  projectAccent: TagTone;
  setRef: (index: number, el: HTMLDivElement | null) => void;
};

export function FeatureItem({ feature, index, isActive, totalCount, featureTone, projectAccent, setRef }: FeatureItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 80%", "end 20%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const tone = feature.tone ?? projectAccent;

  useEffect(() => {
    setRef(index, itemRef.current);
  }, [index, setRef]);

  return (
    <div
      ref={itemRef}
      className={`relative pl-5 transition-opacity duration-500 ${index === 0 ? "pt-0" : "pt-24"} ${index === totalCount - 1 ? "pb-32" : "pb-24"} ${isActive ? "opacity-100" : "opacity-30"}`}
    >
      {/* progress track */}
      <div className="absolute left-0 top-0 h-full w-[1.5px] bg-white/8" />
      {/* progress fill */}
      <motion.div
        className={`absolute left-0 top-0 w-[1.5px] origin-top ${featureTone.point}`}
        style={{ scaleY, height: "100%" }}
      />

      {feature.metric ? (
        <span
          className={`inline-flex rounded-full border px-3 py-1 font-mono text-[0.66rem] font-black uppercase tracking-[0.16em] transition-shadow duration-500 ${featureTone.border} ${featureTone.bg} ${featureTone.text}`}
          style={isActive ? { boxShadow: `0 0 20px ${toneGlowRgb[tone]}` } : undefined}
        >
          {feature.metric}
        </span>
      ) : null}
      <h3
        className="mt-5 text-2xl font-semibold text-foreground transition-all duration-500"
        style={isActive ? { textShadow: `0 0 28px ${toneGlowRgb[tone]}` } : undefined}
      >
        {feature.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
        {feature.description}
      </p>
    </div>
  );
}
