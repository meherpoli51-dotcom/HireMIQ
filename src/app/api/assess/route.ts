import { NextRequest, NextResponse } from "next/server";
import { generateAssessment } from "@/lib/ai/assess";
import { mockAssessment, mockAssessmentQuestions } from "@/lib/mock-data";
import type { AnalysisResult, CandidateMatch, Assessment } from "@/lib/types";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your-api-key-here") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json({
        ...mockAssessment,
        id: `assess-${Date.now()}`,
        candidateId: candidate.id,
        candidateName: candidate.candidateName,
        jobTitle: analysis.jobTitle,
        clientName: analysis.clientName,
        token: crypto.randomBytes(24).toString("hex"),
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        _mock: true,
      });
    }

    // Real assessment generation
    const questions = await generateAssessment(analysis, candidate);
    const token = crypto.randomBytes(24).toString("hex");

    const assessment: Assessment = {
      id: `assess-${Date.now()}`,
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

  // In production, this would query a database
  // For now, return mock data for any token
  const assessment = {
    id: mockAssessment.id,
    candidateName: mockAssessment.candidateName,
    jobTitle: mockAssessment.jobTitle,
    clientName: mockAssessment.clientName,
    questions: mockAssessmentQuestions.map((q) => ({
      id: q.id,
      section: q.section,
      sectionLabel: q.sectionLabel,
      question: q.question,
      timeEstimate: q.timeEstimate,
    })),
    timeLimitMinutes: mockAssessment.timeLimitMinutes,
    status: mockAssessment.status,
  };

  return NextResponse.json(assessment);
}
