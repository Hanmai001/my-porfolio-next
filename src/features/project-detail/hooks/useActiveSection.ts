"use client";

import { useEffect, useState } from "react";

import { tocItems } from "../constants/styles";

type SectionId = (typeof tocItems)[number]["id"];

export function useActiveSection() {
  const [activeId, setActiveId] = useState<SectionId>("overview");

  useEffect(() => {
    const sections = tocItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
