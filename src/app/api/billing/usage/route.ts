import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getWorkspaceIdFromRequest, errorResponse, successResponse, verifyWorkspaceAccess } from '@/lib/api-utils';
import { getWorkspaceCreditUsage, getActiveSubscription, getWorkspaceAnalytics, getWorkspaceWithContext } from '@/lib/billing'

// Database types will be generated after migration runs

/**
 * GET /api/billing/usage
 * Get credit usage, subscription, and analytics for a workspace
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const { error: authError, session } = await requireAuth(request);
    if (authError) return authError;

    const { resolveUserId } = await import("@/lib/api-utils");
    const userId = await resolveUserId(session!.user!.id!, session!.user!.email);
    if (!userId) return errorResponse('User not found', 404);

    // Get workspace ID from query param
    const workspaceId = request.nextUrl.searchParams.get('workspace_id');
    if (!workspaceId) {
      return errorResponse('workspace_id is required', 400);
    }

    // Get workspace with context (skip access check — already authenticated)
    const { workspace, subscription } = await getWorkspaceWithContext(workspaceId, userId);

    // Get credit usage
    const creditUsage = await getWorkspaceCreditUsage(workspaceId);

    // Get analytics
    const analytics = await getWorkspaceAnalytics(workspaceId);

    // Build response
    const response = {
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        tier: workspace.tier,
        members: workspace.members_count,
        max_members: workspace.max_members,
      },
      credits: {
        monthly_limit: creditUsage.limit,
        monthly_used: creditUsage.used,
        total_available: creditUsage.available,
        percent_used: creditUsage.percentUsed,
        resets_at: creditUsage.resetsAt.toISOString(),
      },
      subscription: subscription ? {
        id: subscription.id,
        status: subscription.status,
        plan: subscription.plan,
        next_billing_date: subscription.billing_cycle_end?.toISOString() || null,
        razorpay_subscription_id: subscription.razorpay_subscription_id,
      } : {
        id: null,
        status: 'none',
        plan: 'free',
        next_billing_date: null,
        razorpay_subscription_id: null,
      },
      analytics: {
        this_month: {
          jd_analyses: analytics.thisMonth.jdAnalyses,
          assessments: analytics.thisMonth.assessments,
          credits_used: analytics.thisMonth.creditsUsed,
        },
        all_time: {
          total_analyses: analytics.allTime.totalAnalyses,
          total_assessments: analytics.allTime.totalAssessments,
        },
      },
      upgrade_message: creditUsage.percentUsed >= 80
        ? `You've used ${creditUsage.used} of ${creditUsage.limit} analyses. Upgrade to Pro for ${creditUsage.tier === 'free' ? '30' : 'unlimited'} analyses/month.`
        : creditUsage.available === 0
          ? `Free tier limit reached. Upgrade to Pro for unlimited analyses.`
          : null,
    };

    return successResponse(response);
  } catch (error) {
    console.error('GET /api/billing/usage error:', error);
    const message = error instanceof Error ? error.message : 'Failed to get usage';
    return errorResponse(message, 500);
  }
}
