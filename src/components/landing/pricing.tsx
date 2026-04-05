"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For individual recruiters exploring AI-powered sourcing.",
    features: [
      "5 JD analyses per month",
      "All 6 intelligence modules",
      "Basic Boolean strings",
      "Email outreach templates",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For active recruiters and small agencies who need speed.",
    features: [
      "Unlimited JD analyses",
      "All 6 intelligence modules",
      "Advanced Boolean strings",
      "Multi-channel outreach (Email, LinkedIn, WhatsApp)",
      "Analysis history & saved workspaces",
      "Priority support",
      "Custom outreach tone settings",
    ],
    cta: "Start 14-Day Trial",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$149",
    period: "/month",
    description: "For staffing agencies and TA teams scaling their pipeline.",
    features: [
      "Everything in Pro",
      "Team seats (up to 10)",
      "Shared workspace & templates",
      "API access",
      "CRM integration (coming soon)",
      "Custom branding",
      "Dedicated account manager",
      "SLA & onboarding support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Simple pricing for every team size
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start free, upgrade when you need more power. No hidden fees,
            cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-8 transition-all ${
                plan.highlighted
                  ? "border-blue-200 bg-blue-50/30 shadow-lg shadow-blue-100/50 scale-[1.02]"
                  : "border-slate-200 bg-white hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-slate-500">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/dashboard">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
