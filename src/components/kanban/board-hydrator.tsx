"use client";

/**
 * HireMIQ — Board Hydrator
 * ==========================
 * Client component that hydrates the Zustand store on first mount,
 * then renders the full pipeline board.
 *
 * Replace `hydrate([])` with a Supabase fetch (server action)
 * when the DB is ready — no other file changes needed.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useKanbanStore } from "@/store/use-kanban-store";
import { BoardContainer } from "./board-container";
import { PipelineHeader } from "./pipeline-header";
import { FileSearch, Kanban, Users } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Board Hydrator Component                                           */
/* ------------------------------------------------------------------ */

export function BoardHydrator() {
  const hydrate      = useKanbanStore((s) => s.hydrate);
  const isLoading    = useKanbanStore((s) => s.isLoading);
  const candidates   = useKanbanStore((s) => s.candidates);
  const hydrated     = useRef(false);
  const isEmpty      = !isLoading && Object.keys(candidates).length === 0;

  useEffect(() => {
    // Guard against double-hydration (React StrictMode / hot reload)
    if (hydrated.current) return;
    hydrated.current = true;
    hydrate([]); // TODO: replace with Supabase fetch when DB is ready
  }, []); // empty deps — run exactly once on mount

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-brand-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">
            Loading pipeline…
          </p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <PipelineHeader />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center mx-auto mb-5">
              <Kanban className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Pipeline is empty</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Candidates appear here after you run a JD analysis and click
              <strong className="text-slate-700"> Add to Pipeline</strong> on a Match IQ result.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/workspace"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                <FileSearch className="w-4 h-4" />
                Analyze a JD
              </Link>
              <a
                href="/help"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
              >
                <Users className="w-4 h-4" />
                How it works
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PipelineHeader />
      <div className="flex-1 overflow-hidden p-4">
        <BoardContainer />
      </div>
    </div>
  );
}
