import { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import {
  Brain,
  Zap,
  BarChart3,
  Users,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform — HireMIQ",
  description:
    "8 AI-powered recruitment intelligence modules. Analyze JDs, score candidates, generate assessments, and automate sourcing workflows in seconds.",
};

/* ── IQ Module cards ── */
const modules = [
  {
    num: "01",
    title: "JD IQ",
    description: "Decode messy job descriptions into structured role clarity",
    features: ["Role summary & requirements analysis", "Key responsibilities mapping", "Skill & experience extraction"],
    icon: Brain,
  },
  {
    num: "02",
    title: "Skill IQ",
    description: "Automatically map and weight critical skills for the role",
    features: ["Skill prioritization", "Experience level mapping", "Must-have vs. nice-to-have split"],
    icon: Sparkles,
  },
  {
    num: "03",
    title: "Boolean IQ",
    description: "Generate recruiter-ready Boolean search strings in seconds",
    features: ["Multi-platform Boolean syntax", "Naukri & LinkedIn optimized", "Copy-paste ready searches"],
    icon: Zap,
  },
  {
    num: "04",
    title: "Candidate Match IQ",
    description: "Score candidates across 7 weighted skill and culture dimensions",
    features: ["Resume parsing & analysis", "Match breakdown by dimension", "Explainable scoring"],
    icon: BarChart3,
  },
  {
    num: "05",
    title: "Assessment IQ",
    description: "Generate AI screening assessments customized to the role",
    features: ["Skill-based questions", "Anti-cheating proctoring", "Automated scoring"],
    icon: CheckCircle,
  },
  {
    num: "06",
    title: "Outreach IQ",
    description: "Create personalized candidate outreach sequences and templates",
    features: ["Multi-channel sequences", "Personalization templates", "Follow-up automation"],
    icon: MessageSquare,
  },
  {
    num: "07",
    title: "Pipeline IQ",
    description: "Track candidates across all hiring stages with drag-and-drop ease",
    features: ["7-stage Kanban board", "Real-time filters", "Bulk stage updates"],
    icon: Users,
  },
  {
    num: "08",
    title: "Analytics IQ",
    description: "Measure hiring velocity, conversion rates, and team performance",
    features: ["Time-to-hire metrics", "Stage conversion rates", "Team benchmarks"],
    icon: BarChart3,
  },
];

const benefits = [
  {
    title: "Save 10+ hours per week",
    description: "Automate JD analysis, Boolean creation, and candidate scoring",
  },
  {
    title: "Higher placement rates",
    description: "AI-powered matching reduces bad hires and interview no-shows",
  },
  {
    title: "Zero training curve",
    description: "Intuitive UI — start using it immediately, no onboarding needed",
  },
  {
    title: "Transparent pricing",
    description: "Free for 5 JDs/month. Pro at ₹499/month. No hidden fees.",
  },
];

export default function PlatformPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 via-white to-white" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-brand-100/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                8 AI Modules
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-8">
              Recruitment intelligence
              <br />
              <span className="bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 bg-clip-text text-transparent">
                at superhuman speed.
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              From analyzing a messy JD to scoring candidates to generating screening assessments — do in 60 seconds what used to take 10 hours. No training required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-13 px-8 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/20 transition-all duration-200 text-base gap-2"
              >
                Try Platform Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-13 px-8 border-2 border-brand-200 text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-all duration-200 text-base gap-2"
              >
                Book Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modules Grid ── */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              8 Intelligence Modules
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Every step of recruitment, covered by AI. From JD analysis to pipeline management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.num}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-brand-300 transition-all duration-300"
                >
                  {/* Number */}
                  <span className="text-4xl font-extrabold text-slate-100 group-hover:text-brand-50 leading-none mb-3 block">
                    {mod.num}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-6 h-6 text-brand-500" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {mod.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {mod.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {mod.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-300 mt-1.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Why HireMIQ Platform
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Built by recruiters, for recruiters. Every feature solves a real pain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 p-6 rounded-2xl border border-slate-200 hover:border-brand-200 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {b.title}
                  </h3>
                  <p className="text-sm text-slate-500">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing (micro) ── */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Transparent Pricing
            </h2>
            <p className="text-lg text-slate-500">
              Start free. Scale affordably.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
              <p className="text-slate-500 mb-6">For exploring HireMIQ</p>
              <p className="text-4xl font-extrabold text-slate-900 mb-6">
                ₹0
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-brand-500" />
                  5 JD analyses/month
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-brand-500" />
                  All 8 modules
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-brand-500" />
                  Email support
                </li>
              </ul>
              <Link href="/login" className="block w-full text-center py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl border-2 border-brand-400 p-8 text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-brand-100 mb-6">For active teams</p>
              <p className="text-4xl font-extrabold mb-6">
                ₹499<span className="text-lg text-brand-100">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Unlimited JD analyses
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  All 8 modules
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Team seats (up to 5)
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Priority support
                </li>
              </ul>
              <Link href="/login" className="block w-full text-center py-3 rounded-lg bg-white text-brand-600 font-semibold hover:bg-brand-50 transition-colors">
                Start 14-Day Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to transform your hiring?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Get started free today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-13 px-8 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors text-base shadow-lg shadow-brand-500/20"
            >
              Try Platform Free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-13 px-8 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors text-base"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
