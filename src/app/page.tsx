import type { Metadata } from "next";

import { AboutSection } from "@/features/portfolio/components/AboutSection";
import { ScrollSnap } from "@/features/portfolio/components/ScrollSnap";
import { SiteHeader } from "@/features/portfolio/components/SiteHeader";
import { SkillsSection } from "@/features/portfolio/components/SkillsSection";
import { PortfolioHeroView } from "@/features/portfolio/views/PortfolioHeroView";

export const metadata: Metadata = {
  title: "Helen Mai",
  description:
    "Interactive frontend portfolio for polished web experiences and motion systems.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero pinned as background layer — sticky keeps it visible as MainContent rises over it */}
      <div className="sticky top-0 z-10 h-svh overflow-hidden">
        <PortfolioHeroView />
      </div>

      {/* MainContent slides up over Hero — rounded top edge + shadow create depth */}
      <main id="main-content" className="relative z-20 min-h-screen rounded-t-3xl bg-background shadow-[0_-12px_60px_rgb(0_0_0/0.6)]">
        <ScrollSnap />
        <SiteHeader />
        <AboutSection />
        <SkillsSection />
      </main>
    </>
  );
}
