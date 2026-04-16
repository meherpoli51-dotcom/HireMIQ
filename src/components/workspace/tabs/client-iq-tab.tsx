"use client";

import { Badge } from "@/components/ui/badge";
import {
  Building2,
  TrendingUp,
  Shield,
  MessageSquare,
  AlertCircle,
  Target,
  RefreshCw,
} from "lucide-react";
import type { ClientIQOutput } from "@/lib/types";

export function ClientIQTab({ data }: { data: ClientIQOutput }) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Company snapshot */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-violet-500" />
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Company Type
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {data.companyType}
          </p>
          <Badge className="mt-2 bg-violet-50 text-violet-700 border-violet-200 text-[10px]">
            {data.industry}
          </Badge>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Hiring Style
            </p>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {data.hiringStyle}
          </p>
        </div>
      </div>

      {/* Selling Points */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            Candidate Selling Points
          </h3>
          <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {(data.candidateSellingPoints ?? []).map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-2 bg-emerald-50/50 rounded-lg px-3 py-2 border border-emerald-100"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                &#10003;
              </span>
              <span className="text-sm text-emerald-800">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Work Culture */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          Work Culture Summary
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {data.workCultureSummary}
        </p>
      </div>

      {/* Interview Expectations */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          Interview Expectations
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {data.interviewExpectations}
        </p>
      </div>

      {/* Objection Risks */}
      <div className="bg-rose-50/50 rounded-lg border border-rose-200/60 p-4">
        <h3 className="text-sm font-semibold text-rose-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          Candidate Objection Risks
          <Badge variant="outline" className="bg-rose-100 text-rose-700 border-rose-200 text-[10px]">
            Watch out
          </Badge>
        </h3>
        <ul className="space-y-2">
          {(data.candidateObjectionRisks ?? []).map((risk, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-rose-800/80">
              <span className="text-rose-400 mt-1">&#9888;</span>
              {risk}
            </li>
          ))}
        </ul>
      </div>

      {/* Recruiter Pitch Angle */}
      <div className="bg-blue-50/50 rounded-lg border border-blue-200/60 p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          Recruiter Pitch Angle
        </h3>
        <p className="text-sm text-blue-800/80 leading-relaxed">
          {data.recruiterPitchAngle}
        </p>
      </div>
    </div>
  );
}
