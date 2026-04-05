"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, Brain, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/80 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-full px-4 py-2 mb-10 animate-fade-in">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold tracking-wide">
              AI-Powered Recruitment Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-8 animate-fade-in">
            Decode JDs.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
              Find Better Talent.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-normal animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Paste any job description. Get instant intelligence — skill mapping,
            target companies, Boolean search strings, candidate scoring, and
            AI-powered screening assessments. All in one platform.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Link href="/login">
              <Button
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white h-13 px-8 text-base font-semibold rounded-xl shadow-xl shadow-slate-900/10"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="h-13 px-8 text-base border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
              >
                See How It Works
              </Button>
            </a>
          </div>

          {/* Trust bar */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { icon: Zap, value: "60s", label: "Analysis Time" },
              { icon: Brain, value: "6+", label: "AI Modules" },
              { icon: Users, value: "7D", label: "Match Scoring" },
              { icon: ShieldCheck, value: "AI", label: "Assessments" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  <stat.icon className="w-4 h-4 text-blue-600" />
                  <span className="text-xl font-bold text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
