import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisResult, CandidateMatch } from "../types";

const client = new Anthropic();

const MATCH_SYSTEM_PROMPT = `You are HireMIQ's Candidate Match Intelligence engine — an elite AI that scores candidate resumes against job requirements.

You are NOT a keyword matcher. You think like a senior recruiter with 15 years of experience who understands:
- The difference between listing a skill and actually having depth in it
- How project experience signals real capability
- Why company background matters for client fit
- How stability patterns affect submission risk
- That the same candidate scores differently for a GCC vs a startup vs a product company

Your scoring must be honest, explainable, and actionable. A recruiter is betting their reputation on your assessment.`;

function buildMatchPrompt(analysis: AnalysisResult, resumeText: string): string {
  return `Analyze this candidate resume against the job requirement and produce a detailed match assessment.

## Job Requirement Context
- Role: ${analysis.jobTitle}
- Client: ${analysis.clientName}
- Client Type: ${analysis.clientIQ.companyType}
- Industry: ${analysis.clientIQ.industry}
- Mandatory Skills: ${analysis.skillIQ.mandatorySkills.join(", ")}
- Secondary Skills: ${analysis.skillIQ.secondarySkills.join(", ")}
- Experience Required: ${analysis.jdIQ.experienceRequired}
- Domain: ${analysis.jdIQ.domain}
- Seniority: ${analysis.jdIQ.seniority}
- Role Overview: ${analysis.jdIQ.roleOverview}

## Candidate Resume
${resumeText}

---

Score this candidate across 7 dimensions. Each dimension has a score (0-100), a weight (importance relative to this specific role), and reasoning.

The weights should reflect THIS role's priorities — a DevOps role weights skills differently than a frontend role.

IMPORTANT: Client type matters. Consider how this candidate's background aligns with the client type (${analysis.clientIQ.companyType}). A candidate from TCS may be a great fit for a GCC but a poor fit for a Series A startup. Score accordingly.

Return a JSON object with exactly this structure:
{
  "candidateName": "Full name from resume",
  "currentRole": "Current or most recent title",
  "currentCompany": "Current or most recent company",
  "experience": "Total years of experience (e.g., '6 years')",
  "location": "Location from resume",
  "noticePeriod": "If mentioned, otherwise 'Not specified'",

  "dimensions": {
    "skillMatch": {"score": 0-100, "weight": 0.0-1.0, "label": "Skill Match", "reasoning": "2-3 sentences explaining the score"},
    "roleRelevance": {"score": 0-100, "weight": 0.0-1.0, "label": "Role Relevance", "reasoning": "..."},
    "projectRelevance": {"score": 0-100, "weight": 0.0-1.0, "label": "Project Relevance", "reasoning": "..."},
    "clientFit": {"score": 0-100, "weight": 0.0-1.0, "label": "Client Fit", "reasoning": "Why this candidate does or doesn't fit this specific client type"},
    "stability": {"score": 0-100, "weight": 0.0-1.0, "label": "Stability", "reasoning": "Job tenure patterns, frequency of switches"},
    "domainFit": {"score": 0-100, "weight": 0.0-1.0, "label": "Domain Fit", "reasoning": "..."},
    "experienceFit": {"score": 0-100, "weight": 0.0-1.0, "label": "Experience Fit", "reasoning": "..."}
  },

  "overallScore": 0-100,
  "submissionReadiness": "High" | "Medium" | "Low",

  "strengths": ["3-5 specific strengths relevant to this role"],
  "risks": ["2-4 specific risks or concerns"],
  "missingSkills": ["Skills required by the JD that the candidate lacks"],
  "recruiterGuidance": "3-4 sentences of practical guidance — what to probe in screening, what to highlight to the client, what to watch out for",
  "verdict": "Screen" | "Submit" | "Reject",
  "verdictReason": "One clear sentence explaining the verdict"
}

Scoring guidelines:
- overallScore = weighted average of dimension scores
- submissionReadiness: High (score >= 75 AND no critical gaps), Medium (60-74 OR has manageable gaps), Low (< 60 OR has dealbreaker gaps)
- verdict: Submit (High readiness, strong match), Screen (Medium readiness, needs validation), Reject (Low readiness, fundamental mismatch)

Be honest. A score of 45 is fine if the candidate is weak. Don't inflate.
Respond ONLY with the JSON object. No markdown fences, no explanation.`;
}

function parseJSON(raw: string): Record<string, unknown> {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  return JSON.parse(cleaned);
}

export async function matchCandidate(
  analysis: AnalysisResult,
  resumeText: string,
  resumeFileName: string
): Promise<CandidateMatch> {
  // Trim resume to first 6000 chars — key info is always at top
  const trimmedResume = resumeText.length > 6000
    ? resumeText.substring(0, 6000) + "\n\n[Resume truncated for processing speed]"
    : resumeText;

  const response = await client.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 3000,
    system: MATCH_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildMatchPrompt(analysis, trimmedResume),
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

  const parsed = parseJSON(responseText);

  return {
    id: `candidate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    resumeFileName,
    ...parsed,
  } as unknown as CandidateMatch;
}
