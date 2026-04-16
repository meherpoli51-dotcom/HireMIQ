"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileSearch, Building2, Cpu, Target, Search, MessageSquare, Users,
  CheckCircle2, Loader2, Brain, Sparkles,
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
  { id: "jd-iq",     label: "JD IQ",     icon: FileSearch    },
  { id: "client-iq", label: "Client IQ", icon: Building2     },
  { id: "skill-iq",  label: "Skill IQ",  icon: Cpu           },
  { id: "target-iq", label: "Target IQ", icon: Target        },
  { id: "source-iq", label: "Source IQ", icon: Search        },
  { id: "reach-iq",  label: "Reach IQ",  icon: MessageSquare },
  { id: "match-iq",  label: "Match IQ",  icon: Users         },
];

const STEPS = [
  { id: "jd",     icon: FileSearch,    label: "Parsing Job Description",      sub: "Role, seniority & requirements"         },
  { id: "client", icon: Building2,     label: "Building Client Intelligence",  sub: "Company type, culture & hiring context" },
  { id: "skill",  icon: Cpu,           label: "Mapping Skill Requirements",    sub: "Mandatory vs secondary, tech stack"      },
  { id: "target", icon: Target,        label: "Identifying Target Profiles",   sub: "Ideal personas & sourcing filters"       },
  { id: "source", icon: Search,        label: "Building Source Strategy",      sub: "Platforms, boolean strings & tactics"    },
  { id: "reach",  icon: MessageSquare, label: "Crafting Outreach Templates",   sub: "Personalised InMail & message sequences" },
];

type StepStatus = "pending" | "running" | "done";

function AnalysisProgress({ isAnalyzing }: { isAnalyzing: boolean }) {
  const [steps, setSteps] = useState<StepStatus[]>(STEPS.map(() => "pending"));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAnalyzing) return;

    setSteps(STEPS.map(() => "pending"));
    let current = 0;

    const tick = () => {
      setSteps((prev) => {
        const next = [...prev];
        if (current > 0) next[current - 1] = "done";
        if (current < STEPS.length) next[current] = "running";
        return next;
      });
      current++;
      if (current <= STEPS.length) {
        timerRef.current = setTimeout(tick, 1700);
      }
    };
    tick();

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAnalyzing]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-200 animate-pulse">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Analyzing JD...</h2>
        <p className="text-sm text-slate-500 mt-1">Running 6 intelligence modules in parallel</p>
      </div>

      {/* Steps grid */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STEPS.map((step, i) => {
          const status = steps[i];
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500",
                status === "running" ? "border-blue-200 bg-blue-50 shadow-sm"  :
                status === "done"    ? "border-emerald-200 bg-emerald-50/70"    :
                                      "border-slate-100 bg-slate-50 opacity-40"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                status === "running" ? "bg-blue-600 shadow-md shadow-blue-200" :
                status === "done"    ? "bg-emerald-500"                         : "bg-slate-200"
              )}>
                {status === "done"    ? <CheckCircle2 className="w-4 h-4 text-white" />                       :
                 status === "running" ? <Loader2 className="w-4 h-4 text-white animate-spin" />               :
                                        <Icon className="w-4 h-4 text-slate-400" />}
              </div>
              <div className="min-w-0">
                <p className={cn(
                  "text-sm font-semibold leading-tight",
                  status === "running" ? "text-blue-700" :
                  status === "done"    ? "text-emerald-700" : "text-slate-400"
                )}>{step.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{step.sub}</p>
              </div>
              {status === "running" && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mt-6">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
            style={{ width: `${(steps.filter(s => s === "done").length / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-2 text-center">
          {steps.filter(s => s === "done").length} of {STEPS.length} modules complete
        </p>
      </div>
    </div>
  );
}

interface OutputPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  error?: string | null;
}

export function OutputPanel({ result, isAnalyzing, error }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState("jd-iq");
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const handleMatch = async (resumes: { fileName: string; text: string }[]) => {
    if (!result) return;
    setIsMatching(true);
    setMatchError(null);
    setActiveTab("match-iq");
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: result, resumes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Matching failed");
      // Deduplicate by ID to prevent duplicates on re-upload
      setCandidates((prev) => {
        const existingIds = new Set(prev.map((c: CandidateMatch) => c.id));
        const newCandidates = (data.candidates || []).filter(
          (c: CandidateMatch) => !existingIds.has(c.id)
        );
        return [...prev, ...newCandidates];
      });
    } catch (err) {
      setMatchError(err instanceof Error ? err.message : "Candidate matching failed");
    } finally {
      setIsMatching(false);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-sm p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-rose-50 rounded-2xl flex items-center justify-center">
            <FileSearch className="w-8 h-8 text-rose-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Analysis Failed</h3>
          <p className="text-sm text-rose-600 leading-relaxed mb-2">{error}</p>
          <p className="text-xs text-slate-400">Check your API key in .env.local or try again.</p>
        </div>
      </div>
    );
  }

  // Live analysis progress
  if (isAnalyzing) {
    return <AnalysisProgress isAnalyzing={isAnalyzing} />;
  }

  // Empty state
  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Analyze</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Paste a job description or upload a file, fill in the details, then click <strong className="text-slate-700">Analyze JD</strong>.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: FileSearch, label: "JD Intelligence" },
              { icon: Cpu,        label: "Skill Mapping"   },
              { icon: Users,      label: "Candidate Match" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Icon className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                <p className="text-[11px] text-slate-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
      <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-200 bg-white overflow-x-auto shrink-0">
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

      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "jd-iq"     && <JDIQTab data={result.jdIQ} />}
        {activeTab === "client-iq" && <ClientIQTab data={result.clientIQ} />}
        {activeTab === "skill-iq"  && <SkillIQTab data={result.skillIQ} />}
        {activeTab === "target-iq" && <TargetIQTab data={result.targetIQ} />}
        {activeTab === "source-iq" && <SourceIQTab data={result.sourceIQ} />}
        {activeTab === "reach-iq"  && <ReachIQTab data={result.reachIQ} />}
        {activeTab === "match-iq"  && (
          <div className="space-y-5">
            <ResumeUploadPanel onMatch={handleMatch} isMatching={isMatching} hasAnalysis={!!result} />
            {matchError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-500 text-xs font-bold">!</span>
                <div>
                  <p className="text-sm font-semibold text-red-700">Matching failed</p>
                  <p className="text-xs text-red-600 mt-0.5">{matchError}</p>
                </div>
              </div>
            )}
            {candidates.length > 0 && <CandidateList candidates={candidates} analysis={result} />}
          </div>
        )}
      </div>
    </div>
  );
}
