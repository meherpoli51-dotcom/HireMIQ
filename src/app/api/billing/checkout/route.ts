import { NextRequest } from 'next/server';
import { requireAuth, validateRequestBody, errorResponse, successResponse, verifyWorkspaceAccess } from '@/lib/api-utils';
import { supabase as supabaseClient } from '@/lib/supabase';
import { getPublicKey } from '@/lib/razorpay';

// Temporary: cast to any until migration generates proper types
const supabase = supabaseClient as any;

/**
 * POST /api/billing/checkout
 * Initiate Razorpay payment checkout
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const { error: authError, session } = await requireAuth(request);
    if (authError) return authError;

    const { resolveUserId } = await import("@/lib/api-utils");
    const userId = await resolveUserId(session!.user!.id!, session!.user!.email);
    if (!userId) return errorResponse("User not found", 404);

    // Validate request body
    const { valid, body, error } = await validateRequestBody(request, ['workspace_id', 'plan']);
    if (!valid) return error!;

    const { workspace_id, plan } = body;

    // Verify user has access to workspace (owner/admin only)
    const { authorized, role } = await verifyWorkspaceAccess(userId, workspace_id, 'admin');
    if (!authorized) {
      return errorResponse('Unauthorized - only admins can manage billing', 403);
    }

    // Validate plan
    if (plan !== 'pro') {
      return errorResponse('Invalid plan. Only "pro" is available.', 400);
    }

    // Get workspace
    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspace_id)
      .single();

    if (wsError || !workspace) {
      return errorResponse('Workspace not found', 404);
    }

    // Get user email for Razorpay
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return errorResponse('User not found', 404);
    }

    // Create subscription record in DB (before payment)
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        workspace_id,
        plan: 'pro',
        amount_paisa: 49900, // ₹499
        status: 'pending',
      })
      .select('*')
      .single();

    if (subError || !subscription) {
      return errorResponse('Failed to create subscription record', 500);
    }

    // Return checkout details for frontend
    return successResponse({
      subscriptionId: subscription.id,
      keyId: getPublicKey(),
      amount: 49900,
      currency: 'INR',
      description: 'HireMIQ Pro Plan - Monthly Subscription',
      notes: {
        workspace_id,
        subscription_id: subscription.id,
        plan: 'pro',
      },
      prefill: {
        email: user.email,
        name: user.name || 'Valued Customer',
      },
    });
  } catch (error) {
    console.error('POST /api/billing/checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to initiate checkout';
    return errorResponse(message, 500);
  }
}
