'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  TrendingDown,
  FileText,
  Send,
  Eye,
  Phone,
  PhoneCall,
  CreditCard,
  UserX,
  AlertTriangle,
  FlaskConical,
  BarChart3,
  Activity,
  Minus,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { t } from '@/lib/translations';
import { demoDashboardStats, demoFunnelSteps } from '@/lib/demo-data';
import type { DashboardStats, FunnelStep, ExperimentMetrics } from '@/lib/types';

// ─── Metric Card ────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: string;
}

function MetricCard({ label, value, icon, accent }: MetricCardProps) {
  return (
    <div className="bg-ivory border border-midnight/8 rounded-lg p-4 flex items-start gap-3">
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center',
          accent ?? 'bg-midnight/5 text-midnight/60'
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-midnight/50 leading-tight truncate">{label}</p>
        <p className="text-xl font-semibold text-midnight tracking-tight mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Funnel Bar Colors ──────────────────────────────────────

const FUNNEL_COLORS = [
  '#0f172a',   // midnight
  '#1e3a5f',   // dark navy
  '#2d6a7e',   // teal-ish
  '#4a9bab',   // lighter teal
  '#6ec6d1',   // lightest teal
];

// ─── Custom Tooltip ─────────────────────────────────────────

interface FunnelTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: FunnelStep }>;
}

function FunnelTooltip({ active, payload }: FunnelTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-midnight text-ivory text-xs rounded-md px-3 py-2 shadow-lg border border-midnight/20">
      <p className="font-medium">{data.label}</p>
      <p className="text-ivory/70 mt-0.5">
        {data.count} leads · {data.percentage}%
      </p>
    </div>
  );
}

// ─── A/B Experiment Row ─────────────────────────────────────

interface ExperimentRowProps {
  label: string;
  controlValue: string;
  testValue: string;
  diff: string;
}

function ExperimentRow({ label, controlValue, testValue, diff }: ExperimentRowProps) {
  return (
    <tr className="border-b border-midnight/6 last:border-b-0">
      <td className="py-2.5 pr-4 text-sm text-midnight/70 font-medium">{label}</td>
      <td className="py-2.5 px-4 text-sm text-midnight/50 text-center font-mono">
        {controlValue}
      </td>
      <td className="py-2.5 px-4 text-sm text-midnight/50 text-center font-mono">
        {testValue}
      </td>
      <td className="py-2.5 pl-4 text-sm text-midnight/40 text-center font-mono">
        {diff}
      </td>
    </tr>
  );
}

// ─── Main Page ──────────────────────────────────────────────

