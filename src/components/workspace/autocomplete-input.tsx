"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AutocompleteInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  optional?: boolean;
}

export function AutocompleteInput({
  label,
  placeholder,
  value,
  onChange,
  suggestions,
  optional,
}: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 3) {
      const matches = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(matches);
      setOpen(matches.length > 0);
    } else {
      setOpen(false);
    }
  }, [value, suggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {label}
        {optional && (
          <span className="text-slate-400 font-normal ml-1">(optional)</span>
        )}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (value.length >= 3 && filtered.length > 0) setOpen(true);
        }}
        placeholder={placeholder}
        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
      />
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors",
                item === value && "bg-blue-50 text-blue-700"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
