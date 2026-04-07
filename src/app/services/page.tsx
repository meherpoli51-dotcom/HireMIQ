import { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import {
  ArrowRight,
  Check,
  Calendar,
  Users,
  MessageSquare,
  Briefcase,
  UserCheck,
  Building,
  Cpu,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — HireMIQ | End-to-End Recruitment & AI Staffing",
  description:
    "End-to-end recruitment, staffing, RPO, and AI platform access. We find the talent so you can focus on the business. No lock-ins, no bloated retainers.",
};

/* ------------------------------------------------------------------ */
/*  Service data                                                        */
/* ------------------------------------------------------------------ */

interface Service {
  number: string;
  icon: React.ElementType;
  title: string;
  bestFor: string;
  description: string;
  included: string[];
  cta: string;
  ctaHref: string;
}

const services: Service[] = [
  {
    number: "01",
    icon: Briefcase,
    title: "End-to-End Recruitment",
    bestFor: "Startups, scale-ups, and companies hiring 2–5 roles/month without an in-house talent team",
    description:
      "We own the entire hiring lifecycle from intake to offer acceptance. You share the role, we deliver vetted, interview-ready candidates — fast. No hand-holding required.",
    included: [
      "JD analysis and role scoping",
      "Multi-channel sourcing (Naukri, LinkedIn, referrals, databases)",
      "AI-enhanced Boolean search and candidate mapping",
      "Screening calls and skills-based shortlisting",
      "Interview coordination and feedback loops",
      "Offer negotiation support and onboarding handoff",
    ],
    cta: "Book a free consultation",
    ctaHref: "/contact",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Staffing & Contract Hiring",
    bestFor: "Companies needing fast, flexible talent for project-based or temporary roles",
    description:
      "Need contractors, temp staff, or project-based hires — yesterday? We specialize in speed-to-fill without compromising on quality. Our bench and sourcing engine get you matched in 48–72 hours.",
    included: [
      "Contract, temp-to-perm, and project-based staffing",
      "Pre-vetted candidate bench across domains",
      "Rapid turnaround sourcing (48–72 hour shortlists)",
      "Compliance, documentation, and onboarding support",
      "Flexible engagement models (hourly, monthly, milestone)",
    ],
    cta: "Get staffing support",
    ctaHref: "/contact",
  },
  {
    number: "03",
    icon: Building,
    title: "Recruitment Process Outsourcing",
    bestFor: "Growing companies with ongoing hiring needs who want to scale without building an internal team",
    description:
      "Think of us as your embedded recruitment team — without the overhead. We plug into your existing workflow, operate inside your ATS, and deliver like an in-house function.",
    included: [
      "Dedicated recruiter(s) aligned to your company",
      "Full-cycle hiring managed end-to-end",
      "ATS integration and process management",
      "Hiring analytics, pipeline reporting, and SLA tracking",
      "Employer branding and candidate experience support",
      "Scalable model — ramp up or down as hiring needs change",
    ],
    cta: "Discuss RPO",
    ctaHref: "/contact",
  },
  {
    number: "04",
    icon: Cpu,
    title: "AI Platform Access",
    bestFor: "Agencies and in-house teams who want AI-powered tools to supercharge their own sourcing",
    description:
      "Access our full suite of AI recruitment intelligence modules — JD IQ, Skill IQ, Boolean IQ, Outreach IQ, and more. Turn any messy job description into recruiter-ready workflows in minutes. Free for 10 JDs/month, unlimited at just ₹499/month.",
    included: [
      "8 AI-powered intelligence modules",
      "JD decoding and role clarity analysis",
      "Automated Boolean search for Naukri & LinkedIn",
      "Candidate scoring and match intelligence",
      "AI-generated proctored assessments",
      "Outreach sequence builder with personalization",
      "Free: 10 JDs/month — Pro: ₹499/month unlimited",
    ],
    cta: "Try the platform free",
    ctaHref: "/login",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5f3ff]/60 via-white to-white" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#f5f3ff]/80 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#5B4FBF]/10 text-[#5B4FBF] rounded-full px-4 py-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FBF]" />
              <span className="text-xs font-semibold tracking-wide uppercase">Our Services</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              We find the talent.
              <br />
              <span className="bg-gradient-to-r from-[#5B4FBF] to-[#7c6fe0] bg-clip-text text-transparent">
                You focus on the business.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
              From full-cycle recruitment to AI-powered sourcing tools —
              choose the model that fits your hiring needs. No lock-ins, no
              bloated retainers.
            </p>

            <a
              href="mailto:hello@hiremiq.com"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#5B4FBF] hover:bg-[#4f3da8] text-white font-semibold rounded-xl transition-colors text-base gap-2 shadow-lg shadow-[#5B4FBF]/20"
            >
              <Calendar className="w-4 h-4" />
              Book a free consultation
            </a>
          </div>
        </div>
      </section>

      {/* ── SERVICE CARDS ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isReversed = index % 2 === 1;
              return (
                <div
                  key={service.number}
                  className={`grid lg:grid-cols-2 bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-[#5B4FBF]/30 hover:shadow-xl hover:shadow-[#5B4FBF]/5 transition-all duration-300`}
                >
                  {/* Info side */}
                  <div className={`p-8 sm:p-10 flex flex-col justify-center ${isReversed ? "lg:order-2" : ""}`}>
                    {/* Number + Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl font-extrabold text-[#5B4FBF]/10 leading-none select-none">
                        {service.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#5B4FBF]/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#5B4FBF]" />
                      </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                      {service.title}
                    </h2>

                    {/* Best For badge */}
                    <div className="inline-flex items-start gap-2 bg-[#f5f3ff] rounded-lg px-4 py-2.5 mb-5 max-w-fit">
                      <Users className="w-4 h-4 text-[#5B4FBF] mt-0.5 shrink-0" />
                      <span className="text-sm text-[#5B4FBF] font-medium leading-snug">
                        Best for: {service.bestFor}
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {service.ctaHref.startsWith("/") ? (
                      <Link
                        href={service.ctaHref}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#5B4FBF] hover:gap-3 transition-all w-fit"
                      >
                        {service.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <a
                        href={service.ctaHref}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#5B4FBF] hover:gap-3 transition-all w-fit"
                      >
                        {service.cta}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Checklist side */}
                  <div
                    className={`bg-slate-50 p-8 sm:p-10 flex flex-col justify-center border-t lg:border-t-0 border-slate-200 ${
                      isReversed ? "lg:order-1 lg:border-r" : "lg:border-l"
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
                      What&apos;s included
                    </p>
                    <ul className="space-y-3.5">
                      {service.included.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#5B4FBF]/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-[#5B4FBF]" />
                          </div>
                          <span className="text-sm text-slate-600 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 lg:py-28 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#5B4FBF]/20 flex items-center justify-center mx-auto mb-8">
            <MessageSquare className="w-6 h-6 text-[#5B4FBF]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Not sure which model fits?
          </h2>

          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Book a free 30-minute consultation. We&apos;ll assess your hiring
            needs and recommend the right engagement model — no
            pressure, no hard sell.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hello@hiremiq.com"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#5B4FBF] hover:bg-[#4f3da8] text-white font-semibold rounded-xl transition-colors text-base gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book a consultation
            </a>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors text-base gap-2"
            >
              Learn about us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
