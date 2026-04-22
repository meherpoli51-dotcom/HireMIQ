import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  X as XIcon,
  Zap,
  Shield,
  Users,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Pricing — HireMIQ | Free for 5 JDs, ₹499/month Pro",
  description:
    "Simple, transparent pricing. Free for 5 JD analyses per month. Pro plan at ₹499/month for unlimited analyses, 8 AI modules, and team features.",
};

// ─── Pricing plans ────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    badge: null,
    description: "Get started instantly. No credit card, no commitment.",
    features: [
      "5 JD analyses per month",
      "All 8 AI intelligence modules",
      "Boolean search string generation",
      "Candidate match scoring",
      "Basic pipeline (Kanban)",
      "Email support",
      "Community access",
    ],
    notIncluded: [],
    cta: "Start Free Today",
    ctaHref: "/login",
    highlighted: false,
    ctaNote: null,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    badge: "Best Value",
    description: "Unlimited power for recruiters and agencies who move fast.",
    features: [
      "Everything in Free",
      "Unlimited JD analyses",
      "Advanced candidate match intelligence",
      "AI-powered proctored assessments",
      "Outreach sequence builder",
      "Full recruitment pipeline",
      "Team seats (up to 5)",
      "Priority support & onboarding",
      "API access (coming soon)",
      "White-label reports (coming soon)",
    ],
    notIncluded: [],
    cta: "Start 14-Day Free Trial",
    ctaHref: "/login",
    highlighted: true,
    ctaNote: "No credit card required",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    badge: null,
    description:
      "For large agencies and TA teams needing dedicated support and scale.",
    features: [
      "Everything in Pro",
      "Unlimited team seats",
      "Dedicated account manager",
      "Custom integrations & API",
      "SLA guarantee",
      "Onboarding & training support",
      "White-label options",
      "Volume-based pricing",
    ],
    notIncluded: [],
    cta: "Talk to Sales",
    ctaHref: "mailto:sales@hiremiq.com",
    highlighted: false,
    ctaNote: null,
  },
];

// ─── Comparison table ─────────────────────────────────────────────────────────

type CellValue = string | boolean;

interface TableRow {
  feature: string;
  free: CellValue;
  pro: CellValue;
  linkedin: CellValue;
  agency: CellValue;
}

const TABLE_ROWS: TableRow[] = [
  {
    feature: "Price",
    free: "₹0",
    pro: "₹499/mo",
    linkedin: "~₹4,500/mo",
    agency: "10–15% of CTC",
  },
  {
    feature: "JD Analysis",
    free: "✓ (5/mo)",
    pro: "✓ Unlimited",
    linkedin: false,
    agency: false,
  },
  {
    feature: "Boolean Search AI",
    free: true,
    pro: true,
    linkedin: false,
    agency: false,
  },
  {
    feature: "Candidate Scoring",
    free: true,
    pro: true,
    linkedin: false,
    agency: false,
  },
  {
    feature: "AI Assessments",
    free: true,
    pro: true,
    linkedin: false,
    agency: false,
  },
  {
    feature: "Pipeline Management",
    free: true,
    pro: true,
    linkedin: "Limited",
    agency: false,
  },
  {
    feature: "India Platform Optimized",
    free: true,
    pro: true,
    linkedin: "Partial",
    agency: false,
  },
  {
    feature: "Team Collaboration",
    free: false,
    pro: "✓ (5 seats)",
    linkedin: true,
    agency: "N/A",
  },
];

// ─── ROI cards ────────────────────────────────────────────────────────────────

