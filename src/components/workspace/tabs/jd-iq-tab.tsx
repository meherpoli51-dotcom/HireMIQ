"use client";

import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Lightbulb, RefreshCw } from "lucide-react";
import type { JDIQOutput } from "@/lib/types";

export function JDIQTab({ data }: { data: JDIQOutput }) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Role
          </p>
          <p className="text-sm font-semibold text-slate-900">{data.roleTitle}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Seniority
          </p>
          <p className="text-sm font-semibold text-slate-900">{data.seniority}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Experience
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {data.experienceRequired}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Domain
          </p>
          <p className="text-sm font-semibold text-blue-700">{data.domain}</p>
        </div>
      </div>

      {/* Role Overview */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Role Overview</h3>
          <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {data.roleOverview}
        </p>
      </div>

      {/* Responsibilities */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Key Responsibilities
        </h3>
        <ul className="space-y-2">
          {data.responsibilities.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Info */}
      <div className="bg-amber-50/50 rounded-lg border border-amber-200/60 p-4">
        <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Missing Information
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
            {data.missingInformation.length} gaps
          </Badge>
        </h3>
        <ul className="space-y-2">
          {data.missingInformation.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
              <span className="text-amber-500 mt-1">&#8226;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Recruiter Interpretation */}
      <div className="bg-blue-50/50 rounded-lg border border-blue-200/60 p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-500" />
          Recruiter Interpretation
        </h3>
        <p className="text-sm text-blue-800/80 leading-relaxed">
          {data.recruiterInterpretation}
        </p>
      </div>
    </div>
  );
}
