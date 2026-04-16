"use client";

import { Badge } from "@/components/ui/badge";
import { Mail, MessageCircle, Send, RefreshCw } from "lucide-react";
import { CopyButton } from "../copy-button";
import type { ReachIQOutput } from "@/lib/types";

const typeIcons: Record<string, typeof Mail> = {
  Email: Mail,
  LinkedIn: MessageCircle,
  WhatsApp: Send,
  "Follow-up": Mail,
};

const typeColors: Record<string, { badge: string; border: string }> = {
  Email: { badge: "bg-blue-50 text-blue-700 border-blue-200", border: "border-l-blue-500" },
  LinkedIn: { badge: "bg-sky-50 text-sky-700 border-sky-200", border: "border-l-sky-500" },
  WhatsApp: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", border: "border-l-emerald-500" },
  "Follow-up": { badge: "bg-amber-50 text-amber-700 border-amber-200", border: "border-l-amber-500" },
};

function getTypeKey(type: string): string {
  if (type.includes("Email")) return "Email";
  if (type.includes("LinkedIn")) return "LinkedIn";
  if (type.includes("WhatsApp")) return "WhatsApp";
  if (type.includes("Follow-up")) return "Follow-up";
  return "Email";
}

export function ReachIQTab({ data }: { data: ReachIQOutput }) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
        <p className="text-xs text-slate-500">
          <strong className="text-slate-600">Personalization:</strong> Replace{" "}
          <code className="bg-white px-1 py-0.5 rounded text-blue-600 text-[11px]">
            {"{{first_name}}"}
          </code>
          ,{" "}
          <code className="bg-white px-1 py-0.5 rounded text-blue-600 text-[11px]">
            {"{{current_company}}"}
          </code>
          ,{" "}
          <code className="bg-white px-1 py-0.5 rounded text-blue-600 text-[11px]">
            {"{{recruiter_name}}"}
          </code>{" "}
          with actual values before sending.
        </p>
      </div>

      {(data.messages ?? []).map((msg, i) => {
        const typeKey = getTypeKey(msg.type);
        const colors = typeColors[typeKey];
        const Icon = typeIcons[typeKey] || Mail;

        return (
          <div
            key={i}
            className={`bg-white rounded-lg border border-slate-200 border-l-4 ${colors.border} overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  {msg.type}
                </span>
                <Badge className={`text-[10px] ${colors.badge}`}>
                  {typeKey}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={msg.subject ? `Subject: ${msg.subject}\n\n${msg.body}` : msg.body} />
                <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Subject line */}
            {msg.subject && (
              <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100">
                <p className="text-xs text-slate-500">
                  <strong>Subject:</strong>{" "}
                  <span className="text-slate-700">{msg.subject}</span>
                </p>
              </div>
            )}

            {/* Body */}
            <div className="px-4 py-4">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {msg.body}
              </pre>
            </div>
          </div>
        );
      })}
    </div>
  );
}
