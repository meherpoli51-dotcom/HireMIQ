import { NextRequest, NextResponse } from "next/server";
import { analyzeJD } from "@/lib/ai/analyze";
import { auth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { resolveUserId } from "@/lib/api-utils";
import type { JDInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // Check auth and resolve real UUID — REQUIRED
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = await resolveUserId(session.user.id || "", session.user.email);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const input: JDInput = await request.json();

    // Get workspace_id — from request body, query param, or auto-lookup from user
    let workspaceId =
      (input as any).workspace_id ||
      request.nextUrl.searchParams.get("workspace_id");

    // Auto-lookup workspace from user if not provided
    if (!workspaceId && userId) {
      try {
        const db = createServerClient() as any;
        const { data: member } = await db
          .from("workspace_members")
          .select("workspace_id")
          .eq("user_id", userId)
          .limit(1)
          .single();
        if (member?.workspace_id) workspaceId = member.workspace_id;
      } catch { /* skip */ }
    }

    // Credit check — enforce 5 JDs/month for free tier
    if (workspaceId && userId) {
      try {
        const { canAnalyzeJD } = await import("@/lib/billing");
        const creditCheck = await canAnalyzeJD(workspaceId);
        if (!creditCheck.can) {
          return NextResponse.json(
            { error: creditCheck.reason, upgrade_required: true },
            { status: 402 }
          );
        }
      } catch (billingErr) {
        console.warn("Billing check skipped:", billingErr);
      }
    }

    const result = await analyzeJD(input);

    // Persist analysis to Supabase (non-blocking — never fails the request)
    if (userId) {
      try {
        const db = createServerClient() as any;
        const { data: savedAnalysis, error: saveErr } = await db.from("analyses").insert({
          user_id: userId,
          job_title: input.jobTitle,
          client_name: input.clientName,
          location: input.location || "",
          work_mode: input.workMode || "Hybrid",
          priority_level: input.priorityLevel || "High",
          status: "completed",
          input: input as unknown as Record<string, unknown>,
          result: result as unknown as Record<string, unknown>,
        }).select("id").single();
        if (saveErr) console.warn("Analysis save error:", saveErr);
        else console.log("Analysis saved:", savedAnalysis?.id);
      } catch (dbErr) {
        console.warn("Analysis save skipped:", dbErr);
      }
    }

    // Log usage (non-blocking, skip if billing not ready)
    if (workspaceId && userId) {
      try {
        const { logJDAnalysis } = await import("@/lib/billing");
        await logJDAnalysis(
          workspaceId,
          userId,
          result.id,
          input.jobTitle,
          input.clientName
        );
      } catch (logError) {
        console.warn("Usage logging skipped:", logError);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);

    const message =
      error instanceof Error ? error.message : "Analysis failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
