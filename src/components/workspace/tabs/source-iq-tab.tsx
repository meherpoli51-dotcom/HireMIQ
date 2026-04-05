"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw } from "lucide-react";
import { CopyButton } from "../copy-button";
import type { SourceIQOutput } from "@/lib/types";

const labelStyles: Record<string, string> = {
  Strict: "bg-rose-100 text-rose-700 border-rose-200",
  Balanced: "bg-blue-100 text-blue-700 border-blue-200",
  Broad: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const platformColors: Record<string, string> = {
  LinkedIn: "border-l-blue-500",
  Naukri: "border-l-violet-500",
  "Google X-Ray": "border-l-amber-500",
};

export function SourceIQTab({ data }: { data: SourceIQOutput }) {
  const [editedStrings, setEditedStrings] = useState<Record<number, string>>({});

  const platforms = [...new Set(data.booleanStrings.map((b) => b.platform))];
  const [activePlatform, setActivePlatform] = useState(platforms[0]);

  const filteredStrings = data.booleanStrings.filter(
    (b) => b.platform === activePlatform
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Platform tabs */}
      <div className="flex items-center gap-2">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activePlatform === platform
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {/* Boolean strings */}
      <div className="space-y-4">
        {filteredStrings.map((bs, idx) => {
          const globalIdx = data.booleanStrings.indexOf(bs);
          const currentText = editedStrings[globalIdx] ?? bs.query;

          return (
            <div
              key={globalIdx}
              className={`bg-white rounded-lg border border-slate-200 border-l-4 ${
                platformColors[bs.platform] || "border-l-slate-400"
              } overflow-hidden`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    {bs.platform}
                  </span>
                  <Badge
                    className={`text-[10px] ${labelStyles[bs.label]}`}
                  >
                    {bs.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={currentText} />
                  <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editable query */}
              <textarea
                value={currentText}
                onChange={(e) =>
                  setEditedStrings((prev) => ({
                    ...prev,
                    [globalIdx]: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-3 text-sm text-slate-700 font-mono bg-white border-none outline-none resize-none leading-relaxed"
              />
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
        <p className="text-xs text-slate-500">
          <strong className="text-slate-600">Tip:</strong> Start with the{" "}
          <span className="text-blue-600 font-medium">Balanced</span> search to
          calibrate results, then narrow with{" "}
          <span className="text-rose-600 font-medium">Strict</span> or widen
          with <span className="text-emerald-600 font-medium">Broad</span>{" "}
          based on your talent pool size.
        </p>
      </div>
    </div>
  );
}
