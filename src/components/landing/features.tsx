"use client";

import {
  FileSearch,
  Building2,
  Cpu,
  Target,
  Search,
  MessageSquare,
  Users,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

const modules = [
  {
    icon: FileSearch,
    title: "JD IQ",
    description:
      "Decode any job description into role clarity, seniority mapping, responsibilities, and missing info flags.",
  },
  {
    icon: Building2,
    title: "Client IQ",
    description:
      "Understand hiring company culture, interview expectations, candidate selling points, and objection risks.",
  },
  {
    icon: Cpu,
    title: "Skill IQ",
    description:
      "Complete skill breakdown — mandatory, secondary, nice-to-have — with search keywords and alternative titles.",
  },
  {
    icon: Target,
    title: "Target IQ",
    description:
      "Know exactly which companies to target, adjacent fits to explore, and which to avoid.",
  },
  {
    icon: Search,
    title: "Source IQ",
    description:
      "Ready-to-use Boolean strings for LinkedIn, Naukri, and Google X-Ray in strict, balanced, and broad variants.",
  },
  {
    icon: MessageSquare,
    title: "Reach IQ",
    description:
      "AI-crafted outreach templates for email, LinkedIn, and WhatsApp — personalized and ready to send.",
  },
  {
    icon: Users,
    title: "Match IQ",
    description:
      "Upload resumes, score candidates across 7 weighted dimensions with client-type-aware intelligence.",
  },
  {
    icon: ClipboardCheck,
    title: "Assess IQ",
    description:
      "Generate role-specific screening assessments with AI evaluation. Validate candidates before submission.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Eight intelligence modules.
            <br />
            One unified workflow.
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Every JD you analyze generates specialized intelligence designed to
            collapse your sourcing timeline from days to minutes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className="bg-white p-6 hover:bg-slate-50/80 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {mod.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Platform section */}
        <div id="platform" className="mt-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
              End-to-End Platform
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">
              From JD to submission-ready candidate in one flow
            </h2>
            <div className="space-y-5">
              {[
                {
                  title: "Requirement Intelligence",
                  desc: "Paste a JD, get 6 intelligence modules instantly. Understand the role before you source.",
                },
                {
                  title: "Candidate Match Intelligence",
                  desc: "Upload resumes, score candidates across 7 dimensions. Know who to submit, screen, or reject.",
                },
                {
                  title: "AI Assessment Engine",
                  desc: "Generate screening assessments, share links with candidates, get AI-evaluated results.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 mt-8 hover:text-blue-700 transition-colors"
            >
              Start using HireMIQ
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "60s", label: "Avg analysis time", sub: "per JD" },
              { value: "8", label: "AI modules", sub: "per analysis" },
              { value: "7D", label: "Scoring dimensions", sub: "per candidate" },
              { value: "35min", label: "Assessment length", sub: "AI-evaluated" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-6"
              >
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-600">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
