import { NextRequest, NextResponse } from "next/server";
import { matchCandidate } from "@/lib/ai/match";
import { mockCandidateMatches } from "@/lib/mock-data";
import type { AnalysisResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysis, resumes } = body as {
      analysis: AnalysisResult;
      resumes: { fileName: string; text: string }[];
    };

    if (!analysis || !resumes?.length) {
      return NextResponse.json(
        { error: "Analysis result and at least one resume are required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your-api-key-here") {
      // Return mock data — one per uploaded resume, cycling through mocks
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockResults = resumes.map(
        (r: { fileName: string; text: string }, i: number) => ({
          ...mockCandidateMatches[i % mockCandidateMatches.length],
          id: `candidate-${Date.now()}-${i}`,
          resumeFileName: r.fileName,
        })
      );
      return NextResponse.json({ candidates: mockResults, _mock: true });
    }

    // Real Claude-powered matching — process all resumes in parallel
    const candidates = await Promise.all(
      resumes.map((r: { fileName: string; text: string }) =>
        matchCandidate(analysis, r.text, r.fileName)
      )
    );

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error("Match error:", error);
    const message =
      error instanceof Error ? error.message : "Candidate matching failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
