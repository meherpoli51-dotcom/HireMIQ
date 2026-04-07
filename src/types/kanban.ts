/**
 * HireMIQ — Kanban Pipeline Types
 * ================================
 * Single source of truth for all pipeline data structures.
 * Maps 1:1 to future Supabase tables (candidates, jobs, pipeline_entries).
 *
 * Architecture decision: We use a normalized flat structure (CandidateMap +
 * ColumnMap) instead of nested arrays. This gives O(1) lookups during drag
 * events and prevents React re-renders on unaffected columns.
 */

/* ------------------------------------------------------------------ */
/*  Pipeline Stages (7 fixed columns)                                  */
/* ------------------------------------------------------------------ */

export const PIPELINE_STAGES = [
  "sourced",
  "screened",
  "assessment_sent",
  "interview_scheduled",
  "offered",
  "joined",
  "rejected",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

/** Display metadata for each column header */
export const STAGE_META: Record<
  PipelineStage,
  { label: string; color: string; icon: string }
> = {
  sourced:             { label: "Sourced",              color: "#6366f1", icon: "Search" },
  screened:            { label: "Screened",             color: "#8b5cf6", icon: "Filter" },
  assessment_sent:     { label: "Assessment Sent",      color: "#f59e0b", icon: "ClipboardCheck" },
  interview_scheduled: { label: "Interview Scheduled",  color: "#3b82f6", icon: "Calendar" },
  offered:             { label: "Offered",              color: "#10b981", icon: "Gift" },
  joined:              { label: "Joined",               color: "#059669", icon: "UserCheck" },
  rejected:            { label: "Rejected",             color: "#ef4444", icon: "XCircle" },
};

/* ------------------------------------------------------------------ */
/*  Source & Priority                                                  */
/* ------------------------------------------------------------------ */

export const CANDIDATE_SOURCES = [
  "naukri",
  "linkedin",
  "indeed",
  "referral",
  "internal",
  "other",
] as const;

export type CandidateSource = (typeof CANDIDATE_SOURCES)[number];

export type PriorityLevel = "high" | "medium" | "low";

/* ------------------------------------------------------------------ */
/*  Core Entity: Pipeline Candidate                                    */
/* ------------------------------------------------------------------ */

/** Individual skill match score from AI analysis */
export interface SkillScore {
  skill: string;
  score: number; // 0-100
  verdict: "strong" | "moderate" | "weak";
}

/** Match IQ breakdown (backward-compatible with existing MatchIQBreakdown) */
export interface MatchIQBreakdown {
  skills: number;     // 0-100
  culture: number;    // 0-100
  seniority: number;  // 0-100
}

/** Candidate card in the pipeline */
export interface PipelineCandidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  resumeText?: string;

  /** Match IQ score 0-100 from AI analysis */
  matchScore: number;

  /** Granular breakdown */
  matchBreakdown: MatchIQBreakdown;

  /** Where the candidate was sourced from */
  source: CandidateSource;

  /** Recruiter-assigned priority */
  priority: PriorityLevel;

  /** Current pipeline stage */
  stage: PipelineStage;

  /** Position order within the column (for DnD sorting) */
  order: number;

  /** Linked job/client context */
  jobId: string;
  jobTitle: string;
  clientName: string;

  /** AI-generated skill scores */
  skillBreakdown?: SkillScore[];

  /** AI-generated boolean strings used to source */
  booleanStrings?: string[];

  /** Recruiter notes */
  notes?: string;

  /** Timestamps (ISO strings) */
  createdAt: string;
  updatedAt: string;
  movedAt: string; // last stage transition
}

/* ------------------------------------------------------------------ */
/*  Normalized Store Types (for Zustand)                               */
/* ------------------------------------------------------------------ */

/** Column → ordered candidate IDs */
export type ColumnMap = Record<PipelineStage, string[]>;

/** Candidate ID → full candidate object */
export type CandidateMap = Record<string, PipelineCandidate>;

/** Filter state for pipeline header */
export interface PipelineFilters {
  search: string;
  source: CandidateSource | "all";
  priority: PriorityLevel | "all";
  jobId: string | "all";
}

/** Payload emitted on drag-end */
export interface DragPayload {
  candidateId: string;
  fromStage: PipelineStage;
  toStage: PipelineStage;
  newIndex: number;
}
