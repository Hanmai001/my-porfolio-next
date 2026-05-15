import type { CSSProperties, ReactNode } from "react";

export type TagTone = "secondary" | "primary" | "accent" | "warning" | "energy";

export interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export type WorkCategory = "AI/LLM" | "E-commerce" | "Web3" | "Landing Page";

export type WorkFilter = "All" | WorkCategory;

export type SpotlightStyle = CSSProperties & {
  "--spotlight-x"?: string;
  "--spotlight-y"?: string;
};

export type FeatureHotspot = { x: number; y: number; label?: string };

export type ProjectFeature = {
  title: string;
  description: string;
  metric?: string;
  tone?: TagTone;
  image?: string;
  hotspots?: FeatureHotspot[];
};

export type ProjectPreviewSlide = {
  src?: string;
  alt: string;
};

export type ProjectChallenge = {
  title: string;
  description: string;
  outcome: string;
  solution?: string;
  tags?: string[];
};

export type ProjectDetail = {
  tagline: string;
  problem: string[];
  solution: string[];
  challenges: ProjectChallenge[];
  features: ProjectFeature[];
  previewSlides: ProjectPreviewSlide[];
};

export type WorkItem = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  role: string;
  period: string;
  tags: string[];
  categories: WorkCategory[];
  accent: TagTone;
  featured?: boolean;
  links?: { github?: string; demo?: string };
  detail?: ProjectDetail;
};
