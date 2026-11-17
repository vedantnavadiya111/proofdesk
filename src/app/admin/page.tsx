'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  FileText,
  Send,
  Phone,
  PhoneCall,
  CreditCard,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoDashboardStats, demoFunnelSteps, demoActivityLogs, demoLead } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [stats] = useState(demoDashboardStats);
  const [funnel] = useState(demoFunnelSteps);
  const [activities] = useState(demoActivityLogs);
  const isDemo = !isSupabaseConfigured();

  const statCards = [
    {
      title: 'Stalled Leads',
      value: stats.total_stalled,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200/60',
      description: 'Counselling completed > 7 days, no payment',
      href: '/admin/leads?status=stalled',
    },
    {
      title: 'Dossiers Generated',
      value: stats.dossiers_generated,
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200/60',
      description: 'Evidence-backed trust reports compiled',
      href: '/admin/leads',
    },
    {
      title: 'Dossiers Delivered',
      value: stats.dossiers_delivered,
      icon: Send,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200/60',
      description: 'Shared to parents via WhatsApp',
      href: '/admin/leads',
    },
    {
      title: 'Peer Calls Requested',
      value: stats.peer_calls_requested,
      icon: Phone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200/60',
      description: 'Parent requested talk with student/parent',
      href: '/admin/volunteers',
    },
    {
      title: 'Peer Calls Booked',
      value: stats.peer_calls_booked,
      icon: PhoneCall,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200/60',
      description: 'Peer conversation scheduled',
      href: '/admin/volunteers',
    },
    {
      title: 'Seat-Block Payments',
      value: stats.seat_block_payments,
      icon: CreditCard,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/60',
      description: 'Successfully un-stalled conversions',
      href: '/admin/analytics',
    },
    {
      title: 'Verification Issues',
      value: stats.verification_issues,
      icon: AlertCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200/60',
      description: 'Unverified or pending claims flagged',
      href: '/admin/evidence',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-midnight-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-midnight-950 font-serif">
              Growth Operations Overview
            </h1>
            {isDemo && (
              <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider bg-amber-50/50 text-amber-800 border-amber-300">
                Demo Workspace
              </Badge>
            )}
          </div>
          <p className="text-xs text-midnight-500 mt-0.5">
            Real-time pipeline monitoring for stalled admissions and evidence-driven parent trust conversion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/leads/${demoLead.id}`}>
            <Button size="sm" className="bg-midnight-900 hover:bg-midnight-800 text-ivory-50 text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-verified" />
              Demo Lead: Aarav Sharma
            </Button>
          </Link>
          <Link href="/admin/evidence">
            <Button size="sm" variant="outline" className="text-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-midnight-600" />
              NIU Evidence Library
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="group">
              <Card className="h-full border border-midnight-200/70 bg-ivory-50 hover:border-midnight-300 transition-all shadow-xs">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-medium text-midnight-500 tracking-tight">{card.title}</p>
                      <p className="text-2xl font-bold tracking-tight text-midnight-950 mt-1 font-serif">
                        {card.value}
                      </p>
                    </div>
                    <div className={`p-2 rounded-md ${card.bgColor} ${card.color} border ${card.borderColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[10px] text-midnight-400 mt-2.5 line-clamp-1 border-t border-midnight-100 pt-2">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Middle Section: Funnel & Focus Lead */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <Card className="lg:col-span-2 border-midnight-200/70">
          <CardHeader className="pb-3 border-b border-midnight-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold tracking-tight text-midnight-950">
                  Trust-to-Conversion Pipeline
                </CardTitle>
                <CardDescription className="text-xs text-midnight-500 mt-0.5">
                  Conversion flow for leads that entered stalled status (Counselling + 7 days)
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] text-midnight-600 bg-midnight-50 border-midnight-200">
                Stage Drop-off Analysis
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              {funnel.map((step, idx) => {
                const widthPercent = Math.max(step.percentage, 8);
                return (
                  <div key={step.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-midnight-800 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-midnight-100 text-midnight-700 text-[10px] flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        {step.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-midnight-950 font-mono">{step.count} leads</span>
                        <span className="text-[11px] text-midnight-500 font-mono w-10 text-right">
                          {step.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-midnight-100/70 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-linear-to-r from-midnight-800 to-verified"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-midnight-100 flex items-center justify-between text-xs text-midnight-500">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-verified" />
                Target conversion after Trust Dossier delivery: <strong>18% - 24%</strong>
              </span>
              <Link href="/admin/analytics" className="text-verified-dark font-medium hover:underline flex items-center gap-1">
                View A/B Analytics <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Action Card: Stalled Lead Attention */}
        <Card className="border-midnight-200/70 bg-gradient-to-b from-ivory-50 to-ivory-100 flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-midnight-100">
            <div className="flex items-center justify-between">
              <Badge variant="pending" className="text-[10px]">Action Required</Badge>
              <span className="text-2xs font-mono text-midnight-400">8 Days Idle</span>
            </div>
            <CardTitle className="text-sm font-semibold text-midnight-950 mt-1">
              Sample Case: Aarav Sharma
            </CardTitle>
            <CardDescription className="text-xs text-midnight-500">
              Parent: Rajesh Sharma (Delhi NCR) • Hindi preferred
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-midnight-100">
                <span className="text-midnight-500">Target University:</span>
                <span className="font-medium text-midnight-900">Noida International Univ.</span>
              </div>
              <div className="flex justify-between py-1 border-b border-midnight-100">
                <span className="text-midnight-500">Seat-Block:</span>
                <span className="text-amber-700 font-medium">Pending Payment</span>
              </div>
              <div className="flex justify-between py-1 border-b border-midnight-100">
                <span className="text-midnight-500">Dossier Status:</span>
                <span className="text-indigo-700 font-medium">Ready for Hindi Generation</span>
              </div>
              <p className="text-[11px] text-midnight-500 leading-relaxed pt-1">
                Parent expressed hesitation regarding degree-awarding authority and fee schedule split during counselling.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link href={`/admin/leads/${demoLead.id}`} className="w-full block">
                <Button className="w-full text-xs bg-midnight-900 hover:bg-midnight-800 text-ivory-50 shadow-xs">
                  Generate Hindi Trust Dossier
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
              <Link href={`/dossier/demo-aarav-sharma-niu-2024`} target="_blank" className="w-full block">
                <Button variant="outline" className="w-full text-xs">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Preview Public Dossier
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Activity Timeline */}
      <Card className="border-midnight-200/70">
        <CardHeader className="pb-3 border-b border-midnight-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight text-midnight-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-midnight-600" />
                Audit & Activity Log
              </CardTitle>
              <CardDescription className="text-xs text-midnight-500 mt-0.5">
                Verifiable event stream across lead interactions and dossier touchpoints
              </CardDescription>
            </div>
            <span className="text-2xs font-mono text-midnight-400 bg-midnight-100 px-2 py-0.5 rounded">
              System Generated
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-midnight-200">
            {activities.map((act) => (
              <div key={act.id} className="relative group">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-midnight-400 ring-4 ring-ivory-50 group-hover:bg-verified transition-colors" />
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between text-xs gap-1">
                  <div>
                    <span className="font-semibold text-midnight-900 capitalize">
                      {act.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-midnight-500 ml-2">
                      for Lead: Aarav Sharma (Rajesh Sharma)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-midnight-400">
                    {formatDate(act.created_at)}
                  </span>
                </div>
                {act.details && (
                  <p className="text-[11px] text-midnight-500 mt-0.5 font-mono">
                    {JSON.stringify(act.details)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
