import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { extractText as extractPdfText } from "unpdf";

// Extract text from uploaded file
async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  // TXT files
  if (fileName.endsWith(".txt") || mimeType === "text/plain") {
    return buffer.toString("utf-8");
  }

  // PDF files
  if (fileName.endsWith(".pdf") || mimeType === "application/pdf") {
    try {
      const result = await extractPdfText(new Uint8Array(buffer));
      const pages = result.text;
      return Array.isArray(pages) ? pages.join("\n") : String(pages || "");
    } catch {
      throw new Error("Could not read PDF. Please try a different file or paste the text manually.");
    }
  }

  // DOCX/DOC files — try mammoth, fall back to raw text
  if (
    fileName.endsWith(".docx") ||
    fileName.endsWith(".doc") ||
    mimeType.includes("word") ||
    mimeType.includes("officedocument")
  ) {
    try {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      if (result.value?.trim()) return result.value;
    } catch { /* fall through to raw text */ }
  }

  // Last resort — try reading as plain text (works for many formats)
  const rawText = buffer.toString("utf-8");
  const printable = rawText.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
  if (printable.length > 100) return printable;

  throw new Error("Could not extract text from this file. Please paste the JD text manually.");
}

// Use Claude to extract structured fields from JD text
async function extractFields(jdText: string, fileName?: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your-api-key-here") {
    // Return just the text if no API key
    return { jdText, extractedFields: null };
  }

  const client = new Anthropic({ apiKey });

  const fileHint = fileName ? `\nOriginal filename: "${fileName}" (use this as a hint for job title if the text doesn't clearly state one)` : "";

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are an expert Indian IT recruiter. Extract structured fields from this job description.
${fileHint}

IMPORTANT EXTRACTION RULES:
- For jobTitle: Look for role/position/designation. Check headings, subject lines, "Position:", "Role:", "Job Title:" etc. If not explicitly stated, infer from skills and context (e.g., if the JD mentions Java, Spring Boot, microservices — the title is likely "Java Developer" or "Senior Java Developer"). The filename often contains the role name.
- For clientName: Look for "Company:", "Client:", "Organization:", or any company name mentioned. In Indian staffing JDs, the hiring company is often mentioned at the top.
- For location: Look for city names, "Location:", "Work Location:", "Base Location:". Common Indian cities: Bangalore, Hyderabad, Pune, Chennai, Mumbai, Delhi NCR, Noida, Gurgaon.
- For experience: Look for "X-Y years", "X+ years", "Experience: X years" patterns.
- For budget: Look for "CTC", "LPA", salary ranges, compensation mentioned.
- Be aggressive in extracting — it's better to make a reasonable guess than return empty.

Return ONLY a JSON object with these fields (use empty string "" ONLY if truly impossible to determine):

{
  "jobTitle": "exact or inferred job title",
  "clientName": "hiring company name",
  "endClient": "end client if staffing/consulting role",
  "location": "work location/city",
  "budgetMin": "minimum salary number only (no symbols)",
  "budgetMax": "maximum salary number only",
  "budgetType": "LPA or CTC or INR/Month or USD/Year (default LPA for Indian JDs)",
  "experienceMin": "minimum years number only",
  "experienceMax": "maximum years number only",
  "noticePeriod": "one of: Immediate, 15 Days, 30 Days, 60 Days, 90 Days (or empty)",
  "workMode": "one of: Remote, Hybrid, Onsite (infer from context)",
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

    // Fallback: if jobTitle is still empty, try to infer from filename
    if (!fields.jobTitle && fileName) {
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
      if (nameWithoutExt.length > 2) {
        fields.jobTitle = nameWithoutExt;
      }
    }

    return { jdText, extractedFields: fields };
  } catch {
    // If parsing fails, try to at least extract from filename
    const fallbackFields: Record<string, string> = {};
    if (fileName) {
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
      if (nameWithoutExt.length > 2) {
        fallbackFields.jobTitle = nameWithoutExt;
      }
    }
    return { jdText, extractedFields: Object.keys(fallbackFields).length > 0 ? fallbackFields : null };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth check — prevent unauthenticated file upload + AI usage
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Extract structured fields using AI (pass filename as hint)
    const result = await extractFields(text, file.name);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Parse JD error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to parse document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
