"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/layout/app-navbar";
import { Badge } from "@/components/ui/badge";
import {
  FileSearch,
  Plus,
  Clock,
  MapPin,
  Building2,
  TrendingUp,
  Briefcase,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockWorkspaceCards } from "@/lib/mock-data";

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  draft: "bg-slate-50 text-slate-600 border-slate-200",
};

const priorityStyles: Record<string, string> = {
  Urgent: "bg-rose-50 text-rose-700 border-rose-200",
  High: "bg-amber-50 text-amber-700 border-amber-200",
  Medium: "bg-blue-50 text-blue-700 border-blue-200",
  Low: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function DashboardPage() {
  return (
    <>
      <AppNavbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Analyses",
                value: "24",
                change: "+6 this week",
                icon: FileSearch,
                color: "text-blue-600 bg-blue-50",
              },
              {
                label: "Active JDs",
                value: "8",
                change: "3 high priority",
                icon: Briefcase,
                color: "text-violet-600 bg-violet-50",
              },
              {
                label: "Clients",
                value: "12",
                change: "2 new this month",
                icon: Building2,
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                label: "Candidates Reached",
                value: "156",
                change: "+32 this week",
                icon: Users,
                color: "text-amber-600 bg-amber-50",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Recent Analyses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Analyses
              </h2>
              <Link href="/workspace">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 h-8"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Analysis
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockWorkspaceCards.map((card) => (
                <Link
                  key={card.id}
                  href="/workspace"
                  className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                        {card.jobTitle}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Building2 className="w-3 h-3" />
                        {card.clientName}
                      </p>
                    </div>
                    <Badge
                      className={`text-[10px] shrink-0 ${statusStyles[card.status]}`}
                    >
                      {card.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {card.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {card.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-[10px] ${priorityStyles[card.priorityLevel]}`}
                    >
                      {card.priorityLevel}
                    </Badge>
                    <Badge className="text-[10px] bg-slate-50 text-slate-600 border-slate-200">
                      {card.workMode}
                    </Badge>
                  </div>
                </Link>
              ))}

              {/* Empty state card */}
              <Link
                href="/workspace"
                className="group flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-200 p-8 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer min-h-[180px]"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                  <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-sm font-medium text-slate-500 group-hover:text-blue-700 transition-colors">
                  Start New Analysis
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Paste a JD to get started
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
