import type { TagTone } from "../types";

export type WorkCategory = "AI/LLM" | "E-commerce" | "Web3";

export type WorkItem = {
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
};

export const worksContent = {
  annotation: "What I've built:",
  heading: "Main Works",

  projects: [
    {
      title: "Qlay Research Platform",
      subtitle: "Qlay Technology Inc.",
      description:
        "Contributed to the MVP development of an AI-driven research platform by building reporting modules, study chat workflows, and real-time data synchronization pipelines. Helped reduce manual research operations by 50% through intelligent automation and scalable frontend architecture.",
      role: "Full-stack Engineer",
      period: "March 2026 – Present",
      tags: [
        "NextJS",
        "TypeScript",
        "TailwindCSS",
        "Shadcn/UI",
        "AI / LLM",
        "SWR",
        "Zustand",
        "CI/CD pipeline",
        "AWS"
      ],
      categories: ["AI/LLM"],
      accent: "primary" as TagTone,
      featured: true,
    },

    {
      title: "Qlay AI Hiring Platform",
      subtitle: "Qlay Technology Inc. · Featured in Forbes Tech Council",
      description:
        "Developed scalable frontend systems for an AI-powered hiring platform, focusing on reusable component architecture, shared state management, and responsive enterprise workflows. Contributed to improving development efficiency across multiple products within a monorepo ecosystem.",
      role: "Frontend Engineer",
      period: "Feb 2025 – Feb 2026",
      tags: [
        "ReactJS",
        "NextJS",
        "Electron",
        "NestJS",
        "TypeScript",
        "TailwindCSS",
        "mynaui",
        "Turbo",
        "Zustand/Redux",
        "Websocket",
        "Streaming",
        "CI/CD pipeline",
        "AWS"
      ],
      categories: ["AI/LLM"],
      accent: "secondary" as TagTone,
    },

    {
      title: "Verbale",
      subtitle: "AI-powered English Speaking Platform",
      description:
        "Built a responsive and SEO-optimized language learning platform with real-time speech analysis and AI-powered feedback systems. Implemented smooth interactive learning experiences using modern frontend architecture and realtime processing workflows.",
      role: "Frontend Engineer (Freelancer)",
      period: "May 2025 – Aug 2025",
      tags: [
        "NextJS",
        "TypeScript",
        "Shadcn/UI",
        "Turbo",
        "AI Speech",
        "Realtime",
      ],
      categories: ["AI/LLM"],
      accent: "accent" as TagTone,
    },

    {
      title: "Good Viet Goods",
      subtitle: "E-commerce Platform",
      description:
        "Delivered a complete multilingual e-commerce solution featuring authentication, shopping cart, and order management systems. Focused on responsive UI, scalable state management, and optimized customer shopping experiences.",
      role: "Frontend Engineer (Freelancer)",
      period: "Feb 2024 – Apr 2024",
      tags: [
        "Next.js",
        "TypeScript",
        "Redux",
        "Mantine UI",
      ],
      categories: ["E-commerce"],
      accent: "warning" as TagTone,
    },

    {
      title: "MESEA",
      subtitle: "Multichain NFT Exchange",
      description:
        "Developed frontend features for a multichain NFT marketplace with DeFi integrations including wallet connectivity, cross-chain interactions, and trading experiences optimized for Web3 users.",
      role: "Frontend Engineer",
      period: "2023",
      tags: ["React", "TypeScript", "Web3.js", "NFT", "DeFi", "Solidity", "Smart Contract"],
      categories: ["Web3"],
      accent: "energy" as TagTone,
    },
  ] satisfies WorkItem[],
};
