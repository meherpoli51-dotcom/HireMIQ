"use client";

import { Upload, Sparkles, BarChart3, Send } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Paste or upload JD",
    description:
      "Drop in any job description — raw text, PDF, or structured fields. HireMIQ handles messy, incomplete, or verbose JDs.",
  },
  {
    icon: Sparkles,
    title: "AI analyzes instantly",
    description:
      "Six intelligence reports generated in seconds — role summary, skill mapping, company insights, Boolean strings, and outreach templates.",
  },
  {
    icon: BarChart3,
    title: "Score candidates",
    description:
      "Upload resumes to score candidates across 7 weighted dimensions. Get instant submission readiness verdicts with explainable breakdowns.",
  },
  {
    icon: Send,
    title: "Assess and submit",
    description:
      "Generate AI screening assessments, validate candidates before client submission, and source with confidence.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-3">
            Workflow
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            From JD to submission in four steps
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            No training needed. Paste a JD, get recruiter-ready outputs
            instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-100 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-300 tracking-widest">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
