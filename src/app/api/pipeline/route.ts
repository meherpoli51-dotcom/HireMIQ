import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { resolveUserId } from "@/lib/api-utils";

/**
 * GET /api/pipeline — Load all pipeline candidates for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = await resolveUserId(session.user.id || "", session.user.email);
    if (!userId) {
      return NextResponse.json({ candidates: [] });
    }

    const db = createServerClient() as any;

    const { data, error } = await db
      .from("candidates")
      .select(`
        id,
        analysis_id,
        user_id,
        resume_file_name,
        candidate_name,
        match_score,
        verdict,
        pipeline_stage,
        match_result,
        created_at
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.warn("Pipeline fetch error:", error.message);
      return NextResponse.json({ candidates: [] });
    }

    // Transform DB rows into PipelineCandidate format
    const candidates = (data ?? []).map((row: any) => {
      const match = row.match_result || {};
      return {
        id: row.id,
        name: row.candidate_name || match.candidateName || "Unknown",
        email: "",
        matchScore: row.match_score || match.overallScore || 0,
        matchBreakdown: {
          skills: match.dimensions?.skillMatch?.score ?? row.match_score ?? 0,
          culture: match.dimensions?.clientFit?.score ?? row.match_score ?? 0,
          seniority: match.dimensions?.experienceFit?.score ?? row.match_score ?? 0,
        },
        source: "other",
        priority: (row.match_score ?? 0) >= 75 ? "high" : (row.match_score ?? 0) >= 50 ? "medium" : "low",
        stage: row.pipeline_stage || "sourced",
        order: 0,
        jobId: row.analysis_id || "",
        jobTitle: match.currentRole || "",
        clientName: match.currentCompany || "",
        resumeFileName: row.resume_file_name || "",
        verdict: row.verdict || match.verdict || "Screen",
        matchResult: match,
        createdAt: row.created_at,
        updatedAt: row.created_at,
        movedAt: row.created_at,
      };
    });

    return NextResponse.json({ candidates });
  } catch (err) {
    console.error("Pipeline fetch error:", err);
    return NextResponse.json({ candidates: [] });
  }
}
