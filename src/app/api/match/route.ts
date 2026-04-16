import { NextRequest, NextResponse } from "next/server";
import { matchCandidate } from "@/lib/ai/match";
import { auth } from "@/lib/auth";
import type { AnalysisResult } from "@/lib/types";

const MAX_RESUMES_PER_BATCH = 20;

export async function POST(request: NextRequest) {
  try {
    // Auth check — prevent unauthenticated API cost abuse
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Cap batch size to prevent API cost abuse
    if (resumes.length > MAX_RESUMES_PER_BATCH) {
      return NextResponse.json(
        { error: `Maximum ${MAX_RESUMES_PER_BATCH} resumes per batch` },
        { status: 400 }
      );
    }

    // Filter out empty resumes
    const validResumes = resumes.filter((r) => r.text?.trim().length > 0);
    if (!validResumes.length) {
      return NextResponse.json(
        { error: "All uploaded resumes are empty" },
        { status: 400 }
      );
    }

    const candidates = await Promise.all(
      validResumes.map((r) => matchCandidate(analysis, r.text, r.fileName))
    );

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error("Match error:", error);
    const message =
      error instanceof Error ? error.message : "Candidate matching failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
