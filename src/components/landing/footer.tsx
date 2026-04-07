"use client";

import Link from "next/link";
import { Brain, ArrowUpRight, Heart } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/platform#features" },
      { label: "How it Works", href: "/platform#how-it-works" },
      { label: "Platform", href: "/platform" },
      { label: "Pricing", href: "/platform#pricing" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Recruitment", href: "/services#recruitment" },
      { label: "Staffing", href: "/services#staffing" },
      { label: "RPO", href: "/services#rpo" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/hiremiq",
    icon: ArrowUpRight,
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com/hiremiq",
    icon: ArrowUpRight, // placeholder until lucide ships X icon
  },
] as const;

export function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-400 overflow-hidden">
      {/* Decorative top edge — gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #5B4FBF 25%, #a78bfa 50%, #5B4FBF 75%, transparent 100%)",
        }}
      />

      {/* Decorative background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-500/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-brand-400/[0.04] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* ---- Top Section: Brand + Columns ---- */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 lg:gap-12 mb-14">
          {/* Brand Block — spans 2 cols on md */}
          <div className="col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-5 group/logo"
            >
              <div
                className="
                  w-8 h-8 rounded-lg flex items-center justify-center
                  bg-gradient-to-br from-brand-500 to-brand-700
                  shadow-[0_2px_12px_rgba(91,79,191,0.35)]
                  transition-transform duration-300 group-hover/logo:scale-110
                "
              >
                <Brain className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight select-none">
                Hire<span className="text-brand-400">MIQ</span>
              </span>
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
              AI Recruitment Intelligence Platform.
              <br />
              Built for recruiters who move fast.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="
                      w-9 h-9 rounded-lg flex items-center justify-center
                      bg-white/[0.05] border border-white/[0.06]
                      text-slate-500 hover:text-brand-400
                      hover:bg-brand-500/10 hover:border-brand-500/20
                      transition-all duration-300
                    "
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="
                        footer-link text-sm text-slate-500
                        hover:text-brand-300
                        transition-colors duration-200
                        inline-flex items-center gap-1 group/flink
                      "
                    >
                      {link.label}
                      <ArrowUpRight
                        className="
                          w-3 h-3 opacity-0
                          -translate-x-1 translate-y-0.5
                          group-hover/flink:opacity-60
                          group-hover/flink:translate-x-0
                          group-hover/flink:translate-y-0
                          transition-all duration-200
                        "
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---- Divider ---- */}
        <div
          className="h-px mb-8"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(91,79,191,0.15) 30%, rgba(91,79,191,0.15) 70%, transparent 100%)",
          }}
        />

        {/* ---- Bottom Bar ---- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 text-center sm:text-left">
            &copy; 2026 HireMIQ. All rights reserved. Made with{" "}
            <Heart className="inline w-3 h-3 text-brand-500 fill-brand-500 relative -top-px" />{" "}
            in India.
          </p>
          <p className="text-xs text-slate-600 text-center sm:text-right">
            HireMIQ &mdash; AI Recruitment Intelligence Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
