import type {
  AnalysisResult,
  JDIQOutput,
  ClientIQOutput,
  SkillIQOutput,
  TargetIQOutput,
  SourceIQOutput,
  ReachIQOutput,
  WorkspaceCard,
  CandidateMatch,
  Assessment,
  AssessmentQuestion,
} from "./types";

export const mockJDIQ: JDIQOutput = {
  roleTitle: "Senior Full Stack Engineer",
  seniority: "Senior (L5/L6)",
  experienceRequired: "5-8 years",
  domain: "FinTech / Digital Payments",
  roleOverview:
    "This is a senior full-stack engineering role focused on building and scaling a real-time payment processing platform. The candidate will own end-to-end feature delivery across a React + Node.js stack, work with microservices, and collaborate closely with product and design teams. Strong emphasis on system design, API architecture, and performance optimization.",
  responsibilities: [
    "Design and build scalable microservices for payment processing workflows",
    "Own frontend architecture using React/Next.js with TypeScript",
    "Build and maintain RESTful and GraphQL APIs",
    "Collaborate with product managers, designers, and QA engineers",
    "Participate in code reviews, architecture discussions, and sprint planning",
    "Implement monitoring, alerting, and observability across services",
    "Mentor junior engineers and contribute to engineering best practices",
  ],
  missingInformation: [
    "No mention of team size or reporting structure",
    "Unclear whether this is a new team or backfill",
    "No mention of on-call or production support expectations",
    "Database preferences not specified (SQL vs NoSQL)",
    "No clarity on deployment tooling (CI/CD stack)",
  ],
  recruiterInterpretation:
    "This is a strong IC role with leadership undertones. The client likely wants someone who can hit the ground running with minimal ramp-up. The FinTech domain means compliance and security awareness matter. Candidates from Razorpay, Paytm, PhonePe, Stripe backgrounds would be ideal. Expect 3-4 round interviews including a system design round.",
};

export const mockClientIQ: ClientIQOutput = {
  companyType: "Product / FinTech Startup (Series C)",
  industry: "Financial Technology — Digital Payments & Banking",
  hiringStyle:
    "Fast-paced, prefers candidates who can interview within 1 week. Bar is high for system design. Values startup mindset and ownership.",
  candidateSellingPoints: [
    "Series C funded with strong revenue growth (3x YoY)",
    "Engineering-first culture with modern tech stack",
    "Competitive compensation with meaningful ESOPs",
    "High-impact role — directly shaping core product",
    "Hybrid work model with flexible hours",
    "Strong leadership team with ex-Google, ex-Amazon engineers",
  ],
  workCultureSummary:
    "Fast-moving, low-bureaucracy environment. Engineers own features end-to-end. Weekly demos and biweekly sprints. Strong emphasis on code quality and testing. Regular hackathons and learning days.",
  interviewExpectations:
    "4 rounds — Coding (DSA), System Design, Technical Deep-Dive with Hiring Manager, Culture Fit with VP Engineering. Total process: 10-14 days. Expect take-home assignment for some roles.",
  candidateObjectionRisks: [
    "Startup risk — may concern candidates from large enterprises",
    "Below-market base salary offset by ESOPs (hard sell for risk-averse candidates)",
    "5-day office requirement for first 3 months (onboarding period)",
    "Fast pace may not suit candidates seeking work-life balance",
  ],
  recruiterPitchAngle:
    "Position this as a career-defining opportunity to build India's next payment infrastructure. Emphasize the engineering culture, tech stack modernity, and leadership team pedigree. Lead with the impact story — the candidate will directly shape a product used by 10M+ users.",
};

