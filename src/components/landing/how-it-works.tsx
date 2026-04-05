"use client";

import { Upload, Sparkles, BarChart3, Send } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Paste or Upload JD",
    description:
      "Drop in any job description — paste raw text, upload a PDF, or fill in structured fields. HireMIQ handles messy, incomplete, or verbose JDs.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "AI Analyzes Instantly",
    description:
      "Our AI engine decodes the JD into six intelligence reports — role summary, skill mapping, company insights, target companies, Boolean strings, and outreach drafts.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Review & Refine",
    description:
      "Review each intelligence module in a clean, tabbed workspace. Edit search strings, tweak outreach messages, and refine targeting to your needs.",
  },
  {
    step: "04",
    icon: Send,
    title: "Source & Reach Out",
    description:
      "Copy Boolean strings directly into LinkedIn or Naukri. Send personalized outreach via email, LinkedIn, or WhatsApp. Start sourcing in minutes, not hours.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Workflow
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            From JD to candidates in four steps
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A streamlined workflow designed for speed. No training needed —
            paste a JD and get recruiter-ready outputs instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm mb-5">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-xs font-bold text-blue-600 mb-2 tracking-wider">
                  STEP {step.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
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
