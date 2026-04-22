"use client";

import { LandingNavbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import {
  Mail,
  ArrowRight,
  Send,
  Clock,
  Briefcase,
  Monitor,
  CalendarCheck,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect, useRef, type FormEvent } from "react";

type InquiryType =
  | ""
  | "recruitment"
  | "platform"
  | "rpo"
  | "general";

const inquiryOptions: { value: InquiryType; label: string }[] = [
  { value: "", label: "Select an option" },
  { value: "recruitment", label: "Recruitment services" },
  { value: "platform", label: "Platform access" },
  { value: "rpo", label: "RPO" },
  { value: "general", label: "General enquiry" },
];

/* ------------------------------------------------------------------ */
/*  Scroll-reveal hook                                                 */
/* ------------------------------------------------------------------ */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/*  Contact page                                                       */
/* ------------------------------------------------------------------ */
export default function ContactPage() {
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [inquiry, setInquiry] = useState<InquiryType>("");
  const [message, setMessage] = useState("");

  const hero = useReveal<HTMLDivElement>();
  const info = useReveal<HTMLDivElement>();
  const form = useReveal<HTMLDivElement>();
  const cta = useReveal<HTMLDivElement>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, inquiry, message }),
      });

      if (!res.ok) throw new Error("Request failed");

      setFormState("success");
      setName("");
      setCompany("");
      setEmail("");
      setInquiry("");
      setMessage("");
    } catch {
      setFormState("error");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 lg:pt-48 lg:pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-brand-50/80 to-transparent rounded-full blur-3xl" />
        </div>

        <div
          ref={hero.ref}
          className={`max-w-3xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ${
            hero.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-brand-500 text-white rounded-full px-4 py-2 mb-8 text-xs font-semibold tracking-wide">
            <Mail className="w-3.5 h-3.5" />
            Get in Touch
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Let&apos;s talk{" "}
            <span className="bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500 bg-clip-text text-transparent">
              hiring.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Whether you need a recruitment partner, want a platform demo, or
            just have a question &mdash; we are here. No automated replies, no
            chatbots. A real person from the HireMIQ team will get back to you
            within one business day.
          </p>
        </div>
      </section>

      {/* ── Split layout: Info + Form ──────────────────────────── */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* ── Left: Contact info ─────────────────────────── */}
            <div
              ref={info.ref}
              className={`lg:col-span-2 transition-all duration-700 delay-100 ${
                info.visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                Reach out directly
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Pick the channel that fits your need. Every email goes to a real
                inbox, monitored by the founding team.
              </p>

              <div className="space-y-5">
                {/* General */}
                <ContactCard
                  icon={Mail}
                  label="General enquiries"
                  value="sales@hiremiq.com"
                  href="mailto:sales@hiremiq.com"
                />
                {/* Services */}
                <ContactCard
                  icon={Briefcase}
                  label="For recruitment services"
                  value="sales@hiremiq.com"
                  href="mailto:sales@hiremiq.com"
                />
                {/* Platform */}
                <ContactCard
                  icon={Monitor}
                  label="For platform enquiries"
                  value="sales@hiremiq.com"
                  href="mailto:sales@hiremiq.com"
                />
              </div>

              {/* Response time note */}
              <div className="mt-10 flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-xl p-4">
                <Clock className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Response within one business day
                  </p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    We typically reply much sooner. For urgent matters, mention
                    it in your message and we will prioritise your request.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right: Form ────────────────────────────────── */}
            <div
              ref={form.ref}
              className={`lg:col-span-3 transition-all duration-700 delay-200 ${
                form.visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-100/60">
                <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">
                  Send us a message
                </h3>
                <p className="text-sm text-slate-500 mb-8">
                  Fill in the details and we will be in touch.
                </p>

                {formState === "success" ? (
                  <SuccessMessage onReset={() => setFormState("idle")} />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Company */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField
                        label="Name"
                        required
                        value={name}
                        onChange={setName}
                        placeholder="Your name"
                      />
                      <FormField
                        label="Company"
                        value={company}
                        onChange={setCompany}
                        placeholder="Your company"
                      />
                    </div>

                    {/* Email */}
                    <FormField
                      label="Email"
                      type="email"
                      required
                      value={email}
                      onChange={setEmail}
                      placeholder="you@company.com"
                    />

                    {/* Inquiry type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        What are you looking for?
                      </label>
                      <select
                        required
                        value={inquiry}
                        onChange={(e) =>
                          setInquiry(e.target.value as InquiryType)
                        }
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition-all focus:border-brand-500 focus:ring-3 focus:ring-brand-500/20 appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 12px center",
                        }}
                      >
                        {inquiryOptions.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            disabled={opt.value === ""}
                          >
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your hiring needs..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition-all focus:border-brand-500 focus:ring-3 focus:ring-brand-500/20 resize-none placeholder:text-slate-400"
                      />
                    </div>

                    {/* Error message */}
                    {formState === "error" && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                        Something went wrong. Please try again or email us
                        directly.
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formState === "submitting"}
                      className="group inline-flex items-center justify-center gap-2 h-12 px-8 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-600/30 w-full sm:w-auto"
                    >
                      {formState === "submitting" ? (
                        <>
                          <Spinner />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA: Book consultation ─────────────────────────────── */}
      <section className="pb-24 lg:pb-32">
        <div
          ref={cta.ref}
          className={`max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-700 ${
            cta.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-brand-900 p-10 sm:p-14 shadow-2xl">
            {/* Decorative gradient orb */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-brand-400/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 rounded-full px-3.5 py-1.5 mb-5 text-xs font-semibold tracking-wide backdrop-blur-sm">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Free consultation
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                  Not sure where to start?
                </h2>
                <p className="text-base text-slate-400 leading-relaxed max-w-lg">
                  Book a free 30-minute consultation with our team. We will walk
                  you through the platform, understand your hiring needs, and
                  recommend the best approach &mdash; no strings attached.
                </p>
              </div>

              <a
                href="mailto:sales@hiremiq.com?subject=30-minute%20consultation%20request"
                className="group inline-flex items-center gap-2 h-13 px-8 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-all text-sm shadow-xl shrink-0"
              >
                Book a call
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-50 transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center shrink-0 transition-colors">
        <Icon className="w-5 h-5 text-brand-500" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
          {value}
        </p>
      </div>
    </a>
  );
}

function FormField({
  label,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-brand-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition-all focus:border-brand-500 focus:ring-3 focus:ring-brand-500/20 placeholder:text-slate-400"
      />
    </div>
  );
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-10">
      <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle className="w-7 h-7 text-emerald-500" />
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-2">
        Message sent successfully
      </h4>
      <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
        Thank you for reaching out. A member of the HireMIQ team will get back
        to you within one business day.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
      >
        <Send className="w-4 h-4" />
        Send another message
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