export const mockSkillIQ: SkillIQOutput = {
  mandatorySkills: [
    "React.js / Next.js",
    "Node.js / Express.js",
    "TypeScript",
    "REST API Design",
    "PostgreSQL or MongoDB",
    "System Design",
    "Git / CI-CD Pipelines",
  ],
  secondarySkills: [
    "GraphQL",
    "Docker / Kubernetes",
    "Redis / Message Queues",
    "AWS (EC2, S3, Lambda)",
    "Microservices Architecture",
    "Unit & Integration Testing",
  ],
  niceToHaveSkills: [
    "Payment gateway integration (Razorpay, Stripe)",
    "Event-driven architecture (Kafka / RabbitMQ)",
    "Performance profiling & optimization",
    "Technical writing / documentation",
    "Open-source contributions",
  ],
  toolsPlatforms: [
    "VS Code",
    "Jira / Linear",
    "Figma (for design collaboration)",
    "Datadog / Grafana",
    "GitHub Actions",
    "Postman / Insomnia",
  ],
  searchKeywords: [
    "full stack engineer",
    "senior software engineer",
    "react node developer",
    "fintech engineer",
    "payment platform developer",
    "typescript developer",
    "backend engineer node",
  ],
  alternativeJobTitles: [
    "Senior Software Engineer",
    "Full Stack Developer",
    "Software Engineer III",
    "Platform Engineer",
    "Product Engineer",
    "Backend Engineer (Node.js)",
  ],
  candidateFitGuidance:
    "Ideal candidate has 5+ years of hands-on experience with React and Node.js, has built and shipped production systems at scale, and understands the nuances of financial data handling. Look for candidates who have owned features end-to-end, not just worked on isolated tickets. Prior FinTech experience is a strong plus but not mandatory — strong system design skills can compensate.",
};

export const mockTargetIQ: TargetIQOutput = {
  idealCompanies: [
    "Razorpay",
    "Paytm",
    "PhonePe",
    "CRED",
    "Groww",
    "Zerodha",
    "Pine Labs",
    "BharatPe",
  ],
  similarCompanies: [
    "Cashfree",
    "Juspay",
    "Setu (by Pine Labs)",
    "Decentro",
    "M2P Fintech",
    "Open Financial",
    "Niyo",
    "Jupiter Money",
  ],
  adjacentCompanies: [
    "Flipkart",
    "Swiggy",
    "Zomato",
    "Meesho",
    "Ola",
    "Navi",
    "Slice",
    "KreditBee",
  ],
  avoidCompanies: [
    "Large IT services (TCS, Infosys, Wipro) — culture mismatch, slow pace",
    "Early-stage startups with <20 engineers — may lack depth needed",
    "Companies with known attrition issues in engineering",
  ],
  talentPoolStrategy:
    "Focus on FinTech product companies and well-funded startups (Series B+) in Bangalore and Mumbai. Secondary pool: strong engineers from e-commerce and consumer tech companies who want to move into FinTech. Don't overlook engineers from mid-size product companies like Freshworks, Zoho (product teams), and Postman — they often have strong fundamentals and are open to FinTech pivots.",
};

export const mockSourceIQ: SourceIQOutput = {
  booleanStrings: [
    {
      platform: "LinkedIn",
      label: "Strict",
      query: `("Senior Software Engineer" OR "Senior Full Stack Engineer" OR "Staff Engineer") AND ("React" OR "Next.js") AND ("Node.js" OR "Express") AND ("TypeScript") AND ("FinTech" OR "payments" OR "financial") AND ("Bangalore" OR "Bengaluru" OR "Mumbai")`,
    },
    {
      platform: "LinkedIn",
      label: "Balanced",
      query: `("Full Stack" OR "Software Engineer" OR "Product Engineer") AND ("React" AND "Node") AND ("5+ years" OR "senior" OR "lead") AND ("India")`,
    },
    {
      platform: "LinkedIn",
      label: "Broad",
      query: `("Software Engineer" OR "Developer") AND ("React" OR "Node.js") AND ("payments" OR "fintech" OR "banking") AND ("India")`,
    },
    {
      platform: "Naukri",
      label: "Strict",
      query: `"Senior Full Stack Engineer" AND "React.js" AND "Node.js" AND "TypeScript" AND ("Bangalore" OR "Mumbai") experience:5-8`,
    },
    {
      platform: "Naukri",
      label: "Balanced",
      query: `("Full Stack Developer" OR "Software Engineer") AND "React" AND "Node" AND ("Fintech" OR "Payments") experience:4-10`,
    },
    {
      platform: "Google X-Ray",
      label: "Strict",
      query: `site:linkedin.com/in/ "Senior Software Engineer" OR "Full Stack Engineer" "React" "Node.js" "TypeScript" "Razorpay" OR "Paytm" OR "PhonePe" OR "CRED" "Bangalore"`,
    },
    {
      platform: "Google X-Ray",
      label: "Balanced",
      query: `site:linkedin.com/in/ "Software Engineer" "React" "Node" "FinTech" OR "payments" "India"`,
    },
    {
      platform: "Google X-Ray",
      label: "Broad",
      query: `site:linkedin.com/in/ "full stack" "react" "node" "5 years" OR "6 years" OR "7 years" "India"`,
    },
  ],
};

