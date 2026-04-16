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
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          tier: 'free' | 'pro' | 'enterprise';
          logo_url: string | null;
          timezone: string;
          members_count: number;
          max_members: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          owner_id: string;
          tier?: 'free' | 'pro' | 'enterprise';
          logo_url?: string | null;
          timezone?: string;
          members_count?: number;
          max_members?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["workspaces"]["Insert"]>;
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'recruiter' | 'viewer';
          invited_at: string;
          accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'recruiter' | 'viewer';
          invited_at?: string;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["workspace_members"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          workspace_id: string;
          razorpay_subscription_id: string | null;
          razorpay_customer_id: string | null;
          status: 'pending' | 'active' | 'paused' | 'payment_failed' | 'cancelled' | 'expired';
          plan: 'free' | 'pro' | 'enterprise';
          amount_paisa: number | null;
          billing_cycle_start: string | null;
          billing_cycle_end: string | null;
          paid_until: string | null;
          attempted_charge_date: string | null;
          failure_reason: string | null;
          failure_count: number;
          started_at: string;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          razorpay_subscription_id?: string | null;
          razorpay_customer_id?: string | null;
          status?: 'pending' | 'active' | 'paused' | 'payment_failed' | 'cancelled' | 'expired';
          plan?: 'free' | 'pro' | 'enterprise';
          amount_paisa?: number | null;
          billing_cycle_start?: string | null;
          billing_cycle_end?: string | null;
          paid_until?: string | null;
          attempted_charge_date?: string | null;
          failure_reason?: string | null;
          failure_count?: number;
          started_at?: string;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      usage: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          action: 'jd_analyze' | 'candidate_assess' | 'resume_parse';
          resource_id: string | null;
          job_title: string | null;
          client_name: string | null;
          credits_consumed: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          action: 'jd_analyze' | 'candidate_assess' | 'resume_parse';
          resource_id?: string | null;
          job_title?: string | null;
          client_name?: string | null;
          credits_consumed?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["usage"]["Insert"]>;
      };
      usage_monthly_rollup: {
        Row: {
          id: string;
          workspace_id: string;
          year_month: string;
          total_jd_analyses: number;
          total_assessments: number;
          total_candidates_matched: number;
          credits_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          year_month: string;
          total_jd_analyses?: number;
          total_assessments?: number;
          total_candidates_matched?: number;
          credits_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["usage_monthly_rollup"]["Insert"]>;
      };
      credit_transactions: {
        Row: {
          id: string;
          workspace_id: string;
          transaction_type: 'monthly_reset' | 'usage_charge' | 'team_bonus' | 'rollover' | 'overage' | 'manual_adjustment';
          credits_delta: number;
          balance_before: number | null;
          balance_after: number | null;
          reason: string | null;
          related_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          transaction_type: 'monthly_reset' | 'usage_charge' | 'team_bonus' | 'rollover' | 'overage' | 'manual_adjustment';
          credits_delta: number;
          balance_before?: number | null;
          balance_after?: number | null;
          reason?: string | null;
          related_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_transactions"]["Insert"]>;
      };
      webhook_events: {
        Row: {
          id: string;
          event_type: string;
          source: string;
          entity_id: string | null;
          status: 'pending' | 'processed' | 'failed';
          error_message: string | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          event_type: string;
          source?: string;
          entity_id?: string | null;
          status?: 'pending' | 'processed' | 'failed';
          error_message?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["webhook_events"]["Insert"]>;
      };
    };
  };
}
