import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { resolveUserId } from "@/lib/api-utils";
import type { CandidateMatch, AnalysisResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = await resolveUserId(session.user.id || "", session.user.email);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const body = await request.json();
    const { candidate, analysis, stage } = body as {
      candidate: CandidateMatch;
      analysis: AnalysisResult;
      stage?: string;
    };

    if (!candidate || !analysis) {
      return NextResponse.json({ error: "Candidate and analysis are required" }, { status: 400 });
    }

    const db = createServerClient() as any;

    // Verify analysis_id exists in DB before inserting
    let analysisId = analysis.id;
    const { data: existingAnalysis } = await db
      .from("analyses")
      .select("id")
      .eq("id", analysisId)
      .single();

    if (!existingAnalysis) {
      // Analysis not in DB — save it first
      const { data: newAnalysis } = await db.from("analyses").insert({
        user_id: userId,
        job_title: analysis.jobTitle || "",
        client_name: analysis.clientName || "",
        location: "",
        status: "completed",
        result: analysis as unknown as Record<string, unknown>,
      }).select("id").single();
      if (newAnalysis?.id) {
        analysisId = newAnalysis.id;
      } else {
        // Can't save without valid analysis_id — return error
        return NextResponse.json({
          success: false,
          error: "Could not persist analysis",
        }, { status: 500 });
      }
    }

    // Save candidate to Supabase with pipeline stage
    const pipelineStage = stage ||
      (candidate.verdict === "Submit" ? "sourced" : candidate.verdict === "Screen" ? "screened" : "rejected");

    const { data, error } = await db.from("candidates").insert({
      analysis_id: analysisId,
      user_id: userId,
      resume_file_name: candidate.resumeFileName,
      candidate_name: candidate.candidateName,
      match_score: candidate.overallScore,
      verdict: candidate.verdict,
      pipeline_stage: pipelineStage,
      match_result: candidate as unknown as Record<string, unknown>,
    }).select("id").single();

    if (error) {
      console.error("Pipeline add error:", error);
      return NextResponse.json({
        success: false,
        error: "Failed to save candidate to pipeline",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      candidateDbId: data?.id ?? null,
    });
  } catch (err) {
    console.error("Pipeline add error:", err);
    return NextResponse.json({ error: "Failed to add to pipeline" }, { status: 500 });
  }
}
