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
  Mail,
  Send,
  Kanban,
} from "lucide-react";
import { useKanbanStore } from "@/store/use-kanban-store";
import type { PipelineCandidate } from "@/types/kanban";
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
  const [candidateEmail, setCandidateEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [addedToPipeline, setAddedToPipeline] = useState(false);
  const [addingToPipeline, setAddingToPipeline] = useState(false);
  const addCandidate = useKanbanStore((s) => s.addCandidate);
  // Safely resolve verdict — AI may return unexpected casing or values
  const verdictKey = (Object.keys(verdictConfig) as Array<keyof typeof verdictConfig>).find(
    (k) => k.toLowerCase() === (candidate.verdict || "").toLowerCase()
  ) || "Screen";
  const verdict = verdictConfig[verdictKey];
  const VerdictIcon = verdict.icon;

  // Safely resolve readiness
  const readinessKey = (Object.keys(readinessConfig) as Array<keyof typeof readinessConfig>).find(
    (k) => k.toLowerCase() === (candidate.submissionReadiness || "").toLowerCase()
  ) || "Medium";

  // Safe arrays (AI may omit these)
  const strengths = candidate.strengths || [];
  const risks = candidate.risks || [];
  const missingSkills = candidate.missingSkills || [];

  const handleSendEmail = async () => {
    if (!assessLink || !candidateEmail) return;
    setSendingEmail(true);
    try {
      const res = await fetch("/api/send-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateEmail,
          candidateName: candidate.candidateName,
          jobTitle: analysis?.jobTitle || "",
          clientName: analysis?.clientName || "",
          assessLink,
        }),
      });
      const data = await res.json();
      if (data.sent) {
        setEmailSent(true);
      } else if (data.fallback === "mailto") {
        // Use location.href for mailto (window.open shows blank tab in Chrome)
        window.location.href = data.mailtoLink;
        setEmailSent(true);
      }
    } catch {
      // fallback to mailto
      const subject = encodeURIComponent(
        `Screening Assessment - ${analysis?.jobTitle}`
      );
      const body = encodeURIComponent(
        `Hi ${candidate.candidateName},\n\nPlease complete your assessment:\n${assessLink}`
      );
      window.location.href = `mailto:${candidateEmail}?subject=${subject}&body=${body}`;
      setEmailSent(true);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleAddToPipeline = async () => {
    if (addedToPipeline || addingToPipeline) return;
    setAddingToPipeline(true);
    try {
      // Build a PipelineCandidate from the CandidateMatch
      const pipelineCandidate: PipelineCandidate = {
        id: `pipe-${candidate.id}`,
        name: candidate.candidateName,
        email: "",
        matchScore: candidate.overallScore,
        matchBreakdown: {
          skills: candidate.dimensions?.skillMatch?.score ?? candidate.overallScore,
          culture: candidate.dimensions?.clientFit?.score ?? candidate.overallScore,
          seniority: candidate.dimensions?.experienceFit?.score ?? candidate.overallScore,
        },
        source: "other",
        priority: candidate.overallScore >= 75 ? "high" : candidate.overallScore >= 50 ? "medium" : "low",
        stage: verdictKey === "Submit" ? "sourced" : verdictKey === "Screen" ? "screened" : "rejected",
        order: 0,
        jobId: analysis?.id ?? "unknown",
        jobTitle: analysis?.jobTitle ?? "",
        clientName: analysis?.clientName ?? "",
        skillBreakdown: candidate.missingSkills?.length
          ? candidate.missingSkills.map((s) => ({ skill: s, score: 30, verdict: "weak" as const }))
          : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        movedAt: new Date().toISOString(),
      };

      // Add to local Zustand store immediately (optimistic)
      addCandidate(pipelineCandidate);

      // Persist to Supabase in background
      await fetch("/api/pipeline/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate, analysis }),
      });

      setAddedToPipeline(true);
    } catch {
      // Still marked as added since Zustand store has it
      setAddedToPipeline(true);
    } finally {
      setAddingToPipeline(false);
    }
  };

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
                {verdictKey}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full",
                  readinessConfig[readinessKey]
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

          {/* Add to Pipeline button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleAddToPipeline(); }}
            disabled={addedToPipeline || addingToPipeline}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0",
              addedToPipeline
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
            )}
            title="Add to Pipeline"
          >
            {addingToPipeline ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : addedToPipeline ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Kanban className="w-3.5 h-3.5" />
            )}
            {addedToPipeline ? "In Pipeline" : "Add to Pipeline"}
          </button>

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
              {Object.entries(candidate.dimensions || {}).map(([key, dim]) => (
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
                {strengths.map((s, i) => (
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
                {risks.map((r, i) => (
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
                {missingSkills.map((m, i) => (
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

          {/* Assessment generation + email */}
          {verdictKey !== "Reject" && (
            <div className="space-y-3">
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
                <>
                  {/* Assessment link with copy */}
                  <div className="flex items-center gap-2">
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
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 rounded transition-colors shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* Email to candidate */}
                  {!emailSent ? (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <input
                        type="email"
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        placeholder="candidate@email.com"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendEmail();
                        }}
                        disabled={
                          sendingEmail ||
                          !candidateEmail ||
                          !candidateEmail.includes("@")
                        }
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors disabled:opacity-50 shrink-0"
                      >
                        {sendingEmail ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3" />
                        )}
                        Send
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      Assessment link sent to {candidateEmail}
                    </div>
                  )}
                </>
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
