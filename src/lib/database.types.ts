export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string;
          user_id: string;
          job_title: string;
          client_name: string;
          location: string;
          work_mode: string;
          priority_level: string;
          status: string;
          result: Record<string, unknown> | null;
          input: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_title: string;
          client_name: string;
          location?: string;
          work_mode?: string;
          priority_level?: string;
          status?: string;
          result?: Record<string, unknown> | null;
          input: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["analyses"]["Insert"]>;
      };
      candidates: {
        Row: {
          id: string;
          analysis_id: string;
          user_id: string;
          resume_file_name: string;
          match_result: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          user_id: string;
          resume_file_name: string;
          match_result: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["candidates"]["Insert"]>;
      };
      assessments: {
        Row: {
          id: string;
          candidate_id: string;
          user_id: string;
          token: string;
          questions: Record<string, unknown>[];
          status: string;
          expires_at: string;
          time_limit_minutes: number;
          max_attempts: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          user_id: string;
          token: string;
          questions: Record<string, unknown>[];
          status?: string;
          expires_at: string;
          time_limit_minutes?: number;
          max_attempts?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assessments"]["Insert"]>;
      };
      assessment_responses: {
        Row: {
          id: string;
          assessment_id: string;
          answers: Record<string, unknown>[];
          evaluation: Record<string, unknown> | null;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          answers: Record<string, unknown>[];
          evaluation?: Record<string, unknown> | null;
          submitted_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["assessment_responses"]["Insert"]
        >;
      };
    };
  };
}
