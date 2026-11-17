'use client';

import { useState } from 'react';
import {
  UserCheck,
  Phone,
  PhoneCall,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Building2,
  MapPin,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoVolunteer, demoUniversity } from '@/lib/demo-data';
import type { PeerVolunteer, CallRequest } from '@/lib/types';

export default function VolunteersPage() {
  const [volunteers] = useState<PeerVolunteer[]>([
    demoVolunteer,
    {
      id: '00000000-0000-0000-0000-000000000021',
      name: 'Karthik Reddy',
      role: 'student',
      university_id: demoVolunteer.university_id,
      language: 'te',
      city: 'Hyderabad / Greater Noida',
      state: 'Telangana',
      year_of_joining: 2023,
      bio: 'Current 2nd-year B.Tech CSE student at NIU through NIAT. Can speak directly about hostel life, coding curriculum, peer culture, and faculty.',
      consent_status: 'consented',
      is_available: true,
      is_demo: true,
      created_at: '2024-07-01T10:00:00Z',
      updated_at: '2024-11-10T10:00:00Z',
      university: demoUniversity,
    },
  ]);

  const [callRequests] = useState<CallRequest[]>([
    {
      id: 'call-req-001',
      lead_id: '00000000-0000-0000-0000-000000000010',
      volunteer_id: demoVolunteer.id,
      dossier_id: null,
      preferred_time: 'Weekday evenings (6 PM - 8 PM)',
      preferred_language: 'hi',
      status: 'requested',
      admin_notes: 'Aarav Sharma parent (Rajesh) requested peer discussion on degree certificate and hostel.',
      created_at: '2024-11-10T14:00:00Z',
      updated_at: '2024-11-10T14:00:00Z',
      volunteer: demoVolunteer,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-midnight-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-midnight-950 font-serif">
              Peer Parent & Student Volunteers
            </h1>
            <Badge variant="outline" className="text-2xs bg-amber-50 text-amber-800 border-amber-300">
              Simulated Directory
            </Badge>
          </div>
          <p className="text-xs text-midnight-500 mt-0.5">
            Connect hesitant parents with verified, consented community members for authentic perspective.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono bg-teal-50 text-teal-800 border-teal-200">
            {volunteers.length} Active Volunteers Available
          </Badge>
        </div>
      </div>

      {/* Compliance / Consent Notice */}
      <div className="p-4 bg-midnight-900 text-ivory-50 rounded-lg text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-verified shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-ivory-50 block">
              Ethical Matching & Explicit Consent Standard
            </span>
            <p className="text-[11px] text-midnight-300 mt-0.5 leading-relaxed">
              Never fabricate parent or student testimonials. All profiles in production require verified enrolment records and signed consent before appearance in the parent matching directory.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] text-ivory-100 border-midnight-700 bg-midnight-800 shrink-0 font-mono">
          Strict Privacy Rule
        </Badge>
      </div>

      {/* Volunteer Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {volunteers.map((vol) => (
          <Card key={vol.id} className="border-midnight-200/70 bg-ivory-50 flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-midnight-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold text-midnight-950 font-serif">
                      {vol.name}
                    </CardTitle>
                    <Badge variant="secondary" className="capitalize text-[10px] font-sans">
                      {vol.role}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-midnight-500 mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-midnight-400" />
                    {demoUniversity.name} • Class of {vol.year_of_joining}
                  </CardDescription>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-verified-dark font-medium bg-verified-bg px-2 py-0.5 rounded border border-verified/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse" />
                  Available
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-midnight-700 leading-relaxed italic bg-white p-3 rounded border border-midnight-100">
                "{vol.bio}"
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-midnight-600 pt-2 border-t border-midnight-100">
                <div>
                  <span className="text-[10px] text-midnight-400 uppercase font-mono block">Language</span>
                  <span className="font-semibold text-midnight-900">
                    {vol.language === 'hi' ? 'Hindi (हिंदी)' : vol.language === 'te' ? 'Telugu (తెలుగు)' : 'English'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-midnight-400 uppercase font-mono block">Location</span>
                  <span className="font-semibold text-midnight-900">{vol.city}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-amber-800 font-mono">
                  {vol.is_demo ? '(Simulated demonstration profile)' : 'Verified Volunteer'}
                </span>
                <Badge variant="outline" className="text-[10px] text-verified-dark bg-verified-bg border-verified/30">
                  Consent Verified ✓
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call Requests Inbound Section */}
      <Card className="border-midnight-200/70">
        <CardHeader className="pb-3 border-b border-midnight-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-midnight-950 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-midnight-600" />
                Inbound Peer Conversation Requests
              </CardTitle>
              <CardDescription className="text-xs text-midnight-500">
                Requests initiated by parents directly from the public Trust Dossier
              </CardDescription>
            </div>
            <Badge variant="pending" className="text-2xs">1 Pending Coordination</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="space-y-3">
            {callRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 bg-white border border-midnight-200/80 rounded-md text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-midnight-950">
                      Request for Lead: Aarav Sharma (Rajesh Sharma)
                    </span>
                    <Badge variant="pending" className="text-[10px]">
                      {req.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-midnight-600 text-[11px]">
                    Matched Volunteer: <strong>{req.volunteer?.name}</strong> ({req.volunteer?.role}) • Preferred Language: <strong>Hindi</strong>
                  </p>
                  <p className="text-midnight-500 text-[11px]">
                    Requested Time: {req.preferred_time}
                  </p>
                  {req.admin_notes && (
                    <p className="text-midnight-500 text-[11px] italic bg-midnight-50 p-1.5 rounded mt-1">
                      Note: {req.admin_notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" className="h-8 text-xs bg-midnight-900 hover:bg-midnight-800 text-ivory-50">
                    Schedule Call
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
