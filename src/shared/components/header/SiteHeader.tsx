"use client";

import { homeCta, homeNavItems } from "@/shared/constants/navigation";
import { useLenis } from "@/shared/providers/AppProviders";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const HEADER_HEIGHT = 64;

export function SiteHeader() {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollTo } = useLenis();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionIds = homeNavItems
      .map((item) => item.href.slice(1))
      .filter((id) => !!document.getElementById(id));

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setMobileOpen(false);
    scrollTo(target, { offset: -HEADER_HEIGHT, duration: 1.2 });
  }

  const navItems = homeNavItems.map((item) => {
    const id = item.href.slice(1);
    const isActive = activeId === id;
    return { ...item, id, isActive };
  });

  return (
    <header
      aria-label="Site navigation"
      className="sticky top-0 z-50 h-16 border-b border-border-subtle bg-surface-base/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center gap-1.5 font-mono text-lg font-black tracking-tight text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <span className="size-2 rounded-full bg-brand-primary" aria-hidden="true" />
          HM
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navItems.map(({ label, href, isActive }) => (
            <a
              key={label}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className={`relative font-mono text-sm font-medium transition-colors duration-200 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {label}
              <span
                aria-hidden
                className={`absolute -bottom-2.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand-primary transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"
                  }`}
              />
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-surface-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 min-w-50 overflow-hidden rounded-xl border border-border-subtle bg-surface-base/95 shadow-xl backdrop-blur-md"
              >
                <nav aria-label="Mobile" className="flex flex-col py-2">
                  {navItems.map(({ label, href, isActive }) => (
                    <a
                      key={label}
                      href={href}
                      onClick={(e) => handleNavClick(e, href)}
                      className={`flex items-center gap-3 px-5 py-3 font-mono text-sm font-medium transition-colors duration-150 ${isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/50"
                        }`}
                    >
                      <span
                        aria-hidden
                        className={`size-1.5 rounded-full bg-brand-primary transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"
                          }`}
                      />
                      {label}
                    </a>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <a
          href={homeCta.href}
          className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[0_4px_16px_rgb(99_102_241/0.35)] transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:gap-3 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <span className="hidden sm:inline">{homeCta.label}</span>
          <span className="sm:hidden">Email</span>
          <Mail size={14} className="stroke-[3px] sm:hidden" />
          <Mail size={16} className="hidden stroke-[3px] sm:block" />
        </a>
      </div>
    </header>
  );
}