const ROI_CARDS = [
  {
    icon: Zap,
    title: "Time Saved",
    stat: "18x ROI",
    statNote: "on time alone",
    lines: [
      "Avg recruiter spends 8 hrs/week on JD analysis + Boolean search.",
      "HireMIQ cuts this to 40 minutes.",
      "Save 7+ hours/week = ~30 hours/month.",
      "At ₹300/hr fully-loaded cost = ₹9,000 saved.",
      "HireMIQ costs ₹499.",
    ],
    highlight: "₹9,000 saved vs ₹499 spent",
  },
  {
    icon: Users,
    title: "Better Placements",
    stat: "35% fewer",
    statNote: "unqualified candidates in interviews",
    lines: [
      "Teams using AI scoring report 35% fewer unqualified candidates in interviews.",
      "Fewer bad-fit interviews means faster decisions.",
      "Faster decisions mean higher client satisfaction.",
      "Higher satisfaction means more repeat business.",
    ],
    highlight: "More placements, fewer wasted calls",
  },
  {
    icon: Brain,
    title: "Scale Without Hiring",
    stat: "₹2.4L saved",
    statNote: "in delayed headcount",
    lines: [
      "With HireMIQ, 1 recruiter does the work of 2–3.",
      "Delay your next hiring cost (₹40,000+/month) by 6 months.",
      "That's ₹2.4 lakh saved in fixed headcount.",
    ],
    highlight: "Delay headcount by 6+ months",
  },
];

// ─── Mini FAQ ─────────────────────────────────────────────────────────────────

const MINI_FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, cancel Pro from your account settings. No penalty, no questions.",
  },
  {
    q: "Is the free plan limited time?",
    a: "No, Free is free forever. 5 analyses per month, always.",
  },
  {
    q: "Do you offer a refund?",
    a: "14-day money-back on Pro, no questions asked.",
  },
  {
    q: "Can I try Pro features before buying?",
    a: "Yes — 14-day free trial of Pro. No credit card required.",
  },
  {
    q: "What payment methods do you accept?",
    a: "UPI, credit/debit cards, net banking via Razorpay (coming soon).",
  },
];

// ─── Cell renderer ────────────────────────────────────────────────────────────

