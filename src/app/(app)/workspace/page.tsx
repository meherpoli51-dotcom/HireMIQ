"use client";

import { useState } from "react";
import { AppNavbar } from "@/components/layout/app-navbar";
import { InputPanel } from "@/components/workspace/input-panel";
import { OutputPanel } from "@/components/workspace/output-panel";
import type { JDInput, AnalysisResult } from "@/lib/types";

export default function WorkspacePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: JDInput) => {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await response.json();

      if (data._mock) {
        console.info(
          "Running with mock data. Set ANTHROPIC_API_KEY in .env.local for real AI analysis."
        );
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <AppNavbar title="JD Analysis Workspace" />
      <div className="flex-1 flex overflow-hidden">
        <InputPanel onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        <OutputPanel result={result} isAnalyzing={isAnalyzing} error={error} />
      </div>
    </>
  );
}
