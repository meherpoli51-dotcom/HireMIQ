"use client";

import {
  FileSearch,
  Building2,
  Cpu,
  Target,
  Search,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "JD IQ",
    description:
      "Instantly decode any job description into a structured, recruiter-friendly summary with role clarity, seniority mapping, and missing info flags.",
    color: "blue",
  },
  {
    icon: Building2,
    title: "Client IQ",
    description:
      "Understand the hiring company — culture fit, interview style, candidate selling points, and objection risks before you even pick up the phone.",
    color: "violet",
  },
  {
    icon: Cpu,
    title: "Skill IQ",
    description:
      "Get a complete skill breakdown — mandatory, secondary, nice-to-have — with alternative titles and search keywords for precision sourcing.",
    color: "emerald",
  },
  {
    icon: Target,
    title: "Target IQ",
    description:
      "Know exactly which companies to target, which ones are adjacent fits, and which to avoid. Build a talent pool strategy in seconds.",
    color: "amber",
  },
  {
    icon: Search,
    title: "Source IQ",
    description:
      "Get ready-to-use Boolean search strings for LinkedIn, Naukri, and Google X-Ray. Strict, balanced, and broad variants — copy and go.",
    color: "rose",
  },
  {
    icon: MessageSquare,
    title: "Reach IQ",
    description:
      "AI-crafted outreach templates for email, LinkedIn, and WhatsApp. Personalized, professional, and ready to send to candidates.",
    color: "cyan",
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600", border: "border-violet-100" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100" },
  rose: { bg: "bg-rose-50", icon: "text-rose-600", border: "border-rose-100" },
  cyan: { bg: "bg-cyan-50", icon: "text-cyan-600", border: "border-cyan-100" },
};

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Intelligence Modules
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Six layers of recruitment intelligence
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Every JD you analyze generates six specialized intelligence reports
            designed to accelerate your sourcing workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const colors = colorMap[feature.color];
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative rounded-xl border ${colors.border} bg-white p-6 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
