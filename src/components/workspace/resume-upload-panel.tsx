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
}

interface ResumeUploadPanelProps {
  onMatch: (resumes: { fileName: string; text: string }[]) => void;
  isMatching: boolean;
}

export function ResumeUploadPanel({
  onMatch,
  isMatching,
}: ResumeUploadPanelProps) {
  const [files, setFiles] = useState<ResumeFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const parseFile = async (file: File): Promise<string> => {
    // For now, read as text. PDF parsing would require a library.
    // In production, we'd use pdf-parse or send to an API.
    return file.text();
  };

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).filter(
      (f) =>
        f.type === "application/pdf" ||
        f.type === "text/plain" ||
        f.name.endsWith(".txt") ||
        f.name.endsWith(".pdf")
    );

    const resumeFiles: ResumeFile[] = fileArray.map((f) => ({
      file: f,
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: "parsing" as const,
    }));

    setFiles((prev) => [...prev, ...resumeFiles]);

    // Parse each file
    for (const rf of resumeFiles) {
      try {
        const text = await parseFile(rf.file);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === rf.id ? { ...f, status: "ready" as const, text } : f
          )
        );
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === rf.id ? { ...f, status: "error" as const } : f
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
          input.accept = ".pdf,.txt";
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
          PDF or TXT files. Upload multiple to compare.
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((rf) => (
            <div
              key={rf.id}
              className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg"
            >
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-700 truncate flex-1">
                {rf.file.name}
              </span>
              {rf.status === "parsing" && (
                <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin shrink-0" />
              )}
              {rf.status === "ready" && (
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
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

      {/* Match button */}
      {files.length > 0 && (
        <Button
          onClick={handleMatch}
          disabled={isMatching || readyCount === 0}
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
        >
          {isMatching ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scoring {readyCount} candidate{readyCount !== 1 ? "s" : ""}...
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
