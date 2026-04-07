"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/layout/app-navbar";
import {
  FileSearch,
  Plus,
  Briefcase,
  Building2,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <>
      <AppNavbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Welcome section */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back to HireMIQ
            </h1>
            <p className="text-slate-500">
              Manage your recruitment pipeline and analyze job descriptions with AI intelligence.
            </p>
          </div>

          {/* Quick action cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Start Analysis */}
            <Link href="/workspace">
              <div className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg hover:border-brand-300 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <FileSearch className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Analyze a Job Description
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Upload or paste a JD to get AI-powered insights, Boolean strings, and candidate matching.
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  Start Analysis
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* View Pipeline */}
            <Link href="/pipeline">
              <div className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg hover:border-brand-300 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  View Your Pipeline
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Track candidates across all stages: Sourced, Screened, Assessment, Interview, and more.
                </p>
                <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  Open Pipeline
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>

          {/* Features overview */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Platform Features
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: FileSearch,
                  title: "JD Analysis",
                  desc: "8 AI modules to decode job descriptions",
                },
                {
                  icon: Users,
                  title: "Candidate Matching",
                  desc: "AI-powered scoring and skill mapping",
                },
                {
                  icon: Building2,
                  title: "Pipeline Management",
                  desc: "Track candidates through all hiring stages",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-white rounded-xl border border-slate-200 p-6"
                  >
                    <Icon className="w-8 h-8 text-brand-500 mb-3" />
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA section */}
          <div className="bg-gradient-to-r from-brand-50 to-brand-100/50 rounded-2xl border border-brand-200 p-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Ready to streamline your hiring?
            </h3>
            <p className="text-slate-600 mb-6">
              Start by analyzing a job description or exploring your recruitment pipeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/workspace">
                <Button className="bg-brand-500 hover:bg-brand-600 text-white gap-2">
                  <FileSearch className="w-4 h-4" />
                  New Analysis
                </Button>
              </Link>
              <Link href="/pipeline">
                <Button variant="outline" className="gap-2">
                  <Briefcase className="w-4 h-4" />
                  View Pipeline
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
