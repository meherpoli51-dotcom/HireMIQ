import { NextRequest, NextResponse } from "next/server";
import { analyzeJD } from "@/lib/ai/analyze";
import { mockAnalysisResult } from "@/lib/mock-data";
import type { JDInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const input: JDInput = await request.json();

    // Check if API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your-api-key-here") {
      // Fall back to mock data when no API key is set
      // Simulate processing delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({
        ...mockAnalysisResult,
        jobTitle: input.jobTitle || mockAnalysisResult.jobTitle,
        clientName: input.clientName || mockAnalysisResult.clientName,
        id: `analysis-${Date.now()}`,
        createdAt: new Date().toISOString(),
        _mock: true,
      });
    }

    // Real Claude-powered analysis
    const result = await analyzeJD(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);

    const message =
      error instanceof Error ? error.message : "Analysis failed";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
