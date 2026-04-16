import { supabase as supabaseClient } from './supabase';
import type { Database } from './database.types';

// Temporary: cast to any until migration generates proper types
const supabase = supabaseClient as any;

export type Workspace = any;
export type Subscription = any;
export type Usage = any;

/**
 * Get workspace with full billing context
 */
export async function getWorkspaceWithContext(workspaceId: string, userId: string) {
  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .select(`
      *,
      subscriptions (
        id,
        status,
        plan,
        razorpay_subscription_id,
        billing_cycle_end,
        paid_until
      ),
      workspace_members!inner (
        id,
        role
      )
    `)
    .eq('id', workspaceId)
    .eq('workspace_members.user_id', userId)
    .single();

  if (wsError) throw wsError;

  const subscription = workspace.subscriptions?.[0];
  const userRole = workspace.workspace_members?.[0]?.role;

  return { workspace, subscription, userRole };
}

/**
 * Calculate monthly credit usage for a workspace
 */
export async function getWorkspaceCreditUsage(workspaceId: string) {
  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .select('tier')
    .eq('id', workspaceId)
    .single();

  if (wsError) throw wsError;

  const limit = workspace.tier === 'pro' ? 30 : 5;

  // Get current month usage
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data: usageData, error: usageError } = await supabase
    .from('usage')
    .select('credits_consumed')
    .eq('workspace_id', workspaceId)
    .gte('created_at', monthStart.toISOString())
    .lte('created_at', monthEnd.toISOString());

  if (usageError) throw usageError;

  const used = usageData?.reduce((sum: number, u: any) => sum + (u.credits_consumed || 1), 0) || 0;
  const available = Math.max(0, limit - used);
  const percentUsed = Math.round((used / limit) * 100);

  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    tier: workspace.tier as 'free' | 'pro' | 'enterprise',
    limit,
    used,
    available,
    percentUsed,
    resetsAt: nextMonthStart,
  };
}

/**
 * Check if workspace can analyze (has credits)
 */
export async function canAnalyzeJD(workspaceId: string): Promise<{ can: boolean; reason?: string; used?: number; limit?: number }> {
  try {
    const credits = await getWorkspaceCreditUsage(workspaceId);

    if (credits.available <= 0) {
      return {
        can: false,
        reason: `Monthly limit reached (${credits.used}/${credits.limit}). Upgrade to Pro for 30 analyses/month.`,
        used: credits.used,
        limit: credits.limit,
      };
    }

    return { can: true };
  } catch (error) {
    console.error('Error checking credits:', error);
    // Fail open in case of errors - allow analysis
    return { can: true };
  }
}

/**
 * Log a JD analysis to usage table
 */
export async function logJDAnalysis(
  workspaceId: string,
  userId: string,
  analysisId: string,
  jobTitle: string,
  clientName?: string
) {
  const { data, error } = await supabase
    .from('usage')
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      action: 'jd_analyze',
      resource_id: analysisId,
      job_title: jobTitle,
      client_name: clientName,
      credits_consumed: 1,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error logging usage:', error);
    throw error;
  }

  return data;
}

/**
 * Get active subscription for workspace
 */
export async function getActiveSubscription(workspaceId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error?.code === 'PGRST116') {
    // No rows returned
    return null;
  }

  if (error) throw error;

  return data;
}

/**
 * Create initial workspace for new user
 */
export async function createDefaultWorkspace(userId: string, userName: string) {
  const slug = `workspace-${Date.now()}`.toLowerCase();

  const { data: workspace, error } = await supabase
    .from('workspaces')
    .insert({
      name: `${userName}'s Workspace`,
      slug,
      owner_id: userId,
      tier: 'free',
      max_members: 1,
    })
    .select('*')
    .single();

  if (error) throw error;

  // Add owner to workspace_members
  await supabase
    .from('workspace_members')
    .insert({
      workspace_id: workspace.id,
      user_id: userId,
      role: 'owner',
    });

  return workspace;
}

/**
 * Get all workspaces for a user
 */