export const mockReachIQ: ReachIQOutput = {
  messages: [
    {
      type: "Email — Initial Outreach",
      subject:
        "Senior Full Stack Role at a Leading FinTech — Impact at Scale",
      body: `Hi {{first_name}},

I came across your profile and was impressed by your experience with {{current_company}}. Your background in full-stack development and payment systems stands out.

I'm working with a Series C FinTech company that's building India's next-generation payment infrastructure. They're looking for a Senior Full Stack Engineer to own critical platform features — React/Next.js on the front, Node.js microservices on the back.

A few highlights:
• Engineering-first culture with ex-Google/Amazon leadership
• Modern stack: TypeScript, React, Node, PostgreSQL, Kubernetes
• Competitive comp + meaningful ESOPs
• Hybrid model, Bangalore-based

Would love to share more details if this sounds interesting. Open to a quick 10-min call this week?

Best,
{{recruiter_name}}`,
    },
    {
      type: "LinkedIn — Connection Message",
      body: `Hi {{first_name}}, I noticed your work at {{current_company}} — really impressive background in full-stack engineering. I'm hiring for a Senior Full Stack role at a well-funded FinTech startup (Series C, 10M+ users). Modern stack, strong engineering culture, competitive comp. Would love to share details if you're open to exploring. No pressure either way!`,
    },
    {
      type: "WhatsApp — Short Pitch",
      body: `Hey {{first_name}}! 👋 Quick one — I'm working on a Senior Full Stack Engineer role (React + Node) at a top FinTech startup. Series C, great engineering team, competitive package + ESOPs. Thought of you based on your background. Interested in hearing more?`,
    },
    {
      type: "Follow-up — Email",
      subject: "Re: Senior Full Stack Role — Quick Follow-up",
      body: `Hi {{first_name}},

Just circling back on my earlier note about the Senior Full Stack role at the FinTech company. I know timing is everything — if now isn't right, completely understand.

That said, they've just closed a strong quarter and are expanding the engineering team significantly. The hiring manager (VP Engineering, ex-Amazon) is personally involved in interviews, which usually signals a high-priority hire.

Happy to share the JD or jump on a quick call whenever convenient. No rush!

Best,
{{recruiter_name}}`,
    },
  ],
};

export const mockAnalysisResult: AnalysisResult = {
  id: "analysis-001",
  createdAt: "2026-04-05T10:30:00Z",
  jobTitle: "Senior Full Stack Engineer",
  clientName: "PayScale Technologies",
  status: "completed",
  jdIQ: mockJDIQ,
  clientIQ: mockClientIQ,
  skillIQ: mockSkillIQ,
  targetIQ: mockTargetIQ,
  sourceIQ: mockSourceIQ,
  reachIQ: mockReachIQ,
};

