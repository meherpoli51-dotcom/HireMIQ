"use client";

/**
 * HireMIQ — Candidate Detail Drawer
 * ====================================
 * Right-side Sheet (shadcn/ui) that opens when a card is clicked.
 * Reads selectedId from Zustand — zero prop drilling.
 *
 * Sections:
 *  1. Header — name, role, client, stage badge
 *  2. Match IQ Score — large score + color ring
 *  3. Skill Breakdown — per-skill progress bars
 *  4. Match Dimensions — skills / culture / seniority from MatchIQBreakdown
 *  5. Candidate Info — email, phone, source, priority
 *  6. Boolean Strings — copyable chips
 *  7. Notes — editable textarea (local optimistic update)
 *  8. Quick Actions — move stage, send assessment
 */

import { useState } from "react";
import { useKanbanStore } from "@/store/use-kanban-store";
import {
  STAGE_META,
  PIPELINE_STAGES,
  type PipelineStage,
  type PipelineCandidate,
} from "@/types/kanban";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  Copy,
  Check,
  ChevronRight,
  Flame,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Large circular Match IQ score display */
function MatchIQRing({ score }: { score: number }) {
  const { color, label } =
    score >= 80
      ? { color: "#10b981", label: "Strong Match" }
      : score >= 60
        ? { color: "#f59e0b", label: "Good Match" }
        : score >= 40
          ? { color: "#f97316", label: "Fair Match" }
          : { color: "#ef4444", label: "Weak Match" };

  const circumference = 2 * Math.PI * 36; // r=36
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          {/* Track */}
          <circle
            cx="44" cy="44" r="36"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="44" cy="44" r="36"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-slate-800 leading-none">
            {score}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {label}
      </span>
    </div>
  );
}

/** Skill score row with progress bar */
function SkillRow({
  skill,
  score,
  verdict,
}: {
  skill: string;
  score: number;
  verdict: "strong" | "moderate" | "weak";
}) {
  const color =
    verdict === "strong"
      ? "bg-emerald-500"
      : verdict === "moderate"
        ? "bg-amber-400"
        : "bg-red-400";

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-600">{skill}</span>
        <span className="text-xs font-bold text-slate-700 tabular-nums">
          {score}%
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

/** Copyable boolean string chip */
function BooleanChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3 group">
      <p className="text-xs text-slate-600 font-mono flex-1 break-all leading-relaxed">
        {value}
      </p>
      <button
        onClick={copy}
        className="flex-shrink-0 p-1 rounded hover:bg-slate-200 transition-colors"
        aria-label="Copy boolean string"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
        )}
      </button>
    </div>
  );
}

/** Priority icon */
function PriorityIcon({ priority }: { priority: PipelineCandidate["priority"] }) {
  if (priority === "high") return <Flame className="w-3.5 h-3.5 text-red-400" />;
  if (priority === "medium") return <ArrowUp className="w-3.5 h-3.5 text-amber-400" />;
  return <ArrowDown className="w-3.5 h-3.5 text-slate-400" />;
}

/** Section heading */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Stage Mover                                                        */
/* ------------------------------------------------------------------ */

