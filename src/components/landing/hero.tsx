"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Users, Cpu } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
      {/* ── Animated gradient mesh background ── */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />

        {/* Dot-grid overlay */}
        <div className="absolute inset-0 dot-pattern [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_40%,transparent_100%)]" />

        {/* Floating orbs */}
        <div className="absolute top-16 left-[10%] w-72 h-72 rounded-full bg-brand-200/30 blur-3xl animate-float" />
        <div className="absolute top-32 right-[8%] w-96 h-96 rounded-full bg-brand-300/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-[30%] w-64 h-64 rounded-full bg-brand-100/40 blur-3xl animate-float-delay" />

        {/* Decorative spinning ring */}
        <div className="absolute top-1/3 right-[15%] w-48 h-48 rounded-full border border-brand-200/30 animate-spin-slow hidden lg:block" />
        <div className="absolute bottom-1/4 left-[12%] w-32 h-32 rounded-full border border-brand-100/40 animate-spin-slow hidden lg:block" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-brand-500 text-white rounded-full px-4 py-2 mb-10 animate-fade-in shadow-lg shadow-brand-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-200" />
            <span className="text-xs font-semibold tracking-wide">
              Recruitment Firm + AI Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-8 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Recruitment expertise.
            <br />
            <span className="bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 bg-clip-text text-transparent">
              AI intelligence.
            </span>
            <br />
            One partner.
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            HireMIQ is a recruitment firm and AI platform — built by hiring
            veterans with 15+ years inside India&rsquo;s top staffing agencies
            and startups. We find your talent, or we give your team the tools to
            do it faster than anyone.
          </p>

          {/* Two-ways blurb */}
          <div
            className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="glass-card rounded-2xl p-5 text-left flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  Need to hire?
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Our expert team handles it end-to-end.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 text-left flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  Have a team?
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Our AI platform makes them 10x faster.
                </p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-13 px-8 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-xl shadow-brand-500/20 transition-all duration-200 text-base gap-2 animate-pulse-ring"
            >
              Hire Through Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-13 px-8 border-2 border-brand-200 text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-all duration-200 text-base gap-2"
            >
              Try Platform Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
