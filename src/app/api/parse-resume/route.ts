import { NextRequest, NextResponse } from "next/server";
import { extractText as extractPdfText } from "unpdf";

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  if (fileName.endsWith(".txt") || mimeType === "text/plain") {
    return buffer.toString("utf-8");
  }

  if (fileName.endsWith(".pdf") || mimeType === "application/pdf") {
    try {
      const result = await extractPdfText(new Uint8Array(buffer));
      const pages = result.text;
      return Array.isArray(pages) ? pages.join("\n") : String(pages || "");
    } catch {
      throw new Error("Could not read PDF. Try a different file.");
    }
  }

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
    } catch { /* fall through */ }
  }

  // Last resort — raw text extraction
  const rawText = buffer.toString("utf-8");
  const printable = rawText.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
  if (printable.length > 100) return printable;

  throw new Error("Could not read this file. Please upload PDF, DOCX, or TXT.");
}

export async function POST(request: NextRequest) {
  try {
    // Auth check — prevent unauthenticated file upload
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 10MB." },
        { status: 400 }
      );
    }

    const text = await extractText(file);

    if (!text.trim()) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this file. It may be a scanned image PDF. Try a text-based PDF or DOCX instead.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ text, fileName: file.name });
  } catch (error) {
    console.error("Resume parse error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to parse resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
