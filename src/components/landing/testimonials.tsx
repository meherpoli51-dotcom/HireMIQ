"use client";

import { Star } from "lucide-react";
import { useReveal } from "./use-reveal";

// placeholder - replace with real testimonials
const TESTIMONIALS = [
  {
    name: "Ritu Sharma",
    role: "Head of Talent",
    company: "FinTech Startup, Bengaluru",
    quote:
      "We reduced our JD analysis time from 3 hours to under 5 minutes. HireMIQ's Boolean strings alone saved us 15+ calls per week that were going to wrong candidates.",
  },
  {
    name: "Vikash Agarwal",
    role: "Director",
    company: "IT Staffing Agency, Hyderabad",
    quote:
      "Our placement rate went up 35% in the first month. The candidate scoring tells you instantly which resumes are worth a call. We stopped wasting time on unqualified profiles.",
  },
  {
    name: "Preethi Menon",
    role: "Founder",
    company: "Executive Search Firm, Chennai",
    quote:
      "The assessment feature is a game-changer. Candidates take a proctored test before I even schedule a call. Client satisfaction improved dramatically — no more wasted interview slots.",
  },
  {
    name: "Sanjay Patel",
    role: "TA Manager",
    company: "Series B SaaS, Pune",
    quote:
      "I have a 2-person team handling 20+ open roles. HireMIQ gave us the output of a 5-person team. The outreach templates are genuinely good — not generic AI fluff.",
  },
  {
    name: "Deepika Nair",
    role: "Senior Recruiter",
    company: "MNC Staffing, Mumbai",
    quote:
      "Boolean search used to take me an hour per role. Now it takes 30 seconds and works better. I've tried 4 other tools — nothing comes close for Indian job platforms.",
  },
  {
    name: "Arjun Reddy",
    role: "Co-founder",
    company: "HRTech Consultancy, Bengaluru",
    quote:
      "The pipeline board alone is worth ₹499/month. We track 80+ candidates across 12 clients without Excel sheets. It's the first tool that actually fits how Indian recruiters work.",
  },
];

/** Deterministic hue from a name string for avatar gradient */
function nameToHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  const ref = useReveal();

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle background dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-20 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_30%,transparent_100%)]" />

      <div
        ref={ref}
        className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Top badge */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 rounded-full px-4 py-2 mb-6">
            <Star className="w-3.5 h-3.5 fill-brand-500" />
            <span className="text-xs font-semibold tracking-wide uppercase">
              What Recruiters Say
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Trusted by recruiters across India
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl">
            From startups to staffing agencies — here&apos;s what teams say
            after using HireMIQ
          </p>
        </div>

        {/* Trust rating line */}
        <p className="text-center text-sm font-semibold text-slate-700 mb-10">
          <span className="text-amber-400">★★★★★</span>{" "}
          Rated 4.9/5 by 50+ recruitment professionals
        </p>

        {/* Cards grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => {
            const hue = nameToHue(t.name);
            const avatarStyle = {
              background: `linear-gradient(135deg, hsl(${hue}, 60%, 55%), hsl(${(hue + 40) % 360}, 65%, 45%))`,
            };

            return (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Star rating */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-base leading-none">
                      ★
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author row */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm"
                    style={avatarStyle}
                  >
                    {getInitials(t.name)}
                  </div>

                  {/* Name & role */}
                  <div>
                    <p className="font-semibold text-slate-900 text-sm leading-tight">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t.role} &middot; {t.company}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