export const mockWorkspaceCards: WorkspaceCard[] = [
  {
    id: "ws-001",
    jobTitle: "Senior Full Stack Engineer",
    clientName: "PayScale Technologies",
    location: "Bangalore, India",
    createdAt: "2026-04-05",
    status: "completed",
    priorityLevel: "High",
    workMode: "Hybrid",
  },
  {
    id: "ws-002",
    jobTitle: "Staff Backend Engineer",
    clientName: "NeoBank Corp",
    location: "Mumbai, India",
    createdAt: "2026-04-04",
    status: "completed",
    priorityLevel: "Urgent",
    workMode: "Remote",
  },
  {
    id: "ws-003",
    jobTitle: "DevOps Lead",
    clientName: "CloudFirst India",
    location: "Hyderabad, India",
    createdAt: "2026-04-03",
    status: "processing",
    priorityLevel: "Medium",
    workMode: "Onsite",
  },
  {
    id: "ws-004",
    jobTitle: "React Native Developer",
    clientName: "HealthTech Solutions",
    location: "Pune, India",
    createdAt: "2026-04-02",
    status: "draft",
    priorityLevel: "Low",
    workMode: "Remote",
  },
  {
    id: "ws-005",
    jobTitle: "Data Engineer — Spark/Kafka",
    clientName: "DataMesh Analytics",
    location: "Bangalore, India",
    createdAt: "2026-04-01",
    status: "completed",
    priorityLevel: "High",
    workMode: "Hybrid",
  },
];

export const clientSuggestions = [
  "PayScale Technologies",
  "NeoBank Corp",
  "CloudFirst India",
  "HealthTech Solutions",
  "DataMesh Analytics",
  "Razorpay",
  "Paytm",
  "CRED",
  "Flipkart",
  "Swiggy",
  "Freshworks",
  "Zoho",
  "Postman",
  "PhonePe",
  "Groww",
];

export const locationSuggestions = [
  "Bangalore, India",
  "Mumbai, India",
  "Hyderabad, India",
  "Pune, India",
  "Delhi NCR, India",
  "Chennai, India",
  "Gurgaon, India",
  "Noida, India",
  "Kolkata, India",
  "Ahmedabad, India",
  "Remote — India",
  "Remote — Global",
];

