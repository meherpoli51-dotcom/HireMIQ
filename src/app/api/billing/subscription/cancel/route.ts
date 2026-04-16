import { NextRequest } from 'next/server';
import { requireAuth, validateRequestBody, errorResponse, successResponse, verifyWorkspaceAccess } from '@/lib/api-utils';
import { supabase as supabaseClient } from '@/lib/supabase';
import { getActiveSubscription } from '@/lib/billing';
import { cancelSubscription } from '@/lib/razorpay';

const supabase = supabaseClient as any;

/**
 * PUT /api/billing/subscription/cancel
 * Cancel an active subscription
 */
export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const { error: authError, session } = await requireAuth(request);
    if (authError) return authError;

    const { resolveUserId } = await import("@/lib/api-utils");
    const userId = await resolveUserId(session!.user!.id!, session!.user!.email);
    if (!userId) return errorResponse("User not found", 404);

    // Validate request body
    const { valid, body, error } = await validateRequestBody(request, ['workspace_id']);
    if (!valid) return error!;

    const { workspace_id, cancellation_reason } = body;

    // Verify user is owner of workspace
    const { authorized, role } = await verifyWorkspaceAccess(userId, workspace_id, 'owner');
    if (!authorized) {
      return errorResponse('Only workspace owners can cancel subscriptions', 403);
    }

    // Get active subscription
    const subscription = await getActiveSubscription(workspace_id);
    if (!subscription) {
      return errorResponse('No active subscription found', 404);
    }

    // Cancel with Razorpay
    if (subscription.razorpay_subscription_id) {
      try {
        await cancelSubscription(subscription.razorpay_subscription_id);
      } catch (rzpError) {
        console.error('Razorpay cancellation error:', rzpError);
        // Continue anyway - mark as cancelled locally even if Razorpay fails
        // (webhook will eventually sync state)
      }
    }

    // Update subscription status locally
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: cancellation_reason || 'User requested cancellation',
      })
      .eq('id', subscription.id);

    if (updateError) {
      return errorResponse('Failed to cancel subscription', 500);
    }

    // Downgrade workspace (webhook will also do this, but be explicit)
    const { error: wsError } = await supabase
      .from('workspaces')
      .update({ tier: 'free', max_members: 1 })
      .eq('id', workspace_id);

    if (wsError) {
      console.error('Failed to downgrade workspace:', wsError);
      // Don't fail the request - subscription is already cancelled
    }

    return successResponse({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        id: subscription.id,
        status: 'cancelled',
      },
    });
  } catch (error) {
    console.error('PUT /api/billing/subscription/cancel error:', error);
    const message = error instanceof Error ? error.message : 'Failed to cancel subscription';
    return errorResponse(message, 500);
  }
}
