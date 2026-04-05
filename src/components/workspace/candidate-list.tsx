"use client";

import { useState } from "react";
import { Users, SortAsc, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { CandidateCard } from "./candidate-card";
import type { CandidateMatch, AnalysisResult } from "@/lib/types";

interface CandidateListProps {
  candidates: CandidateMatch[];
  analysis?: AnalysisResult | null;
}

type SortBy = "score" | "name" | "verdict";
type FilterVerdict = "all" | "Submit" | "Screen" | "Reject";

export function CandidateList({ candidates, analysis }: CandidateListProps) {
  const [sortBy, setSortBy] = useState<SortBy>("score");
  const [filterVerdict, setFilterVerdict] = useState<FilterVerdict>("all");

  const filtered =
    filterVerdict === "all"
      ? candidates
      : candidates.filter((c) => c.verdict === filterVerdict);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "score") return b.overallScore - a.overallScore;
    if (sortBy === "name")
      return a.candidateName.localeCompare(b.candidateName);
    // verdict priority: Submit > Screen > Reject
    const order = { Submit: 0, Screen: 1, Reject: 2 };
    return order[a.verdict] - order[b.verdict];
  });

  const submitCount = candidates.filter((c) => c.verdict === "Submit").length;
  const screenCount = candidates.filter((c) => c.verdict === "Screen").length;
  const rejectCount = candidates.filter((c) => c.verdict === "Reject").length;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4.5 h-4.5 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            {candidates.length} Candidate{candidates.length !== 1 ? "s" : ""}{" "}
            Scored
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {submitCount > 0 && (
            <span className="text-emerald-600 font-medium">
              {submitCount} Submit
            </span>
          )}
          {screenCount > 0 && (
            <span className="text-amber-600 font-medium">
              {screenCount} Screen
            </span>
          )}
          {rejectCount > 0 && (
            <span className="text-rose-600 font-medium">
              {rejectCount} Reject
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <SortAsc className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="text-xs h-7 px-2 rounded border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="score">Sort by Score</option>
            <option value="verdict">Sort by Verdict</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex gap-1">
            {(["all", "Submit", "Screen", "Reject"] as FilterVerdict[]).map(
              (v) => (
                <button
                  key={v}
                  onClick={() => setFilterVerdict(v)}
                  className={cn(
                    "text-[11px] font-medium px-2 py-1 rounded transition-colors",
                    filterVerdict === v
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {v === "all" ? "All" : v}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {sorted.map((candidate, i) => (
          <CandidateCard key={candidate.id} candidate={candidate} rank={i + 1} analysis={analysis} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500">
            No candidates match the selected filter.
          </p>
        </div>
      )}
    </div>
  );
}