export const mockCandidateMatches: CandidateMatch[] = [
  {
    id: "candidate-001",
    candidateName: "Arjun Mehta",
    currentRole: "Senior Software Engineer",
    currentCompany: "Razorpay",
    experience: "6 years",
    location: "Bangalore, India",
    noticePeriod: "30 Days",
    resumeFileName: "Arjun_Mehta_Resume.pdf",
    overallScore: 87,
    submissionReadiness: "High",
    dimensions: {
      skillMatch: { score: 92, weight: 0.25, label: "Skill Match", reasoning: "Strong match across all mandatory skills — React, Node.js, TypeScript, PostgreSQL, and system design. Has production experience with GraphQL and Docker/K8s as secondary skills." },
      roleRelevance: { score: 88, weight: 0.2, label: "Role Relevance", reasoning: "Currently a Senior SWE at Razorpay owning full-stack features end-to-end. Experience level and responsibilities closely mirror this role." },
      projectRelevance: { score: 90, weight: 0.15, label: "Project Relevance", reasoning: "Built and scaled Razorpay's merchant dashboard handling 50K+ daily active merchants. Direct payment platform experience is highly relevant." },
      clientFit: { score: 85, weight: 0.15, label: "Client Fit", reasoning: "Coming from a Series D FinTech, well-suited for a Series C startup culture. Understands fast-paced, ownership-driven environments." },
      stability: { score: 78, weight: 0.1, label: "Stability", reasoning: "3 years at Razorpay (current), 2 years at previous startup. Decent tenure pattern, though had a 10-month stint early career." },
      domainFit: { score: 95, weight: 0.1, label: "Domain Fit", reasoning: "Deep FinTech experience — payments, compliance, financial data handling. Exactly the domain background this role demands." },
      experienceFit: { score: 85, weight: 0.05, label: "Experience Fit", reasoning: "6 years experience fits the 5-8 year range. Seniority level aligns well with expectations." },
    },
    strengths: [
      "Direct payment platform experience at Razorpay — zero ramp-up on domain",
      "Full-stack ownership with React + Node.js in production at scale",
      "System design skills validated by building high-throughput merchant APIs",
      "FinTech compliance and security awareness baked in from current role",
    ],
    risks: [
      "May expect higher comp than budget — Razorpay pays well at senior level",
      "30-day notice period means 4-5 week joining timeline",
    ],
    missingSkills: ["Kafka/RabbitMQ (nice-to-have)"],
    recruiterGuidance: "Strong submit candidate. Probe on compensation expectations early — Razorpay's packages at L5 may exceed the 55 LPA ceiling. Highlight the equity upside and engineering culture. In the screening call, validate his system design depth by asking about a complex architecture decision he made at Razorpay.",
    verdict: "Submit",
    verdictReason: "Excellent skill-role-domain alignment with direct FinTech payment platform experience. High confidence submission.",
  },
  {
    id: "candidate-002",
    candidateName: "Priya Sharma",
    currentRole: "Software Engineer III",
    currentCompany: "Flipkart",
    experience: "5 years",
    location: "Bangalore, India",
    noticePeriod: "60 Days",
    resumeFileName: "Priya_Sharma_CV.pdf",
    overallScore: 72,
    submissionReadiness: "Medium",
    dimensions: {
      skillMatch: { score: 78, weight: 0.25, label: "Skill Match", reasoning: "Strong React and TypeScript skills. Node.js experience is present but secondary — primary backend work was in Java/Spring. PostgreSQL experience confirmed." },
      roleRelevance: { score: 75, weight: 0.2, label: "Role Relevance", reasoning: "SWE III at Flipkart with full-stack exposure, but most ownership has been on the frontend side. Backend contributions are team-based rather than individual ownership." },
      projectRelevance: { score: 70, weight: 0.15, label: "Project Relevance", reasoning: "Built Flipkart's checkout flow redesign (high-traffic, payment-adjacent). Not direct payment infrastructure, but understands transaction flows." },
      clientFit: { score: 72, weight: 0.15, label: "Client Fit", reasoning: "Flipkart is a large product company — transition to a Series C startup is viable but there may be cultural adjustment around pace and ambiguity." },
      stability: { score: 80, weight: 0.1, label: "Stability", reasoning: "3 years at Flipkart, 2 years at previous company. Clean tenure pattern with no short stints." },
      domainFit: { score: 60, weight: 0.1, label: "Domain Fit", reasoning: "E-commerce, not FinTech. Has payment-adjacent experience through checkout flows but no direct financial domain exposure." },
      experienceFit: { score: 75, weight: 0.05, label: "Experience Fit", reasoning: "5 years meets the minimum. May be perceived as slightly junior for 'Senior' expectations at a startup." },
    },
    strengths: [
      "Excellent React/TypeScript fundamentals from large-scale Flipkart frontend",
      "Experience with high-traffic, performance-critical applications",
      "Good stability pattern — low flight risk",
      "Checkout flow experience gives partial payment domain awareness",
    ],
    risks: [
      "Node.js is secondary skill — primary backend is Java/Spring",
      "60-day notice period is a long wait",
      "May need ramp-up on FinTech-specific compliance requirements",
      "Startup pace adjustment from large company culture",
    ],
    missingSkills: ["GraphQL", "Docker/Kubernetes (limited exposure)", "Payment gateway integration"],
    recruiterGuidance: "Screen before submitting. Key validation needed: how deep is her Node.js experience vs Java backend? Ask about a backend service she built independently in Node. If Node depth is shallow, this may not clear the technical bar. The 60-day notice is a concern — check if she can negotiate to 30 days. Position the FinTech angle as a growth opportunity.",
    verdict: "Screen",
    verdictReason: "Good frontend match but Node.js depth and FinTech domain gaps need validation before submission.",
  },
  {
    id: "candidate-003",
    candidateName: "Rahul Gupta",
    currentRole: "Associate Software Engineer",
    currentCompany: "Tata Consultancy Services",
    experience: "4 years",
    location: "Pune, India",
    noticePeriod: "90 Days",
    resumeFileName: "Rahul_Gupta_Resume.pdf",
    overallScore: 38,
    submissionReadiness: "Low",
    dimensions: {
      skillMatch: { score: 45, weight: 0.25, label: "Skill Match", reasoning: "Has React and Node listed but projects suggest basic CRUD-level usage. No TypeScript, no system design evidence. PostgreSQL mentioned but in a support/maintenance context." },
      roleRelevance: { score: 30, weight: 0.2, label: "Role Relevance", reasoning: "Associate-level role in a services company. Worked on client projects with pre-defined architectures — no feature ownership or end-to-end delivery experience." },
      projectRelevance: { score: 25, weight: 0.15, label: "Project Relevance", reasoning: "Projects are internal tools and client portals — no payment, financial, or scale-relevant experience." },
      clientFit: { score: 20, weight: 0.15, label: "Client Fit", reasoning: "TCS services background is a poor fit for a Series C FinTech startup. The pace, ambiguity, and ownership expectations are fundamentally different." },
      stability: { score: 55, weight: 0.1, label: "Stability", reasoning: "4 years at TCS — stable but this is common in services companies and doesn't signal commitment to product engineering." },
      domainFit: { score: 15, weight: 0.1, label: "Domain Fit", reasoning: "No FinTech or financial domain experience. Projects span healthcare and logistics client work." },
      experienceFit: { score: 40, weight: 0.05, label: "Experience Fit", reasoning: "4 years falls below the 5-year minimum. Title suggests 2-3 years equivalent product experience." },
    },
    strengths: [
      "4 years of professional coding experience",
      "Willingness to learn (multiple certifications listed)",
    ],
    risks: [
      "Skill depth is CRUD-level — won't clear senior technical bar",
      "TCS services culture is fundamentally misaligned with startup expectations",
      "90-day notice period",
      "Below minimum experience requirement",
      "No system design or architecture exposure",
    ],
    missingSkills: ["TypeScript", "System Design", "GraphQL", "Docker/K8s", "CI/CD", "Microservices", "Payment domain"],
    recruiterGuidance: "Do not submit. Fundamental mismatch on seniority, skill depth, client fit, and domain. This candidate needs 2-3 more years of product company experience before being viable for a role at this level. Would be a rejection at resume screening stage and risks your credibility with the client.",
    verdict: "Reject",
    verdictReason: "Fundamental mismatch — associate-level services experience with CRUD-depth skills does not meet senior product engineering bar.",
  },
];

