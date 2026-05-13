import type { Metadata } from "next";

import { PortfolioHeroView } from "@/features/portfolio/views/PortfolioHeroView";

export const metadata: Metadata = {
  title: "Helen Mai",
  description:
    "Interactive frontend portfolio for polished web experiences and motion systems.",
};

export default function HomePage() {
  return <PortfolioHeroView />;
}
