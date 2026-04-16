'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, X, Zap, Users, Infinity, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpgradeModalProps {
  open: boolean;
  workspaceId?: string;
  currentUsage?: number;
  limit?: number;
  tier?: 'free' | 'pro' | 'enterprise';
  onClose?: () => void;
  onUpgrade?: () => void;
}

export function UpgradeModal({
  open,
  workspaceId,
  currentUsage = 5,
  limit = 5,
  tier = 'free',
  onClose,
  onUpgrade,
}: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);

  if (!open) return null;

  const handleUpgrade = async () => {
    if (onUpgrade) {
      onUpgrade();
      return;
    }

    setIsLoading(true);
    try {
      // Check if Razorpay is configured
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId || '',
          plan: 'pro',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Payment not configured yet — show contact info
        setShowContact(true);
        setIsLoading(false);
        return;
      }

      // Open Razorpay checkout
      if (window.Razorpay) {
        const razorpay = new window.Razorpay({
          key: data.keyId,
          subscription_id: data.subscriptionId,
          amount: data.amount,
          currency: data.currency,
          description: data.description,
          notes: data.notes,
          prefill: data.prefill,
          handler: () => {
            onClose?.();
            window.location.href = '/dash/billing?success=true';
          },
          modal: {
            ondismiss: () => {
              setIsLoading(false);
            },
          },
        });
        razorpay.open();
      } else {
        // Razorpay script not loaded
        setShowContact(true);
        setIsLoading(false);
      }
    } catch {
      setShowContact(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
                <p className="text-sm text-blue-100">Unlock unlimited analyses</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Usage message */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-900">
                  Analysis limit reached
                </p>
                <p className="text-sm text-amber-800 mt-1">
                  You've used all {limit} free analyses for this month.
                </p>
              </div>
            </div>

            {/* Feature comparison */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Included in Pro
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: Infinity, text: '30 JD analyses/month' },
                  { icon: Users, text: 'Up to 5 team members' },
                  { icon: Zap, text: 'Unlimited candidate matching' },
                  { icon: Clock, text: 'Priority support' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <feature.icon className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-sm text-slate-600 mb-1">Monthly subscription</div>
              <div className="text-4xl font-bold text-slate-900">
                ₹499<span className="text-lg text-slate-600">/month</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2.5">
              {showContact ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center space-y-2">
                  <p className="text-sm font-semibold text-blue-900">
                    Online payments coming soon!
                  </p>
                  <p className="text-xs text-blue-700">
                    Contact us to upgrade your account today:
                  </p>
                  <a
                    href="mailto:sales@hiremiq.com?subject=Upgrade%20to%20Pro%20Plan"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    <Zap className="w-4 h-4" />
                    Email sales@hiremiq.com
                  </a>
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Upgrade Now
                    </>
                  )}
                </button>
              )}

              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-full h-10 border border-slate-200 hover:bg-slate-50 text-slate-900 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Maybe later
              </button>
            </div>

            {/* Footer */}
            <p className="text-xs text-slate-500 text-center">
              Cancel anytime. No long-term commitment required.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Make Razorpay available globally
declare global {
  interface Window {
    Razorpay: any;
  }
}
