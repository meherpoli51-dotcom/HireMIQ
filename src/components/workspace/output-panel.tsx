"use client";

import { useState } from "react";
import {
  FileSearch,
  Building2,
  Cpu,
  Target,
  Search,
  MessageSquare,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JDIQTab } from "./tabs/jd-iq-tab";
import { ClientIQTab } from "./tabs/client-iq-tab";
import { SkillIQTab } from "./tabs/skill-iq-tab";
import { TargetIQTab } from "./tabs/target-iq-tab";
import { SourceIQTab } from "./tabs/source-iq-tab";
import { ReachIQTab } from "./tabs/reach-iq-tab";
import { ResumeUploadPanel } from "./resume-upload-panel";
import { CandidateList } from "./candidate-list";
import type { AnalysisResult, CandidateMatch } from "@/lib/types";

const tabs = [
  { id: "jd-iq", label: "JD IQ", icon: FileSearch },
  { id: "client-iq", label: "Client IQ", icon: Building2 },
  { id: "skill-iq", label: "Skill IQ", icon: Cpu },
  { id: "target-iq", label: "Target IQ", icon: Target },
  { id: "source-iq", label: "Source IQ", icon: Search },
  { id: "reach-iq", label: "Reach IQ", icon: MessageSquare },
  { id: "match-iq", label: "Match IQ", icon: Users },
];

interface OutputPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  error?: string | null;
}

export function OutputPanel({ result, isAnalyzing, error }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState("jd-iq");
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const handleMatch = async (
    resumes: { fileName: string; text: string }[]
  ) => {
    if (!result) return;
    setIsMatching(true);
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: result, resumes }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Matching failed");
      }
      const data = await response.json();
      setCandidates((prev) => [...prev, ...data.candidates]);
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setIsMatching(false);
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-rose-50 rounded-2xl flex items-center justify-center">
            <FileSearch className="w-8 h-8 text-rose-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Analysis Failed
          </h3>
          <p className="text-sm text-rose-600 leading-relaxed mb-4">
            {error}
          </p>
          <p className="text-xs text-slate-400">
            Check your API key in .env.local or try again.
          </p>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Analyzing JD...
          </h3>
          <p className="text-sm text-slate-500">
            Generating recruiter intelligence across 6 modules
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
            <FileSearch className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Ready to Analyze
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Paste a job description and fill in the details on the left panel,
            then click <strong>Analyze JD</strong> to generate recruiter
            intelligence.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-200 bg-white overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "jd-iq" && <JDIQTab data={result.jdIQ} />}
        {activeTab === "client-iq" && <ClientIQTab data={result.clientIQ} />}
        {activeTab === "skill-iq" && <SkillIQTab data={result.skillIQ} />}
        {activeTab === "target-iq" && <TargetIQTab data={result.targetIQ} />}
        {activeTab === "source-iq" && <SourceIQTab data={result.sourceIQ} />}
        {activeTab === "reach-iq" && <ReachIQTab data={result.reachIQ} />}
        {activeTab === "match-iq" && (
          <div className="space-y-5">
            <ResumeUploadPanel onMatch={handleMatch} isMatching={isMatching} />
            {candidates.length > 0 && (
              <CandidateList candidates={candidates} analysis={result} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
