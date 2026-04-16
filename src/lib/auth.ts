import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createServerClient } from "./supabase";

const providers = [];

// Only add Google if fully configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  try {
    providers.push(
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    );
  } catch {
    console.warn("Google OAuth provider failed to initialize");
  }
}

providers.push(
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
    },
    authorize(credentials) {
      const email = credentials?.email as string;
      if (!email) return null;
      return {
        id: email,
        email,
        name: email.split("@")[0],
      };
    },
  })
);

/**
 * Ensure a workspace exists for a user.
 * Called on every sign-in — idempotent (only creates if missing).
 */
async function ensureUserExists(userId: string, email: string, name: string) {
  try {
    const db = createServerClient();
    // If userId looks like an email (credentials provider), upsert by email
    if (userId.includes("@")) {
      const { data: existing } = await (db as any)
        .from("users")
        .select("id")
        .eq("email", userId)
        .single();
      if (!existing) {
        await (db as any).from("users").insert({ email: userId, name });
      }
    } else {
      // UUID — normal upsert
      await (db as any).from("users").upsert(
        { id: userId, email, name },
        { onConflict: "id", ignoreDuplicates: true }
      );
    }
  } catch (err) {
    console.warn("ensureUserExists error:", err);
  }
}

async function ensureWorkspaceExists(userId: string, userName: string) {
  try {
    const db = createServerClient();

    // Resolve real UUID if userId is an email
    let realUserId = userId;
    if (userId.includes("@")) {
      const { data: userRow } = await (db as any)
        .from("users").select("id").eq("email", userId).single();
      if (!userRow?.id) return null;
      realUserId = userRow.id;
    }
    userId = realUserId;

    // Check if user already has a workspace
    const { data: existing } = await (db as any)
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (existing?.workspace_id) return existing.workspace_id;

    // Create a default workspace
    const slug = `ws-${userId.replace(/-/g, "").slice(0, 12)}-${Date.now()}`;
    const workspaceName = userName
      ? `${userName}'s Workspace`
      : "My Workspace";

    const { data: workspace, error: wsError } = await (db as any)
      .from("workspaces")
      .insert({
        name: workspaceName,
        slug,
        owner_id: userId,
        tier: "free",
        max_members: 1,
      })
      .select("id")
      .single();

    if (wsError || !workspace) {
      console.error("Failed to create workspace:", wsError);
      return null;
    }

    // Add user as owner to workspace_members
    await (db as any).from("workspace_members").insert({
      workspace_id: workspace.id,
      user_id: userId,
      role: "owner",
      accepted_at: new Date().toISOString(),
    });

    // Update user's primary_workspace_id
    await (db as any)
      .from("users")
      .update({ primary_workspace_id: workspace.id })
      .eq("id", userId);

    console.log(`Created workspace ${workspace.id} for user ${userId}`);
    return workspace.id;
  } catch (err) {
    // Don't fail login if workspace creation fails
    console.error("ensureWorkspaceExists error:", err);
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth }) {
      // Return true if user is signed in — proxy will redirect to signIn page otherwise
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // 1. Ensure user row exists in DB
        await ensureUserExists(
          user.id as string,
          user.email as string,
          user.name as string
        );
        // 2. Ensure workspace exists
        const workspaceId = await ensureWorkspaceExists(
          user.id as string,
          user.name as string
        );
        if (workspaceId) {
          token.workspaceId = workspaceId;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        // Expose workspaceId on session for frontend
        (session.user as any).workspaceId = token.workspaceId as string | undefined;
      }
      return session;
    },
  },
});