export const mockAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: "q-001",
    section: "must_have_skills",
    sectionLabel: "Core Skills Depth",
    question: "You're building a React component that renders a list of 10,000+ payment transactions with real-time updates. Walk me through how you'd architect this for performance — what React patterns, virtualization strategies, and state management decisions would you make?",
    expectedDepth: "Strong answers reference virtualized lists (react-window/react-virtuoso), memoization (useMemo/React.memo), efficient state updates (useReducer or external store), and WebSocket/SSE for real-time. Bonus for mentioning pagination strategies.",
    timeEstimate: "4-5 min",
  },
  {
    id: "q-002",
    section: "must_have_skills",
    sectionLabel: "Core Skills Depth",
    question: "Describe how you'd design a Node.js microservice that processes payment webhooks from multiple providers (Razorpay, Stripe, PayU). How do you handle idempotency, retry logic, and ensure exactly-once processing?",
    expectedDepth: "Should discuss idempotency keys, deduplication via database constraints, exponential backoff, dead letter queues, and transaction safety. Practical experience signals: mentioning specific edge cases like network timeouts or partial failures.",
    timeEstimate: "4-5 min",
  },
  {
    id: "q-003",
    section: "resume_validation",
    sectionLabel: "Resume Validation",
    question: "You mentioned working on a merchant dashboard at scale. What was the most challenging architectural decision you made on that project, and what trade-offs did you accept?",
    expectedDepth: "Genuine experience produces specific, nuanced answers with real trade-off reasoning. Watch for vague generalities or inability to name specific technologies, metrics, or team dynamics.",
    timeEstimate: "3-4 min",
  },
  {
    id: "q-004",
    section: "resume_validation",
    sectionLabel: "Resume Validation",
    question: "Tell me about a production incident you handled. What broke, how did you diagnose it, and what did you change to prevent recurrence?",
    expectedDepth: "Look for structured incident response thinking: monitoring/alerting → diagnosis → fix → post-mortem. Candidates with real ownership describe specific metrics, timelines, and systemic improvements.",
    timeEstimate: "3-4 min",
  },
  {
    id: "q-005",
    section: "scenario_fit",
    sectionLabel: "Scenario Fit",
    question: "You join the team and discover that the existing payment API has no integration tests, inconsistent error handling, and 3 different authentication patterns. You have a feature deadline in 2 weeks. How do you balance tech debt vs delivery?",
    expectedDepth: "Strong answers show pragmatic judgment — not 'rewrite everything' or 'ignore it all'. Look for: scoped testing strategy, incremental standardization plan, communication with PM about risks, and a concrete approach to the immediate feature.",
    timeEstimate: "4-5 min",
  },
  {
    id: "q-006",
    section: "scenario_fit",
    sectionLabel: "Scenario Fit",
    question: "A junior developer on your team pushes a PR that works but has significant design flaws. The feature is needed urgently. How do you handle the code review?",
    expectedDepth: "Tests mentoring mindset and pragmatism. Strong answers: approve with required follow-up tasks, pair on critical fixes, use it as a teaching moment without blocking delivery. Red flag: either rubber-stamping everything or being a perfectionist gatekeeper.",
    timeEstimate: "3-4 min",
  },
  {
    id: "q-007",
    section: "communication",
    sectionLabel: "Communication & Thinking",
    question: "Explain to a non-technical product manager why migrating from a monolithic REST API to microservices would take 3 months instead of 3 weeks, and what risks are involved.",
    expectedDepth: "Tests ability to translate technical complexity for business stakeholders. Strong answers use analogies, focus on business impact (downtime risk, team velocity), and acknowledge trade-offs rather than just listing technical tasks.",
    timeEstimate: "3-4 min",
  },
  {
    id: "q-008",
    section: "communication",
    sectionLabel: "Communication & Thinking",
    question: "If you had to choose between PostgreSQL and MongoDB for a new payment ledger service, what factors would drive your decision? Walk me through your reasoning.",
    expectedDepth: "Looking for structured decision-making: ACID requirements for financial data (favors Postgres), query patterns, consistency needs, team familiarity. Red flag: dogmatic preference without reasoning or inability to articulate trade-offs.",
    timeEstimate: "3-4 min",
  },
];

