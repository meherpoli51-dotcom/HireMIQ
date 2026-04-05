"use client";

import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AppNavbar({ title }: { title?: string }) {
  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-base font-semibold text-slate-900">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search analyses, clients..."
            className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder:text-slate-400 w-full"
          />
        </div>

        {/* New Analysis */}
        <Link href="/workspace">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 h-8">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Analysis</span>
          </Button>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>
      </div>
    </header>
  );
}
