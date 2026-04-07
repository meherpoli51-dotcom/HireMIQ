"use client";

/**
 * HireMIQ — Board Hydrator
 * ==========================
 * Client component that seeds the Zustand store with mock data on
 * first mount, then renders the full pipeline board.
 *
 * Swap `generateMockCandidates()` for a Supabase fetch (server action)
 * when the DB is ready — no other file changes needed.
 */

import { useEffect } from "react";
import { useKanbanStore } from "@/store/use-kanban-store";
import { type PipelineCandidate, type PipelineStage } from "@/types/kanban";
import { BoardContainer } from "./board-container";
import { PipelineHeader } from "./pipeline-header";

/* ------------------------------------------------------------------ */
/*  Mock seed data                                                     */
/* ------------------------------------------------------------------ */

function generateMockCandidates(): PipelineCandidate[] {
  const now = new Date().toISOString();

  const seed: Omit<PipelineCandidate, "createdAt" | "updatedAt" | "movedAt">[] = [
    // ── Sourced ──
    {
      id: "c1",
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      phone: "+91 98765 43210",
      matchScore: 87,
      matchBreakdown: { skills: 90, culture: 85, seniority: 86 },
      source: "linkedin",
      priority: "high",
      stage: "sourced",
      order: 0,
      jobId: "j1",
      jobTitle: "Senior Frontend Engineer",
      clientName: "Razorpay",
      skillBreakdown: [
        { skill: "React", score: 95, verdict: "strong" },
        { skill: "TypeScript", score: 88, verdict: "strong" },
        { skill: "System Design", score: 72, verdict: "strong" },
      ],
      booleanStrings: [
        '("React" OR "Next.js") AND ("TypeScript") AND ("frontend" OR "UI engineer") site:linkedin.com',
      ],
    },
    {
      id: "c2",
      name: "Arjun Mehta",
      email: "arjun.mehta@outlook.com",
      matchScore: 63,
      matchBreakdown: { skills: 65, culture: 60, seniority: 64 },
      source: "naukri",
      priority: "medium",
      stage: "sourced",
      order: 1,
      jobId: "j1",
      jobTitle: "Senior Frontend Engineer",
      clientName: "Razorpay",
      skillBreakdown: [
        { skill: "React", score: 70, verdict: "strong" },
        { skill: "TypeScript", score: 55, verdict: "moderate" },
        { skill: "System Design", score: 48, verdict: "moderate" },
      ],
    },
    {
      id: "c3",
      name: "Neha Kulkarni",
      email: "neha.k@yahoo.com",
      matchScore: 41,
      matchBreakdown: { skills: 40, culture: 45, seniority: 38 },
      source: "indeed",
      priority: "low",
      stage: "sourced",
      order: 2,
      jobId: "j2",
      jobTitle: "Product Manager",
      clientName: "Swiggy",
    },

    // ── Screened ──
    {
      id: "c4",
      name: "Rahul Verma",
      email: "rahul.verma@proton.me",
      phone: "+91 87654 32109",
      matchScore: 79,
      matchBreakdown: { skills: 82, culture: 78, seniority: 77 },
      source: "referral",
      priority: "high",
      stage: "screened",
      order: 0,
      jobId: "j2",
      jobTitle: "Product Manager",
      clientName: "Swiggy",
      skillBreakdown: [
        { skill: "Product Strategy", score: 85, verdict: "strong" },
        { skill: "Data Analysis", score: 78, verdict: "strong" },
        { skill: "Stakeholder Mgmt", score: 72, verdict: "strong" },
      ],
    },
    {
      id: "c5",
      name: "Sneha Iyer",
      email: "sneha.iyer@gmail.com",
      matchScore: 55,
      matchBreakdown: { skills: 52, culture: 60, seniority: 53 },
      source: "linkedin",
      priority: "medium",
      stage: "screened",
      order: 1,
      jobId: "j3",
      jobTitle: "Backend Engineer (Go)",
      clientName: "Zepto",
    },

    // ── Assessment Sent ──
    {
      id: "c6",
      name: "Karan Joshi",
      email: "karan.joshi@gmail.com",
      phone: "+91 99887 76655",
      matchScore: 91,
      matchBreakdown: { skills: 93, culture: 90, seniority: 90 },
      source: "internal",
      priority: "high",
      stage: "assessment_sent",
      order: 0,
      jobId: "j3",
      jobTitle: "Backend Engineer (Go)",
      clientName: "Zepto",
      skillBreakdown: [
        { skill: "Golang", score: 95, verdict: "strong" },
        { skill: "Microservices", score: 90, verdict: "strong" },
        { skill: "Kubernetes", score: 88, verdict: "strong" },
      ],
      booleanStrings: [
        '("Golang" OR "Go lang") AND ("microservices" OR "gRPC") AND ("Kubernetes") site:linkedin.com',
      ],
    },
    {
      id: "c7",
      name: "Divya Nair",
      email: "divya.nair@hotmail.com",
      matchScore: 68,
      matchBreakdown: { skills: 70, culture: 65, seniority: 69 },
      source: "naukri",
      priority: "medium",
      stage: "assessment_sent",
      order: 1,
      jobId: "j4",
      jobTitle: "Data Scientist",
      clientName: "PhonePe",
    },

    // ── Interview Scheduled ──
    {
      id: "c8",
      name: "Vikram Malhotra",
      email: "vikram.m@gmail.com",
      phone: "+91 91234 56789",
      matchScore: 84,
      matchBreakdown: { skills: 86, culture: 82, seniority: 84 },
      source: "linkedin",
      priority: "high",
      stage: "interview_scheduled",
      order: 0,
      jobId: "j4",
      jobTitle: "Data Scientist",
      clientName: "PhonePe",
      skillBreakdown: [
        { skill: "Python / ML", score: 90, verdict: "strong" },
        { skill: "SQL & Analytics", score: 85, verdict: "strong" },
        { skill: "Deep Learning", score: 76, verdict: "strong" },
      ],
    },
    {
      id: "c9",
      name: "Anjali Singh",
      email: "anjali.singh@gmail.com",
      matchScore: 72,
      matchBreakdown: { skills: 75, culture: 70, seniority: 71 },
      source: "referral",
      priority: "medium",
      stage: "interview_scheduled",
      order: 1,
      jobId: "j1",
      jobTitle: "Senior Frontend Engineer",
      clientName: "Razorpay",
    },

    // ── Offered ──
    {
      id: "c10",
      name: "Rohan Gupta",
      email: "rohan.gupta@proton.me",
      phone: "+91 98001 23456",
      matchScore: 93,
      matchBreakdown: { skills: 95, culture: 91, seniority: 93 },
      source: "linkedin",
      priority: "high",
      stage: "offered",
      order: 0,
      jobId: "j5",
      jobTitle: "Engineering Manager",
      clientName: "CRED",
      skillBreakdown: [
        { skill: "Technical Leadership", score: 96, verdict: "strong" },
        { skill: "System Design", score: 92, verdict: "strong" },
        { skill: "People Management", score: 91, verdict: "strong" },
      ],
    },

    // ── Joined ──
    {
      id: "c11",
      name: "Meera Pillai",
      email: "meera.pillai@gmail.com",
      matchScore: 88,
      matchBreakdown: { skills: 90, culture: 87, seniority: 87 },
      source: "referral",
      priority: "high",
      stage: "joined",
      order: 0,
      jobId: "j5",
      jobTitle: "Engineering Manager",
      clientName: "CRED",
    },

    // ── Rejected ──
    {
      id: "c12",
      name: "Aditya Rao",
      email: "aditya.rao@gmail.com",
      matchScore: 32,
      matchBreakdown: { skills: 30, culture: 35, seniority: 31 },
      source: "indeed",
      priority: "low",
      stage: "rejected",
      order: 0,
      jobId: "j2",
      jobTitle: "Product Manager",
      clientName: "Swiggy",
    },
    {
      id: "c13",
      name: "Pooja Desai",
      email: "pooja.desai@outlook.com",
      matchScore: 28,
      matchBreakdown: { skills: 25, culture: 30, seniority: 29 },
      source: "naukri",
      priority: "low",
      stage: "rejected",
      order: 1,
      jobId: "j3",
      jobTitle: "Backend Engineer (Go)",
      clientName: "Zepto",
    },
  ];

  return seed.map((c) => ({
    ...c,
    createdAt: now,
    updatedAt: now,
    movedAt: now,
  }));
}

/* ------------------------------------------------------------------ */
/*  Board Hydrator Component                                           */
/* ------------------------------------------------------------------ */

export function BoardHydrator() {
  const hydrate = useKanbanStore((s) => s.hydrate);
  const isLoading = useKanbanStore((s) => s.isLoading);

  useEffect(() => {
    // Hydrate with mock data (replace with Supabase fetch later)
    hydrate(generateMockCandidates());
  }, [hydrate]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-brand-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">
            Loading pipeline…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PipelineHeader />
      <div className="flex-1 overflow-hidden p-4">
        <BoardContainer />
      </div>
    </div>
  );
}
