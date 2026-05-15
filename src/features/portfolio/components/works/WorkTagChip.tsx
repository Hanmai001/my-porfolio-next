"use client";

import type { TagTone } from "../../types";
import { ACCENT } from "../../constants/workStyles";
import { Magnetic } from "../Magnetic";

export function WorkTagChip({ label, accent }: { label: string; accent: TagTone }) {
  const a = ACCENT[accent];
  return (
    <Magnetic strength={0.08} className="inline-flex">
      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-black uppercase tracking-wider ${a.border} ${a.bg} ${a.text}`}>
        {label}
      </span>
    </Magnetic>
  );
}
