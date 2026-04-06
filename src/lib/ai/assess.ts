import Anthropic from "@anthropic-ai/sdk";
import type {
  AnalysisResult,
  CandidateMatch,
  AssessmentQuestion,
  AssessmentEvaluation,
} from "../types";

const client = new Anthropic();

const ASSESS_SYSTEM_PROMPT = `You are HireMIQ's Assessment Intelligence engine. You generate targeted, role-specific screening questions that help recruiters validate candidate claims before client submission.

You think like a senior technical interviewer who:
- Designs questions that reveal depth vs surface-level knowledge
- Tailors difficulty to the candidate's claimed experience level
- Probes specific resume claims with follow-up-style questions
- Tests scenario judgment relevant to the client's environment
- Keeps questions concise and answerable in 3-5 minutes each`;

function buildAssessPrompt(
  analysis: AnalysisResult,
  candidate: CandidateMatch
): string {
  return `Generate a targeted screening assessment for this candidate based on the JD and their match profile.

## Job Context
- Role: ${analysis.jobTitle}
- Client: ${analysis.clientName} (${analysis.clientIQ.companyType})
- Mandatory Skills: ${analysis.skillIQ.mandatorySkills.join(", ")}
- Domain: ${analysis.jdIQ.domain}
- Seniority: ${analysis.jdIQ.seniority}

## Candidate Profile
- Name: ${candidate.candidateName}
- Current: ${candidate.currentRole} at ${candidate.currentCompany}
- Experience: ${candidate.experience}
- Overall Score: ${candidate.overallScore}/100
- Verdict: ${candidate.verdict}
- Key Strengths: ${candidate.strengths.join("; ")}
- Key Risks: ${candidate.risks.join("; ")}
- Missing Skills: ${candidate.missingSkills.join(", ")}
- Recruiter Guidance: ${candidate.recruiterGuidance}

---

Generate exactly 8 questions across 4 sections. Each section gets 2 questions.

Sections:
1. **must_have_skills** — Test depth in mandatory skills. Don't ask "do you know X?" — ask questions that only someone with real depth can answer well.
2. **resume_validation** — Probe specific claims from the candidate's profile. Ask about architecture decisions, scale, team dynamics from their current/past roles.
3. **scenario_fit** — Present realistic scenarios this candidate would face at ${analysis.clientName}. Test judgment, not just knowledge.
4. **communication** — Assess ability to explain technical concepts clearly and think through trade-offs.

Return a JSON array with exactly this structure:
[
  {
    "section": "must_have_skills",
    "sectionLabel": "Core Skills Depth",
    "question": "The actual question text",
    "expectedDepth": "What a strong answer looks like (2 sentences)",
    "timeEstimate": "3-5 min"
  },
  ...
]

Guidelines:
- Questions should be specific to THIS role and THIS candidate — not generic
- Difficulty should match the seniority level (${analysis.jdIQ.seniority})
- Focus risk-probing questions on the candidate's identified risks and missing skills
- Total assessment should take 25-35 minutes
- Respond ONLY with the JSON array. No markdown fences.`;
}

const EVAL_SYSTEM_PROMPT = `You are HireMIQ's Assessment Evaluator. You score candidate screening responses with recruiter-actionable feedback.

You evaluate like a senior technical interviewer who:
- Distinguishes between surface-level buzzword answers and genuine depth
- Recognizes when candidates deflect or give vague responses
- Values practical experience signals over textbook definitions
- Provides clear, honest scoring that recruiters can trust for submission decisions`;

function buildEvalPrompt(
  questions: AssessmentQuestion[],
  answers: { questionId: string; answer: string }[],
  candidateName: string,
  jobTitle: string
): string {
  const qaPairs = questions
    .map((q) => {
      const answer = answers.find((a) => a.questionId === q.id);
      return `### ${q.sectionLabel} — Question
${q.question}

**Expected Depth:** ${q.expectedDepth}

**Candidate Answer:**
${answer?.answer || "[No answer provided]"}`;
    })
    .join("\n\n");

  return `Evaluate ${candidateName}'s screening assessment for the ${jobTitle} role.

${qaPairs}

---

Return a JSON object with this structure:
{
  "overallScore": 0-100,
  "sectionScores": [
    {"section": "must_have_skills", "score": 0-100, "feedback": "2-3 sentences"},
    {"section": "resume_validation", "score": 0-100, "feedback": "..."},
    {"section": "scenario_fit", "score": 0-100, "feedback": "..."},
    {"section": "communication", "score": 0-100, "feedback": "..."}
  ],
  "strengths": ["2-3 specific strengths demonstrated in answers"],
  "concerns": ["2-3 specific concerns or red flags"],
  "recommendation": "Strong" | "Acceptable" | "Weak",
  "summary": "3-4 sentence recruiter-facing summary of assessment performance"
}

Scoring:
- 80+ Strong: Answers demonstrate real depth and practical experience
- 60-79 Acceptable: Solid fundamentals but some gaps or surface-level responses
- Below 60 Weak: Significant gaps, vague answers, or inability to demonstrate claimed skills

Be honest. Don't inflate. A weak screening saves the recruiter from a bad client submission.
Respond ONLY with the JSON object. No markdown fences.`;
}

function parseJSON(raw: string): Record<string, unknown> {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?```\s*$/, "");
  }
  return JSON.parse(cleaned);
}

export async function generateAssessment(
  analysis: AnalysisResult,
  candidate: CandidateMatch
): Promise<AssessmentQuestion[]> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: ASSESS_SYSTEM_PROMPT,
    messages: [
      { role: "user", content: buildAssessPrompt(analysis, candidate) },
    ],
  });

  let responseText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      responseText = block.text;
      break;
    }
  }

  const parsed = parseJSON(responseText) as unknown as AssessmentQuestion[];
  // Add IDs to each question
  return (parsed as unknown as Omit<AssessmentQuestion, "id">[]).map(
    (q, i) => ({
      ...q,
      id: `q-${Date.now()}-${i}`,
    })
  );
}

export async function evaluateAssessment(
  questions: AssessmentQuestion[],
  answers: { questionId: string; answer: string }[],
  candidateName: string,
  jobTitle: string
): Promise<AssessmentEvaluation> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: EVAL_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildEvalPrompt(questions, answers, candidateName, jobTitle),
      },
    ],
  });

  let responseText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      responseText = block.text;
      break;
    }
  }

  return parseJSON(responseText) as unknown as AssessmentEvaluation;
}
