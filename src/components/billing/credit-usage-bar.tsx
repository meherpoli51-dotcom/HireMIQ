'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditUsage {
  monthly_limit: number;
  monthly_used: number;
  total_available: number;
  percent_used: number;
  resets_at: string;
}

interface CreditUsageBarProps {
  workspaceId?: string;
  className?: string;
}

export function CreditUsageBar({ workspaceId, className }: CreditUsageBarProps) {
  const [usage, setUsage] = useState<CreditUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsage() {
      try {
        setLoading(true);
        const params = workspaceId ? `?workspace_id=${workspaceId}` : '';
        const response = await fetch(`/api/billing/usage${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch usage');
        }

        const data = await response.json();
        setUsage(data.credits);
        setError(null);
      } catch (err) {
        console.error('Error fetching credit usage:', err);
        setError(err instanceof Error ? err.message : 'Error loading usage');
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
    // Refresh usage every 30 seconds
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, [workspaceId]);

  if (loading || !usage) {
    return (
      <div className={cn('px-4 py-3 rounded-lg bg-slate-100 animate-pulse h-20', className)} />
    );
  }

  if (error) {
    return (
      <div className={cn('px-4 py-3 rounded-lg bg-rose-50 border border-rose-200', className)}>
        <p className="text-xs text-rose-600">Error loading usage</p>
      </div>
    );
  }

  const isNearLimit = usage.percent_used >= 80;
  const isAtLimit = usage.total_available <= 0;

  const barColor =
    usage.percent_used >= 100
      ? 'bg-rose-500'
      : usage.percent_used >= 80
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  const bgColor =
    usage.percent_used >= 100
      ? 'bg-rose-50 border-rose-200'
      : usage.percent_used >= 80
        ? 'bg-amber-50 border-amber-200'
        : 'bg-emerald-50 border-emerald-200';

  const textColor =
    usage.percent_used >= 100
      ? 'text-rose-900'
      : usage.percent_used >= 80
        ? 'text-amber-900'
        : 'text-emerald-900';

  const resetDate = new Date(usage.resets_at);
  const resetMonth = resetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className={cn(`rounded-xl border px-4 py-3 space-y-2 ${bgColor}`, className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAtLimit ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <Zap className="w-4 h-4 text-blue-600 shrink-0" />
          )}
          <span className={cn('text-xs font-semibold', textColor)}>
            {usage.monthly_used} of {usage.monthly_limit} analyses
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all rounded-full', barColor)}
            style={{ width: `${Math.min(100, usage.percent_used)}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">
            Resets {resetMonth}
          </span>
          <span className={cn('text-xs font-semibold', textColor)}>
            {usage.percent_used}%
          </span>
        </div>
      </div>

      {/* Warning/CTA */}
      {isAtLimit && (
        <div className="pt-2 border-t border-current/10">
          <a
            href="/dash/billing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Upgrade to Pro
          </a>
        </div>
      )}

      {isNearLimit && !isAtLimit && (
        <div className="pt-2 border-t border-current/10">
          <a
            href="/dash/billing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            Approaching limit
          </a>
        </div>
      )}
    </div>
  );
}
