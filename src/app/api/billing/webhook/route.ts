import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { supabase as supabaseClient } from '@/lib/supabase';
import {
  isWebhookEventProcessed,
  markWebhookEventProcessed,
  recordWebhookEventFailure,
  upgradeWorkspaceToPro,
  downgradeWorkspaceToFree,
} from '@/lib/billing';

const supabase = supabaseClient as any;

/**
 * POST /api/billing/webhook
 * Handle Razorpay webhook events
 * Verify signature, check idempotency, and process payment events
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured');
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  try {
    // Get body as text for signature verification
    const body = await request.text();

    // Verify signature
    const signature = request.headers.get('x-razorpay-signature');
    if (!signature) {
      return new NextResponse('Missing signature', { status: 401 });
    }

    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return new NextResponse('Invalid signature', { status: 403 });
    }

    // Parse body
    const event = JSON.parse(body);
    const { id: eventId, event: eventType, entity } = event;

    // Check idempotency
    const alreadyProcessed = await isWebhookEventProcessed(eventId);
    if (alreadyProcessed) {
      console.log(`Webhook ${eventId} already processed, skipping`);
      return new NextResponse('OK', { status: 200 });
    }

    // Process event
    try {
      switch (eventType) {
        case 'subscription.activated':
          await handleSubscriptionActivated(entity);
          break;

        case 'subscription.paused':
          await handleSubscriptionPaused(entity);
          break;

        case 'subscription.cancelled':
          await handleSubscriptionCancelled(entity);
          break;

        case 'subscription.expired':
          await handleSubscriptionExpired(entity);
          break;

        case 'payment.failed':
          await handlePaymentFailed(entity);
          break;

        default:
          console.log(`Unhandled event type: ${eventType}`);
      }

      // Mark as processed
      await markWebhookEventProcessed(eventId, eventType);
      return new NextResponse('OK', { status: 200 });
    } catch (processError) {
      const message = processError instanceof Error ? processError.message : 'Unknown error';
      await recordWebhookEventFailure(eventId, eventType, message);
      throw processError;
    }
  } catch (error) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(message, { status: 500 });
  }
}

/**
 * Handle subscription.activated event
 */
async function handleSubscriptionActivated(entity: any) {
  const razorpaySubId = entity.id;
  const customerId = entity.customer_id;

  console.log(`Processing subscription activation: ${razorpaySubId}`);

  // Find subscription in DB
  const { data: subscription, error: findError } = await supabase
    .from('subscriptions')
    .select('id, workspace_id')
    .eq('razorpay_subscription_id', razorpaySubId)
    .single();

  if (findError || !subscription) {
    console.warn(`Subscription not found for razorpay_id: ${razorpaySubId}`);
    // Try to find by workspace if this is a retry
    return;
  }

  // Update subscription status
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      plan: 'pro',
      razorpay_customer_id: customerId,
      billing_cycle_start: new Date(entity.current_start * 1000).toISOString(),
      billing_cycle_end: new Date(entity.current_end * 1000).toISOString(),
      paid_until: new Date(entity.current_end * 1000).toISOString(),
    })
    .eq('id', subscription.id);

  if (updateError) {
    throw new Error(`Failed to update subscription: ${updateError.message}`);
  }

  // Upgrade workspace to pro
  await upgradeWorkspaceToPro(subscription.workspace_id, subscription.id);

  console.log(`Subscription activated: ${subscription.id}`);
}

/**
 * Handle subscription.paused event
 */
async function handleSubscriptionPaused(entity: any) {
  const razorpaySubId = entity.id;

  console.log(`Processing subscription pause: ${razorpaySubId}`);

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'paused',
    })
    .eq('razorpay_subscription_id', razorpaySubId);

  if (error) {
    throw new Error(`Failed to update subscription status: ${error.message}`);
  }

  console.log(`Subscription paused: ${razorpaySubId}`);
}

/**
 * Handle subscription.cancelled event
 */
async function handleSubscriptionCancelled(entity: any) {
  const razorpaySubId = entity.id;

  console.log(`Processing subscription cancellation: ${razorpaySubId}`);

  // Find and update subscription
  const { data: subscription, error: findError } = await supabase
    .from('subscriptions')
    .select('id, workspace_id')
    .eq('razorpay_subscription_id', razorpaySubId)
    .single();

  if (findError || !subscription) {
    console.warn(`Subscription not found for razorpay_id: ${razorpaySubId}`);
    return;
  }

  // Update subscription
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', subscription.id);

  if (updateError) {
    throw new Error(`Failed to update subscription: ${updateError.message}`);
  }

  // Downgrade workspace
  await downgradeWorkspaceToFree(subscription.workspace_id);

  console.log(`Subscription cancelled: ${subscription.id}`);
}

/**
 * Handle subscription.expired event
 */
async function handleSubscriptionExpired(entity: any) {
  const razorpaySubId = entity.id;

  console.log(`Processing subscription expiration: ${razorpaySubId}`);

  // Find and update subscription
  const { data: subscription, error: findError } = await supabase
    .from('subscriptions')
    .select('id, workspace_id')
    .eq('razorpay_subscription_id', razorpaySubId)
    .single();

  if (findError || !subscription) {
    console.warn(`Subscription not found for razorpay_id: ${razorpaySubId}`);
    return;
  }

  // Update subscription
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: 'expired',
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', subscription.id);

  if (updateError) {
    throw new Error(`Failed to update subscription: ${updateError.message}`);
  }

  // Downgrade workspace
  await downgradeWorkspaceToFree(subscription.workspace_id);

  console.log(`Subscription expired: ${subscription.id}`);
}

/**
 * Handle payment.failed event
 */
async function handlePaymentFailed(entity: any) {
  const paymentId = entity.id;
  const subscriptionId = entity.subscription_id;

  console.log(`Processing payment failure: ${paymentId}`);

  if (!subscriptionId) {
    console.warn(`Payment ${paymentId} has no subscription_id`);
    return;
  }

  // Find subscription
  const { data: subscription, error: findError } = await supabase
    .from('subscriptions')
    .select('id, failure_count')
    .eq('razorpay_subscription_id', subscriptionId)
    .single();

  if (findError || !subscription) {
    console.warn(`Subscription not found for razorpay_id: ${subscriptionId}`);
    return;
  }

  const failureCount = (subscription.failure_count || 0) + 1;

  // Update subscription with failure info
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: failureCount >= 3 ? 'paused' : 'payment_failed',
      failure_count: failureCount,
      failure_reason: entity.error_description || 'Unknown error',
      attempted_charge_date: new Date().toISOString(),
    })
    .eq('id', subscription.id);

  if (updateError) {
    throw new Error(`Failed to update subscription: ${updateError.message}`);
  }

  console.log(`Payment failed for subscription ${subscription.id} (attempt ${failureCount})`);
}
