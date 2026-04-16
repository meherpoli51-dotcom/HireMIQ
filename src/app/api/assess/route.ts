import { NextRequest, NextResponse } from "next/server";
import { generateAssessment } from "@/lib/ai/assess";
import { auth } from "@/lib/auth";
import type { AnalysisResult, CandidateMatch, Assessment } from "@/lib/types";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Auth check — prevent unauthenticated API cost abuse
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { analysis, candidate } = body as {
      analysis: AnalysisResult;
      candidate: CandidateMatch;
    };

    if (!analysis || !candidate) {
      return NextResponse.json(
        { error: "Analysis and candidate data are required" },
        { status: 400 }
      );
    }

    const questions = await generateAssessment(analysis, candidate);
    const token = crypto.randomBytes(24).toString("hex");

    const assessment: Assessment = {
      id: crypto.randomUUID(),
      candidateId: candidate.id,
      candidateName: candidate.candidateName,
      jobTitle: analysis.jobTitle,
      clientName: analysis.clientName,
      questions,
      token,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      maxAttempts: 1,
      timeLimitMinutes: 35,
      status: "pending",
    };

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Assessment generation error:", error);
    const message =
      error instanceof Error ? error.message : "Assessment generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET — Fetch assessment by token (for candidate-facing page)
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Assessment token is required" },
      { status: 400 }
    );
  }

  // TODO: query database by token when Supabase is wired up
  return NextResponse.json(
    { error: "Assessment retrieval requires database setup" },
    { status: 501 }
  );
}
