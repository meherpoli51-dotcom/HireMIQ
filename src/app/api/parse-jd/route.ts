import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { extractText as extractPdfText } from "unpdf";

// Extract text from uploaded file
async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  if (fileName.endsWith(".pdf")) {
    const result = await extractPdfText(new Uint8Array(buffer));
    const pages = result.text;
    return Array.isArray(pages) ? pages.join("\n") : String(pages || "");
  }

  if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  throw new Error("Unsupported file format. Please upload PDF, DOCX, or TXT.");
}

// Use Claude to extract structured fields from JD text
async function extractFields(jdText: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your-api-key-here") {
    // Return just the text if no API key
    return { jdText, extractedFields: null };
  }

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Extract structured recruitment fields from this job description. Return ONLY a JSON object with these fields (use empty string "" if not found):

{
  "jobTitle": "exact job title mentioned",
  "clientName": "hiring company name if mentioned",
  "endClient": "end client if this is a staffing/consulting role",
  "location": "work location/city",
  "budgetMin": "minimum salary/budget number only (no currency symbols)",
  "budgetMax": "maximum salary/budget number only",
  "budgetType": "LPA or CTC or INR/Month or USD/Year (infer from context, default LPA for Indian JDs)",
  "experienceMin": "minimum years of experience number only",
  "experienceMax": "maximum years of experience number only",
  "noticePeriod": "one of: Immediate, 15 Days, 30 Days, 60 Days, 90 Days (or empty)",
  "workMode": "one of: Remote, Hybrid, Onsite (infer from JD)",
  "employmentType": "one of: Full-time, Contract, Contract-to-Hire, Part-time"
}

Job Description:
${jdText.substring(0, 8000)}`,
      },
    ],
  });

  try {
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    // Clean markdown fences if present
    const cleaned = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    const fields = JSON.parse(cleaned);
    return { jdText, extractedFields: fields };
  } catch {
    // If parsing fails, return just the text
    return { jdText, extractedFields: null };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Extract text from document
    const text = await extractText(file);

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from the document. Please paste the JD text manually." },
        { status: 400 }
      );
    }

    // Extract structured fields using AI
    const result = await extractFields(text);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Parse JD error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to parse document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
