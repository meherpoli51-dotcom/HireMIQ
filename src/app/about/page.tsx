import { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import {
  ArrowRight,
  Clock,
  Users,
  Brain,
  Blocks,
  Quote,
  Cpu,
  Mail,
  Handshake,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — HireMIQ | Built by Recruitment Veterans",
  description:
    "15 years of hiring instinct meets a new generation of AI intelligence. Learn how HireMIQ combines veteran recruitment expertise with AI-powered tools built for India.",
};

export default function AboutPage() {
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
              <span className="text-xs font-semibold tracking-wide uppercase">Our Story</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              15 years of hiring instinct.
              <br />
              <span className="bg-gradient-to-r from-[#5B4FBF] to-[#7c6fe0] bg-clip-text text-transparent">
                A new generation of intelligence.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              We&apos;re not another HR-tech startup guessing what recruiters
              need. We lived it. Now we&apos;re solving it.
            </p>
          </div>
        </div>
      </section>

      {/* ── OPENING ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              HireMIQ was born in frustration — and built with purpose.
            </p>
            <p className="text-lg text-slate-500 leading-relaxed">
              Our founders spent over 15 years inside the staffing trenches —
              running delivery desks, managing high-volume mandates,
              building sourcing teams from scratch, and dealing with every
              breakdown the recruitment process could throw at them. Bad JDs.
              Ghost clients. Unscreenable volumes. Candidate no-shows. ATS
              black holes.
            </p>
            <p className="text-lg text-slate-500 leading-relaxed">
              They didn&apos;t just observe these problems — they
              carried them. Every missed SLA, every rework cycle, every
              late-night Boolean search string that still didn&apos;t surface
              the right talent. That experience became the foundation for
              everything HireMIQ is today.
            </p>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="py-16 lg:py-24 bg-[#f5f3ff]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                We didn&apos;t build this from
                <br className="hidden sm:block" /> the outside looking in.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Most recruitment tools are built by engineers who&apos;ve
                never filled a role. They optimize for dashboards and data
                models — not for the messy, human, high-pressure reality
                of staffing. The result? Tools that look great in demos but
                collect dust in practice.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed">
                Recruiters need clarity from chaos. They need speed without
                sacrificing quality. They need tools that think the way they
                think — not tools that force them into someone
                else&apos;s workflow.
              </p>
            </div>

            {/* Founder Quote */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm">
              <div className="absolute -top-4 -left-2">
                <div className="w-10 h-10 rounded-xl bg-[#5B4FBF] flex items-center justify-center shadow-lg shadow-[#5B4FBF]/30">
                  <Quote className="w-5 h-5 text-white" />
                </div>
              </div>
              <blockquote className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium italic mt-4">
                &ldquo;We didn&apos;t build HireMIQ because we saw a market
                opportunity. We built it because we were exhausted by the gap
                between how good recruitment could be — and how it
                actually was.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5B4FBF]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#5B4FBF]">F</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Founders, HireMIQ
                  </p>
                  <p className="text-xs text-slate-400">
                    15+ years in staffing &amp; recruitment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE BUILT ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Two engines. One mission.
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              HireMIQ is not just a tool and not just a service. It&apos;s
              both — working together seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Engine 1 */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 hover:border-[#5B4FBF]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#5B4FBF]/10 flex items-center justify-center mb-6">
                <Handshake className="w-6 h-6 text-[#5B4FBF]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                The Services Practice
              </h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                End-to-end recruitment, staffing, and RPO delivered by
                experienced professionals who understand mandates, SLAs, and
                the pressure of delivery desks. Real recruiters solving real
                hiring problems.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5B4FBF] hover:gap-3 transition-all"
              >
                Explore services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Engine 2 */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 hover:border-[#5B4FBF]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#5B4FBF]/10 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-[#5B4FBF]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                The AI Platform
              </h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Eight intelligence modules that turn messy JDs into
                recruiter-ready sourcing and outreach workflows. JD IQ, Skill
                IQ, Boolean IQ, Outreach IQ, and more — built by
                recruiters, for recruiters.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5B4FBF] hover:gap-3 transition-all"
              >
                Try the platform
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE TEAM ── */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Team visual */}
            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#5B4FBF]/5 to-[#5B4FBF]/15 border border-[#5B4FBF]/10 overflow-hidden flex items-center justify-center">
              <div className="text-center px-8">
                <div className="flex items-center justify-center gap-1 mb-6">
                  {["V", "G", "A", "P", "R", "S"].map((initial, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5B4FBF] to-[#7c6fe0] border-2 border-white -ml-2 first:ml-0 flex items-center justify-center shadow-sm"
                      style={{ zIndex: 6 - i }}
                    >
                      <span className="text-sm font-bold text-white">{initial}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-semibold text-[#5B4FBF] mb-1">
                  10+ Team Members
                </p>
                <p className="text-xs text-slate-500">
                  Veteran founders + GenZ operators
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Veteran wisdom.{" "}
                <span className="text-[#5B4FBF]">GenZ execution.</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Behind HireMIQ is a team of 10+ GenZ operators — sharp,
                hungry, digitally native — mentored by founders with
                over 15 years of staffing DNA. They don&apos;t just use AI
                tools — they grew up with them.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed">
                This isn&apos;t a traditional hierarchy. It&apos;s a
                combination that works: veterans who know what matters and a
                new generation that knows how to move fast. The result is
                execution speed that surprises — and quality that compounds.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed">
                Every module on the platform, every sourcing workflow, every
                candidate assessment framework — tested in the
                field before it was coded into the product. Built from
                practice, not theory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-16 lg:py-20 bg-[#5B4FBF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { icon: Clock,   value: "15+", label: "Years in Recruitment" },
              { icon: Users,   value: "2",   label: "Founders" },
              { icon: Brain,   value: "10+", label: "GenZ Team Members" },
              { icon: Blocks,  value: "8",   label: "AI Modules" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white/80" />
                    </div>
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/60 font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CLOSING BELIEF ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-12 rounded-xl bg-[#5B4FBF]/10 flex items-center justify-center mx-auto mb-8">
              <Brain className="w-6 h-6 text-[#5B4FBF]" />
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-snug tracking-tight">
              The future of recruitment isn&apos;t choosing between human
              expertise and artificial intelligence —{" "}
              <span className="text-[#5B4FBF]">it&apos;s combining them.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 lg:py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to work with us?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Whether you need recruitment services, AI-powered tools, or both —
            we&apos;re here to help you hire smarter and faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#5B4FBF] hover:bg-[#4f3da8] text-white font-semibold rounded-xl transition-colors text-base gap-2"
            >
              <Handshake className="w-4 h-4" />
              Explore Services
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-colors text-base gap-2"
            >
              <Cpu className="w-4 h-4" />
              Try the Platform
            </Link>
            <a
              href="mailto:sales@hiremiq.com"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors text-base gap-2"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
