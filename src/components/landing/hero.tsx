"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Users, Cpu, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />
        <div className="absolute inset-0 dot-pattern [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_40%,transparent_100%)]" />
        <div className="absolute top-16 left-[10%] w-72 h-72 rounded-full bg-brand-200/30 blur-3xl animate-float" />
        <div className="absolute top-32 right-[8%] w-96 h-96 rounded-full bg-brand-300/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-[30%] w-64 h-64 rounded-full bg-brand-100/40 blur-3xl animate-float-delay" />
        <div className="absolute top-1/3 right-[15%] w-48 h-48 rounded-full border border-brand-200/30 animate-spin-slow hidden lg:block" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">

          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-brand-100 shadow-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-600">Trusted by 50+ recruitment teams</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">Live</span>
          </div>

          {/* Headline — specific, outcome-focused */}
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Stop spending 10 hours
            <br />
            on what AI does in{" "}
            <span className="bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 bg-clip-text text-transparent">
              60 seconds.
            </span>
          </h1>

          {/* Specific subtitle with real proof */}
          <p
            className="text-base sm:text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto mb-4 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            HireMIQ analyzes job descriptions, generates Naukri & LinkedIn Boolean strings,
            scores candidates, and builds outreach sequences — in under 60 seconds.
            Built by recruiters with 15+ years in India&rsquo;s staffing industry.
          </p>

          {/* Proof metrics strip */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10 animate-fade-in"
            style={{ animationDelay: "0.25s" }}
          >
            {[
              { value: "60s", label: "JD analysis" },
              { value: "8", label: "AI modules" },
              { value: "35%", label: "better shortlists" },
              { value: "Free", label: "to start" },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-brand-500">{m.value}</span>
                <span className="text-sm text-slate-400">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Two-ways blurb */}
          <div
            className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="glass-card rounded-2xl p-5 text-left flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Need to hire?</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Our expert team handles sourcing, screening &amp; offers end-to-end.
                </p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 text-left flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Have a team?</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Our AI platform makes them 10x faster. Free for 5 JDs/month.
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
              href="/login"
              className="inline-flex items-center justify-center h-13 px-8 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-xl shadow-brand-500/20 transition-all duration-200 text-base gap-2 animate-pulse-ring"
            >
              <Sparkles className="w-4 h-4" />
              Start Free — 5 JDs/month
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-13 px-8 border-2 border-brand-200 text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-all duration-200 text-base gap-2"
            >
              Hire Through Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust micro-copy */}
          <p className="text-xs text-slate-400 mt-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            No credit card required &middot; Free forever plan &middot; Cancel Pro anytime
          </p>

        </div>
      </div>
    </section>
  );
}
