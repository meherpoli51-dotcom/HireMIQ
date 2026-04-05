"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
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
  status: string;
}

type PageState = "loading" | "ready" | "in_progress" | "submitting" | "submitted" | "error";

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
  const token = searchParams.get("token");

  const [pageState, setPageState] = useState<PageState>("loading");
  const [assessment, setAssessment] = useState<AssessData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch assessment data
  useEffect(() => {
    if (!token) {
      setErrorMsg("Invalid assessment link. No token provided.");
      setPageState("error");
      return;
    }

    fetch(`/api/assess?token=${encodeURIComponent(token)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Assessment not found or expired");
        return r.json();
      })
      .then((data) => {
        setAssessment(data);
        setTimeLeft(data.timeLimitMinutes * 60);
        setPageState("ready");
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setPageState("error");
      });
  }, [token]);

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
    setPageState("in_progress");
  };

  const handleSubmit = useCallback(async () => {
    if (!assessment || !token) return;
    setPageState("submitting");

    try {
      const answerArray = assessment.questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || "",
      }));

      const response = await fetch("/api/assess/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          candidateName: assessment.candidateName,
          jobTitle: assessment.jobTitle,
          questions: assessment.questions,
          answers: answerArray,
        }),
      });

      if (!response.ok) throw new Error("Submission failed");
      setPageState("submitted");
    } catch {
      setErrorMsg("Failed to submit assessment. Please try again.");
      setPageState("in_progress");
    }
  }, [assessment, token, answers]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (pageState === "in_progress" && timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, pageState, handleSubmit]);

  const answeredCount = assessment
    ? assessment.questions.filter((q) => (answers[q.id] || "").trim().length > 0)
        .length
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

  // Submitted state
  if (pageState === "submitted") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Assessment Submitted
          </h1>
          <p className="text-sm text-slate-600 mb-2">
            Thank you, {assessment?.candidateName}. Your responses have been
            recorded and will be evaluated.
          </p>
          <p className="text-xs text-slate-400">
            The recruiter will contact you with next steps.
          </p>
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
  const timeWarning = timeLeft < 300; // last 5 minutes

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky header with timer */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-900">
              {assessment.jobTitle}
            </span>
          </div>
          <div className="flex items-center gap-4">
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
              placeholder="Type your answer here..."
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-y"
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
                {answeredCount}/{assessment.questions.length} questions
                answered. You cannot edit after submission.
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
