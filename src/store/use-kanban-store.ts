/**
 * HireMIQ — Kanban Pipeline Store (Zustand)
 * ===========================================
 * Normalized store: O(1) candidate lookups, O(1) column mutations.
 * Drag-and-drop updates are optimistic — UI moves instantly,
 * Supabase sync will be added as middleware later.
 */

import { create } from "zustand";
import {
  type PipelineCandidate,
  type PipelineStage,
  type CandidateMap,
  type ColumnMap,
  type PipelineFilters,
  type DragPayload,
  PIPELINE_STAGES,
} from "@/types/kanban";

/* ------------------------------------------------------------------ */
/*  Store Interface                                                    */
/* ------------------------------------------------------------------ */

interface KanbanState {
  /** Candidate ID → full object */
  candidates: CandidateMap;

  /** Stage → ordered array of candidate IDs */
  columns: ColumnMap;

  /** Active filters from pipeline header */
  filters: PipelineFilters;

  /** Currently selected candidate (for drawer) */
  selectedId: string | null;

  /** Loading state */
  isLoading: boolean;
}

interface KanbanActions {
  /** Hydrate store with candidates (from API / Supabase) */
  hydrate: (candidates: PipelineCandidate[]) => void;

  /** Move a candidate between stages (drag-and-drop) */
  moveCandidate: (payload: DragPayload) => void;

  /** Reorder within the same column */
  reorderInColumn: (
    stage: PipelineStage,
    oldIndex: number,
    newIndex: number,
  ) => void;

  /** Update filters */
  setFilters: (filters: Partial<PipelineFilters>) => void;

  /** Select candidate for drawer */
  selectCandidate: (id: string | null) => void;

  /** Update a single candidate's fields */
  updateCandidate: (
    id: string,
    patch: Partial<PipelineCandidate>,
  ) => void;

  /** Add a new candidate to a stage */
  addCandidate: (candidate: PipelineCandidate) => void;

  /** Remove a candidate entirely */
  removeCandidate: (id: string) => void;

  /** Get filtered candidate IDs for a column */
  getFilteredColumn: (stage: PipelineStage) => string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Create empty column map */
function emptyColumns(): ColumnMap {
  return Object.fromEntries(
    PIPELINE_STAGES.map((s) => [s, [] as string[]]),
  ) as ColumnMap;
}

/** Default filter state */
const DEFAULT_FILTERS: PipelineFilters = {
  search: "",
  source: "all",
  priority: "all",
  jobId: "all",
};

/** Check if a candidate passes the current filters */
function passesFilter(
  c: PipelineCandidate,
  f: PipelineFilters,
): boolean {
  // Search filter (name, job title, client)
  if (f.search) {
    const q = f.search.toLowerCase();
    const haystack =
      `${c.name} ${c.jobTitle} ${c.clientName} ${c.email}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  // Source filter
  if (f.source !== "all" && c.source !== f.source) return false;

  // Priority filter
  if (f.priority !== "all" && c.priority !== f.priority) return false;

  // Job filter
  if (f.jobId !== "all" && c.jobId !== f.jobId) return false;

  return true;
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useKanbanStore = create<KanbanState & KanbanActions>()(
  (set, get) => ({
    /* ── State ── */
    candidates: {},
    columns: emptyColumns(),
    filters: DEFAULT_FILTERS,
    selectedId: null,
    isLoading: true,

    /* ── Actions ── */

    hydrate(candidateList) {
      const candidates: CandidateMap = {};
      const columns = emptyColumns();

      // Sort by order before inserting
      const sorted = [...candidateList].sort((a, b) => a.order - b.order);

      for (const c of sorted) {
        candidates[c.id] = c;
        columns[c.stage].push(c.id);
      }

      set({ candidates, columns, isLoading: false });
    },

    moveCandidate({ candidateId, fromStage, toStage, newIndex }) {
      set((state) => {
        const candidate = state.candidates[candidateId];
        if (!candidate) return state;

        const now = new Date().toISOString();

        // Clone affected columns
        const fromCol = [...state.columns[fromStage]];
        const toCol =
          fromStage === toStage
            ? fromCol
            : [...state.columns[toStage]];

        // Remove from source
        const oldIdx = fromCol.indexOf(candidateId);
        if (oldIdx !== -1) fromCol.splice(oldIdx, 1);

        // Insert at destination
        const clampedIndex = Math.min(newIndex, toCol.length);
        if (fromStage === toStage) {
          fromCol.splice(clampedIndex, 0, candidateId);
        } else {
          toCol.splice(clampedIndex, 0, candidateId);
        }

        return {
          candidates: {
            ...state.candidates,
            [candidateId]: {
              ...candidate,
              stage: toStage,
              order: clampedIndex,
              movedAt: now,
              updatedAt: now,
            },
          },
          columns: {
            ...state.columns,
            [fromStage]: fromCol,
            ...(fromStage !== toStage ? { [toStage]: toCol } : {}),
          },
        };
      });
    },

    reorderInColumn(stage, oldIndex, newIndex) {
      set((state) => {
        const col = [...state.columns[stage]];
        const [moved] = col.splice(oldIndex, 1);
        col.splice(newIndex, 0, moved);
        return {
          columns: { ...state.columns, [stage]: col },
        };
      });
    },

    setFilters(partial) {
      set((state) => ({
        filters: { ...state.filters, ...partial },
      }));
    },

    selectCandidate(id) {
      set({ selectedId: id });
    },

    updateCandidate(id, patch) {
      set((state) => {
        const existing = state.candidates[id];
        if (!existing) return state;
        return {
          candidates: {
            ...state.candidates,
            [id]: {
              ...existing,
              ...patch,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
    },

    addCandidate(candidate) {
      set((state) => ({
        candidates: {
          ...state.candidates,
          [candidate.id]: candidate,
        },
        columns: {
          ...state.columns,
          [candidate.stage]: [
            ...state.columns[candidate.stage],
            candidate.id,
          ],
        },
      }));
    },

    removeCandidate(id) {
      set((state) => {
        const candidate = state.candidates[id];
        if (!candidate) return state;

        const { [id]: _, ...rest } = state.candidates;
        return {
          candidates: rest,
          columns: {
            ...state.columns,
            [candidate.stage]: state.columns[candidate.stage].filter(
              (cid) => cid !== id,
            ),
          },
          // Close drawer if removing the selected candidate
          selectedId: state.selectedId === id ? null : state.selectedId,
        };
      });
    },

    getFilteredColumn(stage) {
      const { candidates, columns, filters } = get();
      return columns[stage].filter((id) => {
        const c = candidates[id];
        return c ? passesFilter(c, filters) : false;
      });
    },
  }),
);
