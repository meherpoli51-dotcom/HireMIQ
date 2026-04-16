"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppNavbar } from "@/components/layout/app-navbar";
import {
  FileSearch, Briefcase, Users, ArrowRight, Clock,
  TrendingUp, Plus, Kanban, ChevronRight, Sparkles,
  Building2, History, MapPin, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Analysis {
  id: string;
  job_title: string;
  client_name: string;
  location: string;
  work_mode?: string;
  priority_level?: string;
  status: string;
  created_at: string;
}

interface PipelineCandidate {
  id: string;
  name: string;
  matchScore: number;
  stage: string;
  verdict: string;
  jobTitle: string;
  clientName: string;
  createdAt: string;
}

interface CreditInfo {
  monthly_limit: number;
  monthly_used: number;
  total_available: number;
  percent_used: number;
}

interface WorkspaceInfo {
  id: string;
  name: string;
  tier: "free" | "pro" | "enterprise";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Tab Views                                                          */
/* ------------------------------------------------------------------ */

function HistoryView({ analyses, loading }: { analyses: Analysis[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
          <History className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-base font-semibold text-slate-700 mb-1">No analyses yet</p>
        <p className="text-sm text-slate-400 mb-5">Analyze your first JD to see it here</p>
        <Link href="/workspace">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Sparkles className="w-4 h-4 mr-1.5" />
            Analyze a JD
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {analyses.map((a) => (
        <div key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <FileSearch className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{a.job_title}</p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-slate-400 flex items-center gap-1 truncate">
                <Building2 className="w-3 h-3" />
                {a.client_name || "—"}
              </span>
              {a.location && (
                <span className="text-xs text-slate-400 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3" />
                  {a.location}
                </span>
              )}
              {a.work_mode && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {a.work_mode}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className={cn(
              "text-[10px] font-semibold px-2.5 py-0.5 rounded-full",
              a.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            )}>
              {a.status}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 min-w-[100px] justify-end">
              <Clock className="w-3 h-3" />
              {formatDate(a.created_at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientsView({ analyses, loading }: { analyses: Analysis[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 bg-slate-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  // Group analyses by client_name
  const clientMap: Record<string, Analysis[]> = {};
  for (const a of analyses) {
    const client = a.client_name || "Unknown Client";
    if (!clientMap[client]) clientMap[client] = [];
    clientMap[client].push(a);
  }

  const clients = Object.entries(clientMap).sort((a, b) => b[1].length - a[1].length);

  if (clients.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-base font-semibold text-slate-700 mb-1">No clients yet</p>
        <p className="text-sm text-slate-400">Clients appear after you analyze JDs</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {clients.map(([name, items]) => (
        <div key={name} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-violet-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{name}</p>
              <p className="text-xs text-slate-400">{items.length} {items.length === 1 ? "analysis" : "analyses"}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {items.slice(0, 3).map((a) => (
              <div key={a.id} className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                <FileSearch className="w-3 h-3 text-slate-400 shrink-0" />
                {a.job_title}
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-xs text-slate-400">+{items.length - 3} more</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function CandidatesView({ candidates, loading }: { candidates: PipelineCandidate[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3 p-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-base font-semibold text-slate-700 mb-1">No candidates yet</p>
        <p className="text-sm text-slate-400 mb-5">Add candidates from Match IQ results to see them here</p>
        <Link href="/workspace">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Sparkles className="w-4 h-4 mr-1.5" />
            Start Matching
          </Button>
        </Link>
      </div>
    );
  }

  const verdictColors: Record<string, string> = {
    submit: "bg-emerald-50 text-emerald-600",
    screen: "bg-amber-50 text-amber-600",
    reject: "bg-rose-50 text-rose-600",
  };

  const stageLabels: Record<string, string> = {
    sourced: "Sourced",
    screened: "Screened",
    assessment_sent: "Assessment Sent",
    interview_scheduled: "Interview",
    offered: "Offered",
    joined: "Joined",
    rejected: "Rejected",
  };

  return (
    <div className="divide-y divide-slate-100">
      {candidates.map((c) => (
        <div key={c.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-blue-600">
              {(c.name || "?").substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-slate-400 truncate">{c.jobTitle || "—"}</span>
              {c.clientName && (
                <span className="text-xs text-slate-400 truncate">@ {c.clientName}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Match Score */}
            <div className="text-right">
              <span className={cn(
                "text-sm font-bold",
                c.matchScore >= 75 ? "text-emerald-600" :
                c.matchScore >= 50 ? "text-amber-600" : "text-rose-500"
              )}>
                {c.matchScore}%
              </span>
            </div>
            {/* Verdict */}
            <span className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full",
              verdictColors[(c.verdict || "").toLowerCase()] || "bg-slate-50 text-slate-600"
            )}>
              {c.verdict}
            </span>
            {/* Stage */}
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {stageLabels[c.stage] || c.stage}
            </span>
            {/* Date */}
            <span className="text-[11px] text-slate-400 min-w-[50px] text-right">
              {timeAgo(c.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard Page                                                */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [credits, setCredits] = useState<CreditInfo | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [candidates, setCandidates] = useState<PipelineCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workspace/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.workspace) setWorkspace(d.workspace);
      })
      .catch((e) => {
        console.error("workspace/me failed:", e);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!workspace?.id) return;

    fetch(`/api/billing/usage?workspace_id=${workspace.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.credits) setCredits(d.credits);
      })
      .catch((e) => console.error("billing/usage failed:", e));

    // Fetch all analyses (up to 500 for history)
    fetch(`/api/analyses?limit=500`)
      .then((r) => r.json())
      .then((d) => {
        if (d.analyses) setAnalyses(d.analyses);
      })
      .catch((e) => console.error("analyses failed:", e))
      .finally(() => setLoading(false));
  }, [workspace?.id]);

  // Fetch pipeline candidates for the Candidates tab
  useEffect(() => {
    if (activeTab !== "candidates") return;
    fetch("/api/pipeline")
      .then((r) => r.json())
      .then((d) => {
        if (d.candidates) setCandidates(d.candidates);
      })
      .catch((e) => console.error("pipeline failed:", e));
  }, [activeTab]);

  const usedPct = credits ? Math.min(100, credits.percent_used) : 0;
  const creditColor = usedPct >= 100 ? "bg-rose-500" : usedPct >= 80 ? "bg-amber-500" : "bg-emerald-500";

  const tabs = [
    { key: "overview",   label: "Overview",   icon: Sparkles },
    { key: "history",    label: "History",     icon: History },
    { key: "clients",    label: "Clients",     icon: Building2 },
    { key: "candidates", label: "Candidates",  icon: Users },
  ];

  return (
    <>
      <AppNavbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto space-y-6">

          {/* Tab bar */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <Link
                  key={t.key}
                  href={t.key === "overview" ? "/dashboard" : `/dashboard?tab=${t.key}`}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {t.key === "history" && analyses.length > 0 && (
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
                      {analyses.length}
                    </span>
                  )}
                  {t.key === "candidates" && candidates.length > 0 && (
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
                      {candidates.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === "history" ? (
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-800">All Analyses</h2>
                  <span className="text-xs text-slate-400">({analyses.length} total)</span>
                </div>
                <Link href="/workspace" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  New <Plus className="w-3.5 h-3.5" />
                </Link>
              </div>
              <HistoryView analyses={analyses} loading={loading} />
              {analyses.length > 0 && (
                <div className="px-6 py-3 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400">
                    Data retained for 90 days. Pro users get unlimited retention.
                  </p>
                </div>
              )}
            </div>
          ) : activeTab === "clients" ? (
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-violet-600" />
                  <h2 className="text-sm font-bold text-slate-800">Clients</h2>
                </div>
              </div>
              <ClientsView analyses={analyses} loading={loading} />
            </div>
          ) : activeTab === "candidates" ? (
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold text-slate-800">All Candidates</h2>
                  <span className="text-xs text-slate-400">({candidates.length} total)</span>
                </div>
                <Link href="/pipeline" className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  Pipeline <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <CandidatesView candidates={candidates} loading={loading} />
            </div>
          ) : (
            /* ── Overview Tab (default) ── */
            <>
              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Credits used */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-medium text-slate-500 mb-3">Credits Used</p>
                  {credits ? (
                    <>
                      <p className="text-2xl font-bold text-slate-900">
                        {credits.monthly_used}
                        <span className="text-sm font-normal text-slate-400 ml-1">/ {credits.monthly_limit}</span>
                      </p>
                      <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", creditColor)} style={{ width: `${usedPct}%` }} />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">{credits.total_available} remaining this month</p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold text-slate-300 animate-pulse">-</p>
                  )}
                </div>

                {/* Total analyses */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-medium text-slate-500 mb-3">Total Analyses</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {loading ? <span className="animate-pulse text-slate-300">-</span> : analyses.length}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5">JDs analyzed so far</p>
                </div>

                {/* Plan */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-medium text-slate-500 mb-3">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-bold px-2.5 py-1 rounded-lg capitalize",
                      workspace?.tier === "pro" ? "bg-blue-50 text-blue-700" :
                      workspace?.tier === "enterprise" ? "bg-violet-50 text-violet-700" :
                      "bg-slate-100 text-slate-700"
                    )}>
                      {workspace?.tier ?? "Free"}
                    </span>
                  </div>
                  {workspace?.tier === "free" && (
                    <Link href="/pricing" className="text-[11px] text-blue-600 hover:underline mt-2 inline-block">
                      Upgrade to Pro
                    </Link>
                  )}
                </div>

                {/* Quick action */}
                <Link href="/workspace" className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg hover:shadow-blue-200 transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">New Analysis</p>
                    <p className="text-xs text-blue-200 mt-0.5 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Analyze a JD <ArrowRight className="w-3 h-3" />
                    </p>
                  </div>
                </Link>
              </div>

              {/* Recent analyses + quick actions */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent analyses */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileSearch className="w-4 h-4 text-blue-600" />
                      <h2 className="text-sm font-bold text-slate-800">Recent Analyses</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href="/dashboard?tab=history" className="text-xs text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1">
                        View All <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link href="/workspace" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        New <Plus className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {loading ? (
                    <div className="p-6 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : analyses.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                        <FileSearch className="w-7 h-7 text-slate-300" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">No analyses yet</p>
                      <p className="text-xs text-slate-400 mb-4">Analyze your first JD to see it here</p>
                      <Link href="/workspace">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          Analyze a JD
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {analyses.slice(0, 8).map((a) => (
                        <div key={a.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors group">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <FileSearch className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{a.job_title}</p>
                            <p className="text-xs text-slate-400 truncate">{a.client_name}{a.location ? ` · ${a.location}` : ""}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={cn(
                              "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                              a.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            )}>
                              {a.status}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeAgo(a.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <Link href="/pipeline" className="block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-purple-200 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                        <Kanban className="w-5 h-5 text-purple-600" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Pipeline</p>
                    <p className="text-xs text-slate-500 mt-0.5">Track candidates through every stage</p>
                  </Link>

                  <Link href="/pricing" className="block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {workspace?.tier === "free" ? "Upgrade to Pro" : "View Plan"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {workspace?.tier === "free" ? "Unlimited analyses for 499/mo" : "Manage your subscription"}
                    </p>
                  </Link>

                  <Link href="/help" className="block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <Users className="w-5 h-5 text-slate-500" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Help & Support</p>
                    <p className="text-xs text-slate-500 mt-0.5">FAQs, docs, and contact</p>
                  </Link>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
