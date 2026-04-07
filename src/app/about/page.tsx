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
  Handshake,
  Cpu,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — HireMIQ",
  description:
    "15 years of hiring instinct meets a new generation of intelligence. Learn how HireMIQ combines veteran recruitment expertise with AI-powered tools.",
};

/* ------------------------------------------------------------------ */
/*  CSS-based scroll reveal: elements with .reveal start invisible    */
/*  and animate into view via IntersectionObserver in the client       */
/*  wrapper below.                                                    */
/* ------------------------------------------------------------------ */

function RevealOnScroll({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />
      <ClientRevealInit />

      {/* ===== HERO ===== */}
      <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#f5f3ff]/80 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#5B4FBF]/10 text-[#5B4FBF] rounded-full px-4 py-2 mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FBF]" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Our story
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6 animate-fade-in">
              15 years of hiring instinct.
              <br />
              <span className="bg-gradient-to-r from-[#5B4FBF] to-[#7c6fe0] bg-clip-text text-transparent">
                A new generation of intelligence.
              </span>
            </h1>

            <p
              className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              We&apos;re not another HR-tech startup guessing what recruiters
              need. We lived it. Now we&apos;re solving it.
            </p>
          </div>
        </div>
      </section>

      {/* ===== OPENING ===== */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <RevealOnScroll>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-8">
                HireMIQ was born in frustration&nbsp;&mdash; and built with
                purpose.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <p className="text-lg text-slate-500 leading-relaxed mb-6">
                Our founders spent over 15 years inside the staffing trenches
                &mdash; running delivery desks, managing high-volume mandates,
                building sourcing teams from scratch, and dealing with every
                breakdown the recruitment process could throw at them. Bad JDs.
                Ghost clients. Unscreenable volumes. Candidate no-shows. ATS
                black holes.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <p className="text-lg text-slate-500 leading-relaxed">
                They didn&apos;t just observe these problems &mdash; they
                carried them. Every missed SLA, every rework cycle, every
                late-night Boolean search string that still didn&apos;t surface
                the right talent. That experience became the foundation for
                everything HireMIQ is today.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ===== THE PROBLEM ===== */}
      <section className="py-20 lg:py-28 bg-[#f5f3ff]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <RevealOnScroll>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
                  We didn&apos;t build this from
                  <br className="hidden sm:block" /> the outside looking in.
                </h2>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <p className="text-lg text-slate-500 leading-relaxed mb-6">
                  Most recruitment tools are built by engineers who&apos;ve
                  never filled a role. They optimize for dashboards and data
                  models &mdash; not for the messy, human, high-pressure reality
                  of staffing. The result? Tools that look great in demos but
                  collect dust in practice.
                </p>
              </RevealOnScroll>
              <RevealOnScroll delay={200}>
                <p className="text-lg text-slate-500 leading-relaxed">
                  Recruiters need clarity from chaos. They need speed without
                  sacrificing quality. They need tools that think the way they
                  think &mdash; not tools that force them into someone
                  else&apos;s workflow.
                </p>
              </RevealOnScroll>
            </div>

            {/* Founder Quote */}
            <RevealOnScroll delay={150}>
              <div className="relative bg-white rounded-2xl border border-slate-100 p-8 sm:p-10 shadow-sm">
                <div className="absolute -top-4 -left-2">
                  <div className="w-10 h-10 rounded-xl bg-[#5B4FBF] flex items-center justify-center">
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                </div>
                <blockquote className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium italic mt-4">
                  &ldquo;We didn&apos;t build HireMIQ because we saw a market
                  opportunity. We built it because we were exhausted by the gap
                  between how good recruitment could be &mdash; and how it
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
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ===== WHAT WE BUILT ===== */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <RevealOnScroll>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Two engines. One mission.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                HireMIQ is not just a tool and not just a service. It&apos;s
                both &mdash; working together.
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Engine 1: Services */}
            <RevealOnScroll>
              <div className="group relative bg-white rounded-2xl border border-slate-100 p-8 sm:p-10 hover:border-[#5B4FBF]/20 hover:shadow-lg hover:shadow-[#5B4FBF]/5 transition-all duration-300">
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
                  className="inline-flex items-center text-sm font-semibold text-[#5B4FBF] group-hover:gap-2.5 gap-1.5 transition-all"
                >
                  Explore services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </RevealOnScroll>

            {/* Engine 2: Platform */}
            <RevealOnScroll delay={150}>
              <div className="group relative bg-white rounded-2xl border border-slate-100 p-8 sm:p-10 hover:border-[#5B4FBF]/20 hover:shadow-lg hover:shadow-[#5B4FBF]/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#5B4FBF]/10 flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6 text-[#5B4FBF]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  The AI Platform
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Eight intelligence modules that turn messy JDs into
                  recruiter-ready sourcing and outreach workflows. JD IQ, Skill
                  IQ, Boolean IQ, Outreach IQ, and more &mdash; built by
                  recruiters, for recruiters.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-semibold text-[#5B4FBF] group-hover:gap-2.5 gap-1.5 transition-all"
                >
                  Try the platform
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ===== THE TEAM ===== */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Team photo placeholder */}
            <RevealOnScroll>
              <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#5B4FBF]/5 to-[#5B4FBF]/15 border border-[#5B4FBF]/10 overflow-hidden flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-[#5B4FBF]/15 border-2 border-white -ml-2 first:ml-0 flex items-center justify-center"
                      >
                        <Users className="w-4 h-4 text-[#5B4FBF]/50" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-[#5B4FBF]/60 font-medium">
                    Team photo coming soon
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            <div>
              <RevealOnScroll>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                  Veteran wisdom.
                  <br />
                  <span className="text-[#5B4FBF]">GenZ execution.</span>
                </h2>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <p className="text-lg text-slate-500 leading-relaxed mb-6">
                  Behind HireMIQ is a team of 10+ GenZ operators &mdash; sharp,
                  hungry, digitally native &mdash; mentored by founders with
                  over 15 years of staffing DNA. They don&apos;t just use AI
                  tools &mdash; they grew up with them.
                </p>
              </RevealOnScroll>
              <RevealOnScroll delay={200}>
                <p className="text-lg text-slate-500 leading-relaxed mb-6">
                  This isn&apos;t a traditional hierarchy. It&apos;s a
                  combination that works: veterans who know what matters and a
                  new generation that knows how to move fast. The result is
                  execution speed that surprises &mdash; and quality that
                  compounds.
                </p>
              </RevealOnScroll>
              <RevealOnScroll delay={300}>
                <p className="text-lg text-slate-500 leading-relaxed">
                  Every module on the platform, every sourcing workflow, every
                  candidate assessment framework &mdash; it was tested in the
                  field before it was coded into the product. That&apos;s what
                  makes HireMIQ different: it&apos;s built from practice, not
                  theory.
                </p>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="py-16 lg:py-20 bg-[#5B4FBF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                icon: Clock,
                value: "15+",
                label: "Years in Recruitment",
              },
              {
                icon: Users,
                value: "2",
                label: "Founders",
              },
              {
                icon: Brain,
                value: "10+",
                label: "GenZ Team Members",
              },
              {
                icon: Blocks,
                value: "8",
                label: "AI Modules",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-white/80" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-white/60 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLOSING BELIEF ===== */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <RevealOnScroll>
              <div className="w-12 h-12 rounded-xl bg-[#5B4FBF]/10 flex items-center justify-center mx-auto mb-8">
                <Brain className="w-6 h-6 text-[#5B4FBF]" />
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-snug tracking-tight">
                The future of recruitment isn&apos;t choosing between human
                expertise and artificial intelligence &mdash;{" "}
                <span className="text-[#5B4FBF]">
                  it&apos;s combining them.
                </span>
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 lg:py-28 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to work with us?
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
              Whether you need recruitment services, AI-powered tools, or both
              &mdash; we&apos;re here to help you hire smarter and faster.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center h-13 px-8 bg-[#5B4FBF] hover:bg-[#4f3da8] text-white font-semibold rounded-xl transition-colors text-base gap-2"
              >
                <Handshake className="w-4 h-4" />
                Explore Services
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-13 px-8 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-colors text-base gap-2"
              >
                <Cpu className="w-4 h-4" />
                Try the Platform
              </Link>
              <a
                href="mailto:hello@hiremiq.com"
                className="inline-flex items-center justify-center h-13 px-8 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors text-base gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Client component: initializes IntersectionObserver for .reveal    */
/* ------------------------------------------------------------------ */

function ClientRevealInit() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var style = document.createElement('style');
            style.textContent = \`
              .reveal {
                opacity: 0;
                transform: translateY(24px);
                transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
              }
              .reveal.revealed {
                opacity: 1;
                transform: translateY(0);
              }
            \`;
            document.head.appendChild(style);

            var observer = new IntersectionObserver(
              function(entries) {
                entries.forEach(function(entry) {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                  }
                });
              },
              { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
            );

            function observe() {
              document.querySelectorAll('.reveal').forEach(function(el) {
                observer.observe(el);
              });
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', observe);
            } else {
              observe();
            }
          })();
        `,
      }}
    />
  );
}
