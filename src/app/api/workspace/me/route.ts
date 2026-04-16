import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-utils";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { error: authError, session } = await requireAuth(request);
    if (authError) return authError;

    const rawId = session!.user!.id!;
    const email = session!.user!.email || (rawId.includes("@") ? rawId : null);
    const db = createServerClient() as any;

    // Step 1: Find user — always try email first (most reliable)
    let userRow = null;

    if (email) {
      const { data } = await db.from("users").select("id").eq("email", email).single();
      userRow = data;
    }

    // If not found by email, try by ID
    if (!userRow && !rawId.includes("@")) {
      const { data } = await db.from("users").select("id").eq("id", rawId).single();
      userRow = data;
    }

    // Create user if not found
    if (!userRow && email) {
      const { data } = await db
        .from("users")
        .insert({ email, name: session!.user!.name || email.split("@")[0] })
        .select("id")
        .single();
      userRow = data;
    }

    if (!userRow?.id) {
      return errorResponse("Could not resolve user", 500);
    }

    const userId = userRow.id;

    // Step 2: Find workspace
    const { data: member } = await db
      .from("workspace_members")
      .select(`
        workspace_id,
        role,
        workspaces (id, name, slug, tier, max_members, members_count)
      `)
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (member?.workspaces) {
      return successResponse({
        workspace: { ...member.workspaces, role: member.role },
      });
    }

    // Step 3: No workspace — find one owned by this user
    const { data: ownedWs } = await db
      .from("workspaces")
      .select("id, name, slug, tier, max_members, members_count")
      .eq("owner_id", userId)
      .limit(1)
      .single();

    if (ownedWs) {
      // Re-add member link
      await db.from("workspace_members").upsert({
        workspace_id: ownedWs.id,
        user_id: userId,
        role: "owner",
        accepted_at: new Date().toISOString(),
      }, { onConflict: "workspace_id,user_id" });

      return successResponse({
        workspace: { ...ownedWs, role: "owner" },
      });
    }

    // Step 4: Create new workspace
    const slug = `ws-${userId.replace(/-/g, "").slice(0, 12)}-${Date.now()}`;
    const { data: workspace, error: wsErr } = await db
      .from("workspaces")
      .insert({
        name: session!.user!.name ? `${session!.user!.name}'s Workspace` : "My Workspace",
        slug,
        owner_id: userId,
        tier: "free",
        max_members: 1,
      })
      .select("id, name, slug, tier, max_members, members_count")
      .single();

    if (wsErr || !workspace) {
      console.error("Create workspace error:", JSON.stringify(wsErr));
      return errorResponse("Failed to create workspace: " + (wsErr?.message || "unknown"), 500);
    }

    await db.from("workspace_members").insert({
      workspace_id: workspace.id,
      user_id: userId,
      role: "owner",
      accepted_at: new Date().toISOString(),
    });

    return successResponse({
      workspace: { ...workspace, role: "owner" },
    });
  } catch (error) {
    console.error("GET /api/workspace/me error:", error);
    return errorResponse("Internal error: " + (error instanceof Error ? error.message : String(error)), 500);
  }
}
