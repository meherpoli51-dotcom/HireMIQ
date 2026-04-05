"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-50 via-blue-50/50 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute top-40 right-0 w-72 h-72 bg-gradient-to-bl from-violet-100 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">
              AI-Powered Recruitment Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6 animate-fade-in">
            Decode JDs.{" "}
            <span className="gradient-text">Find Better Talent.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Turn messy job descriptions into recruiter-ready sourcing workflows
            in minutes. Smart JD analysis, boolean search strings, target
            companies, and candidate outreach — all powered by AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 h-12 px-8 text-base">
                Start Analyzing JDs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base border-slate-300 text-slate-700">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-2xl font-bold text-slate-900">60s</span>
              </div>
              <p className="text-xs text-slate-500">Avg. Analysis Time</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-2xl font-bold text-slate-900">6</span>
              </div>
              <p className="text-xs text-slate-500">Intelligence Modules</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-2xl font-bold text-slate-900">85%</span>
              </div>
              <p className="text-xs text-slate-500">Faster Sourcing</p>
            </div>
          </div>
        </div>

        {/* App Preview */}
        <div className="mt-16 max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="relative rounded-xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
            {/* Mock app bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200/60">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded-md border border-slate-200 px-4 py-1 text-xs text-slate-400 w-64 text-center">
                  app.hiremiq.com/workspace
                </div>
              </div>
            </div>
            {/* Preview content */}
            <div className="grid grid-cols-12 min-h-[340px]">
              {/* Sidebar preview */}
              <div className="col-span-2 bg-slate-900 p-4">
                <div className="space-y-3">
                  <div className="h-3 w-16 bg-slate-700 rounded" />
                  <div className="h-8 w-full bg-blue-600/20 border border-blue-500/30 rounded-md" />
                  <div className="h-8 w-full bg-slate-800 rounded-md" />
                  <div className="h-8 w-full bg-slate-800 rounded-md" />
                  <div className="h-8 w-full bg-slate-800 rounded-md" />
                </div>
              </div>
              {/* Input panel preview */}
              <div className="col-span-4 p-4 border-r border-slate-200/60 bg-white">
                <div className="space-y-3">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="h-8 w-full bg-slate-100 rounded-md border border-slate-200" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-20 w-full bg-slate-100 rounded-md border border-slate-200" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-slate-100 rounded-md border border-slate-200" />
                    <div className="h-8 bg-slate-100 rounded-md border border-slate-200" />
                  </div>
                  <div className="h-10 w-full bg-blue-600 rounded-md mt-2" />
                </div>
              </div>
              {/* Output panel preview */}
              <div className="col-span-6 p-4 bg-slate-50/50">
                <div className="flex gap-2 mb-4">
                  {["JD IQ", "Client IQ", "Skill IQ", "Target IQ"].map((t) => (
                    <div key={t} className={`px-3 py-1.5 rounded-md text-xs font-medium ${t === "JD IQ" ? "bg-blue-600 text-white" : "bg-white text-slate-500 border border-slate-200"}`}>{t}</div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                    <div className="h-3 w-32 bg-blue-100 rounded" />
                    <div className="h-2 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-4/5 bg-slate-100 rounded" />
                    <div className="h-2 w-3/4 bg-slate-100 rounded" />
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                    <div className="h-3 w-28 bg-emerald-100 rounded" />
                    <div className="h-2 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-5/6 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
