"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Eye,
  EyeOff,
  Clipboard,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessQuestion {
  id: string;
  section: string;
  sectionLabel: string;
  question: string;
  timeEstimate: string;
}

interface AssessData {
  id: string;
  candidateName: string;
  jobTitle: string;
  clientName: string;
  questions: AssessQuestion[];
  timeLimitMinutes: number;
  status?: string;
}

interface EvaluationResult {
  overallScore: number;
  sectionScores: { section: string; score: number; feedback: string }[];
  strengths: string[];
  concerns: string[];
  recommendation: string;
  summary: string;
}

// Anti-cheating integrity data
interface IntegrityData {
  tabSwitches: number;
  pasteAttempts: number;
  copyAttempts: number;
  rightClickAttempts: number;
  focusLostDuration: number; // total seconds window was hidden
  warnings: string[];
  startedAt: string;
  submittedAt?: string;
}

type PageState =
  | "loading"
  | "ready"
  | "in_progress"
  | "submitting"
  | "submitted"
  | "error";

function decodeAssessData(encoded: string): AssessData | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function AssessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      }
    >
      <AssessPageContent />
    </Suspense>
  );
}

function AssessPageContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("d");
  const tokenParam = searchParams.get("token");

  const [pageState, setPageState] = useState<PageState>("loading");
  const [assessment, setAssessment] = useState<AssessData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Anti-cheating state
  const [integrity, setIntegrity] = useState<IntegrityData>({
    tabSwitches: 0,
    pasteAttempts: 0,
    copyAttempts: 0,
    rightClickAttempts: 0,
    focusLostDuration: 0,
    warnings: [],
    startedAt: "",
  });
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const focusLostAt = useRef<number | null>(null);
  const warningTimeout = useRef<NodeJS.Timeout | null>(null);

  // Show anti-cheat warning banner
  const triggerWarning = useCallback((message: string) => {
    setWarningMessage(message);
    setShowWarning(true);
    setIntegrity((prev) => ({
      ...prev,
      warnings: [...prev.warnings, `${new Date().toISOString()}: ${message}`],
    }));
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    warningTimeout.current = setTimeout(() => setShowWarning(false), 5000);
  }, []);

  // ─── Anti-cheating: Tab switch / visibility detection ───
  useEffect(() => {
    if (pageState !== "in_progress") return;

    const handleVisibility = () => {
      if (document.hidden) {
        // Tab lost focus
        focusLostAt.current = Date.now();
        setIntegrity((prev) => ({
          ...prev,
          tabSwitches: prev.tabSwitches + 1,
        }));
        triggerWarning(
          "Tab switch detected. This activity is recorded and shared with the recruiter."
        );
      } else {
        // Tab regained focus — calculate time away
        if (focusLostAt.current) {
          const awaySeconds = Math.round(
            (Date.now() - focusLostAt.current) / 1000
          );
          setIntegrity((prev) => ({
            ...prev,
            focusLostDuration: prev.focusLostDuration + awaySeconds,
          }));
          focusLostAt.current = null;
        }
      }
    };

    const handleBlur = () => {
      if (pageState === "in_progress") {
        setIntegrity((prev) => ({
          ...prev,
          tabSwitches: prev.tabSwitches + 1,
        }));
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [pageState, triggerWarning]);

  // ─── Anti-cheating: Block copy, paste, right-click ───
  useEffect(() => {
    if (pageState !== "in_progress") return;

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      setIntegrity((prev) => ({
        ...prev,
        pasteAttempts: prev.pasteAttempts + 1,
      }));
      triggerWarning(
        "Paste blocked. Type your answers manually. This attempt is recorded."
      );
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setIntegrity((prev) => ({
        ...prev,
        copyAttempts: prev.copyAttempts + 1,
      }));
      triggerWarning(
        "Copy is disabled during the assessment. This attempt is recorded."
      );
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setIntegrity((prev) => ({
        ...prev,
        rightClickAttempts: prev.rightClickAttempts + 1,
      }));
    };

    // Block keyboard shortcuts for copy/paste/devtools
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+A (select all for copy)
      if (e.ctrlKey || e.metaKey) {
        if (["v", "V"].includes(e.key)) {
          e.preventDefault();
          setIntegrity((prev) => ({
            ...prev,
            pasteAttempts: prev.pasteAttempts + 1,
          }));
          triggerWarning("Paste blocked. Type your answers manually.");
        }
        if (["c", "C"].includes(e.key)) {
          e.preventDefault();
          setIntegrity((prev) => ({
            ...prev,
            copyAttempts: prev.copyAttempts + 1,
          }));
        }
      }
      // Block F12 and Ctrl+Shift+I (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        triggerWarning("Developer tools are disabled during assessment.");
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "I", "j", "J"].includes(e.key)) {
        e.preventDefault();
        triggerWarning("Developer tools are disabled during assessment.");
      }
    };

    document.addEventListener("paste", handlePaste, true);
    document.addEventListener("copy", handleCopy, true);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("paste", handlePaste, true);
      document.removeEventListener("copy", handleCopy, true);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [pageState, triggerWarning]);

  // Load assessment data
  useEffect(() => {
    if (dataParam) {
      const data = decodeAssessData(dataParam);
      if (data && data.questions?.length > 0) {
        setAssessment(data);
        setTimeLeft((data.timeLimitMinutes || 35) * 60);
        setPageState("ready");
        return;
      }
      setErrorMsg("Invalid assessment link. Data could not be decoded.");
      setPageState("error");
      return;
    }

    if (tokenParam) {
      fetch(`/api/assess?token=${encodeURIComponent(tokenParam)}`)
        .then((r) => {
          if (!r.ok) throw new Error("Assessment not found or expired");
          return r.json();
        })
        .then((data) => {
          setAssessment(data);
          setTimeLeft((data.timeLimitMinutes || 35) * 60);
          setPageState("ready");
        })
        .catch((err) => {
          setErrorMsg(err.message);
          setPageState("error");
        });
      return;
    }

    setErrorMsg("Invalid assessment link. No data provided.");
    setPageState("error");
  }, [dataParam, tokenParam]);

  // Timer
  useEffect(() => {
    if (pageState !== "in_progress") return;
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pageState, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIntegrity((prev) => ({
      ...prev,
      startedAt: new Date().toISOString(),
    }));
    setPageState("in_progress");
  };

  const handleSubmit = useCallback(async () => {
    if (!assessment) return;
    setPageState("submitting");

    const finalIntegrity = {
      ...integrity,
      submittedAt: new Date().toISOString(),
    };

    try {
      const answerArray = assessment.questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || "",
      }));

      const response = await fetch("/api/assess/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenParam || "self-contained",
          candidateName: assessment.candidateName,
          jobTitle: assessment.jobTitle,
          questions: assessment.questions,
          answers: answerArray,
          integrity: finalIntegrity,
        }),
      });

      if (!response.ok) throw new Error("Submission failed");
      const evalData = await response.json();
      // API returns { evaluation: {...} } — unwrap it
      setEvaluation(evalData.evaluation || evalData);
      setPageState("submitted");
    } catch {
      setErrorMsg("Failed to submit assessment. Please try again.");
      setPageState("in_progress");
    }
  }, [assessment, tokenParam, answers, integrity]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (pageState === "in_progress" && timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, pageState, handleSubmit]);

  const answeredCount = assessment
    ? assessment.questions.filter(
        (q) => (answers[q.id] || "").trim().length > 0
      ).length
    : 0;

  // Error state
  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Assessment Unavailable
          </h1>
          <p className="text-sm text-slate-600">{errorMsg}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Submitted state — show evaluation results + integrity report
  if (pageState === "submitted") {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Assessment Submitted
            </h1>
            <p className="text-sm text-slate-600">
              Thank you, {assessment?.candidateName}. Your responses have been
              evaluated.
            </p>
          </div>

          {evaluation && (
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Overall Score
                </p>
                <div
                  className={cn(
                    "text-5xl font-bold mb-2",
                    evaluation.overallScore >= 80
                      ? "text-emerald-600"
                      : evaluation.overallScore >= 60
                        ? "text-amber-600"
                        : "text-rose-600"
                  )}
                >
                  {evaluation.overallScore}
                  <span className="text-2xl text-slate-400">/100</span>
                </div>
                <span
                  className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-semibold",
                    evaluation.recommendation === "Strong"
                      ? "bg-emerald-50 text-emerald-700"
                      : evaluation.recommendation === "Acceptable"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700"
                  )}
                >
                  {evaluation.recommendation}
                </span>
              </div>

              {/* Integrity Report */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Assessment Integrity
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-center",
                      integrity.tabSwitches === 0
                        ? "bg-emerald-50"
                        : integrity.tabSwitches <= 2
                          ? "bg-amber-50"
                          : "bg-rose-50"
                    )}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {integrity.tabSwitches === 0 ? (
                        <Eye className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-rose-600" />
                      )}
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {integrity.tabSwitches}
                    </p>
                    <p className="text-[10px] text-slate-500">Tab Switches</p>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-center",
                      integrity.pasteAttempts === 0
                        ? "bg-emerald-50"
                        : "bg-rose-50"
                    )}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clipboard className="w-3 h-3 text-slate-500" />
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {integrity.pasteAttempts}
                    </p>
                    <p className="text-[10px] text-slate-500">Paste Attempts</p>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-center",
                      integrity.copyAttempts === 0
                        ? "bg-emerald-50"
                        : "bg-amber-50"
                    )}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clipboard className="w-3 h-3 text-slate-500" />
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {integrity.copyAttempts}
                    </p>
                    <p className="text-[10px] text-slate-500">Copy Attempts</p>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-center",
                      integrity.focusLostDuration < 10
                        ? "bg-emerald-50"
                        : integrity.focusLostDuration < 30
                          ? "bg-amber-50"
                          : "bg-rose-50"
                    )}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Monitor className="w-3 h-3 text-slate-500" />
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {integrity.focusLostDuration}s
                    </p>
                    <p className="text-[10px] text-slate-500">Away Time</p>
                  </div>
                </div>
                {integrity.tabSwitches === 0 &&
                integrity.pasteAttempts === 0 ? (
                  <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Clean assessment — no suspicious activity detected
                  </p>
                ) : (
                  <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Suspicious activity detected — flagged for recruiter review
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Assessment Summary
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {evaluation.summary}
                </p>
              </div>

              {/* Section Scores */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Section Breakdown
                </h3>
                <div className="space-y-4">
                  {evaluation.sectionScores.map((s, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-700 capitalize">
                          {s.section.replace(/_/g, " ")}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-bold",
                            s.score >= 80
                              ? "text-emerald-600"
                              : s.score >= 60
                                ? "text-amber-600"
                                : "text-rose-600"
                          )}
                        >
                          {s.score}/100
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            s.score >= 80
                              ? "bg-emerald-500"
                              : s.score >= 60
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          )}
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{s.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Concerns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Strengths
                  </h3>
                  <ul className="space-y-1.5">
                    {evaluation.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 flex items-start gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Areas of Concern
                  </h3>
                  <ul className="space-y-1.5">
                    {evaluation.concerns.map((c, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 flex items-start gap-1.5"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-400">
                  Assessment for {assessment?.jobTitle} at{" "}
                  {assessment?.clientName}
                </p>
              </div>
            </div>
          )}

          {!evaluation && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <p className="text-sm text-slate-600">
                Your responses have been recorded. The recruiter will contact
                you with next steps.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!assessment) return null;

  // Ready state — start screen
  if (pageState === "ready") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              HireMIQ Assessment
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Screening Assessment
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {assessment.jobTitle} at {assessment.clientName}
          </p>

          <div className="bg-slate-50 rounded-xl p-5 space-y-3 mb-6">
            <p className="text-sm text-slate-700">
              <strong>Candidate:</strong> {assessment.candidateName}
            </p>
            <p className="text-sm text-slate-700">
              <strong>Questions:</strong> {assessment.questions.length}
            </p>
            <p className="text-sm text-slate-700">
              <strong>Time Limit:</strong> {assessment.timeLimitMinutes} minutes
            </p>
            <p className="text-sm text-slate-700">
              <strong>Attempt:</strong> Single attempt only
            </p>
          </div>

          {/* Anti-cheating notice */}
          <div className="bg-slate-900 rounded-lg px-4 py-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <p className="text-xs font-semibold text-white">
                Proctored Assessment
              </p>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <EyeOff className="w-3 h-3 mt-0.5 shrink-0 text-slate-400" />
                Tab switches and window changes are tracked
              </li>
              <li className="flex items-start gap-1.5">
                <Clipboard className="w-3 h-3 mt-0.5 shrink-0 text-slate-400" />
                Copy-paste is disabled — type your answers
              </li>
              <li className="flex items-start gap-1.5">
                <Monitor className="w-3 h-3 mt-0.5 shrink-0 text-slate-400" />
                All activity is recorded and shared with the recruiter
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mb-6">
            <p className="text-xs text-amber-800">
              Once you start, the timer begins. Answer all questions thoroughly
              — your responses will be evaluated by AI for depth and accuracy.
              You cannot pause or return to this assessment.
            </p>
          </div>

          <button
            onClick={handleStart}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  // In-progress state — questions
  const timeWarning = timeLeft < 300;

  return (
    <div className="min-h-screen bg-slate-50 select-none">
      {/* Anti-cheat warning banner */}
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-rose-600 text-white text-center py-2.5 px-4 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p className="text-xs font-medium">{warningMessage}</p>
          </div>
        </div>
      )}

      {/* Sticky header with timer + integrity indicators */}
      <div
        className={cn(
          "sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm transition-all",
          showWarning && "mt-9"
        )}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-900">
              {assessment.jobTitle}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Integrity indicator */}
            {integrity.tabSwitches > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                <EyeOff className="w-3 h-3" />
                {integrity.tabSwitches} switch
                {integrity.tabSwitches !== 1 ? "es" : ""}
              </span>
            )}
            <span className="text-xs text-slate-500">
              {answeredCount}/{assessment.questions.length} answered
            </span>
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-bold",
                timeWarning
                  ? "bg-rose-50 text-rose-600"
                  : "bg-slate-100 text-slate-700"
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {assessment.questions.map((q, i) => (
          <div
            key={q.id}
            className="bg-white border border-slate-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {q.sectionLabel}
                </span>
                <span className="text-xs text-slate-400">
                  Q{i + 1} of {assessment.questions.length}
                </span>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {q.timeEstimate}
              </span>
            </div>

            <p className="text-sm text-slate-900 font-medium leading-relaxed mb-4">
              {q.question}
            </p>

            <textarea
              value={answers[q.id] || ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
              onPaste={(e) => e.preventDefault()}
              placeholder="Type your answer here... (paste is disabled)"
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-y select-text"
              style={{ WebkitUserSelect: "text", userSelect: "text" }}
            />

            {(answers[q.id] || "").trim().length > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                Answered
              </div>
            )}
          </div>
        ))}

        {/* Submit */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Ready to submit?
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {answeredCount}/{assessment.questions.length} questions answered.
                You cannot edit after submission.
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={pageState === "submitting" || answeredCount === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {pageState === "submitting" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
