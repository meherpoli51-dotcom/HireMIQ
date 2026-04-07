// ─── Anti-Cheat Logs ─────────────────────────────────────────────────────────

export interface AntiCheatEvent {
  timestamp: string;   // ISO timestamp
  count: number;
}

export interface AntiCheatLogs {
  tab_blur: AntiCheatEvent[];    // candidate switched away from tab
  copy_paste: AntiCheatEvent[];  // clipboard paste detected in answer fields
}

// ─── Assessment Status ───────────────────────────────────────────────────────

export type AssessmentStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "REVIEWED"
  | "FLAGGED";

// ─── Discriminated Union: Assessment ─────────────────────────────────────────
// Each status branch enforces which fields are present — e.g. integrity_score
// and anti_cheat_logs only exist once the candidate has submitted.

export type Assessment =
  | {
      status: "PENDING";
      id: string;
      candidate_id: string;
      job_id: string;
      created_at: string;
      expires_at: string;
      questions: AssessmentQuestion[];
    }
  | {
      status: "IN_PROGRESS";
      id: string;
      candidate_id: string;
      job_id: string;
      created_at: string;
      expires_at: string;
      questions: AssessmentQuestion[];
      started_at: string;
      anti_cheat_logs: AntiCheatLogs;
    }
  | {
      status: "SUBMITTED";
      id: string;
      candidate_id: string;
      job_id: string;
      created_at: string;
      expires_at: string;
      questions: AssessmentQuestion[];
      started_at: string;
      submitted_at: string;
      answers: AssessmentAnswer[];
      anti_cheat_logs: AntiCheatLogs;
      integrity_score: number;   // 0–100; AI-computed post-submission
    }
  | {
      status: "REVIEWED";
      id: string;
      candidate_id: string;
      job_id: string;
      created_at: string;
      expires_at: string;
      questions: AssessmentQuestion[];
      started_at: string;
      submitted_at: string;
      reviewed_at: string;
      answers: AssessmentAnswer[];
      anti_cheat_logs: AntiCheatLogs;
      integrity_score: number;
      reviewer_notes?: string;
    }
  | {
      status: "FLAGGED";
      id: string;
      candidate_id: string;
      job_id: string;
      created_at: string;
      expires_at: string;
      questions: AssessmentQuestion[];
      started_at: string;
      submitted_at: string;
      flagged_at: string;
      answers: AssessmentAnswer[];
      anti_cheat_logs: AntiCheatLogs;
      integrity_score: number;
      flag_reason: string;
    };

// ─── Question & Answer ───────────────────────────────────────────────────────

export type QuestionType = "MCQ" | "CODING" | "SHORT_ANSWER" | "SYSTEM_DESIGN";

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  time_limit_seconds?: number;
  points: number;
}

export interface AssessmentAnswer {
  question_id: string;
  response: string;
  time_taken_seconds: number;
  ai_score?: number;    // 0–100; null until AI grades it
  ai_feedback?: string;
}