function TableCell({
  value,
  isHiremiqPro = false,
}: {
  value: CellValue;
  isHiremiqPro?: boolean;
}) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center">
        <Check
          className={`w-5 h-5 ${isHiremiqPro ? "text-brand-500" : "text-emerald-500"}`}
        />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center">
        <XIcon className="w-4 h-4 text-slate-300" />
      </span>
    );
  }
  return (
    <span
      className={`text-sm font-medium ${isHiremiqPro ? "text-brand-600" : "text-slate-600"}`}
    >
      {value}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <>
      <style>{`
        details summary::-webkit-details-marker { display: none; }
        details summary { user-select: none; }
        details[open] summary { color: var(--color-brand-600, #4f3da8); }
        details[open] summary .chevron-icon { transform: rotate(180deg); }
        .chevron-icon { transition: transform 0.25s ease; }
      `}</style>

      <LandingNavbar />

      <main className="min-h-screen bg-white">
        {/* ── 1. Hero ── */}
        <section className="pt-32 pb-16 bg-brand-50/40 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-600 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold tracking-wide uppercase">
              Transparent Pricing
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
              <span className="text-slate-900">Start free.</span>{" "}
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                Pay only when you scale.
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-6">
              ₹499/month gives you more than tools that cost ₹10,000+. No
              hidden fees, no lock-in, cancel anytime.
            </p>
            <p className="text-sm font-semibold text-slate-600">
              <span className="text-amber-400">★★★★★</span>&nbsp; Trusted by
              50+ recruitment teams across India
            </p>
          </div>
        </section>

        {/* ── 2. Pricing cards ── */}
        <section className="py-16 lg:py-20 bg-slate-50 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-8 transition-all duration-300 flex flex-col ${
                    plan.highlighted
                      ? "border-brand-300 bg-white shadow-2xl shadow-brand-200/40 scale-[1.03] ring-1 ring-brand-200"
                      : "border-slate-200 bg-white hover:shadow-lg hover:border-brand-100"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-brand-500/30">
                        <Zap className="w-3 h-3" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-7">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-5 min-h-[40px]">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-4xl font-extrabold tracking-tight ${plan.highlighted ? "text-brand-500" : "text-slate-900"}`}
                      >
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-slate-400 font-medium">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlighted ? "bg-brand-100" : "bg-slate-100"}`}
                        >
                          <Check
                            className={`w-3 h-3 ${plan.highlighted ? "text-brand-500" : "text-slate-500"}`}
                          />
                        </div>
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div>
                    {plan.ctaHref.startsWith("/") ? (
                      <Link
                        href={plan.ctaHref}
                        className={`flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          plan.highlighted
                            ? "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <a
                        href={plan.ctaHref}
                        className={`flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          plan.highlighted
                            ? "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                    {plan.ctaNote && (
                      <p className="text-center text-xs text-slate-400 mt-2.5">
                        {plan.ctaNote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-slate-400 mt-10">
              No credit card required for free plan &middot; Cancel Pro anytime
              &middot; All prices in INR
            </p>
          </div>
        </section>

        {/* ── 3. Comparison table ── */}
        <section className="py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                How HireMIQ compares
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                See how our platform stacks up against the alternatives on the
                features that matter most.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-500 bg-slate-50 w-44">
                      Feature
                    </th>
                    <th className="p-4 font-semibold text-slate-700 bg-slate-50 text-center">
                      HireMIQ Free
                    </th>
                    <th className="p-4 font-bold text-brand-600 bg-brand-50 text-center border-x border-brand-100">
                      HireMIQ Pro
                    </th>
                    <th className="p-4 font-semibold text-slate-700 bg-slate-50 text-center">
                      LinkedIn Recruiter Lite
                    </th>
                    <th className="p-4 font-semibold text-slate-700 bg-slate-50 text-center">
                      Traditional Agency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                    >
                      <td className="p-4 font-medium text-slate-700">
                        {row.feature}
                      </td>
                      <td className="p-4 text-center">
                        <TableCell value={row.free} />
                      </td>
                      <td className="p-4 text-center bg-brand-50/60 border-x border-brand-100/60">
                        <TableCell value={row.pro} isHiremiqPro />
                      </td>
                      <td className="p-4 text-center">
                        <TableCell value={row.linkedin} />
                      </td>
                      <td className="p-4 text-center">
                        <TableCell value={row.agency} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── 4. ROI section ── */}
        <section className="py-16 lg:py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                What&apos;s your ROI at ₹499/month?
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                The math is embarrassingly clear. Here&apos;s what recruiters
                actually get back.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {ROI_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-white rounded-2xl border border-slate-200 p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-brand-500" />
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      {card.title}
                    </h3>
                    <div className="mb-4">
                      <span className="text-2xl font-extrabold text-brand-500">
                        {card.stat}
                      </span>{" "}
                      <span className="text-xs text-slate-500">
                        {card.statNote}
                      </span>
                    </div>

                    <ul className="space-y-2 mb-5">
                      {card.lines.map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-2 text-sm text-slate-500"
                        >
                          <span className="w-1 h-1 rounded-full bg-slate-300 mt-2 shrink-0" />
                          {line}
                        </li>
                      ))}
                    </ul>

                    <div className="rounded-lg bg-brand-50 border border-brand-100 px-3 py-2 text-xs font-semibold text-brand-700">
                      {card.highlight}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. Mini FAQ ── */}
        <section className="py-16 lg:py-20">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">
              Quick answers
            </h2>
            <div className="space-y-3">
              {MINI_FAQ.map((item) => (
                <details
                  key={item.q}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                >
                  <summary className="flex justify-between items-center p-5 cursor-pointer font-semibold text-slate-900 list-none hover:bg-brand-50/50 transition-colors duration-150">
                    <span className="pr-4 text-[0.9375rem]">{item.q}</span>
                    <Shield className="chevron-icon w-4 h-4 shrink-0 text-slate-300 hidden" />
                    <svg
                      className="chevron-icon w-5 h-5 shrink-0 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Final CTA ── */}
        <section className="bg-slate-900 py-20 relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]" />
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #5B4FBF 25%, #a78bfa 50%, #5B4FBF 75%, transparent 100%)",
            }}
          />

          <div className="relative max-w-2xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold tracking-wide uppercase">
              Get Started
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to transform your hiring?
            </h2>
            <p className="text-slate-400 mb-10 max-w-md mx-auto">
              Join 50+ recruitment teams already using HireMIQ to hire faster,
              smarter, and at a fraction of the cost.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all duration-200 hover:-translate-y-px"
              >
                Start Free Today
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:sales@hiremiq.com"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold text-sm transition-all duration-200"
              >
                Talk to Sales
              </a>
            </div>

            <p className="text-slate-600 text-xs mt-6">
              No credit card required &middot; Free plan forever &middot; Setup
              in under 2 minutes
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
