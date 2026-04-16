"use client";

/**
 * HireMIQ — Kanban Column (Droppable)
 * =====================================
 * Each column is a droppable zone identified by its PipelineStage string.
 * Cards inside use SortableContext for within-column reordering.
 * The column never re-renders when other columns change — Zustand's
 * selector ensures it only subscribes to its own ID array.
 */

import { useMemo, memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useKanbanStore } from "@/store/use-kanban-store";
import { STAGE_META, type PipelineStage } from "@/types/kanban";
import { CandidateCard } from "./candidate-card";
import {
  Search,
  Filter,
  ClipboardCheck,
  Calendar,
  Gift,
  UserCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Icon map (matches STAGE_META icon strings)                        */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  Filter,
  ClipboardCheck,
  Calendar,
  Gift,
  UserCheck,
  XCircle,
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface KanbanColumnProps {
  stage: PipelineStage;
  /** True when a card is being dragged over this column */
  isOver: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function KanbanColumnInner({ stage, isOver }: KanbanColumnProps) {
  const meta = STAGE_META[stage];
  const Icon = ICON_MAP[meta.icon] ?? Search;

  /* Stable direct store reads — no selector wrapping needed for object refs */
  const columnIds  = useKanbanStore((s) => s.columns[stage]) ?? [];
  const candidates = useKanbanStore((s) => s.candidates);
  const filters    = useKanbanStore((s) => s.filters);
  const count      = columnIds.length;

  /* Derive filtered IDs — only recomputes when deps change */
  const candidateIds = useMemo(() => {
    if (!columnIds.length) return [];
    return columnIds.filter((id) => {
      const c = candidates[id];
      if (!c) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!`${c.name} ${c.jobTitle} ${c.clientName} ${c.email}`.toLowerCase().includes(q)) return false;
      }
      if (filters.source   !== "all" && c.source   !== filters.source)   return false;
      if (filters.priority !== "all" && c.priority !== filters.priority) return false;
      if (filters.jobId    !== "all" && c.jobId    !== filters.jobId)    return false;
      return true;
    });
  }, [columnIds, candidates, filters]);

  /* ── Make this element a drop target ── */
  const { setNodeRef } = useDroppable({ id: stage });

  return (
    <div
      className="flex flex-col flex-shrink-0 w-72"
      role="group"
      aria-label={`${meta.label} column, ${count} candidates`}
    >
      {/* ── Column Header ── */}
      <div className="flex items-center gap-2.5 mb-3 px-1">
        {/* Colored stage icon */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${meta.color}18` }}
        >
          <Icon
            className="w-3.5 h-3.5"
            style={{ color: meta.color }}
            aria-hidden="true"
          />
        </div>

        {/* Stage label */}
        <h3 className="text-sm font-semibold text-slate-700 leading-none flex-1 truncate">
          {meta.label}
        </h3>

        {/* Count badge */}
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
          style={{
            backgroundColor: `${meta.color}15`,
            color: meta.color,
          }}
        >
          {count}
        </span>
      </div>

      {/* ── Drop Zone ── */}
      <div
        ref={setNodeRef}
        className={[
          "flex-1 flex flex-col gap-2.5 rounded-2xl p-2 min-h-[520px]",
          "transition-colors duration-200",
          isOver
            ? "bg-brand-50 ring-2 ring-brand-300 ring-inset"
            : "bg-slate-100/70",
        ].join(" ")}
      >
        {/* ── Sortable context for within-column reorder ── */}
        <SortableContext
          items={candidateIds}
          strategy={verticalListSortingStrategy}
        >
          {candidateIds.map((id) => {
            const candidate = candidates[id];
            if (!candidate) return null;
            return <CandidateCard key={id} candidate={candidate} />;
          })}
        </SortableContext>

        {/* ── Empty state ── */}
        {candidateIds.length === 0 && (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-2 py-10 rounded-xl border-2 border-dashed"
            style={{ borderColor: `${meta.color}30` }}
            aria-label={`No candidates in ${meta.label}`}
          >
            <Icon
              className="w-6 h-6 opacity-25"
              style={{ color: meta.color }}
              aria-hidden="true"
            />
            <p className="text-xs text-slate-400 font-medium text-center px-4">
              {isOver ? "Drop here" : "No candidates"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const KanbanColumn = memo(KanbanColumnInner);
