/**
 * HireMIQ — Recruitment Pipeline Page
 * ======================================
 * Server component wrapper. Delegates all interactivity to
 * BoardHydrator (client). Swap generateMockCandidates() for a
 * Supabase server action here when the DB is wired up.
 */

import { Metadata } from "next";
import { BoardHydrator } from "@/components/kanban/board-hydrator";

export const metadata: Metadata = {
  title: "Pipeline — HireMIQ",
  description: "Track candidates across every stage of your recruitment pipeline.",
};

export default function PipelinePage() {
  return (
    // Full-height flex column — header is sticky inside BoardHydrator
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">
      <BoardHydrator />
    </div>
  );
}
