"use client";

import { useState, useEffect } from "react";
import { InputPanel } from "@/components/workspace/input-panel";
import { OutputPanel } from "@/components/workspace/output-panel";
import { UpgradeModal } from "@/components/billing/upgrade-modal";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JDInput, AnalysisResult } from "@/lib/types";

interface WorkspaceInfo {
  id: string;
  name: string;
  tier: "free" | "pro" | "enterprise";
  role: string;
}

interface CreditInfo {
  monthly_limit: number;
  monthly_used: number;
  total_available: number;
  percent_used: number;
  resets_at: string;
}

export default function WorkspacePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputCollapsed, setInputCollapsed] = useState(false);

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [credits, setCredits] = useState<CreditInfo | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetch("/api/workspace/me")
      .then((r) => r.json())
      .then((data) => { if (data.workspace) setWorkspace(data.workspace); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!workspace?.id) return;
    fetch(`/api/billing/usage?workspace_id=${workspace.id}`)
      .then((r) => r.json())
      .then((data) => { if (data.credits) setCredits(data.credits); })
      .catch(console.error);
  }, [workspace?.id]);

  const handleAnalyze = async (input: JDInput) => {
    if (credits && credits.total_available <= 0) { setShowUpgrade(true); return; }

    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, workspace_id: workspace?.id }),
      });

      if (response.status === 402) { setShowUpgrade(true); return; }
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);

      // Collapse input panel to give full space to results
      setInputCollapsed(true);

      if (workspace?.id) {
        fetch(`/api/billing/usage?workspace_id=${workspace.id}`)
          .then((r) => r.json())
          .then((d) => d.credits && setCredits(d.credits))
          .catch(console.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Breadcrumb bar */}
      <div className="h-10 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Workspace</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>{result ? (result.jobTitle || "New Analysis") : "New Analysis"}</span>
          {result && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-blue-600 font-medium">{result.clientName}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {credits && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all",
                    credits.percent_used >= 100 ? "bg-rose-500" :
                    credits.percent_used >= 80  ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${Math.min(100, credits.percent_used)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">
                {credits.monthly_used}/{credits.monthly_limit} credits
              </span>
            </div>
          )}
          {/* Toggle input panel when collapsed */}
          {inputCollapsed && (
            <button
              onClick={() => setInputCollapsed(false)}
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium border border-blue-200 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Edit JD
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Input panel — slides out after analysis */}
        <div className={cn(
          "transition-all duration-500 ease-in-out overflow-hidden shrink-0 flex",
          inputCollapsed ? "w-0 opacity-0" : "w-[420px] xl:w-[440px] opacity-100"
        )}>
          <InputPanel
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            credits={credits}
            onUpgradeClick={() => setShowUpgrade(true)}
          />
        </div>

        {/* Output panel — expands to fill full width after collapse */}
        <OutputPanel result={result} isAnalyzing={isAnalyzing} error={error} />
      </div>

      <UpgradeModal
        open={showUpgrade}
        workspaceId={workspace?.id}
        currentUsage={credits?.monthly_used}
        limit={credits?.monthly_limit}
        tier={workspace?.tier ?? "free"}
        onClose={() => setShowUpgrade(false)}
      />
    </div>
  );
}
