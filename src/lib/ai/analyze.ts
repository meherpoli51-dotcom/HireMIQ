import Anthropic from "@anthropic-ai/sdk";
import type { JDInput, AnalysisResult } from "../types";
import {
  SYSTEM_PROMPT,
  JD_IQ_PROMPT,
  CLIENT_IQ_PROMPT,
  SKILL_IQ_PROMPT,
  TARGET_IQ_PROMPT,
  SOURCE_IQ_PROMPT,
  REACH_IQ_PROMPT,
  buildAnalysisContext,
} from "./prompts";

const client = new Anthropic();

async function callClaude(modulePrompt: string, context: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `${modulePrompt}\n\n---\n\n${context}\n\n---\n\nRespond ONLY with the JSON object. No markdown, no code fences, no explanation.`,
      },
    ],
  });

  for (const block of response.content) {
    if (block.type === "text") {
      return block.text;
    }
  }

  throw new Error("No text response from Claude");
}

function parseJSON(raw: string): Record<string, unknown> {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  return JSON.parse(cleaned);
}

export async function analyzeJD(input: JDInput): Promise<AnalysisResult> {
  const context = buildAnalysisContext(input);

  // Run all 6 modules in parallel for speed
  const [jdIQRaw, clientIQRaw, skillIQRaw, targetIQRaw, sourceIQRaw, reachIQRaw] =
    await Promise.all([
      callClaude(JD_IQ_PROMPT, context),
      callClaude(CLIENT_IQ_PROMPT, context),
      callClaude(SKILL_IQ_PROMPT, context),
      callClaude(TARGET_IQ_PROMPT, context),
      callClaude(SOURCE_IQ_PROMPT, context),
      callClaude(REACH_IQ_PROMPT, context),
    ]);

  const jdIQ = parseJSON(jdIQRaw);
  const clientIQ = parseJSON(clientIQRaw);
  const skillIQ = parseJSON(skillIQRaw);
  const targetIQ = parseJSON(targetIQRaw);
  const sourceIQ = parseJSON(sourceIQRaw);
  const reachIQ = parseJSON(reachIQRaw);

  return {
    id: `analysis-${Date.now()}`,
    createdAt: new Date().toISOString(),
    jobTitle: input.jobTitle || (jdIQ.roleTitle as string) || "Untitled Role",
    clientName: input.clientName || "Unknown Client",
    status: "completed",
    jdIQ: jdIQ as unknown as AnalysisResult["jdIQ"],
    clientIQ: clientIQ as unknown as AnalysisResult["clientIQ"],
    skillIQ: skillIQ as unknown as AnalysisResult["skillIQ"],
    targetIQ: targetIQ as unknown as AnalysisResult["targetIQ"],
    sourceIQ: sourceIQ as unknown as AnalysisResult["sourceIQ"],
    reachIQ: reachIQ as unknown as AnalysisResult["reachIQ"],
  };
}
