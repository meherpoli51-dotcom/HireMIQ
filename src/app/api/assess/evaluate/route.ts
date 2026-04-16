import { NextRequest, NextResponse } from "next/server";
import { evaluateAssessment } from "@/lib/ai/assess";
import type { AssessmentQuestion, AssessmentEvaluation } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, candidateName, jobTitle, questions, answers, integrity } =
      body as {
        token: string;
        candidateName: string;
        jobTitle: string;
        questions: AssessmentQuestion[];
        answers: { questionId: string; answer: string }[];
        integrity?: {
          tabSwitches: number;
          pasteAttempts: number;
          copyAttempts: number;
          focusLostDuration: number;
          warnings: string[];
        };
      };

    if (!token || !answers?.length) {
      return NextResponse.json(
        { error: "Token and answers are required" },
        { status: 400 }
      );
    }

    const evaluation = await evaluateAssessment(
      questions,
      answers,
      candidateName || "Candidate",
      jobTitle || "Role"
    );

    return NextResponse.json({ evaluation, integrity: integrity || null });
  } catch (error) {
    console.error("Assessment evaluation error:", error);
    const message =
      error instanceof Error ? error.message : "Evaluation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
