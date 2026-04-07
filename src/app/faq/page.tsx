import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { LandingNavbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "FAQ — HireMIQ",
  description:
    "Answers to common questions about HireMIQ's AI recruitment platform and staffing services.",
};

const FAQ_CATEGORIES = [
  {
    title: "Platform",
    questions: [
      {
        q: "What is HireMIQ?",
        a: "HireMIQ is two things in one: a recruitment services firm AND an AI platform. You can hire us to recruit for you, or use our platform to make your own team 10x faster. Most clients start with the platform and add our services when they need to scale.",
      },
      {
        q: "How does the JD analysis work?",
        a: "Paste or upload any job description (PDF, DOCX, or text). Our AI analyzes it through 8 intelligence modules in under 60 seconds: role clarity, skill mapping, Boolean search strings, candidate scoring criteria, outreach templates, and more. No formatting required — we handle messy JDs.",
      },
      {
        q: "How accurate is the candidate matching?",
        a: "Our Match IQ scores candidates across 7 weighted dimensions (technical skills, cultural fit, experience level, etc.). Users report 60–70% reduction in unqualified candidates reaching the interview stage. The score is explainable — you can see exactly why a candidate scored 78% vs 45%.",
      },
      {
        q: "Does it integrate with Naukri and LinkedIn?",
        a: "Yes. Our Boolean search strings are optimized specifically for Naukri, LinkedIn, Naukri Gulf, and Indeed India syntax. Copy-paste directly into search bars. ATS integration is on our 2025 roadmap.",
      },
      {
        q: "What is the Pipeline feature?",
        a: "A 7-stage Kanban board (Sourced → Screened → Assessment Sent → Interview → Offered → Joined → Rejected) to track all your candidates visually. Drag cards between stages, filter by source/priority, and view full candidate details with AI analysis in a side panel.",
      },
    ],
  },
  {
    title: "Pricing",
    questions: [
      {
        q: "Is the free plan really free?",
        a: "Yes, genuinely free. 10 JD analyses per month, access to all 8 AI modules, no credit card required. Create an account and start immediately.",
      },
      {
        q: "What does the ₹499/month Pro plan include?",
        a: "Unlimited JD analyses, all 8 AI modules, candidate match scoring, AI proctored assessments, outreach sequence builder, recruitment pipeline, team seats (up to 5), and priority support. Cancel anytime.",
      },
      {
        q: "Can I switch between Free and Pro?",
        a: "Yes, upgrade or downgrade at any time. If you downgrade, you keep Pro features until end of the billing cycle, then move to the free tier (10 analyses/month).",
      },
      {
        q: "Do you offer enterprise pricing?",
        a: "Yes. Contact us for custom pricing for teams of 10+, white-label options, API access, and dedicated account management. Email hello@hiremiq.com.",
      },
      {
        q: "Is there a refund policy?",
        a: "Yes. If you're not satisfied in the first 14 days of Pro, we'll refund you — no questions asked. Email hello@hiremiq.com.",
      },
    ],
  },
  {
    title: "Services",
    questions: [
      {
        q: "What's the difference between your platform and your staffing services?",
        a: "The platform is software — you use it to source and manage candidates yourself. Staffing services means our team recruits for you end-to-end. You can use one or both. Many clients use the platform for volume hiring and our services for senior/niche roles.",
      },
      {
        q: "How fast do you deliver shortlists?",
        a: "For end-to-end recruitment: shortlists in 5–7 business days. For RPO engagements: we match your SLAs. For contract staffing: 48–72 hours for most roles.",
      },
      {
        q: "What sectors do you specialize in?",
        a: "Technology (SWE, product, data), fintech, e-commerce, B2B SaaS, and healthcare tech. We have deep networks across Bengaluru, Hyderabad, Mumbai, Pune, and Chennai.",
      },
      {
        q: "What is RPO (Recruitment Process Outsourcing)?",
        a: "RPO means we embed our team into your company as your dedicated recruiting function. We handle everything — job posting, sourcing, screening, interviews, offers — under your brand. You get the results of a full talent team without the fixed headcount cost.",
      },
    ],
  },
  {
    title: "Security & Data",
    questions: [
      {
        q: "Is my candidate data secure?",
        a: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use Supabase infrastructure hosted on AWS in the ap-south-1 (Mumbai) region. We do not sell or share candidate data with third parties.",
      },
      {
        q: "Are you GDPR compliant?",
        a: "We follow data minimization principles and provide data deletion on request. Full GDPR compliance documentation available on request for enterprise customers.",
      },
      {
        q: "Who owns the data I upload?",
        a: "You do. 100%. We process it to generate your analysis, but we do not train our models on your data and we do not retain it beyond your account. You can delete your data at any time.",
      },
      {
        q: "Can candidates see their assessment results?",
        a: "Yes, candidates see their results immediately after submission. Recruiters see the same results plus an integrity report (tab switches, paste attempts, focus time) via the dashboard.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <style>{`
        details summary::-webkit-details-marker { display: none; }
        details summary { user-select: none; }
        details[open] summary { color: var(--color-brand-600, #4f3da8); }
        details[open] summary .chevron { transform: rotate(180deg); }
        .chevron { transition: transform 0.25s ease; }
      `}</style>

      <LandingNavbar />

      <main className="min-h-screen bg-white">
        {/* ── Hero ── */}
        <section className="pt-32 pb-16 bg-brand-50/40 relative overflow-hidden">
          {/* Decorative orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-600 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold tracking-wide uppercase">
              Help Center
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                Frequently Asked
              </span>{" "}
              <span className="text-slate-900">Questions</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Everything you need to know before getting started
            </p>
          </div>
        </section>

        {/* ── FAQ categories ── */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4">
            {FAQ_CATEGORIES.map((category) => (
              <div key={category.title} className="mb-12">
                <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-brand-500 inline-block" />
                  {category.title}
                </h2>

                <div className="space-y-3">
                  {category.questions.map((item) => (
                    <details
                      key={item.q}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-white group"
                    >
                      <summary className="flex justify-between items-center p-5 cursor-pointer font-semibold text-slate-900 list-none hover:bg-brand-50/50 transition-colors duration-150">
                        <span className="pr-4 text-[0.9375rem] leading-snug">
                          {item.q}
                        </span>
                        <ChevronDown className="chevron w-5 h-5 shrink-0 text-slate-400" />
                      </summary>
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="bg-slate-900 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Still have questions?
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Email us at{" "}
              <a
                href="mailto:hello@hiremiq.com"
                className="text-brand-400 hover:text-brand-300 font-medium underline underline-offset-2 transition-colors"
              >
                hello@hiremiq.com
              </a>{" "}
              or{" "}
              <a
                href="/contact"
                className="text-brand-400 hover:text-brand-300 font-medium underline underline-offset-2 transition-colors"
              >
                book a free 30-minute call
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
