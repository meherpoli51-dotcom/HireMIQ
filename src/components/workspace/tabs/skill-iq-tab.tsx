"use client";

import { Badge } from "@/components/ui/badge";
import { Cpu, Wrench, Search, Lightbulb, RefreshCw } from "lucide-react";
import type { SkillIQOutput } from "@/lib/types";

function SkillBadge({
  skill,
  variant,
}: {
  skill: string;
  variant: "mandatory" | "secondary" | "nice";
}) {
  const styles = {
    mandatory: "bg-blue-50 text-blue-700 border-blue-200",
    secondary: "bg-violet-50 text-violet-700 border-violet-200",
    nice: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${styles[variant]}`}
    >
      {skill}
    </span>
  );
}

export function SkillIQTab({ data }: { data: SkillIQOutput }) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Mandatory Skills */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            Mandatory Skills
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
              Must Have
            </Badge>
          </h3>
          <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.mandatorySkills.map((skill) => (
            <SkillBadge key={skill} skill={skill} variant="mandatory" />
          ))}
        </div>
      </div>

      {/* Secondary Skills */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-violet-500" />
          Secondary Skills
          <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-[10px]">
            Good to Have
          </Badge>
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.secondarySkills.map((skill) => (
            <SkillBadge key={skill} skill={skill} variant="secondary" />
          ))}
        </div>
      </div>

      {/* Nice-to-Have */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-slate-400" />
          Nice-to-Have Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.niceToHaveSkills.map((skill) => (
            <SkillBadge key={skill} skill={skill} variant="nice" />
          ))}
        </div>
      </div>

      {/* Tools & Platforms */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-500" />
          Tools & Platforms
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {data.toolsPlatforms.map((tool) => (
            <div
              key={tool}
              className="flex items-center gap-2 bg-amber-50/50 rounded-md px-3 py-2 border border-amber-100 text-sm text-amber-800"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {tool}
            </div>
          ))}
        </div>
      </div>

      {/* Search Keywords & Alt Titles */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" />
            Search Keywords
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {data.searchKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-500" />
            Alternative Job Titles
          </h3>
          <ul className="space-y-1.5">
            {data.alternativeJobTitles.map((title) => (
              <li
                key={title}
                className="text-sm text-slate-600 flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-blue-400" />
                {title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Candidate Fit Guidance */}
      <div className="bg-blue-50/50 rounded-lg border border-blue-200/60 p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-500" />
          Candidate Fit Guidance
        </h3>
        <p className="text-sm text-blue-800/80 leading-relaxed">
          {data.candidateFitGuidance}
        </p>
      </div>
    </div>
  );
}
