"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import type { ProjectDetail, TagTone } from "@/shared/types/work-project";
import { accentStyles, ease } from "../../constants/styles";
import { FeatureItem } from "../FeatureItem";

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.62, ease, delay },
  };
}

type ProjectFeaturesSectionProps = {
  detail: ProjectDetail;
  accent: TagTone;
  activeFeatureIndex: number;
  setFeatureRef: (index: number, el: HTMLDivElement | null) => void;
};

export function ProjectFeaturesSection({ detail, accent, activeFeatureIndex, setFeatureRef }: ProjectFeaturesSectionProps) {
  const styles = accentStyles[accent];
  const activeFeature = detail.features[activeFeatureIndex];
  const activeTone = accentStyles[activeFeature?.tone ?? accent];

  return (
    <section id="features" className="scroll-mt-8 pb-24">
      <motion.div {...reveal(0)} className="mb-12 max-w-2xl">
        <p className={`mb-3 font-mono text-xs font-black uppercase tracking-[0.2em] ${styles.text}`}>Key features</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Product moments built for momentum
        </h2>
      </motion.div>

      <div className="relative grid gap-0 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* Left — scrolling text */}
        <div>
          {detail.features.map((feature, index) => (
            <FeatureItem
              key={feature.title}
              feature={feature}
              index={index}
              isActive={index === activeFeatureIndex}
              totalCount={detail.features.length}
              featureTone={accentStyles[feature.tone ?? accent]}
              projectAccent={accent}
              setRef={setFeatureRef}
            />
          ))}
        </div>

        {/* Right — sticky visual stage (desktop only) */}
        <div className="hidden lg:block">
          <div className="sticky top-[20vh] h-[40vh]">
            <AnimatePresence mode="wait">
              {activeFeature?.image ? (
                <motion.div
                  key={activeFeature.image}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease }}
                  className={`relative h-full w-full overflow-hidden rounded-2xl ${activeTone.glow}`}
                >
                  <Image
                    src={activeFeature.image}
                    alt={activeFeature.title}
                    fill
                    className="object-cover object-top"
                    sizes="(min-width: 1024px) 60vw, 0px"
                  />
                  {activeFeature.hotspots?.map((spot, i) => (
                    <div
                      key={i}
                      className="absolute z-10"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
                    >
                      <motion.div
                        className={`absolute rounded-full border ${activeTone.border}`}
                        style={{ width: 32, height: 32, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
                        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: i * 0.6 }}
                      />
                      <div className={`size-2.5 rounded-full ${activeTone.point}`} />
                    </div>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
