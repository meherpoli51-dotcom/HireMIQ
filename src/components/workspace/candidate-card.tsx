"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Briefcase,
  Layers,
  BarChart3,
  ClipboardCheck,
  Loader2,
  Link2,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CandidateMatch, DimensionScore, AnalysisResult } from "@/lib/types";

const verdictConfig = {
  Submit: {
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  Screen: {
    color: "text-amber-700 bg-amber-50 border-amber-200",
    icon: AlertTriangle,
  },
  Reject: {
    color: "text-rose-700 bg-rose-50 border-rose-200",
    icon: XCircle,
  },
};

const readinessConfig = {
  High: "text-emerald-700 bg-emerald-50",
  Medium: "text-amber-700 bg-amber-50",
  Low: "text-rose-700 bg-rose-50",
};

const dimensionIcons: Record<string, typeof Shield> = {
  skillMatch: Zap,
  roleRelevance: Briefcase,
  projectRelevance: Target,
  clientFit: Building2,
  stability: Shield,
  domainFit: Layers,
  experienceFit: TrendingUp,
};

function ScoreRing({
  score,
  size = 56,
}: {
  score: number;
  size?: number;
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75
      ? "text-emerald-500"
      : score >= 50
        ? "text-amber-500"
        : "text-rose-500";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          className="text-slate-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-sm font-bold", color)}>{score}</span>
      </div>
    </div>
  );
}

function DimensionBar({
  dimension,
  dimKey,
}: {
  dimension: DimensionScore;
  dimKey: string;
}) {
  const Icon = dimensionIcons[dimKey] || BarChart3;
  const barColor =
    dimension.score >= 75
      ? "bg-emerald-500"
      : dimension.score >= 50
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-700">
            {dimension.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">
            w: {(dimension.weight * 100).toFixed(0)}%
          </span>
          <span className="text-xs font-semibold text-slate-900">
            {dimension.score}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${dimension.score}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        {dimension.reasoning}
      </p>
    </div>
  );
}

// Encode assessment data into a URL-safe string
function encodeAssessData(data: Record<string, unknown>): string {
  try {
    const json = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(json)));
  } catch {
    return "";
  }
}

interface CandidateCardProps {
  candidate: CandidateMatch;
  rank: number;
  analysis?: AnalysisResult | null;
}

export function CandidateCard({ candidate, rank, analysis }: CandidateCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [assessLink, setAssessLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const verdict = verdictConfig[candidate.verdict];
  const VerdictIcon = verdict.icon;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Collapsed header */}
      <div
        className="px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          {/* Rank + Score */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-slate-300">
              #{rank}
            </span>
            <ScoreRing score={candidate.overallScore} />
          </div>

          {/* Candidate Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-slate-900 truncate">
                {candidate.candidateName}
              </h4>
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                  verdict.color
                )}
              >
                <VerdictIcon className="w-3 h-3 inline mr-0.5 -mt-px" />
                {candidate.verdict}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full",
                  readinessConfig[candidate.submissionReadiness]
                )}
              >
                {candidate.submissionReadiness} Readiness
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {candidate.currentRole}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {candidate.currentCompany}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {candidate.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {candidate.noticePeriod}
              </span>
            </div>
          </div>

          {/* Expand toggle */}
          <button className="text-slate-400 hover:text-slate-600 shrink-0">
            {expanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-5">
          {/* Verdict reason */}
          <p className="text-sm text-slate-700 italic bg-slate-50 rounded-lg px-4 py-3">
            &ldquo;{candidate.verdictReason}&rdquo;
          </p>

          {/* Dimension scores */}
          <div>
            <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Dimension Breakdown
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(candidate.dimensions).map(([key, dim]) => (
                <DimensionBar key={key} dimension={dim} dimKey={key} />
              ))}
            </div>
          </div>

          {/* Strengths / Risks / Missing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h5 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                Strengths
              </h5>
              <ul className="space-y-1.5">
                {candidate.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-600 flex items-start gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
                Risks
              </h5>
              <ul className="space-y-1.5">
                {candidate.risks.map((r, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-600 flex items-start gap-1.5"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2">
                Missing Skills
              </h5>
              <ul className="space-y-1.5">
                {candidate.missingSkills.map((m, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-600 flex items-start gap-1.5"
                  >
                    <XCircle className="w-3 h-3 text-rose-400 mt-0.5 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recruiter Guidance */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
            <h5 className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1.5">
              Recruiter Guidance
            </h5>
            <p className="text-xs text-blue-900 leading-relaxed">
              {candidate.recruiterGuidance}
            </p>
          </div>

          {/* Assessment generation */}
          {candidate.verdict !== "Reject" && (
            <div className="flex items-center gap-3">
              {!assessLink ? (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!analysis) return;
                    setGenerating(true);
                    try {
                      const res = await fetch("/api/assess", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ analysis, candidate }),
                      });
                      if (!res.ok) throw new Error("Failed");
                      const data = await res.json();

                      // Encode assessment data directly in URL (self-contained, no DB needed)
                      const assessPayload = {
                        id: data.id,
                        candidateName: data.candidateName,
                        jobTitle: data.jobTitle,
                        clientName: data.clientName,
                        questions: (data.questions || []).map(
                          (q: { id: string; section: string; sectionLabel: string; question: string; timeEstimate: string }) => ({
                            id: q.id,
                            section: q.section,
                            sectionLabel: q.sectionLabel,
                            question: q.question,
                            timeEstimate: q.timeEstimate,
                          })
                        ),
                        timeLimitMinutes: data.timeLimitMinutes || 35,
                      };

                      const encoded = encodeAssessData(assessPayload);
                      const link = `${window.location.origin}/assess?d=${encodeURIComponent(encoded)}`;
                      setAssessLink(link);
                    } catch {
                      // handle silently
                    } finally {
                      setGenerating(false);
                    }
                  }}
                  disabled={generating || !analysis}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {generating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ClipboardCheck className="w-3.5 h-3.5" />
                  )}
                  Generate Assessment Link
                </button>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <Link2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <input
                    readOnly
                    value={assessLink}
                    className="flex-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 font-mono"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(assessLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {candidate.experience}
            </span>
            <span>Resume: {candidate.resumeFileName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
