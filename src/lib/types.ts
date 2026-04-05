export interface JDInput {
  jobTitle: string;
  jdText: string;
  clientName: string;
  endClient: string;
  location: string;
  budgetMin: string;
  budgetMax: string;
  budgetType: string;
  experienceMin: string;
  experienceMax: string;
  noticePeriod: string;
  workMode: string;
  employmentType: string;
  priorityLevel: string;
  recruiterNotes: string;
}

export interface JDIQOutput {
  roleTitle: string;
  seniority: string;
  experienceRequired: string;
  domain: string;
  roleOverview: string;
  responsibilities: string[];
  missingInformation: string[];
  recruiterInterpretation: string;
}

export interface ClientIQOutput {
  companyType: string;
  industry: string;
  hiringStyle: string;
  candidateSellingPoints: string[];
  workCultureSummary: string;
  interviewExpectations: string;
  candidateObjectionRisks: string[];
  recruiterPitchAngle: string;
}

export interface SkillIQOutput {
  mandatorySkills: string[];
  secondarySkills: string[];
  niceToHaveSkills: string[];
  toolsPlatforms: string[];
  searchKeywords: string[];
  alternativeJobTitles: string[];
  candidateFitGuidance: string;
}

export interface TargetIQOutput {
  idealCompanies: string[];
  similarCompanies: string[];
  adjacentCompanies: string[];
  avoidCompanies: string[];
  talentPoolStrategy: string;
}

export interface BooleanString {
  platform: string;
  label: "Strict" | "Broad" | "Balanced";
  query: string;
}

export interface SourceIQOutput {
  booleanStrings: BooleanString[];
}

export interface OutreachMessage {
  type: string;
  subject?: string;
  body: string;
}

export interface ReachIQOutput {
  messages: OutreachMessage[];
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  jobTitle: string;
  clientName: string;
  status: "completed" | "processing" | "failed";
  jdIQ: JDIQOutput;
  clientIQ: ClientIQOutput;
  skillIQ: SkillIQOutput;
  targetIQ: TargetIQOutput;
  sourceIQ: SourceIQOutput;
  reachIQ: ReachIQOutput;
}

export interface WorkspaceCard {
  id: string;
  jobTitle: string;
  clientName: string;
  location: string;
  createdAt: string;
  status: "completed" | "processing" | "draft";
  priorityLevel: string;
  workMode: string;
}

// ─── Candidate Match Intelligence ───

export interface DimensionScore {
  score: number; // 0-100
  weight: number; // 0-1
  label: string;
  reasoning: string;
}

export interface CandidateMatch {
  id: string;
  candidateName: string;
  currentRole: string;
  currentCompany: string;
  experience: string;
  location: string;
  noticePeriod: string;
  resumeFileName: string;

  overallScore: number; // 0-100
  submissionReadiness: "High" | "Medium" | "Low";

  dimensions: {
    skillMatch: DimensionScore;
    roleRelevance: DimensionScore;
    projectRelevance: DimensionScore;
    clientFit: DimensionScore;
    stability: DimensionScore;
    domainFit: DimensionScore;
    experienceFit: DimensionScore;
  };

  strengths: string[];
  risks: string[];
  missingSkills: string[];
  recruiterGuidance: string;
  verdict: "Screen" | "Submit" | "Reject";
  verdictReason: string;
}

// ─── AI Assessment Engine ───

export interface AssessmentQuestion {
  id: string;
  section: "must_have_skills" | "resume_validation" | "scenario_fit" | "communication";
  sectionLabel: string;
  question: string;
  expectedDepth: string;
  timeEstimate: string;
}

export interface Assessment {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  clientName: string;
  questions: AssessmentQuestion[];
  token: string;
  expiresAt: string;
  maxAttempts: number;
  timeLimitMinutes: number;
  status: "pending" | "in_progress" | "completed" | "expired";
}

export interface AssessmentResponse {
  assessmentId: string;
  candidateName: string;
  answers: { questionId: string; answer: string }[];
  submittedAt: string;
  evaluation?: AssessmentEvaluation;
}

export interface AssessmentEvaluation {
  overallScore: number;
  sectionScores: {
    section: string;
    score: number;
    feedback: string;
  }[];
  strengths: string[];
  concerns: string[];
  recommendation: "Strong" | "Acceptable" | "Weak";
  summary: string;
}
