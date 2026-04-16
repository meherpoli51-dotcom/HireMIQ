import crypto from 'crypto';
import axios from 'axios';

const RAZORPAY_API_URL = 'https://api.razorpay.com/v1';

/**
 * Initialize Razorpay API client
 */
function getRazorpayAuth() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  return {
    auth: {
      username: keyId,
      password: keySecret,
    },
  };
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return hash === signature;
  } catch {
    return false;
  }
}

/**
 * Create Razorpay order for one-time payment
 */
export async function createOrder(
  amount: number, // in paise (e.g., 49900 for ₹499)
  receipt: string,
  description: string = 'HireMIQ Pro Subscription'
) {
  try {
    const auth = getRazorpayAuth();

    const response = await axios.post(
      `${RAZORPAY_API_URL}/orders`,
      {
        amount,
        currency: 'INR',
        receipt,
        description,
        payment_capture: 1,
      },
      auth
    );

    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

/**
 * Create Razorpay subscription (recurring)
 */
export async function createSubscription(
  planId: string,
  customerNotify: 1 | 0 = 1,
  quantity: number = 1,
  totalCount: number = 120 // 10 years of monthly subscriptions
) {
  try {
    const auth = getRazorpayAuth();

    const response = await axios.post(
      `${RAZORPAY_API_URL}/subscriptions`,
      {
        plan_id: planId,
        customer_notify: customerNotify,
        quantity,
        total_count: totalCount,
      },
      auth
    );

    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay subscription:', error);
    throw error;
  }
}

/**
 * Cancel Razorpay subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const auth = getRazorpayAuth();

    const response = await axios.post(
      `${RAZORPAY_API_URL}/subscriptions/${subscriptionId}/cancel`,
      {
        notify_customer: 1,
      },
      auth
    );

    return response.data;
  } catch (error) {
    console.error('Error cancelling Razorpay subscription:', error);
    throw error;
  }
}

/**
 * Pause Razorpay subscription
 */
export async function pauseSubscription(
  subscriptionId: string,
  pauseAt: number = 0 // 0 means pause immediately, unix timestamp for future pause
) {
  try {
    const auth = getRazorpayAuth();

    const response = await axios.post(
      `${RAZORPAY_API_URL}/subscriptions/${subscriptionId}/pause`,
      {
        pause_at: pauseAt,
      },
      auth
    );

    return response.data;
  } catch (error) {
    console.error('Error pausing Razorpay subscription:', error);
    throw error;
  }
}

/**
 * Resume Razorpay subscription
 */
export async function resumeSubscription(subscriptionId: string) {
  try {
    const auth = getRazorpayAuth();

    const response = await axios.post(
      `${RAZORPAY_API_URL}/subscriptions/${subscriptionId}/resume`,
      {},
      auth
    );

    return response.data;
  } catch (error) {
    console.error('Error resuming Razorpay subscription:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails(subscriptionId: string) {
  try {
    const auth = getRazorpayAuth();

    const response = await axios.get(
      `${RAZORPAY_API_URL}/subscriptions/${subscriptionId}`,
      auth
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
}

/**
 * Get payment details
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    const auth = getRazorpayAuth();

    const response = await axios.get(
      `${RAZORPAY_API_URL}/payments/${paymentId}`,
      auth
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
}

/**
 * Capture payment (complete transaction)
 */
export async function capturePayment(paymentId: string, amount: number) {
  try {
    const auth = getRazorpayAuth();

    const response = await axios.post(
      `${RAZORPAY_API_URL}/payments/${paymentId}/capture`,
      {
        amount,
      },
      auth
    );

    return response.data;
  } catch (error) {
    console.error('Error capturing payment:', error);
    throw error;
  }
}

/**
 * Refund payment
 */
export async function refundPayment(paymentId: string, amount?: number) {
  try {
    const auth = getRazorpayAuth();

    const body: Record<string, any> = {};
    if (amount) {
      body.amount = amount; // in paise
    }

    const response = await axios.post(
      `${RAZORPAY_API_URL}/payments/${paymentId}/refund`,
      body,
      auth
    );

    return response.data;
  } catch (error) {
    console.error('Error refunding payment:', error);
    throw error;
  }
}

/**
 * Create customer for recurring payments
 */
export async function createCustomer(email: string, name: string, contact?: string) {
  try {
    const auth = getRazorpayAuth();

    const response = await axios.post(
      `${RAZORPAY_API_URL}/customers`,
      {
        email,
        name,
        contact,
      },
      auth
    );

    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

/**
 * Export public key for frontend
 */
export function getPublicKey() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error('Razorpay public key not configured');
  }
  return keyId;
}

/**
 * Type definitions for Razorpay webhook events
 */
export interface RazorpayWebhookEvent {
  id: string;
  event: 'subscription.activated' | 'subscription.paused' | 'subscription.cancelled' | 'subscription.expired' | 'payment.failed';
  created_at: number;
  entity: Record<string, any>;
}

export interface RazorpaySubscription {
  id: string;
  entity: 'subscription';
  plan_id: string;
  customer_id: string;
  status: 'pending' | 'active' | 'paused' | 'cancelled' | 'expired' | 'halted' | 'auth_attempts_exhausted';
  current_start: number;
  current_end: number;
  ended_at: number | null;
  quantity: number;
  notes: Record<string, any>;
  charge_at: number;
  start_at: number;
  end_at: number | null;
  auth_attempts: number;
  total_count: number;
  paid_count: number;
  customer_notify: 0 | 1;
  created_at: number;
  paused_at: number | null;
  expire_at: number | null;
  short_url: string;
  has_scheduled_changes: boolean;
  change_scheduled_at: number | null;
  remaining_count: number;
  offer_id: string | null;
  remaining_count_per_plan: number | null;
  paid_at: number | null;
}

export interface RazorpayPayment {
  id: string;
  entity: 'payment';
  amount: number; // in paise
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'reversed';
  method: string;
  description: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null;
  email: string;
  contact: string;
  notes: Record<string, any>;
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_reason: string | null;
  acquirer_data: Record<string, any>;
  created_at: number;
}
