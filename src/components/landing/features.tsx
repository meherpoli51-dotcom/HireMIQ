"use client";

import {
  Briefcase,
  UserCheck,
  Building,
  Cpu,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useReveal } from "./use-reveal";

const services = [
  {
    num: "01",
    icon: Briefcase,
    title: "End-to-end recruitment",
    description:
      "From requirement gathering to offer rollout. We manage sourcing, screening, interviews, and negotiation — so you get the right hire without lifting a finger.",
    href: "/contact",
  },
  {
    num: "02",
    icon: UserCheck,
    title: "Staffing & contract talent",
    description:
      "Need to scale fast or fill temporary gaps? We provide contract, temp-to-perm, and project-based talent across functions — vetted, ready, and deployable.",
    href: "/contact",
  },
  {
    num: "03",
    icon: Building,
    title: "RPO — your embedded hiring team",
    description:
      "We embed inside your organization as your recruitment process outsourcing partner. Your brand, your culture, our expertise and tech stack driving results.",
    href: "/contact",
  },
  {
    num: "04",
    icon: Cpu,
    title: "HireMIQ platform access",
    description:
      "Give your team the same AI tools we use — JD analysis, Boolean generation, candidate scoring, outreach templates, and screening assessments. All in one platform.",
    href: "/login",
  },
];

export function Features() {
  const ref = useReveal();

  return (
    <section id="services" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle grid lines */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_30%,transparent_100%)]" />

      <div ref={ref} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-3">
            Services
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            What we do for you
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Whether you need us to recruit or empower your team with AI — we have
            you covered.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={service.num}
                className="relative group rounded-2xl bg-white border border-slate-200 p-8 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-50 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Number watermark */}
                <span className="absolute top-6 right-8 text-6xl font-extrabold text-slate-100 group-hover:text-brand-50 transition-colors select-none">
                  {service.num}
                </span>

                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center mb-5 transition-colors">
                    <Icon className="w-6 h-6 text-brand-500" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed mb-5">
                    {service.description}
                  </p>

                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors group/link"
                  >
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
