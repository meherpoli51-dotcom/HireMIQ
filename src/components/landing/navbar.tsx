"use client";

import Link from "next/link";
import { Brain, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Platform", href: "/platform" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 16);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-out
        ${mounted ? "animate-nav-in" : "opacity-0"}
        ${
          scrolled
            ? "bg-white/70 backdrop-blur-2xl shadow-[0_1px_3px_rgba(91,79,191,0.08)] border-b border-brand-100/60"
            : "bg-transparent border-b border-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[4.25rem]">
          {/* ---- Logo ---- */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group/logo relative"
          >
            <div
              className="
                w-8 h-8 rounded-lg flex items-center justify-center
                bg-gradient-to-br from-brand-500 to-brand-700
                shadow-[0_2px_8px_rgba(91,79,191,0.3)]
                transition-transform duration-300 group-hover/logo:scale-110
                group-hover/logo:shadow-[0_4px_16px_rgba(91,79,191,0.4)]
              "
            >
              <Brain className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight select-none">
              Hire<span className="text-brand-500">MIQ</span>
            </span>
          </Link>

          {/* ---- Desktop Nav Links ---- */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  relative px-3.5 py-2 text-sm font-medium text-slate-500
                  rounded-lg transition-all duration-200
                  hover:text-brand-600 hover:bg-brand-50/60
                  group/link
                "
                style={{ animationDelay: `${(i + 1) * 60}ms` }}
              >
                {link.label}
                <span
                  className="
                    absolute bottom-1 left-1/2 -translate-x-1/2
                    w-0 h-[2px] rounded-full bg-brand-500
                    transition-all duration-300
                    group-hover/link:w-5
                  "
                />
              </Link>
            ))}
          </div>

          {/* ---- Desktop CTA Buttons ---- */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Secondary — outlined */}
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="
                  relative overflow-hidden
                  border-brand-200 text-brand-600
                  hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700
                  transition-all duration-300
                  font-semibold rounded-lg
                  cursor-pointer
                "
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 opacity-70" />
                Try Platform Free
              </Button>
            </Link>

            {/* Primary — filled purple */}
            <Link href="/contact">
              <Button
                size="sm"
                className="
                  relative overflow-hidden
                  bg-gradient-to-r from-brand-500 to-brand-600
                  hover:from-brand-600 hover:to-brand-700
                  text-white font-semibold rounded-lg
                  shadow-[0_2px_12px_rgba(91,79,191,0.3)]
                  hover:shadow-[0_4px_20px_rgba(91,79,191,0.45)]
                  transition-all duration-300
                  hover:-translate-y-px
                  cursor-pointer
                "
              >
                Hire Through Us
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-300 group-hover/button:translate-x-0.5" />
              </Button>
            </Link>
          </div>

          {/* ---- Mobile Hamburger ---- */}
          <button
            className="
              lg:hidden relative w-10 h-10 flex items-center justify-center
              rounded-lg text-slate-600
              hover:bg-brand-50 hover:text-brand-600
              transition-colors duration-200
            "
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`
                absolute transition-all duration-300
                ${mobileOpen ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}
              `}
            >
              <Menu className="w-5 h-5" />
            </span>
            <span
              className={`
                absolute transition-all duration-300
                ${mobileOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"}
              `}
            >
              <X className="w-5 h-5" />
            </span>
          </button>
        </div>
      </div>

      {/* ---- Mobile Menu ---- */}
      <div
        className={`
          lg:hidden overflow-hidden
          transition-all duration-400 ease-out
          ${mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="bg-white/95 backdrop-blur-2xl border-t border-brand-100/40 px-4 pb-6 pt-2">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  text-sm font-medium text-slate-600 py-3 px-4 rounded-xl
                  hover:bg-brand-50 hover:text-brand-600
                  transition-all duration-200
                  active:scale-[0.98]
                "
                style={{
                  animationDelay: `${i * 50}ms`,
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateX(0)" : "translateX(-12px)",
                  transition: `opacity 0.3s ${i * 50}ms, transform 0.3s ${i * 50}ms, background-color 0.2s, color 0.2s`,
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <hr className="border-brand-100/50 my-3" />

          {/* Mobile CTAs */}
          <div className="flex flex-col gap-2.5 px-1">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button
                variant="outline"
                size="lg"
                className="
                  w-full justify-center
                  border-brand-200 text-brand-600
                  hover:border-brand-300 hover:bg-brand-50
                  font-semibold rounded-xl
                  cursor-pointer
                "
              >
                <Sparkles className="w-4 h-4 mr-1.5 opacity-70" />
                Try Platform Free
              </Button>
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>
              <Button
                size="lg"
                className="
                  w-full justify-center
                  bg-gradient-to-r from-brand-500 to-brand-600
                  hover:from-brand-600 hover:to-brand-700
                  text-white font-semibold rounded-xl
                  shadow-[0_2px_12px_rgba(91,79,191,0.3)]
                  cursor-pointer
                "
              >
                Hire Through Us
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
