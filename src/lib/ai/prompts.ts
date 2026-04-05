import type { JDInput } from "../types";

export function buildAnalysisContext(input: JDInput): string {
  const parts: string[] = [];

  if (input.jobTitle) parts.push(`Job Title: ${input.jobTitle}`);
  if (input.clientName) parts.push(`Client/Company: ${input.clientName}`);
  if (input.endClient) parts.push(`End Client: ${input.endClient}`);
  if (input.location) parts.push(`Location: ${input.location}`);
  if (input.budgetMin || input.budgetMax) {
    parts.push(
      `Budget: ${input.budgetMin || "?"} - ${input.budgetMax || "?"} ${input.budgetType}`
    );
  }
  if (input.experienceMin || input.experienceMax) {
    parts.push(
      `Experience: ${input.experienceMin || "?"} - ${input.experienceMax || "?"} years`
    );
  }
  if (input.noticePeriod) parts.push(`Notice Period: ${input.noticePeriod}`);
  if (input.workMode) parts.push(`Work Mode: ${input.workMode}`);
  if (input.employmentType) parts.push(`Employment Type: ${input.employmentType}`);
  if (input.priorityLevel) parts.push(`Priority: ${input.priorityLevel}`);
  if (input.recruiterNotes) parts.push(`Recruiter Notes: ${input.recruiterNotes}`);

  const metadata = parts.length > 0 ? parts.join("\n") : "No additional metadata provided.";

  return `
## Structured Metadata
${metadata}

## Job Description Text
${input.jdText || "No JD text provided. Analyze based on the job title and metadata above."}
`.trim();
}

export const SYSTEM_PROMPT = `You are HireMIQ — an elite AI recruitment intelligence engine used by professional recruiters and staffing agencies.

You analyze job descriptions and produce actionable recruiter intelligence. Your outputs must be:
- Specific and detailed (not generic)
- Immediately actionable by a recruiter
- Written in recruiter language, not HR jargon
- Based on real industry knowledge
- Honest about what's missing or unclear in the JD

You are not a chatbot. You are a precision intelligence tool. Every word you output should help a recruiter source and close candidates faster.`;

export const JD_IQ_PROMPT = `Analyze this job description and produce a structured JD Intelligence report.

Return a JSON object with exactly these fields:
{
  "roleTitle": "The actual role title (clean it up if the JD title is messy)",
  "seniority": "Seniority level (e.g., 'Junior', 'Mid-Level', 'Senior (L5/L6)', 'Staff', 'Principal', 'Lead', 'Director')",
  "experienceRequired": "Experience range (e.g., '5-8 years')",
  "domain": "Industry/domain (e.g., 'FinTech / Digital Payments')",
  "roleOverview": "A clear 3-4 sentence summary of what this role actually is, written for a recruiter who needs to quickly understand the position",
  "responsibilities": ["Array of 5-8 key responsibilities, written clearly"],
  "missingInformation": ["Array of 3-6 things that are unclear, missing, or ambiguous in the JD that a recruiter should clarify with the hiring manager"],
  "recruiterInterpretation": "Your honest interpretation of this role — what the client really wants, what kind of candidate would succeed, interview expectations, and any red flags. Write this like advice from a senior recruiter to a junior one."
}`;

export const CLIENT_IQ_PROMPT = `Analyze the hiring company/client from this job description and produce Client Intelligence.

Based on the JD text, company name, and any context clues, infer as much as possible about the client.

Return a JSON object with exactly these fields:
{
  "companyType": "Company type (e.g., 'Product / FinTech Startup (Series C)', 'GCC / Enterprise', 'IT Services / Consulting', 'Product Company / SaaS')",
  "industry": "Primary industry and sub-domain",
  "hiringStyle": "How this company likely hires — pace, bar, process style. 2-3 sentences.",
  "candidateSellingPoints": ["Array of 5-7 reasons a candidate would want to join this company. Be specific, not generic."],
  "workCultureSummary": "A realistic 2-3 sentence summary of the likely work culture based on JD signals",
  "interviewExpectations": "What the interview process likely looks like — rounds, format, timeline. Be specific.",
  "candidateObjectionRisks": ["Array of 3-5 objections candidates might raise about this opportunity. Be honest."],
  "recruiterPitchAngle": "How should a recruiter pitch this opportunity to candidates? What's the hook? What story should they tell? Write 3-4 sentences."
}`;

