"use client";

import { AppNavbar } from "@/components/layout/app-navbar";
import {
  BookOpen,
  MessageCircle,
  Zap,
  FileSearch,
  Kanban,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "How does JD Analysis work?",
    a: "Paste your job description into the workspace, fill in the client and location details, then click Analyze JD. Our AI (Claude) parses the JD and generates a full intelligence report — skills, sourcing strategy, outreach templates, and more.",
  },
  {
    q: "What is Match IQ?",
    a: "Match IQ scores a candidate's resume against the analyzed JD. Upload one or more resumes after running the analysis and get a percentage match with a skill-by-skill breakdown.",
  },
  {
    q: "How do I use the Pipeline?",
    a: "The Pipeline page tracks candidates through recruitment stages (Sourced → Screened → Assessment → Interview → Offer → Joined). Drag cards between columns to move candidates. Click any card to view full details.",
  },
  {
    q: "What file formats does resume upload support?",
    a: "PDF, DOCX, DOC, and TXT files are supported. Maximum file size is 10MB per resume.",
  },
  {
    q: "How many JDs can I analyze?",
    a: "The free plan includes 5 JD analyses per month. Upgrade to Pro (₹499/month) for unlimited analyses.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. JD and resume data is only used for the analysis request and is not stored permanently without your consent. We use Supabase (postgres) with row-level security for all workspace data.",
  },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 ml-3" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-3" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-4">
          <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

const quickLinks = [
  { icon: FileSearch, label: "Start a JD Analysis", href: "/workspace" },
  { icon: Kanban, label: "Open Pipeline", href: "/pipeline" },
  { icon: Star, label: "View Pricing", href: "/pricing" },
];

export default function HelpPage() {
  return (
    <>
      <AppNavbar title="Help & Support" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-3xl mx-auto space-y-6">

          {/* Quick links */}
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-slate-700">{label}</span>
              </a>
            ))}
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
              Frequently Asked Questions
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {faqs.map((faq) => (
                <FAQ key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 mb-1">Still need help?</p>
                <p className="text-sm text-slate-500 mb-3">
                  Reach out to our team — we typically respond within 24 hours.
                </p>
                <a
                  href="mailto:sales@hiremiq.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Us
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