export default function AnalyticsPage() {
  const stats: DashboardStats = demoDashboardStats;
  const funnelSteps: FunnelStep[] = demoFunnelSteps;

  // Extended metrics derived from the demo stats
  const metrics = useMemo(
    () => [
      {
        label: 'Stalled Leads',
        value: stats.total_stalled,
        icon: <TrendingDown className="w-4 h-4" />,
        accent: 'bg-pending/15 text-pending-dark',
      },
      {
        label: 'Dossiers Generated',
        value: stats.dossiers_generated,
        icon: <FileText className="w-4 h-4" />,
        accent: 'bg-verified/15 text-verified-dark',
      },
      {
        label: 'Dossiers Delivered',
        value: stats.dossiers_delivered,
        icon: <Send className="w-4 h-4" />,
        accent: 'bg-verified/15 text-verified-dark',
      },
      {
        label: 'Dossiers Viewed',
        value: 0,
        icon: <Eye className="w-4 h-4" />,
        accent: 'bg-midnight/5 text-midnight/60',
      },
      {
        label: 'Peer Calls Requested',
        value: stats.peer_calls_requested,
        icon: <Phone className="w-4 h-4" />,
        accent: 'bg-pending/15 text-pending-dark',
      },
      {
        label: 'Peer Calls Completed',
        value: stats.peer_calls_booked,
        icon: <PhoneCall className="w-4 h-4" />,
        accent: 'bg-verified/15 text-verified-dark',
      },
      {
        label: 'Seat-Block Payments',
        value: stats.seat_block_payments,
        icon: <CreditCard className="w-4 h-4" />,
        accent: 'bg-verified/15 text-verified-dark',
      },
      {
        label: 'Opt-Outs',
        value: 0,
        icon: <UserX className="w-4 h-4" />,
        accent: 'bg-midnight/5 text-midnight/60',
      },
      {
        label: 'Complaints',
        value: 0,
        icon: <AlertTriangle className="w-4 h-4" />,
        accent: 'bg-conflicting/15 text-conflicting-dark',
      },
    ],
    [stats]
  );

  // A/B experiment data — zeros / dashes since there is no real data yet
  const experimentRows: ExperimentRowProps[] = useMemo(
    () => [
      {
        label: 'Total Leads',
        controlValue: '—',
        testValue: '—',
        diff: '—',
      },
      {
        label: t('analytics_call_booking'),
        controlValue: '0.0%',
        testValue: '0.0%',
        diff: '0.0 pp',
      },
      {
        label: t('analytics_seat_block'),
        controlValue: '0.0%',
        testValue: '0.0%',
        diff: '0.0 pp',
      },
      {
        label: t('analytics_opt_out'),
        controlValue: '0.0%',
        testValue: '0.0%',
        diff: '0.0 pp',
      },
      {
        label: t('analytics_complaint'),
        controlValue: '0.0%',
        testValue: '0.0%',
        diff: '0.0 pp',
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-ivory-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-midnight flex items-center justify-center">
            <BarChart3 className="w-4.5 h-4.5 text-ivory" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-midnight tracking-tight">
              {t('analytics_title')}
            </h1>
            <p className="text-xs text-midnight/45 mt-0.5">
              Operational metrics and conversion analysis
            </p>
          </div>
        </div>

        {/* ── SECTION 1: Overview Metrics ──────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-midnight/40" />
            <h2 className="text-sm font-semibold text-midnight/70 uppercase tracking-wider">
              Overview Metrics
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics.map((m) => (
              <MetricCard
                key={m.label}
                label={m.label}
                value={m.value}
                icon={m.icon}
                accent={m.accent}
              />
            ))}
          </div>
        </section>

        {/* ── SECTION 2: Conversion Funnel ─────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-midnight/40" />
            <h2 className="text-sm font-semibold text-midnight/70 uppercase tracking-wider">
              {t('dash_funnel_title')}
            </h2>
          </div>
          <div className="bg-ivory border border-midnight/8 rounded-lg p-5">
            {/* Funnel Chart */}
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={funnelSteps}
                  layout="vertical"
                  margin={{ top: 4, right: 40, bottom: 4, left: 4 }}
                  barCategoryGap="20%"
                >
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#0f172a80' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={140}
                    tick={{ fontSize: 12, fill: '#0f172ab3' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<FunnelTooltip />}
                    cursor={{ fill: '#0f172a08' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={36}>
                    {funnelSteps.map((_, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={FUNNEL_COLORS[idx % FUNNEL_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Funnel Legend / Summary Row */}
            <div className="mt-4 border-t border-midnight/6 pt-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {funnelSteps.map((step, idx) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{
                        backgroundColor:
                          FUNNEL_COLORS[idx % FUNNEL_COLORS.length],
                      }}
                    />
                    <span className="text-xs text-midnight/60">
                      {step.label}
                    </span>
                    <span className="text-xs font-semibold text-midnight">
                      {step.count}
                    </span>
                    <span className="text-xs text-midnight/40">
                      ({step.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: A/B Experiment ────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="w-4 h-4 text-midnight/40" />
            <h2 className="text-sm font-semibold text-midnight/70 uppercase tracking-wider">
              {t('analytics_experiment')}
            </h2>
          </div>
          <div className="bg-ivory border border-midnight/8 rounded-lg overflow-hidden">
            {/* Awaiting Data Banner */}
            <div className="px-5 py-4 border-b border-midnight/6 bg-pending/5 flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-pending/15 flex items-center justify-center flex-shrink-0">
                <Minus className="w-3.5 h-3.5 text-pending-dark" />
              </div>
              <div>
                <p className="text-sm font-medium text-pending-dark">
                  {t('analytics_awaiting')}
                </p>
                <p className="text-xs text-midnight/40 mt-0.5">
                  The table below will populate once sufficient experiment data is collected.
                </p>
              </div>
            </div>

            {/* Experiment Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-midnight/8">
                    <th className="py-3 pr-4 pl-5 text-left text-xs font-semibold text-midnight/50 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-midnight/50 uppercase tracking-wider">
                      {t('analytics_control')}
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-midnight/50 uppercase tracking-wider">
                      {t('analytics_test')}
                    </th>
                    <th className="py-3 pl-4 pr-5 text-center text-xs font-semibold text-midnight/50 uppercase tracking-wider">
                      {t('analytics_pp_diff')}
                    </th>
                  </tr>
                </thead>
                <tbody className="px-5">
                  {experimentRows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-midnight/6 last:border-b-0"
                    >
                      <td className="py-2.5 pr-4 pl-5 text-sm text-midnight/70 font-medium">
                        {row.label}
                      </td>
                      <td className="py-2.5 px-4 text-sm text-midnight/50 text-center font-mono">
                        {row.controlValue}
                      </td>
                      <td className="py-2.5 px-4 text-sm text-midnight/50 text-center font-mono">
                        {row.testValue}
                      </td>
                      <td className="py-2.5 pl-4 pr-5 text-sm text-midnight/40 text-center font-mono">
                        {row.diff}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
