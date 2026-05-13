import type { ReactNode } from "react";

export type TagTone = "secondary" | "primary" | "accent" | "warning" | "energy";

export interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}
