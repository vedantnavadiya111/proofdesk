'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Library,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  Info,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { demoEvidence, demoUniversity } from '@/lib/demo-data';
import { EVIDENCE_CATEGORIES, STATUS_COLORS } from '@/lib/constants';
import type { Evidence, EvidenceStatus } from '@/lib/types';

export default function EvidencePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const evidenceList = demoEvidence;

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch =
      item.claim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source_organisation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge variant="verified" className="flex items-center gap-1 font-mono text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-verified" />
            VERIFIED
          </Badge>
        );
      case 'NOT_YET_VERIFIED':
        return (
          <Badge variant="pending" className="flex items-center gap-1 font-mono text-[10px]">
            <Clock className="w-3 h-3 text-amber-600" />
            NOT YET VERIFIED
          </Badge>
        );
      case 'NOT_YET_PROVEN':
        return (
          <Badge variant="notproven" className="flex items-center gap-1 font-mono text-[10px]">
            <HelpCircle className="w-3 h-3 text-indigo-600" />
            NOT YET PROVEN
          </Badge>
        );
      case 'CONFLICTING_EVIDENCE':
        return (
          <Badge variant="conflicting" className="flex items-center gap-1 font-mono text-[10px]">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            CONFLICTING EVIDENCE
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-midnight-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-midnight-950 font-serif">
              University Evidence Library
            </h1>
            <Badge variant="outline" className="text-2xs bg-teal-50 text-teal-800 border-teal-200">
              Noida International University (NIU)
            </Badge>
          </div>
          <p className="text-xs text-midnight-500 mt-0.5">
            Institutional verification ledger linking regulatory records, degree authorities, fee declarations and student outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={demoUniversity.official_website}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="outline" className="text-xs h-8">
              <ExternalLink className="w-3.5 h-3.5 mr-1 text-midnight-500" />
              NIU Official Portal
            </Button>
          </a>
          <a
            href={demoUniversity.ugc_url!}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="outline" className="text-xs h-8">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-verified" />
              UGC State Entry
            </Button>
          </a>
        </div>
      </div>

      {/* University Establishment Card */}
      <Card className="border-midnight-200/70 bg-gradient-to-r from-ivory-50 to-ivory-100">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-midnight-900 text-ivory-50 flex items-center justify-center shrink-0 font-serif font-bold text-sm">
              NIU
            </div>
            <div>
              <h2 className="text-sm font-bold text-midnight-950 font-serif">
                {demoUniversity.name}
              </h2>
              <p className="text-xs text-midnight-600 mt-0.5">
                {demoUniversity.city}, {demoUniversity.state} • Established {demoUniversity.established_year} (UP State Legislature Act)
              </p>
              <p className="text-[11px] text-midnight-500 mt-1">
                <strong>Collaboration:</strong> {demoUniversity.niat_collaboration_details}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right text-xs">
              <span className="text-midnight-500 block">Total Claims Audited</span>
              <span className="font-mono font-bold text-midnight-950 text-base">{evidenceList.length} Records</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter and Category Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-midnight-400" />
            <Input
              placeholder="Search claims, sources, or explanations…"
              className="pl-9 h-9 text-xs bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              className="h-8 text-xs"
              onClick={() => setStatusFilter('all')}
            >
              All Statuses
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'VERIFIED' ? 'default' : 'outline'}
              className={`h-8 text-xs ${statusFilter === 'VERIFIED' ? 'bg-verified hover:bg-verified-dark text-white' : ''}`}
              onClick={() => setStatusFilter('VERIFIED')}
            >
              Verified
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'NOT_YET_VERIFIED' ? 'default' : 'outline'}
              className="h-8 text-xs"
              onClick={() => setStatusFilter('NOT_YET_VERIFIED')}
            >
              Pending
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'NOT_YET_PROVEN' ? 'default' : 'outline'}
              className="h-8 text-xs"
              onClick={() => setStatusFilter('NOT_YET_PROVEN')}
            >
              Not Proven
            </Button>
          </div>
        </div>

        {/* Categories Tab Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-midnight-900 text-ivory-50'
                : 'bg-midnight-100/70 text-midnight-700 hover:bg-midnight-200'
            }`}
          >
            All Categories ({evidenceList.length})
          </button>
          {EVIDENCE_CATEGORIES.map((cat) => {
            const count = evidenceList.filter((e) => e.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.key
                    ? 'bg-midnight-900 text-ivory-50'
                    : 'bg-midnight-100/70 text-midnight-700 hover:bg-midnight-200'
                }`}
              >
                <span>{cat.key.toUpperCase()}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Evidence Ledger List */}
      <div className="space-y-3">
        {filteredEvidence.map((ev, index) => (
          <div
            key={ev.id}
            className="p-4 sm:p-5 rounded-lg border border-midnight-200/80 bg-ivory-50 shadow-2xs space-y-3 hover:border-midnight-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-midnight-100 text-midnight-600 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-midnight-400 block mb-0.5">
                    Category: {ev.category.toUpperCase()}
                  </span>
                  <p className="text-sm font-semibold text-midnight-950 font-sans leading-snug">
                    {ev.claim}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {getStatusBadge(ev.status)}
              </div>
            </div>

            {/* Explanation */}
            <div className="pl-7 text-xs text-midnight-700 leading-relaxed bg-midnight-50/50 p-2.5 rounded border border-midnight-100">
              <p>{ev.explanation}</p>
            </div>

            {/* Source & Metadata Strip */}
            <div className="pl-7 flex flex-wrap items-center justify-between text-[11px] text-midnight-500 pt-1 border-t border-midnight-100 gap-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-midnight-700">
                  Source: {ev.source_organisation} — {ev.source_title}
                </span>
                <a
                  href={ev.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-verified-dark hover:underline flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Original Authority
                </a>
              </div>

              <div className="font-mono text-[10px] text-midnight-400">
                Verified: {ev.date_checked}
              </div>
            </div>
          </div>
        ))}

        {filteredEvidence.length === 0 && (
          <div className="p-8 text-center border border-dashed border-midnight-200 rounded-lg text-midnight-500 text-xs">
            No evidence records matched your search query.
          </div>
        )}
      </div>
    </div>
  );
}
