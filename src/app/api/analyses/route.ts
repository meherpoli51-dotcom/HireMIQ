import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServerClient() as any;

    // Resolve to real DB UUID
    const { resolveUserId } = await import("@/lib/api-utils");
    const resolvedId = await resolveUserId(userId, session?.user?.email);
    if (resolvedId) userId = resolvedId;

    const { data, error } = await db
      .from("analyses")
      .select("id, job_title, client_name, location, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      // Tables may not exist yet
      console.warn("Analyses fetch error:", error.message);
      return NextResponse.json({ analyses: [] });
    }

    return NextResponse.json({ analyses: data ?? [] });
  } catch (err) {
    console.error("Analyses route error:", err);
    return NextResponse.json({ analyses: [] });
  }
}
