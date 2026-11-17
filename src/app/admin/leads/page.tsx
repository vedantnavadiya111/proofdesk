'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  FileText,
  Send,
  Eye,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { demoLead, demoDossier, DEMO_DOSSIER_TOKEN } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import type { Lead, LeadStatus } from '@/lib/types';

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [leads] = useState<Lead[]>([
    demoLead,
    // Add two complementary demo leads to make the table realistic and demonstrate filtering
    {
      id: '00000000-0000-0000-0000-000000000011',
      student_name: 'Rohit Kulkarni',
      parent_name: 'Anand Kulkarni',
      parent_phone: null,
      parent_email: null,
      university_id: demoLead.university_id,
      city: 'Hyderabad',
      state: 'Telangana',
      preferred_language: 'te',
      lead_source: 'NIAT counselling',
      lead_status: 'dossier_delivered',
      experiment_group: 'test',
      counselling_date: '2024-11-04',
      counselling_completed: true,
      days_since_counselling: 6,
      seat_block_payment: false,
      seat_block_payment_date: null,
      created_at: '2024-10-29T10:00:00Z',
      updated_at: '2024-11-10T10:00:00Z',
      university: demoLead.university,
    },
    {
      id: '00000000-0000-0000-0000-000000000012',
      student_name: 'Neha Gupta',
      parent_name: 'Suresh Gupta',
      parent_phone: null,
      parent_email: null,
      university_id: demoLead.university_id,
      city: 'Delhi NCR',
      state: 'Delhi',
      preferred_language: 'en',
      lead_source: 'NIAT counselling',
      lead_status: 'seat_block_paid',
      experiment_group: 'test',
      counselling_date: '2024-10-25',
      counselling_completed: true,
      days_since_counselling: 16,
      seat_block_payment: true,
      seat_block_payment_date: '2024-11-06',
      created_at: '2024-10-20T10:00:00Z',
      updated_at: '2024-11-06T10:00:00Z',
      university: demoLead.university,
    },
  ]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || lead.lead_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'stalled':
        return <Badge variant="pending">Stalled (8d)</Badge>;
      case 'dossier_generated':
        return <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">Dossier Generated</Badge>;
      case 'dossier_delivered':
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Dossier Delivered</Badge>;
      case 'seat_block_paid':
        return <Badge variant="verified">Seat-Block Paid</Badge>;
      default:
        return <Badge variant="outline">{status.replace(/_/g, ' ')}</Badge>;
    }
  };

  const getLangBadge = (lang: string) => {
    switch (lang) {
      case 'hi':
        return <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">हिंदी</span>;
      case 'te':
        return <span className="text-[11px] font-medium text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">తెలుగు</span>;
      default:
        return <span className="text-[11px] font-medium text-midnight-700 bg-midnight-50 px-1.5 py-0.5 rounded border border-midnight-200">EN</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-midnight-200/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-midnight-950 font-serif">
            Admissions Lead Management
          </h1>
          <p className="text-xs text-midnight-500 mt-0.5">
            Track student leads from counselling completion to proof-based parent conversion.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-2xs text-amber-800 bg-amber-50 border-amber-300">
            Fictional Demonstration Data
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-ivory-50 p-3 rounded-lg border border-midnight-200/70 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-midnight-400" />
          <Input
            placeholder="Search by student, parent, or city…"
            className="pl-9 h-9 text-xs bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-9 text-xs bg-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="stalled">Stalled Leads</SelectItem>
              <SelectItem value="dossier_delivered">Dossier Delivered</SelectItem>
              <SelectItem value="seat_block_paid">Seat-Block Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="border border-midnight-200/70 rounded-lg overflow-hidden bg-ivory-50 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-midnight-200/80 bg-midnight-100/50 text-midnight-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Student & Parent</th>
                <th className="py-3 px-4">Allotted University</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Pref. Lang</th>
                <th className="py-3 px-4">Lead Status</th>
                <th className="py-3 px-4">Days Since Counselling</th>
                <th className="py-3 px-4">Seat-Block</th>
                <th className="py-3 px-4">Dossier Action</th>
                <th className="py-3 px-4 text-right">View Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-100">
              {filteredLeads.map((lead) => {
                const isTargetLead = lead.id === demoLead.id;
                return (
                  <tr
                    key={lead.id}
                    className={`hover:bg-midnight-50/60 transition-colors ${
                      isTargetLead ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-midnight-950 flex items-center gap-1.5">
                          {lead.student_name}
                          {isTargetLead && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-normal font-mono">
                              Sample
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-midnight-500 mt-0.5">
                          Parent: {lead.parent_name}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-midnight-800">
                      Noida International University
                      <span className="block text-[10px] text-midnight-400">Greater Noida, UP</span>
                    </td>

                    <td className="py-3.5 px-4 text-midnight-700">{lead.city}</td>

                    <td className="py-3.5 px-4">{getLangBadge(lead.preferred_language)}</td>

                    <td className="py-3.5 px-4">{getStatusBadge(lead.lead_status)}</td>

                    <td className="py-3.5 px-4">
                      <span className={`font-mono ${lead.days_since_counselling && lead.days_since_counselling > 7 ? 'text-amber-700 font-semibold' : 'text-midnight-600'}`}>
                        {lead.days_since_counselling ?? '—'} days
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {lead.seat_block_payment ? (
                        <span className="text-verified-dark font-medium flex items-center gap-1">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium flex items-center gap-1">
                          ○ Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/leads/${lead.id}`}>
                          <Button size="sm" variant="default" className="h-7 text-xs px-2.5 bg-midnight-900 hover:bg-midnight-800">
                            <Sparkles className="w-3 h-3 mr-1 text-verified" />
                            Dossier
                          </Button>
                        </Link>
                        <Link href={`/dossier/demo-aarav-sharma-niu-2024`} target="_blank">
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/admin/leads/${lead.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <ChevronRight className="w-4 h-4 text-midnight-500" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-midnight-50/50 border-t border-midnight-100 flex items-center justify-between text-xs text-midnight-500">
          <span>Showing {filteredLeads.length} of {leads.length} demo records</span>
          <span className="text-[11px] text-midnight-400 font-mono">
            * Leads automatically enter 'Stalled' status when seat-block payment is not received 7 days after counselling.
          </span>
        </div>
      </div>
    </div>
  );
}