export const SKILL_IQ_PROMPT = `Analyze the skills, technologies, and qualifications in this job description.

Return a JSON object with exactly these fields:
{
  "mandatorySkills": ["Array of 5-8 skills that are clearly mandatory / must-have"],
  "secondarySkills": ["Array of 4-6 skills that are important but not absolute dealbreakers"],
  "niceToHaveSkills": ["Array of 3-5 skills that would be a bonus but not required"],
  "toolsPlatforms": ["Array of 4-6 specific tools, platforms, or technologies mentioned or implied"],
  "searchKeywords": ["Array of 6-8 search keywords a recruiter should use to find candidates for this role"],
  "alternativeJobTitles": ["Array of 5-7 alternative job titles that candidates for this role might currently hold"],
  "candidateFitGuidance": "A 3-4 sentence guide for recruiters on what the ideal candidate looks like, what to prioritize in screening, and what trade-offs are acceptable."
}`;

export const TARGET_IQ_PROMPT = `Identify target companies for sourcing candidates for this role.

Based on the role, skills, domain, and location, identify companies where ideal candidates likely work.

Return a JSON object with exactly these fields:
{
  "idealCompanies": ["Array of 6-10 companies that are the best source of candidates for this exact role. These should be specific company names, not categories."],
  "similarCompanies": ["Array of 6-8 companies in a similar domain/tech stack that would also have relevant talent"],
  "adjacentCompanies": ["Array of 6-8 companies from adjacent industries where transferable talent exists"],
  "avoidCompanies": ["Array of 3-4 company types or specific companies to avoid sourcing from, with brief reasons"],
  "talentPoolStrategy": "A 3-4 sentence strategy for how to approach the talent pool — where to focus first, secondary pools, and any creative sourcing angles."
}`;

export const SOURCE_IQ_PROMPT = `Generate Boolean search strings for recruiting this role.

Create precise, ready-to-use Boolean search strings for three platforms: LinkedIn, Naukri, and Google X-Ray.

For each platform, create variants:
- Strict: Very targeted, will return fewer but highly relevant results
- Balanced: Good mix of precision and volume
- Broad: Wider net for larger talent pools

Return a JSON object with exactly this structure:
{
  "booleanStrings": [
    {"platform": "LinkedIn", "label": "Strict", "query": "the actual boolean string"},
    {"platform": "LinkedIn", "label": "Balanced", "query": "the actual boolean string"},
    {"platform": "LinkedIn", "label": "Broad", "query": "the actual boolean string"},
    {"platform": "Naukri", "label": "Strict", "query": "the actual boolean string"},
    {"platform": "Naukri", "label": "Balanced", "query": "the actual boolean string"},
    {"platform": "Google X-Ray", "label": "Strict", "query": "the actual boolean string using site:linkedin.com/in/"},
    {"platform": "Google X-Ray", "label": "Balanced", "query": "the actual boolean string"},
    {"platform": "Google X-Ray", "label": "Broad", "query": "the actual boolean string"}
  ]
}

Make sure the Boolean strings use proper syntax with AND, OR, NOT, quotes, and parentheses. They must be copy-paste ready.`;

export const REACH_IQ_PROMPT = `Generate candidate outreach messages for recruiting this role.

Create professional, personalized outreach templates that a recruiter can immediately use.

Use these placeholders: {{first_name}}, {{current_company}}, {{recruiter_name}}

Return a JSON object with exactly this structure:
{
  "messages": [
    {
      "type": "Email — Initial Outreach",
      "subject": "A compelling email subject line",
      "body": "The full email body. Professional but human. Not generic. Reference specific aspects of the role and company that would attract candidates."
    },
    {
      "type": "LinkedIn — Connection Message",
      "body": "A concise LinkedIn connection/InMail message. Must be under 300 characters for connection requests, or a full InMail. Professional, specific, not spammy."
    },
    {
      "type": "WhatsApp — Short Pitch",
      "body": "A casual but professional WhatsApp message. Short, direct, conversational. Include the key hook."
    },
    {
      "type": "Follow-up — Email",
      "subject": "A follow-up subject line",
      "body": "A follow-up email for candidates who didn't respond to the initial outreach. Add urgency or new information without being pushy."
    }
  ]
}

The messages should be specific to this role, not generic templates. Reference the actual company, role, tech stack, and selling points.`;
