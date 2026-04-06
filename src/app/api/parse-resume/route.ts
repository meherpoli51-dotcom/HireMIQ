import { NextRequest, NextResponse } from "next/server";
import { extractText as extractPdfText } from "unpdf";

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

  throw new Error("Unsupported format. Upload PDF, DOCX, or TXT.");
}

export async function POST(request: NextRequest) {
  try {
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
