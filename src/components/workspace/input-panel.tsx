"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Sparkles, Loader2, FileText, X, CheckCircle2, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutocompleteInput } from "./autocomplete-input";
import { cn } from "@/lib/utils";
import type { JDInput } from "@/lib/types";

interface CreditInfo {
  monthly_limit: number;
  monthly_used: number;
  total_available: number;
  percent_used: number;
  resets_at: string;
}

interface InputPanelProps {
  onAnalyze: (input: JDInput) => void;
  isAnalyzing: boolean;
  credits?: CreditInfo | null;
  onUpgradeClick?: () => void;
}

const defaultInput: JDInput = {
  jobTitle: "",
  jdText: "",
  clientName: "",
  endClient: "",
  location: "",
  budgetMin: "",
  budgetMax: "",
  budgetType: "LPA",
  experienceMin: "",
  experienceMax: "",
  noticePeriod: "",
  workMode: "Hybrid",
  employmentType: "Full-time",
  priorityLevel: "High",
  recruiterNotes: "",
};

export function InputPanel({ onAnalyze, isAnalyzing, credits, onUpgradeClick }: InputPanelProps) {
  const [input, setInput] = useState<JDInput>(defaultInput);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "parsing" | "done" | "error"
  >("idle");
  const [uploadedFile, setUploadedFile] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof JDInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const processFile = useCallback(async (file: File) => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];
    const validExtensions = [".pdf", ".docx", ".doc", ".txt"];
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf("."));

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      setUploadState("error");
      setUploadError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadState("error");
      setUploadError("File too large. Maximum size is 10MB.");
      return;
    }

    setUploadState("uploading");
    setUploadedFile(file.name);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      setUploadState("parsing");

      const response = await fetch("/api/parse-jd", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to parse document");
      }

      // Auto-fill all extracted fields
      setInput((prev) => {
        const updated = { ...prev, jdText: data.jdText || prev.jdText };

        if (data.extractedFields) {
          const f = data.extractedFields;
          if (f.jobTitle) updated.jobTitle = f.jobTitle;
          if (f.clientName) updated.clientName = f.clientName;
          if (f.endClient) updated.endClient = f.endClient;
          if (f.location) updated.location = f.location;
          if (f.budgetMin) updated.budgetMin = f.budgetMin;
          if (f.budgetMax) updated.budgetMax = f.budgetMax;
          if (f.budgetType) updated.budgetType = f.budgetType;
          if (f.experienceMin) updated.experienceMin = f.experienceMin;
          if (f.experienceMax) updated.experienceMax = f.experienceMax;
          if (f.noticePeriod) updated.noticePeriod = f.noticePeriod;
          if (f.workMode) updated.workMode = f.workMode;
          if (f.employmentType) updated.employmentType = f.employmentType;
        }

        return updated;
      });

      setUploadState("done");
    } catch (err) {
      setUploadState("error");
      setUploadError(
        err instanceof Error ? err.message : "Failed to parse document"
      );
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
      // Reset input so same file can be re-uploaded
      e.target.value = "";
    },
    [processFile]
  );

  const clearUpload = () => {
    setUploadState("idle");
    setUploadedFile("");
    setUploadError("");
  };

  return (
    <div className="w-full lg:w-[420px] xl:w-[440px] border-r border-slate-200 bg-white flex flex-col shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">JD Input</h2>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Job Title */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Job Title
          </label>
          <input
            type="text"
            value={input.jobTitle}
            onChange={(e) => update("jobTitle", e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer"
            className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Upload JD */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Upload JD
          </label>

          {uploadState === "idle" || uploadState === "error" ? (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
                }`}
              >
                <Upload
                  className={`w-5 h-5 mx-auto mb-1.5 ${
                    isDragging ? "text-blue-500" : "text-slate-400"
                  }`}
                />
                <p className="text-xs text-slate-500">
                  Drop PDF, DOCX, or TXT here, or{" "}
                  <span className="text-blue-600 font-medium">browse</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  AI auto-fills all fields from your document
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              {uploadState === "error" && (
                <p className="text-xs text-red-500 mt-1.5">{uploadError}</p>
              )}
            </>
          ) : uploadState === "uploading" || uploadState === "parsing" ? (
            <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-3 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">
                  {uploadedFile}
                </p>
                <p className="text-[10px] text-blue-600">
                  {uploadState === "uploading"
                    ? "Uploading..."
                    : "Extracting text & auto-filling fields..."}
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-green-200 bg-green-50/50 rounded-lg p-3 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-slate-500" />
                  <p className="text-xs font-medium text-slate-700 truncate">
                    {uploadedFile}
                  </p>
                </div>
                <p className="text-[10px] text-green-600">
                  Parsed & fields auto-filled
                </p>
              </div>
              <button
                onClick={clearUpload}
                className="p-1 hover:bg-green-100 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          )}
        </div>

        {/* Paste JD */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Paste JD Text
          </label>
          <textarea
            value={input.jdText}
            onChange={(e) => update("jdText", e.target.value)}
            placeholder="Paste the full job description here..."
            rows={6}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
          />
        </div>

        {/* Client Name with autocomplete — REQUIRED */}
        <AutocompleteInput
          label="Client Name"
          placeholder="Start typing company name..."
          value={input.clientName}
          onChange={(v) => update("clientName", v)}
          suggestions={[]}
          required
          showError={triedSubmit}
        />

        {/* End Client */}
        <AutocompleteInput
          label="End Client"
          placeholder="End client (if staffing)"
          value={input.endClient}
          onChange={(v) => update("endClient", v)}
          suggestions={[]}
          optional
        />

        {/* Location with autocomplete — REQUIRED */}
        <AutocompleteInput
          label="Location"
          placeholder="Start typing city..."
          value={input.location}
          onChange={(v) => update("location", v)}
          suggestions={[]}
          required
          showError={triedSubmit}
        />

        {/* Budget */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Budget Range
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input.budgetMin}
              onChange={(e) => update("budgetMin", e.target.value)}
              placeholder="Min"
              className="flex-1 h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            <span className="flex items-center text-xs text-slate-400">to</span>
            <input
              type="text"
              value={input.budgetMax}
              onChange={(e) => update("budgetMax", e.target.value)}
              placeholder="Max"
              className="flex-1 h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            <select
              value={input.budgetType}
              onChange={(e) => update("budgetType", e.target.value)}
              className="h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option>LPA</option>
              <option>CTC</option>
              <option>INR/Month</option>
              <option>USD/Year</option>
            </select>
          </div>
        </div>

        {/* Experience Range */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Experience Range (years)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={input.experienceMin}
              onChange={(e) => update("experienceMin", e.target.value)}
              placeholder="Min"
              className="flex-1 h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="text"
              value={input.experienceMax}
              onChange={(e) => update("experienceMax", e.target.value)}
              placeholder="Max"
              className="flex-1 h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        {/* Compact row fields */}
        <div className="grid grid-cols-2 gap-3">
          {/* Notice Period */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Notice Period
            </label>
            <select
              value={input.noticePeriod}
              onChange={(e) => update("noticePeriod", e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="">Select</option>
              <option>Immediate</option>
              <option>15 Days</option>
              <option>30 Days</option>
              <option>60 Days</option>
              <option>90 Days</option>
            </select>
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Work Mode
            </label>
            <select
              value={input.workMode}
              onChange={(e) => update("workMode", e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Employment Type
            </label>
            <select
              value={input.employmentType}
              onChange={(e) => update("employmentType", e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option>Full-time</option>
              <option>Contract</option>
              <option>Contract-to-Hire</option>
              <option>Part-time</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Priority Level
            </label>
            <select
              value={input.priorityLevel}
              onChange={(e) => update("priorityLevel", e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>

        {/* Recruiter Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Recruiter Notes{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={input.recruiterNotes}
            onChange={(e) => update("recruiterNotes", e.target.value)}
            placeholder="Any additional context or notes..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 py-4 border-t border-slate-100 space-y-3">
        {/* Credit usage mini-bar */}
        {credits && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-600">
                  {credits.monthly_used} / {credits.monthly_limit} analyses used
                </span>
              </div>
              {credits.total_available > 0 && (
                <span className="text-xs text-slate-400">
                  {credits.total_available} left
                </span>
              )}
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  credits.percent_used >= 100
                    ? "bg-rose-500"
                    : credits.percent_used >= 80
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                )}
                style={{ width: `${Math.min(100, credits.percent_used)}%` }}
              />
            </div>
          </div>
        )}

        {triedSubmit && (!input.clientName.trim() || !input.location.trim()) && (
          <p className="text-xs text-rose-500">
            Please fill in Client Name and Location to proceed.
          </p>
        )}

        {/* Analyze button — blocked when no credits */}
        {credits && credits.total_available <= 0 ? (
          <button
            onClick={onUpgradeClick}
            className="w-full h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-sm text-sm transition-all"
          >
            <AlertCircle className="w-4 h-4" />
            Upgrade to Pro — ₹499/month
          </button>
        ) : (
          <Button
            onClick={() => {
              setTriedSubmit(true);
              if (!input.jobTitle.trim()) return;
              if (!input.clientName.trim()) return;
              if (!input.location.trim()) return;
              if (!input.jdText.trim()) return;
              onAnalyze(input);
            }}
            disabled={isAnalyzing}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm disabled:opacity-50 text-sm"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing JD...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze JD
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
