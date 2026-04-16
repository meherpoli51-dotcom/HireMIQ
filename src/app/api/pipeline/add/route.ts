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
    const { candidate, analysis } = body as {
      candidate: CandidateMatch;
      analysis: AnalysisResult;
    };

    if (!candidate || !analysis) {
      return NextResponse.json({ error: "Candidate and analysis are required" }, { status: 400 });
    }

    const db = createServerClient() as any;

    // Save candidate to Supabase
    const { data, error } = await db.from("candidates").insert({
      analysis_id: analysis.id,
      user_id: userId,
      resume_file_name: candidate.resumeFileName,
      match_result: candidate as unknown as Record<string, unknown>,
    }).select("id").single();

    if (error) {
      console.error("Pipeline add error:", error);
      // If analysis doesn't exist in DB yet (e.g. no Supabase), still return success
      // so the UI pipeline works via Zustand
    }

    return NextResponse.json({
      success: true,
      candidateDbId: (data as any)?.id ?? null,
    });
  } catch (err) {
    console.error("Pipeline add error:", err);
    return NextResponse.json({ error: "Failed to add to pipeline" }, { status: 500 });
  }
}
