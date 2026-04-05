"use client";

import { useState } from "react";
import { Upload, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutocompleteInput } from "./autocomplete-input";
import { clientSuggestions, locationSuggestions, sampleJDText } from "@/lib/mock-data";
import type { JDInput } from "@/lib/types";

interface InputPanelProps {
  onAnalyze: (input: JDInput) => void;
  isAnalyzing: boolean;
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

export function InputPanel({ onAnalyze, isAnalyzing }: InputPanelProps) {
  const [input, setInput] = useState<JDInput>(defaultInput);

  const update = (field: keyof JDInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoadSample = () => {
    setInput({
      ...input,
      jobTitle: "Senior Full Stack Engineer",
      jdText: sampleJDText,
      clientName: "PayScale Technologies",
      location: "Bangalore, India",
      budgetMin: "35",
      budgetMax: "55",
      budgetType: "LPA",
      experienceMin: "5",
      experienceMax: "8",
      workMode: "Hybrid",
      employmentType: "Full-time",
      priorityLevel: "High",
    });
  };

  return (
    <div className="w-full lg:w-[420px] xl:w-[440px] border-r border-slate-200 bg-white flex flex-col shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">JD Input</h2>
          <button
            onClick={handleLoadSample}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Load Sample JD
          </button>
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
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
            <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
            <p className="text-xs text-slate-500">
              Drop PDF or DOCX here, or{" "}
              <span className="text-blue-600 font-medium">browse</span>
            </p>
          </div>
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

        {/* Client Name with autocomplete */}
        <AutocompleteInput
          label="Client Name"
          placeholder="Start typing company name..."
          value={input.clientName}
          onChange={(v) => update("clientName", v)}
          suggestions={clientSuggestions}
        />

        {/* End Client */}
        <AutocompleteInput
          label="End Client"
          placeholder="End client (if staffing)"
          value={input.endClient}
          onChange={(v) => update("endClient", v)}
          suggestions={clientSuggestions}
          optional
        />

        {/* Location with autocomplete */}
        <AutocompleteInput
          label="Location"
          placeholder="Start typing city..."
          value={input.location}
          onChange={(v) => update("location", v)}
          suggestions={locationSuggestions}
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
      <div className="px-5 py-4 border-t border-slate-100">
        <Button
          onClick={() => onAnalyze(input)}
          disabled={isAnalyzing || (!input.jdText && !input.jobTitle)}
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
      </div>
    </div>
  );
}
