"use client";

/**
 * HireMIQ — Pipeline Header & Filters
 * ======================================
 * Sticky header for the Kanban board with:
 *  - Page title + total candidate count
 *  - Live search (name, job, client)
 *  - Source filter (Naukri, LinkedIn, etc.)
 *  - Priority filter (High / Medium / Low)
 *  - Add Candidate button (placeholder for modal)
 *  - Column stats summary strip
 *
 * All filter actions write to Zustand — columns re-derive
 * their filtered ID lists on the next render automatically.
 */

import { useCallback, useRef } from "react";
import { useKanbanStore } from "@/store/use-kanban-store";
import {
  CANDIDATE_SOURCES,
  PIPELINE_STAGES,
  STAGE_META,
  type CandidateSource,
  type PriorityLevel,
} from "@/types/kanban";
import {
  Search,
  X,
  SlidersHorizontal,
  UserPlus,
  ChevronDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Tiny select wrapper (avoids importing full shadcn Select)         */
/* ------------------------------------------------------------------ */

interface NativeSelectProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
  children: React.ReactNode;
}

function NativeSelect({ value, onChange, label, children }: NativeSelectProps) {
  return (
    <div className="relative">
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "h-9 pl-3 pr-8 text-xs font-medium rounded-lg border appearance-none cursor-pointer",
          "bg-white border-slate-200 text-slate-600",
          "hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-300",
          "transition-colors duration-150",
        ].join(" ")}
        aria-label={label}
      >
        {children}
      </select>
      <ChevronDown
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats strip (cards per column)                                    */
/* ------------------------------------------------------------------ */

function StatsStrip() {
  const columns = useKanbanStore((s) => s.columns);

  return (
    <div
      className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-0.5"
      role="list"
      aria-label="Pipeline stage counts"
    >
      {PIPELINE_STAGES.map((stage) => {
        const meta = STAGE_META[stage];
        const count = columns[stage].length;
        if (count === 0) return null;

        return (
          <div
            key={stage}
            role="listitem"
            className="flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${meta.color}12`,
              color: meta.color,
            }}
            title={`${meta.label}: ${count} candidate${count !== 1 ? "s" : ""}`}
          >
            <span className="font-bold tabular-nums">{count}</span>
            <span className="opacity-80 hidden sm:inline">{meta.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Header                                                        */
/* ------------------------------------------------------------------ */

export function PipelineHeader() {
  const filters = useKanbanStore((s) => s.filters);
  const setFilters = useKanbanStore((s) => s.setFilters);
  const totalCandidates = useKanbanStore((s) => Object.keys(s.candidates).length);
  const hasActiveFilters =
    filters.search !== "" ||
    filters.source !== "all" ||
    filters.priority !== "all";

  const searchRef = useRef<HTMLInputElement>(null);

  /* Debounced search update */
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ search: e.target.value });
    },
    [setFilters],
  );

  const clearSearch = useCallback(() => {
    setFilters({ search: "" });
    searchRef.current?.focus();
  }, [setFilters]);

  const clearAllFilters = useCallback(() => {
    setFilters({ search: "", source: "all", priority: "all" });
  }, [setFilters]);

  return (
    <div className="flex-shrink-0 bg-white border-b border-slate-100 px-6 py-4 space-y-3">

      {/* ── Row 1: Title + Actions ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Recruitment Pipeline
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {totalCandidates} candidate{totalCandidates !== 1 ? "s" : ""} across all stages
            </p>
          </div>
        </div>

        {/* Add Candidate CTA */}
        <button
          className={[
            "flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-semibold",
            "bg-brand-500 hover:bg-brand-600 text-white",
            "shadow-sm shadow-brand-500/20 transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-1",
          ].join(" ")}
          aria-label="Add new candidate"
          onClick={() => {
            // TODO: open Add Candidate modal (Step 9)
          }}
        >
          <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Add Candidate</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── Row 2: Search + Filters ── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            type="search"
            value={filters.search}
            onChange={handleSearch}
            placeholder="Search candidates, roles, clients…"
            className={[
              "w-full h-9 pl-9 pr-8 text-xs rounded-lg border bg-white",
              "border-slate-200 text-slate-700 placeholder:text-slate-400",
              "hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-300",
              "transition-colors duration-150",
            ].join(" ")}
            aria-label="Search candidates"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source filter */}
        <NativeSelect
          value={filters.source}
          onChange={(v) =>
            setFilters({ source: v as CandidateSource | "all" })
          }
          label="Filter by source"
        >
          <option value="all">All Sources</option>
          {CANDIDATE_SOURCES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </NativeSelect>

        {/* Priority filter */}
        <NativeSelect
          value={filters.priority}
          onChange={(v) =>
            setFilters({ priority: v as PriorityLevel | "all" })
          }
          label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">⚪ Low</option>
        </NativeSelect>

        {/* Active filter indicator + clear */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className={[
              "flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold",
              "bg-brand-50 text-brand-600 border border-brand-200",
              "hover:bg-brand-100 transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-brand-300",
            ].join(" ")}
            aria-label="Clear all filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Clear filters
            <X className="w-3 h-3 ml-0.5" />
          </button>
        )}
      </div>

      {/* ── Row 3: Stage stats strip ── */}
      <StatsStrip />
    </div>
  );
}
