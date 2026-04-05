import { NextRequest, NextResponse } from "next/server";
import { evaluateAssessment } from "@/lib/ai/assess";
import { mockAssessmentQuestions } from "@/lib/mock-data";
import type { AssessmentQuestion, AssessmentEvaluation } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, candidateName, jobTitle, questions, answers } = body as {
      token: string;
      candidateName: string;
      jobTitle: string;
      questions: AssessmentQuestion[];
      answers: { questionId: string; answer: string }[];
    };

    if (!token || !answers?.length) {
      return NextResponse.json(
        { error: "Token and answers are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your-api-key-here") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockEval: AssessmentEvaluation = {
        overallScore: 74,
        sectionScores: [
          {
            section: "must_have_skills",
            score: 82,
            feedback:
              "Demonstrated strong React performance optimization knowledge and practical Node.js microservices experience. Answers showed depth beyond surface-level understanding.",
          },
          {
            section: "resume_validation",
            score: 78,
            feedback:
              "Provided specific examples from current role with concrete metrics. The incident response answer was well-structured and showed genuine ownership.",
          },
          {
            section: "scenario_fit",
            score: 68,
            feedback:
              "Showed pragmatic thinking on tech debt vs delivery but the code review scenario answer leaned slightly towards perfectionism. May need coaching on startup pace.",
          },
          {
            section: "communication",
            score: 70,
            feedback:
              "Good at explaining technical concepts but could be more concise. The database comparison answer was thorough but took a while to reach a conclusion.",
          },
        ],
        strengths: [
          "Deep practical knowledge of React performance patterns",
          "Strong incident response and production ownership mindset",
          "Specific, metrics-backed examples from real projects",
        ],
        concerns: [
          "May lean towards over-engineering when simpler solutions suffice",
          "Communication could be more concise for fast-paced startup environment",
        ],
        recommendation: "Acceptable",
        summary:
          "Candidate demonstrates solid technical depth and genuine production experience. Core skills are strong, particularly in React and system design. Some concerns around communication conciseness and tendency towards perfectionism in code reviews. Overall, a viable candidate who would benefit from a follow-up technical interview focused on practical problem-solving speed.",
      };
      return NextResponse.json({ evaluation: mockEval, _mock: true });
    }

    // Real evaluation
    const resolvedQuestions = questions || mockAssessmentQuestions;
    const evaluation = await evaluateAssessment(
      resolvedQuestions,
      answers,
      candidateName || "Candidate",
      jobTitle || "Role"
    );

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error("Assessment evaluation error:", error);
    const message =
      error instanceof Error ? error.message : "Evaluation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
