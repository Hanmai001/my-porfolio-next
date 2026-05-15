"use client";

import { motion } from "framer-motion";

import type { WorkFilter } from "../../types";
import { reveal } from "../../constants/animations";
import { Magnetic } from "../Magnetic";

const workFilters = ["All", "AI/LLM", "E-commerce", "Web3"] as const;

export { workFilters };

export function WorkFilterBar({
  activeFilter,
  onChange,
}: {
  activeFilter: WorkFilter;
  onChange: (filter: WorkFilter) => void;
}) {
  return (
    <motion.div
      {...reveal(0.16)}
      className="mt-6 flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter works"
    >
      {workFilters.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <Magnetic key={filter} strength={0.1}>
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(filter)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] backdrop-blur-[20px] transition-colors duration-200 ${
                isActive
                  ? "border-brand-primary/60 bg-brand-primary text-primary-foreground shadow-[0_0_24px_rgb(56_189_248/0.2)]"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          </Magnetic>
        );
      })}
    </motion.div>
  );
}
