"use client";

/**
 * HireMIQ — Draggable Candidate Card
 * =====================================
 * Renders a single candidate in the Kanban board.
 * Uses useSortable for drag handle, transform, and isDragging state.
 * When isDragging=true, renders a ghost placeholder (preserves column height).
 * Clicking the card (not dragging) opens the detail drawer.
 */

import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useKanbanStore } from "@/store/use-kanban-store";
import { type PipelineCandidate } from "@/types/kanban";
import { GripVertical, Flame, ArrowUp, ArrowDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Color-coded Match IQ badge */
function MatchBadge({ score }: { score: number }) {
  const { bg, text, label } =
    score >= 80
      ? { bg: "bg-emerald-50", text: "text-emerald-600", label: "Strong" }
      : score >= 60
        ? { bg: "bg-amber-50", text: "text-amber-600", label: "Good" }
        : score >= 40
          ? { bg: "bg-orange-50", text: "text-orange-600", label: "Fair" }
          : { bg: "bg-red-50", text: "text-red-500", label: "Weak" };

  return (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${bg}`}
      title={`Match IQ: ${score}% — ${label}`}
    >
      <span className={`text-xs font-bold tabular-nums ${text}`}>
        {score}%
      </span>
    </div>
  );
}

/** Source tag pill */
function SourceTag({ source }: { source: PipelineCandidate["source"] }) {
  const labels: Record<PipelineCandidate["source"], string> = {
    naukri:   "Naukri",
    linkedin: "LinkedIn",
    indeed:   "Indeed",
    referral: "Referral",
    internal: "Internal",
    other:    "Other",
  };
  const colors: Record<PipelineCandidate["source"], string> = {
    naukri:   "bg-blue-50 text-blue-600",
    linkedin: "bg-sky-50 text-sky-600",
    indeed:   "bg-violet-50 text-violet-600",
    referral: "bg-teal-50 text-teal-600",
    internal: "bg-slate-100 text-slate-600",
    other:    "bg-slate-100 text-slate-500",
  };

  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${colors[source]}`}>
      {labels[source]}
    </span>
  );
}

/** Priority icon indicator */
function PriorityBadge({ priority }: { priority: PipelineCandidate["priority"] }) {
  if (priority === "high")
    return (
      <span title="High priority">
        <Flame className="w-3.5 h-3.5 text-red-400" aria-label="High priority" />
      </span>
    );
  if (priority === "medium")
    return (
      <span title="Medium priority">
        <ArrowUp className="w-3.5 h-3.5 text-amber-400" aria-label="Medium priority" />
      </span>
    );
  return (
    <span title="Low priority">
      <ArrowDown className="w-3.5 h-3.5 text-slate-300" aria-label="Low priority" />
    </span>
  );
}

/** Avatar with fallback initials */
function Avatar({ name, url }: { name: string; url?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  // Deterministic color from name hash
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
      style={{ background: `hsl(${hue}, 55%, 52%)` }}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface CandidateCardProps {
  candidate: PipelineCandidate;
  /** True when rendered inside DragOverlay (disables sortable wiring) */
  isOverlay?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

function CandidateCardInner({ candidate, isOverlay = false }: CandidateCardProps) {
  const selectCandidate = useKanbanStore((s) => s.selectCandidate);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: candidate.id,
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  /* ── Ghost placeholder while dragging ── */
  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[116px] rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/40"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "group relative bg-white rounded-xl border border-slate-200",
        "shadow-sm hover:shadow-md hover:border-brand-200",
        "transition-all duration-200 cursor-pointer",
        isOverlay ? "shadow-2xl border-brand-300" : "",
      ].join(" ")}
      onClick={() => !isOverlay && selectCandidate(candidate.id)}
      role="button"
      tabIndex={0}
      aria-label={`${candidate.name}, ${candidate.jobTitle} at ${candidate.clientName}, Match IQ ${candidate.matchScore}%`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!isOverlay) selectCandidate(candidate.id);
        }
      }}
    >
      {/* ── Drag handle (visible on hover) ── */}
      <button
        {...attributes}
        {...listeners}
        className={[
          "absolute left-1.5 top-1/2 -translate-y-1/2",
          "p-1 rounded-md text-slate-300 hover:text-slate-500 hover:bg-slate-100",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
          "cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-brand-300",
        ].join(" ")}
        aria-label="Drag to reorder"
        onClick={(e) => e.stopPropagation()} // prevent card click when grabbing handle
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>

      {/* ── Card Content ── */}
      <div className="p-3 pl-7">
        {/* Row 1: Avatar + Name + Priority */}
        <div className="flex items-start gap-2.5 mb-2">
          <Avatar name={candidate.name} url={candidate.avatarUrl} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                {candidate.name}
              </p>
              <PriorityBadge priority={candidate.priority} />
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {candidate.email}
            </p>
          </div>
        </div>

        {/* Row 2: Job Title + Client */}
        <div className="mb-2.5">
          <p className="text-xs font-medium text-slate-600 truncate">
            {candidate.jobTitle}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {candidate.clientName}
          </p>
        </div>

        {/* Row 3: Match IQ + Source tag */}
        <div className="flex items-center justify-between gap-2">
          <MatchBadge score={candidate.matchScore} />
          <SourceTag source={candidate.source} />
        </div>
      </div>
    </div>
  );
}

export const CandidateCard = memo(CandidateCardInner);
