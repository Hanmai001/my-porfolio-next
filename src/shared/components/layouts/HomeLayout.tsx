import type { ReactNode } from "react";
import { ScrollSnap } from "../ScrollSnap";
import { SiteHeader } from "../header/SiteHeader";

export function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-content"
      className="relative z-20 min-h-screen rounded-t-3xl bg-background shadow-[0_-12px_60px_rgb(0_0_0/0.6)]"
    >
      <ScrollSnap />
      <SiteHeader />
      {children}
    </main>
  );
}
