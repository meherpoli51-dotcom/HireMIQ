import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { resolveUserId } from "@/lib/api-utils";

/**
 * GET /api/analyses — Load all analyses for the current user
 * Supports ?limit=N query param (default 100, max 500)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await resolveUserId(session.user.id || "", session.user.email);
    if (!userId) {
      return NextResponse.json({ analyses: [] });
    }

    const db = createServerClient() as any;

    // Support configurable limit via query param
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(limitParam || "100", 10) || 100, 1), 500);

    const { data, error } = await db
      .from("analyses")
      .select("id, job_title, client_name, location, work_mode, priority_level, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("Analyses fetch error:", error.message);
      return NextResponse.json({ analyses: [] });
    }

    return NextResponse.json({ analyses: data ?? [] });
  } catch (err) {
    console.error("Analyses route error:", err);
    return NextResponse.json({ analyses: [] });
  }
}