function StageMover({ candidate }: { candidate: PipelineCandidate }) {
  const moveCandidate = useKanbanStore((s) => s.moveCandidate);
  const columns = useKanbanStore((s) => s.columns);
  const currentIdx = PIPELINE_STAGES.indexOf(candidate.stage);

  const move = (toStage: PipelineStage) => {
    const newIndex = columns[toStage].length;
    moveCandidate({
      candidateId: candidate.id,
      fromStage: candidate.stage,
      toStage,
      newIndex,
    });
  };

  return (
    <div className="space-y-2">
      <SectionLabel>Move to Stage</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {PIPELINE_STAGES.map((stage, idx) => {
          const meta = STAGE_META[stage];
          const isCurrent = stage === candidate.stage;
          return (
            <button
              key={stage}
              disabled={isCurrent}
              onClick={() => move(stage)}
              className={[
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold",
                "transition-all duration-150 border",
                isCurrent
                  ? "border-transparent text-white cursor-default"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              ].join(" ")}
              style={isCurrent ? { backgroundColor: meta.color } : {}}
              aria-label={`Move to ${meta.label}`}
              aria-pressed={isCurrent}
            >
              {isCurrent && <Check className="w-3 h-3" />}
              {meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Drawer                                                        */
/* ------------------------------------------------------------------ */

export function CandidateDrawer() {
  const selectedId = useKanbanStore((s) => s.selectedId);
  const selectCandidate = useKanbanStore((s) => s.selectCandidate);
  const updateCandidate = useKanbanStore((s) => s.updateCandidate);
  const candidate = useKanbanStore((s) =>
    s.selectedId ? s.candidates[s.selectedId] : null,
  );

  const [notes, setNotes] = useState("");

  // Sync local notes when candidate changes
  const displayNotes = candidate?.notes ?? notes;

  const saveNotes = () => {
    if (!candidate) return;
    updateCandidate(candidate.id, { notes });
  };

  if (!candidate) return null;

  const stageMeta = STAGE_META[candidate.stage];

  return (
    <Sheet open={!!selectedId} onOpenChange={(open) => !open && selectCandidate(null)}>
      <SheetContent
        side="right"
        className="w-full sm:w-[480px] sm:max-w-[480px] p-0 flex flex-col overflow-hidden"
        aria-label={`Candidate details for ${candidate.name}`}
      >
        {/* ── Header ── */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-bold text-slate-900 truncate">
                {candidate.name}
              </SheetTitle>
              <p className="text-sm text-slate-500 mt-0.5 truncate">
                {candidate.jobTitle} &middot; {candidate.clientName}
              </p>
            </div>

            {/* Stage badge */}
            <span
              className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${stageMeta.color}15`,
                color: stageMeta.color,
              }}
            >
              {stageMeta.label}
            </span>
          </div>
        </SheetHeader>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Match IQ Score */}
          <div className="flex flex-col items-center py-2">
            <MatchIQRing score={candidate.matchScore} />
          </div>

          <Separator />

          {/* Match Dimensions */}
          {candidate.matchBreakdown && (
            <div>
              <SectionLabel>Match IQ Breakdown</SectionLabel>
              <div className="space-y-3">
                <SkillRow
                  skill="Skills Match"
                  score={candidate.matchBreakdown.skills}
                  verdict={
                    candidate.matchBreakdown.skills >= 70 ? "strong"
                    : candidate.matchBreakdown.skills >= 45 ? "moderate"
                    : "weak"
                  }
                />
                <SkillRow
                  skill="Culture Fit"
                  score={candidate.matchBreakdown.culture}
                  verdict={
                    candidate.matchBreakdown.culture >= 70 ? "strong"
                    : candidate.matchBreakdown.culture >= 45 ? "moderate"
                    : "weak"
                  }
                />
                <SkillRow
                  skill="Seniority Alignment"
                  score={candidate.matchBreakdown.seniority}
                  verdict={
                    candidate.matchBreakdown.seniority >= 70 ? "strong"
                    : candidate.matchBreakdown.seniority >= 45 ? "moderate"
                    : "weak"
                  }
                />
              </div>
            </div>
          )}

          {/* Per-skill breakdown */}
          {candidate.skillBreakdown && candidate.skillBreakdown.length > 0 && (
            <div>
              <SectionLabel>Skill Scores</SectionLabel>
              <div className="space-y-3">
                {candidate.skillBreakdown.map((s) => (
                  <SkillRow
                    key={s.skill}
                    skill={s.skill}
                    score={s.score}
                    verdict={s.verdict}
                  />
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Candidate Info */}
          <div>
            <SectionLabel>Candidate Info</SectionLabel>
            <div className="space-y-2.5">
              <a
                href={`mailto:${candidate.email}`}
                className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-brand-500 transition-colors group"
              >
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-brand-400" />
                {candidate.email}
              </a>

              {candidate.phone && (
                <a
                  href={`tel:${candidate.phone}`}
                  className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-brand-500 transition-colors group"
                >
                  <Phone className="w-4 h-4 text-slate-400 group-hover:text-brand-400" />
                  {candidate.phone}
                </a>
              )}

              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Source</span>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {candidate.source}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Priority</span>
                  <PriorityIcon priority={candidate.priority} />
                  <span className="text-xs font-medium text-slate-600 capitalize">
                    {candidate.priority}
                  </span>
                </div>
              </div>

              {candidate.resumeUrl && (
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                >
                  View Resume
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <Separator />

          {/* Boolean Strings */}
          {candidate.booleanStrings && candidate.booleanStrings.length > 0 && (
            <div>
              <SectionLabel>Boolean Search Strings</SectionLabel>
              <div className="space-y-2">
                {candidate.booleanStrings.map((str, i) => (
                  <BooleanChip key={i} value={str} />
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Stage Mover */}
          <StageMover candidate={candidate} />

          <Separator />

          {/* Notes */}
          <div>
            <SectionLabel>Recruiter Notes</SectionLabel>
            <textarea
              value={displayNotes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              placeholder="Add notes about this candidate..."
              rows={4}
              className="w-full text-sm text-slate-700 placeholder:text-slate-300 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition-all"
            />
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
