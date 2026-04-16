import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisResult, CandidateMatch } from "../types";

const client = new Anthropic();

const MATCH_SYSTEM_PROMPT = `You are HireMIQ's Candidate Match Intelligence engine — a seasoned senior recruitment consultant with 20+ years of experience in India's IT staffing industry.

Your job: evaluate whether a candidate is WORTH SUBMITTING to the client. You think like a business-minded recruiter, not a checkbox auditor.

CRITICAL SCORING PHILOSOPHY:

1. TRANSFERABLE SKILLS MATTER
   - Spring Boot experience counts toward Java skills even if "Core Java" isn't explicitly listed
   - React Native experience is relevant for React roles
   - AWS Lambda experience counts toward cloud/serverless even if Azure is specified
   - Data pipeline experience (Kafka, Spark) shows distributed systems capability
   - Don't penalize for using different but equivalent technologies

2. REAL-WORLD RECRUITER THINKING
   - A 7-year Java developer who worked on Spring Boot, Kafka, microservices IS a Java developer
   - If the JD says "Core Java" and the candidate has built production Java systems, that's a MATCH
   - Company pedigree matters: Publicis Sapient, TCS, Infosys, Wipro engineers have process discipline
   - Don't reject candidates who can clearly DO the job but use slightly different terminology

3. SCORING CALIBRATION (this is critical)
   - 80-100: Strong match, submit immediately
   - 65-79: Good match with minor gaps, worth screening
   - 50-64: Moderate match, has relevant foundation but needs validation
   - 35-49: Weak match, significant gaps
   - 0-34: No fit, completely different domain

   A candidate with 70%+ of required skills who works in the same technology ecosystem should score 65+.
   A candidate from the same domain with 5+ years relevant experience should never score below 50 unless they're in a completely different tech stack.

4. INDIA STAFFING CONTEXT
   - Most JDs are aspirational wishlists — candidates matching 60-70% of skills are routinely submitted and selected
   - Notice period, location, and budget fit matter as much as technical skills
   - Client type compatibility: GCC values process, startups value speed, product companies value depth
   - A candidate who interviews well can bridge 20-30% skill gaps within the first month`;

function buildMatchPrompt(analysis: AnalysisResult, resumeText: string): string {
  return `Analyze this candidate resume against the job requirement and produce a match assessment.

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

Score this candidate across 7 dimensions. Each dimension gets a score (0-100), weight (importance for THIS role), and reasoning.

BEFORE SCORING:
- List every skill the candidate has that's RELATED to the mandatory skills (even if not exact match)
- Consider the candidate's overall technology ecosystem — are they in the same world?
- Think: "Would a smart recruiter submit this profile?" If yes, score should be 60+.

Return a JSON object with exactly this structure:
{
  "candidateName": "Full name from resume",
  "currentRole": "Current or most recent title",
  "currentCompany": "Current or most recent company",
  "experience": "Total years of experience (e.g., '7 years')",
  "location": "Location from resume",
  "noticePeriod": "If mentioned, otherwise 'Not specified'",

  "dimensions": {
    "skillMatch": {"score": 0-100, "weight": 0.30, "label": "Skill Match", "reasoning": "2-3 sentences. Credit transferable and adjacent skills. If candidate has 5/7 mandatory skills, score should be 65-75, not 40."},
    "roleRelevance": {"score": 0-100, "weight": 0.25, "label": "Role Relevance", "reasoning": "Does their career trajectory align with this role?"},
    "projectRelevance": {"score": 0-100, "weight": 0.15, "label": "Project Relevance", "reasoning": "Have they built things similar to what this role requires?"},
    "clientFit": {"score": 0-100, "weight": 0.10, "label": "Client Fit", "reasoning": "Company background vs client type compatibility"},
    "stability": {"score": 0-100, "weight": 0.05, "label": "Stability", "reasoning": "Job tenure patterns. 2+ years per role is stable. Don't over-penalize."},
    "domainFit": {"score": 0-100, "weight": 0.10, "label": "Domain Fit", "reasoning": "Industry/domain alignment"},
    "experienceFit": {"score": 0-100, "weight": 0.05, "label": "Experience Fit", "reasoning": "Years of experience vs requirement. Within ±2 years is fine."}
  },

  "overallScore": 0-100,
  "submissionReadiness": "High | Medium | Low",

  "strengths": ["3-5 specific strengths relevant to this role"],
  "risks": ["2-3 specific risks or gaps — be constructive, not dismissive"],
  "missingSkills": ["Only list truly MISSING skills, not skills present under different names"],
  "recruiterGuidance": "3-4 sentences of practical advice: what to validate in screening, what to highlight to client, what the candidate should brush up on",
  "verdict": "Submit | Screen | Reject",
  "verdictReason": "One clear sentence explaining the verdict"
}

VERDICT RULES:
- Submit: overallScore >= 70, strong fit, submit to client with confidence
- Screen: overallScore 50-69, worth talking to, needs phone screen to validate gaps
- Reject: overallScore < 50, fundamental mismatch in domain/stack/level

IMPORTANT: Calculate overallScore as the weighted average of dimension scores using the weights provided.
A candidate in the right technology ecosystem with relevant experience should score 60-75 even if they don't match every keyword.

Respond ONLY with the JSON object. No markdown fences.`;
}

function parseJSON(raw: string): Record<string, unknown> {
  if (!raw || !raw.trim()) {
    throw new Error("Empty response from AI model");
  }
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse AI response:", cleaned.substring(0, 200));
    throw new Error("AI returned invalid JSON. Please try again.");
  }
}

export async function matchCandidate(
  analysis: AnalysisResult,
  resumeText: string,
  resumeFileName: string
): Promise<CandidateMatch> {
  // Guard against empty resumes (e.g., scanned image PDFs)
  if (!resumeText?.trim()) {
    throw new Error(`Resume "${resumeFileName}" is empty or could not be read`);
  }

  // Use more of the resume — 10K chars covers most resumes fully
  const trimmedResume = resumeText.length > 10000
    ? resumeText.substring(0, 10000) + "\n\n[Resume truncated — key content above]"
    : resumeText;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
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
