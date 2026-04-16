"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  X,
  Loader2,
  Users,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResumeFile {
  file: File;
  id: string;
  status: "pending" | "parsing" | "ready" | "error";
  text?: string;
  error?: string;
}

interface ResumeUploadPanelProps {
  onMatch: (resumes: { fileName: string; text: string }[]) => void;
  isMatching: boolean;
  hasAnalysis?: boolean;
}

export function ResumeUploadPanel({
  onMatch,
  isMatching,
  hasAnalysis = true,
}: ResumeUploadPanelProps) {
  const [files, setFiles] = useState<ResumeFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const parseFile = async (file: File): Promise<string> => {
    // For plain text files, read directly on client
    if (file.name.toLowerCase().endsWith(".txt") || file.type === "text/plain") {
      return file.text();
    }

    // For PDF/DOCX, send to server for proper parsing
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse-resume", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to parse resume");
    }

    return data.text;
  };

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const validExtensions = [".pdf", ".txt", ".docx", ".doc"];
    const fileArray = Array.from(newFiles).filter((f) => {
      const ext = f.name.toLowerCase().substring(f.name.lastIndexOf("."));
      return validExtensions.includes(ext);
    });

    if (fileArray.length === 0) return;

    const resumeFiles: ResumeFile[] = fileArray.map((f) => ({
      file: f,
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: "parsing" as const,
    }));

    setFiles((prev) => [...prev, ...resumeFiles]);

    // Parse each file via server-side API
    for (const rf of resumeFiles) {
      try {
        const text = await parseFile(rf.file);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === rf.id ? { ...f, status: "ready" as const, text } : f
          )
        );
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to parse";
        setFiles((prev) =>
          prev.map((f) =>
            f.id === rf.id
              ? { ...f, status: "error" as const, error: errorMsg }
              : f
          )
        );
      }
    }
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleMatch = () => {
    const ready = files
      .filter((f) => f.status === "ready" && f.text)
      .map((f) => ({ fileName: f.file.name, text: f.text! }));
    if (ready.length) onMatch(ready);
  };

  const readyCount = files.filter((f) => f.status === "ready").length;
  const parsingCount = files.filter((f) => f.status === "parsing").length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4.5 h-4.5 text-blue-600" />
        <h3 className="text-sm font-semibold text-slate-900">
          Candidate Match Intelligence
        </h3>
      </div>
      <p className="text-xs text-slate-500 -mt-2">
        Upload candidate resumes to score against this JD
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer",
          isDragOver
            ? "border-blue-400 bg-blue-50/50"
            : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
        )}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.accept = ".pdf,.txt,.docx,.doc";
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files?.length) addFiles(target.files);
          };
          input.click();
        }}
      >
        <Upload
          className={cn(
            "w-6 h-6 mx-auto mb-2",
            isDragOver ? "text-blue-500" : "text-slate-400"
          )}
        />
        <p className="text-sm text-slate-600 font-medium">
          Drop resumes here or{" "}
          <span className="text-blue-600">browse files</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          PDF, DOCX, or TXT files. Upload multiple to compare.
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((rf) => (
            <div
              key={rf.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg",
                rf.status === "error" ? "bg-red-50" : "bg-slate-50"
              )}
            >
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-slate-700 truncate block">
                  {rf.file.name}
                </span>
                {rf.status === "error" && rf.error && (
                  <span className="text-[10px] text-red-500 block truncate">
                    {rf.error}
                  </span>
                )}
              </div>
              {rf.status === "parsing" && (
                <span className="flex items-center gap-1 shrink-0">
                  <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                  <span className="text-[10px] text-blue-600">Parsing...</span>
                </span>
              )}
              {rf.status === "ready" && (
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                  Ready
                </span>
              )}
              {rf.status === "error" && (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(rf.id);
                }}
                className="text-slate-400 hover:text-slate-600 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No analysis warning */}
      {!hasAnalysis && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            Analyze a JD first — then upload resumes to score candidates against it.
          </p>
        </div>
      )}

      {/* Match button */}
      {/* Scoring animation */}
      {isMatching && (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite] -skew-x-12" />
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-3 border-blue-200 border-t-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">
                AI is scoring {readyCount} candidate{readyCount !== 1 ? "s" : ""}...
              </p>
              <p className="text-xs text-blue-600 mt-0.5 animate-pulse">
                Analyzing skills, experience, and match quality
              </p>
            </div>
          </div>
          <div className="relative mt-3 h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-[progress_8s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Match button */}
      {files.length > 0 && !isMatching && (
        <Button
          onClick={handleMatch}
          disabled={readyCount === 0 || parsingCount > 0 || !hasAnalysis}
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {parsingCount > 0 ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Parsing {parsingCount} file{parsingCount !== 1 ? "s" : ""}...
            </>
          ) : !hasAnalysis ? (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Analyze a JD first
            </>
          ) : (
            <>
              <Users className="w-4 h-4 mr-2" />
              Match {readyCount} Resume{readyCount !== 1 ? "s" : ""} Against JD
            </>
          )}
        </Button>
      )}
    </div>
  );
}
