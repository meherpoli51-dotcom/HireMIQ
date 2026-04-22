"use client";

import { useState } from "react";
import { Calendar, X, CheckCircle, Loader2, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Booking Modal                                                      */
/* ------------------------------------------------------------------ */

function BookingModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    date: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (field: string, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#5B4FBF] to-[#7c6fe0] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">
                  Book a Free Consultation
                </h2>
                <p className="text-white/70 text-xs mt-0.5">
                  We'll get back to you within 1 business day
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {status === "success" ? (
            /* Success state */
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Request Sent!
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                Thanks <strong>{form.name}</strong>! Our team will reach out to{" "}
                <strong>{form.email}</strong> within 1 business day to confirm
                your consultation slot.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-[#5B4FBF] hover:bg-[#4f3da8] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#5B4FBF] focus:ring-2 focus:ring-[#5B4FBF]/10 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition"
                  />
                </div>

                {/* Email */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@company.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#5B4FBF] focus:ring-2 focus:ring-[#5B4FBF]/10 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition"
                  />
                </div>

                {/* Company */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Pvt Ltd"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#5B4FBF] focus:ring-2 focus:ring-[#5B4FBF]/10 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition"
                  />
                </div>

                {/* Preferred Date */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#5B4FBF] focus:ring-2 focus:ring-[#5B4FBF]/10 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition"
                  />
                </div>

                {/* Message */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    What do you need help with?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. We're hiring 5 senior engineers and need help with sourcing..."
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#5B4FBF] focus:ring-2 focus:ring-[#5B4FBF]/10 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition resize-none"
                  />
                </div>
              </div>

              {status === "error" && (
                <p className="text-xs text-rose-500 bg-rose-50 rounded-lg px-3 py-2">
                  Something went wrong. Please email us at{" "}
                  <a href="mailto:sales@hiremiq.com" className="underline">
                    sales@hiremiq.com
                  </a>{" "}
                  directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#5B4FBF] hover:bg-[#4f3da8] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending request…
                  </>
                ) : (
                  <>
                    Request Consultation
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                No spam. We reply within 1 business day.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported Button                                                    */
/* ------------------------------------------------------------------ */

export function BookConsultationButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center justify-center px-8 py-3.5 bg-[#5B4FBF] hover:bg-[#4f3da8] text-white font-semibold rounded-xl transition-colors text-base gap-2 shadow-lg shadow-[#5B4FBF]/20 cursor-pointer"
        }
      >
        <Calendar className="w-4 h-4" />
        Book a free consultation
      </button>

      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  );
}
