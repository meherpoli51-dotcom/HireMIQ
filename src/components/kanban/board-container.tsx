"use client";

/**
 * HireMIQ — Kanban Board Container
 * ==================================
 * Owns the DnD context and routes drag events to the Zustand store.
 * Children (columns + cards) are purely presentational — they declare
 * droppable/draggable IDs but never touch drag state directly.
 *
 * DnD Strategy:
 * - DragOverlay renders a frozen "ghost" card while dragging (no layout shift)
 * - onDragOver handles real-time column highlighting
 * - onDragEnd commits the move to the store (optimistic update)
 */

import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { useKanbanStore } from "@/store/use-kanban-store";
import { PIPELINE_STAGES, type PipelineStage } from "@/types/kanban";
import { KanbanColumn } from "./kanban-column";
import { CandidateCard } from "./candidate-card";
import { CandidateDrawer } from "./candidate-drawer";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Given a draggable/droppable ID, determine which stage it belongs to.
 * Card IDs  → look up candidate's current stage.
 * Column IDs → the stage IS the id.
 */
function resolveStage(
  id: string,
  candidateStages: Record<string, PipelineStage>,
): PipelineStage | null {
  if (id in candidateStages) return candidateStages[id];
  if (PIPELINE_STAGES.includes(id as PipelineStage))
    return id as PipelineStage;
  return null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function BoardContainer() {
  const { candidates, columns, moveCandidate, reorderInColumn } =
    useKanbanStore();

  /** ID of the card currently being dragged (for DragOverlay) */
  const [activeId, setActiveId] = useState<string | null>(null);

  /**
   * Live "over" stage while dragging — used to highlight the target
   * column before the card is dropped.
   */
  const [overStage, setOverStage] = useState<PipelineStage | null>(null);

  /* ── Sensor config ── */
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require a 5px drag before activating (prevents mis-clicks)
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /* ── Candidate stage lookup (memoized to avoid recalc on every render) ── */
  const candidateStages = useMemo<Record<string, PipelineStage>>(() => {
    const map: Record<string, PipelineStage> = {};
    for (const [id, c] of Object.entries(candidates)) {
      map[id] = c.stage;
    }
    return map;
  }, [candidates]);

  /* ── Drag Start ── */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  /* ── Drag Over (real-time column highlight) ── */
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const overId = event.over ? String(event.over.id) : null;
      if (!overId) {
        setOverStage(null);
        return;
      }
      const stage = resolveStage(overId, candidateStages);
      setOverStage(stage);
    },
    [candidateStages],
  );

  /* ── Drag End (commit move to store) ── */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setOverStage(null);

      if (!over) return;

      const candidateId = String(active.id);
      const overId = String(over.id);

      const fromStage = candidateStages[candidateId];
      const toStage = resolveStage(overId, candidateStages);

      if (!fromStage || !toStage) return;

      // Determine drop index inside target column
      const targetColumn = columns[toStage];
      let newIndex = targetColumn.length; // default: end of column

      if (overId !== toStage) {
        // Dropped over another card — insert before/after it
        const overIndex = targetColumn.indexOf(overId);
        if (overIndex !== -1) newIndex = overIndex;
      }

      if (fromStage === toStage) {
        // Same-column reorder
        const fromIndex = columns[fromStage].indexOf(candidateId);
        if (fromIndex !== -1 && fromIndex !== newIndex) {
          reorderInColumn(fromStage, fromIndex, newIndex);
        }
      } else {
        // Cross-column move
        moveCandidate({ candidateId, fromStage, toStage, newIndex });
      }
    },
    [candidateStages, columns, moveCandidate, reorderInColumn],
  );

  /* ── Active (dragging) candidate for overlay ── */
  const activeCandidate = activeId ? candidates[activeId] : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* ── Horizontal scrollable board ── */}
        <div
          className="flex gap-4 h-full overflow-x-auto pb-4 px-1"
          role="region"
          aria-label="Recruitment pipeline kanban board"
        >
          {PIPELINE_STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              isOver={overStage === stage}
            />
          ))}
        </div>

        {/* ── Drag ghost overlay (frozen snapshot of the card) ── */}
        <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
          {activeCandidate ? (
            <div className="rotate-2 opacity-90 pointer-events-none">
              <CandidateCard candidate={activeCandidate} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* ── Detail drawer (renders outside DnD context intentionally) ── */}
      <CandidateDrawer />
    </>
  );
}