export const mockAssessment: Assessment = {
  id: "assess-001",
  candidateId: "candidate-001",
  candidateName: "Arjun Mehta",
  jobTitle: "Senior Full Stack Engineer",
  clientName: "PayScale Technologies",
  questions: mockAssessmentQuestions,
  token: "assess-tok-abc123def456",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  maxAttempts: 1,
  timeLimitMinutes: 35,
  status: "pending",
};

export const sampleJDText = `We are looking for a Senior Full Stack Engineer to join our growing engineering team at PayScale Technologies.

The ideal candidate will have 5-8 years of experience building scalable web applications using React.js and Node.js. You'll be responsible for designing and implementing features across our payment processing platform, working with microservices architecture, and collaborating with cross-functional teams.

Requirements:
- 5+ years of experience with React.js/Next.js and TypeScript
- Strong backend experience with Node.js and Express
- Experience with PostgreSQL and/or MongoDB
- Understanding of RESTful API design and GraphQL
- Experience with cloud platforms (AWS preferred)
- Strong system design and architecture skills
- Experience with CI/CD pipelines and containerization (Docker/K8s)

Nice to have:
- Payment gateway integration experience
- Event-driven architecture (Kafka/RabbitMQ)
- FinTech domain experience

We offer competitive compensation, ESOPs, hybrid work model, and a chance to build India's next-generation payment infrastructure.

Location: Bangalore (Hybrid)
Experience: 5-8 years
Budget: 35-55 LPA`;
