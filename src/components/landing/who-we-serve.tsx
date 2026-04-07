"use client";

import { Building2, Users2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useReveal } from "./use-reveal";

const audiences = [
  {
    icon: Building2,
    title: "For companies & startups",
    description:
      "You need talent. Fast. Without the back-and-forth, resume spam, and wasted interviews. HireMIQ combines real recruiting expertise with AI-powered intelligence to find, screen, and deliver the right candidates — so you can focus on building your business.",
    cta: "Hire Through Us",
    href: "/contact",
    accent: "from-brand-500 to-brand-700",
  },
  {
    icon: Users2,
    title: "For recruitment teams & agencies",
    description:
      "Your team works hard. But sourcing, Boolean strings, JD analysis, candidate mapping — it all takes time. HireMIQ gives your recruiters an AI co-pilot that does in 60 seconds what used to take hours. Faster sourcing. Sharper shortlists. Higher placements.",
    cta: "Try the Platform",
    href: "/login",
    accent: "from-brand-400 to-brand-600",
  },
];

export function WhoWeServe() {
  const ref = useReveal();

  return (
    <section id="who-we-serve" className="py-24 lg:py-32 bg-brand-50/40 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 dot-pattern opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]" />

      <div ref={ref} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-3">
            Who we serve
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight max-w-2xl mx-auto">
            Built for the people who need to hire right
            <span className="bg-gradient-to-r from-brand-500 to-brand-400 bg-clip-text text-transparent">
              {" "}
              — and fast
            </span>
            .
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {audiences.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="gradient-border rounded-2xl p-8 hover:shadow-xl hover:shadow-brand-100/60 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center mb-6 shadow-lg shadow-brand-500/15 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {item.description}
                </p>

                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors group/link"
                >
                  {item.cta}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