export async function getUserWorkspaces(userId: string) {
  const { data, error } = await supabase
    .from('workspace_members')
    .select(`
      workspace_id,
      workspaces (
        id,
        name,
        slug,
        tier,
        owner_id,
        members_count,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data?.map((m: any) => m.workspaces).filter(Boolean) || [];
}

/**
 * Upgrade workspace to pro tier (called after payment confirmation)
 */
export async function upgradeWorkspaceToPro(workspaceId: string, subscriptionId: string) {
  const updates = await Promise.all([
    // Update workspace tier
    supabase
      .from('workspaces')
      .update({ tier: 'pro', max_members: 5 })
      .eq('id', workspaceId),

    // Update subscription status
    supabase
      .from('subscriptions')
      .update({
        status: 'active',
        plan: 'pro',
        billing_cycle_start: new Date().toISOString(),
        billing_cycle_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', subscriptionId),
  ]);

  const errors = updates.filter(u => u.error);
  if (errors.length > 0) {
    throw new Error(`Failed to upgrade workspace: ${errors[0].error?.message}`);
  }

  return true;
}

/**
 * Downgrade workspace back to free tier
 */
export async function downgradeWorkspaceToFree(workspaceId: string) {
  // Update workspace
  const { error } = await supabase
    .from('workspaces')
    .update({ tier: 'free', max_members: 1 })
    .eq('id', workspaceId);

  if (error) throw error;

  // Note: Don't delete subscription, just mark as cancelled (done by webhook)
  return true;
}

/**
 * Get workspace members with roles
 */
export async function getWorkspaceMembers(workspaceId: string) {
  const { data, error } = await supabase
    .from('workspace_members')
    .select(`
      id,
      user_id,
      role,
      invited_at,
      accepted_at,
      users (
        id,
        email,
        name,
        avatar_url
      )
    `)
    .eq('workspace_id', workspaceId)
    .order('invited_at', { ascending: true });

  if (error) throw error;

  return data?.map((m: any) => ({
    id: m.id,
    userId: m.user_id,
    role: m.role,
    invitedAt: m.invited_at,
    acceptedAt: m.accepted_at,
    user: m.users,
  })) || [];
}

/**
 * Invite user to workspace
 */
export async function inviteToWorkspace(workspaceId: string, email: string, role: string = 'recruiter') {
  // First, find or create user (simplified - in real app, send invite email)
  const { data: existingUser, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (findError?.code !== 'PGRST116' && findError) {
    throw findError;
  }

  const userId = existingUser?.id;
  if (!userId) {
    throw new Error('User not found. User must sign up first.');
  }

  // Add to workspace
  const { data, error } = await supabase
    .from('workspace_members')
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      role,
    })
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('User is already a member of this workspace');
    }
    throw error;
  }

  // Update workspace members count
  await supabase
    .from('workspaces')
    .update({ members_count: supabase.rpc('increment', { x: 1 }) })
    .eq('id', workspaceId);

  return data;
}

/**
 * Get workspace usage analytics for dashboard
 */
export async function getWorkspaceAnalytics(workspaceId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Current month metrics
  const { data: thisMonth } = await supabase
    .from('usage')
    .select('action, credits_consumed')
    .eq('workspace_id', workspaceId)
    .gte('created_at', monthStart.toISOString());

  const jdAnalyses = thisMonth?.filter((u: any) => u.action === 'jd_analyze').length || 0;
  const assessments = thisMonth?.filter((u: any) => u.action === 'candidate_assess').length || 0;

  // All-time metrics
  const { data: allTime } = await supabase
    .from('usage')
    .select('action')
    .eq('workspace_id', workspaceId);

  const totalAnalyses = allTime?.filter((u: any) => u.action === 'jd_analyze').length || 0;
  const totalAssessments = allTime?.filter((u: any) => u.action === 'candidate_assess').length || 0;

  return {
    thisMonth: {
      jdAnalyses,
      assessments,
      creditsUsed: thisMonth?.reduce((sum: number, u: Record<string, any>) => sum + (u.credits_consumed || 0), 0) || 0,
    },
    allTime: {
      totalAnalyses,
      totalAssessments,
    },
  };
}

/**
 * Check if webhook event already processed (idempotency)
 */
export async function isWebhookEventProcessed(eventId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('id', eventId)
    .eq('status', 'processed')
    .single();

  if (error?.code === 'PGRST116') {
    return false; // Event not processed
  }

  return !!data;
}

/**
 * Mark webhook event as processed
 */
export async function markWebhookEventProcessed(eventId: string, eventType: string) {
  const { error } = await supabase
    .from('webhook_events')
    .insert({
      id: eventId,
      event_type: eventType,
      status: 'processed',
      processed_at: new Date().toISOString(),
    })
    .onConflict('id')
    .update({ status: 'processed', processed_at: new Date().toISOString() });

  if (error) {
    console.error('Error marking webhook as processed:', error);
  }
}

/**
 * Record webhook event failure
 */
export async function recordWebhookEventFailure(eventId: string, eventType: string, error: string) {
  await supabase
    .from('webhook_events')
    .insert({
      id: eventId,
      event_type: eventType,
      status: 'failed',
      error_message: error,
    })
    .onConflict('id')
    .update({ status: 'failed', error_message: error });
}
