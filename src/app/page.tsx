import type { Metadata } from "next";

import { AboutSection } from "@/features/portfolio/components/about/AboutSection";
import { SkillsSection } from "@/features/portfolio/components/skills/SkillsSection";
import { WorksSection } from "@/features/portfolio/components/works/WorksSection";
import { PortfolioHeroView } from "@/features/portfolio/views/PortfolioHeroView";
import { HomeLayout } from "@/shared/components/layouts/HomeLayout";

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
      <HomeLayout>
        <AboutSection />
        <WorksSection />
        <SkillsSection />
      </HomeLayout>
    </>
  );
}
