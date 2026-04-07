"use client";

import { Check, Sparkles, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useReveal } from "./use-reveal";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "",
    badge: null,
    description:
      "Get started with 10 free JD analyses. No credit card required.",
    features: [
      "10 JD analyses per month",
      "All 8 AI intelligence modules",
      "Boolean search string generation",
      "Candidate match scoring",
      "Email outreach templates",
      "Assessment generation",
    ],
    cta: "Start Free",
    ctaHref: "/login",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    badge: "Best Value",
    description:
      "Unlimited power for recruiters and agencies who move fast.",
    features: [
      "Unlimited JD analyses",
      "All 8 AI intelligence modules",
      "Advanced candidate match intelligence",
      "AI-powered proctored assessments",
      "Multi-channel outreach (Email, LinkedIn, WhatsApp)",
      "Analysis history & saved workspaces",
      "Team collaboration (up to 5 seats)",
      "Priority support & onboarding",
    ],
    cta: "Upgrade to Pro",
    ctaHref: "/login",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    badge: null,
    description:
      "For large agencies and TA teams needing dedicated support and integrations.",
    features: [
      "Everything in Pro",
      "Unlimited team seats",
      "API access & custom integrations",
      "Dedicated account manager",
      "Custom branding & white-label",
      "SLA & onboarding support",
      "CRM integration",
      "Volume-based pricing",
    ],
    cta: "Contact Sales",
    ctaHref: "mailto:hello@hiremiq.com",
    highlighted: false,
  },
];

export function Pricing() {
  const ref = useReveal();

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-pattern opacity-30 [mask-image:radial-gradient(ellipse_60%_40%_at_50%_50%,#000_30%,transparent_100%)]" />

      <div ref={ref} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 rounded-full px-4 py-2 mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold tracking-wide uppercase">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Start free. Scale when ready.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            10 free JD analyses every month. Upgrade to Pro for unlimited power
            at just ₹499/month — less than your daily coffee.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "border-brand-300 bg-white shadow-2xl shadow-brand-200/30 scale-[1.03] ring-1 ring-brand-200"
                  : "border-slate-200 bg-white hover:shadow-lg hover:border-brand-100"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-brand-500/30">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500 mb-5 min-h-[40px]">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold tracking-tight ${plan.highlighted ? "text-brand-500" : "text-slate-900"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-slate-400 font-medium">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3.5 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlighted ? "bg-brand-100" : "bg-slate-100"}`}>
                      <Check className={`w-3 h-3 ${plan.highlighted ? "text-brand-500" : "text-slate-500"}`} />
                    </div>
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

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
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Trust line */}
        <p className="text-center text-sm text-slate-400 mt-10">
          No credit card required for free plan &middot; Cancel Pro anytime &middot; All prices in INR
        </p>
      </div>
    </section>
  );
}
