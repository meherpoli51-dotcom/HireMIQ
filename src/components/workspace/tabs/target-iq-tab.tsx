"use client";

import { Badge } from "@/components/ui/badge";
import {
  Target,
  Building2,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import type { TargetIQOutput } from "@/lib/types";

function CompanyList({
  companies,
  color,
}: {
  companies: string[];
  color: "blue" | "emerald" | "amber" | "rose";
}) {
  const styles = {
    blue: "bg-blue-50 border-blue-100 text-blue-800",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-800",
    amber: "bg-amber-50 border-amber-100 text-amber-800",
    rose: "bg-rose-50 border-rose-100 text-rose-800",
  };
  const dotStyles = {
    blue: "bg-blue-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {companies.map((company) => (
        <div
          key={company}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${styles[color]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[color]}`} />
          {company}
        </div>
      ))}
    </div>
  );
}

export function TargetIQTab({ data }: { data: TargetIQOutput }) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Ideal Companies */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            Ideal Target Companies
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
              Primary
            </Badge>
          </h3>
          <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <CompanyList companies={data.idealCompanies ?? []} color="blue" />
      </div>

      {/* Similar Companies */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-500" />
          Similar Companies
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">
            Strong Fit
          </Badge>
        </h3>
        <CompanyList companies={data.similarCompanies ?? []} color="emerald" />
      </div>

      {/* Adjacent Companies */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-amber-500" />
          Adjacent Companies
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
            Explore
          </Badge>
        </h3>
        <CompanyList companies={data.adjacentCompanies ?? []} color="amber" />
      </div>

      {/* Avoid Companies */}
      <div className="bg-rose-50/30 rounded-lg border border-rose-200/60 p-4">
        <h3 className="text-sm font-semibold text-rose-800 mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          Avoid / Low-Fit
          <Badge variant="outline" className="bg-rose-100 text-rose-700 border-rose-200 text-[10px]">
            Skip
          </Badge>
        </h3>
        <ul className="space-y-2">
          {(data.avoidCompanies ?? []).map((company, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-rose-800/80">
              <span className="text-rose-400 mt-0.5 shrink-0">&#10005;</span>
              {company}
            </li>
          ))}
        </ul>
      </div>

      {/* Talent Pool Strategy */}
      <div className="bg-blue-50/50 rounded-lg border border-blue-200/60 p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-500" />
          Talent Pool Strategy
        </h3>
        <p className="text-sm text-blue-800/80 leading-relaxed">
          {data.talentPoolStrategy}
        </p>
      </div>
    </div>
  );
}
