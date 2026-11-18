'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Share2,
  Copy,
  ExternalLink,
  Check,
  Send,
  Clock,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Building2,
  AlertTriangle,
  Phone,
  MessageSquare,
  ShieldCheck,
  FileCheck2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  demoLead,
  demoUniversity,
  demoActivityLogs,
  DEMO_DOSSIER_TOKEN,
  getLeadById,
  getDossierByLeadId,
} from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import { formatShareMessage } from '@/lib/translations';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { DossierLanguage, DossierContent, Lead } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;

  // Resolve initial lead from demo store or fallback
  const initialLead = getLeadById(leadId) || demoLead;
  const initialDossier = getDossierByLeadId(initialLead.id);
  const initialToken = initialDossier?.share_token || `demo-${initialLead.student_name.toLowerCase().replace(/\s+/g, '-')}-niu-2026`;

  const [lead, setLead] = useState<Lead>(initialLead);
  const [selectedLang, setSelectedLang] = useState<DossierLanguage>(initialLead.preferred_language || 'hi');
  const [parentPhone, setParentPhone] = useState<string>(initialLead.parent_phone || '+91 98765 43210');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [dossierToken, setDossierToken] = useState<string>(initialToken);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<DossierContent | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [timeline, setTimeline] = useState(demoActivityLogs);

  // Sync lead data from Supabase if available
  useEffect(() => {
    async function fetchLeadFromSupabase() {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*, university:universities(*), dossiers(*)')
          .eq('id', leadId)
          .single();

        if (data && !error) {
          setLead(data as Lead);
          if (data.preferred_language) {
            setSelectedLang(data.preferred_language as DossierLanguage);
          }
          if (data.parent_phone) {
            setParentPhone(data.parent_phone);
          }
          if (data.dossiers && data.dossiers.length > 0) {
            setDossierToken(data.dossiers[0].share_token);
          }
        }
      } catch (e) {
        console.warn('Could not load lead from Supabase, using local fallback:', e);
      }
    }

    fetchLeadFromSupabase();
  }, [leadId]);

  const dossierUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dossier/${dossierToken}`
    : `http://localhost:3000/dossier/${dossierToken}`;

  const shareText = formatShareMessage(
    selectedLang,
    lead.parent_name,
    lead.student_name,
    demoUniversity.name,
    dossierUrl
  );

  const cleanPhone = parentPhone.replace(/\D/g, '');
  const whatsappAppUrl = cleanPhone
    ? `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(shareText)}&type=phone_number&app_absent=0`
    : `https://api.whatsapp.com/send/?text=${encodeURIComponent(shareText)}`;
  const whatsappWaMeUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(shareText)}`
    : `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const whatsappWebUrl = cleanPhone
    ? `https://web.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(shareText)}`
    : `https://web.whatsapp.com/send/?text=${encodeURIComponent(shareText)}`;

  const handleWhatsAppShare = (url: string, channelName: string) => {
    const newLog = {
      id: `act-${Date.now()}`,
      lead_id: lead.id,
      dossier_id: null,
      action: 'dossier_shared',
      details: {
        channel: channelName,
        recipient_phone: cleanPhone || 'Not specified',
        language: selectedLang,
      },
      performed_by: 'Counsellor (Admin)',
      created_at: new Date().toISOString(),
    };
    setTimeline((prev) => [newLog, ...prev]);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleGenerateDossier = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await fetch('/api/dossier/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: lead.id,
          language: selectedLang,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate dossier');
      }

      const data = await res.json();
      const token = data.share_token || dossierToken;
      setDossierToken(token);
      setGeneratedContent(data.dossier?.generated_content || null);
      setHasGenerated(true);

      // Append activity log
      const newLog = {
        id: `act-${Date.now()}`,
        lead_id: lead.id,
        dossier_id: data.dossier?.id || null,
        action: 'dossier_generated',
        details: { language: selectedLang, token },
        performed_by: 'Counsellor (Admin)',
        created_at: new Date().toISOString(),
      };
      setTimeline((prev) => [newLog, ...prev]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Dossier generation failed';
      setGenerationError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dossierUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  // Specific counsellor notes per demo lead
  const getCounsellorNote = () => {
    if (lead.student_name.includes('Aarav')) {
      return 'Rajesh Sharma (father) indicated high interest in computer science, but expressed skepticism about ed-tech fee splits and wanted verifiable proof regarding whether the degree certificate is issued directly by Noida International University.';
    }
    if (lead.student_name.includes('Rohit')) {
      return 'Anand Kulkarni (father) inquired about hostel facilities, ragging prevention policies, and Telugu-speaking faculty or student peers from Telangana/Andhra Pradesh. Dossier delivered.';
    }
    if (lead.student_name.includes('Neha')) {
      return 'Suresh Gupta (father) requested clarification on UGC approval, NAAC recognition, and statutory accreditation before confirming admission. Seat-block fee paid after review.';
    }
    return `Parent expressed keen interest in the NIAT curriculum and university accreditation. Awaiting verification review in ${selectedLang.toUpperCase()}.`;
  };

  const getStatusBadge = () => {
    switch (lead.lead_status) {
      case 'stalled':
        return <Badge variant="pending" className="text-2xs">Stalled ({lead.days_since_counselling || 8} Days)</Badge>;
      case 'dossier_delivered':
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-2xs">Dossier Delivered</Badge>;
      case 'seat_block_paid':
        return <Badge variant="verified" className="text-2xs">Seat-Block Paid</Badge>;
      default:
        return <Badge variant="outline" className="text-2xs">{lead.lead_status.replace(/_/g, ' ')}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back and Page Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-midnight-200/60">
        <div className="flex items-center gap-3">
          <Link href="/admin/leads">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Leads
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-midnight-950 font-serif">
                Lead: {lead.student_name}
              </h1>
              {getStatusBadge()}
              <Badge variant="outline" className="text-2xs bg-amber-50 text-amber-900 border-amber-300 font-mono">
                Test Cohort
              </Badge>
            </div>
            <p className="text-xs text-midnight-500 mt-0.5">
              Parent: {lead.parent_name} • Preferred Language: {selectedLang === 'hi' ? 'Hindi (हिंदी)' : selectedLang === 'te' ? 'Telugu (తెలుగు)' : 'English'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => handleWhatsAppShare(whatsappAppUrl, 'whatsapp_app')}
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs shadow-xs"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Share on WhatsApp
          </Button>
          <Link href={`/dossier/${dossierToken}`} target="_blank">
            <Button size="sm" variant="outline" className="text-xs">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Preview Dossier
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content: Left Column Profile & Dossier, Right Column Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lead Profile & Dossier Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Profile Summary */}
          <Card className="border-midnight-200/70">
            <CardHeader className="pb-3 border-b border-midnight-100">
              <CardTitle className="text-sm font-semibold text-midnight-950 flex items-center gap-2">
                <User className="w-4 h-4 text-midnight-600" />
                Admission Candidate Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-midnight-500 block">Student Full Name</span>
                  <span className="font-semibold text-midnight-950 text-sm">{lead.student_name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-midnight-500 block">Parent / Guardian Name</span>
                  <span className="font-semibold text-midnight-950 text-sm">{lead.parent_name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-midnight-500 block">Parent WhatsApp Mobile</span>
                  <span className="font-semibold text-midnight-900 font-mono flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                    {parentPhone}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-midnight-500 block">Allotted University</span>
                  <span className="font-medium text-midnight-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-verified" />
                    {demoUniversity.name}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-midnight-500 block">Location / City</span>
                  <span className="font-medium text-midnight-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-midnight-500" />
                    {lead.city}, {lead.state}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-midnight-500 block">Counselling Completed</span>
                  <span className="font-medium text-midnight-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-midnight-500" />
                    {lead.counselling_date ? formatDate(lead.counselling_date) : 'Completed'} ({lead.days_since_counselling ?? 8} days ago)
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-midnight-500 block">Seat-Block Payment Status</span>
                  {lead.seat_block_payment ? (
                    <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                      Paid {lead.seat_block_payment_date ? `(${formatDate(lead.seat_block_payment_date)})` : ''}
                    </span>
                  ) : (
                    <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                      Not Paid (Pending)
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-md text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Counsellor Note:</strong> {getCounsellorNote()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dossier Generator & Sharing Workspace */}
          <Card className="border-midnight-200/70 bg-gradient-to-br from-ivory-50 to-ivory-100">
            <CardHeader className="pb-3 border-b border-midnight-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-midnight-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-verified" />
                    Personalised Trust Dossier Generator
                  </CardTitle>
                  <CardDescription className="text-xs text-midnight-500 mt-0.5">
                    Grounds university verification data via Gemini 1.5 into a parent-friendly report
                  </CardDescription>
                </div>
                <Badge variant="verified" className="text-2xs">Evidence Grounded</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-white border border-midnight-200/70 rounded-md">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-midnight-900 block">
                    Parent's Preferred Dossier Language
                  </label>
                  <p className="text-[11px] text-midnight-500">
                    The report will be naturally translated while preserving legal names and source URLs.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select value={selectedLang} onValueChange={(val) => setSelectedLang(val as DossierLanguage)}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleGenerateDossier}
                    disabled={isGenerating}
                    className="h-9 text-xs bg-midnight-900 hover:bg-midnight-800 text-ivory-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-verified" />
                        {hasGenerated ? 'Regenerate' : 'Generate Dossier'}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {generationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs">
                  {generationError}
                </div>
              )}

              {/* Share & Actions Box */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-midnight-600">
                    WhatsApp Delivery & Click-to-Chat
                  </h3>
                  <span className="text-[11px] text-midnight-500 font-mono">
                    User-initiated wa.me intent
                  </span>
                </div>

                {/* Recipient Phone Input */}
                <div className="space-y-1 bg-white p-3 rounded-md border border-midnight-200/80">
                  <label className="text-xs font-semibold text-midnight-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                      Parent WhatsApp Phone Number:
                    </span>
                    <span className="text-[10px] text-midnight-400 font-normal">
                      Include country code (e.g. +91)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="flex-1 h-9 px-3 text-xs font-mono rounded-md border border-midnight-200 bg-white text-midnight-900 focus:outline-hidden focus:ring-1 focus:ring-midnight-400"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setParentPhone(lead.parent_phone || '+91 98765 43210')}
                      className="text-2xs h-9 px-2.5 text-midnight-600"
                    >
                      Reset
                    </Button>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-midnight-500 pt-1">
                    <Info className="w-3 h-3 text-midnight-400 shrink-0" />
                    <span>
                      {cleanPhone
                        ? `Target recipient set to: +${cleanPhone}. WhatsApp will open directly into this chat.`
                        : 'No phone number provided. WhatsApp will ask you to pick a contact.'}
                    </span>
                  </div>
                </div>

                {/* Generated Dossier Link */}
                <div className="p-3 bg-white border border-midnight-200/80 rounded-md space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-midnight-500">
                    <span>Direct Parent Dossier URL:</span>
                    <button
                      onClick={handleCopyLink}
                      className="text-verified-dark font-medium hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3 h-3 text-verified" /> : <Copy className="w-3 h-3" />}
                      {copiedLink ? 'Copied link' : 'Copy link'}
                    </button>
                  </div>
                  <div className="p-2 bg-midnight-50 rounded border border-midnight-100 font-mono text-2xs text-midnight-800 break-all select-all">
                    {dossierUrl}
                  </div>
                </div>

                {/* Pre-drafted WhatsApp message preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-midnight-500">
                    <span>Pre-drafted Message ({selectedLang.toUpperCase()}):</span>
                    <button
                      onClick={handleCopyMessage}
                      className="text-verified-dark font-medium hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedMessage ? <Check className="w-3 h-3 text-verified" /> : <Copy className="w-3 h-3" />}
                      {copiedMessage ? 'Copied message' : 'Copy text'}
                    </button>
                  </div>
                  <div className="p-3 bg-white border border-midnight-200/80 rounded-md text-xs text-midnight-800 font-sans leading-relaxed">
                    {shareText}
                  </div>
                </div>

                {/* WhatsApp Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  <Button
                    onClick={() => handleWhatsAppShare(whatsappWebUrl, 'whatsapp_web')}
                    variant="outline"
                    className="text-xs h-9 border-[#25D366] text-emerald-800 hover:bg-emerald-50"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-[#25D366]" />
                    Open in WhatsApp Web
                  </Button>
                  <Button
                    onClick={() => handleWhatsAppShare(whatsappAppUrl, 'whatsapp_app')}
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs h-9 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Open WhatsApp App (wa.me)
                  </Button>
                  <Link href={`/dossier/${dossierToken}`} target="_blank">
                    <Button variant="outline" className="text-xs h-9">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Open Dossier in New Tab
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Activity Timeline */}
        <div className="space-y-6">
          <Card className="border-midnight-200/70 h-full">
            <CardHeader className="pb-3 border-b border-midnight-100">
              <CardTitle className="text-sm font-semibold text-midnight-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-midnight-600" />
                Lead Event Timeline
              </CardTitle>
              <CardDescription className="text-xs text-midnight-500">
                Audited journey for {lead.parent_name} & {lead.student_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-midnight-200">
                {timeline.map((act) => (
                  <div key={act.id} className="relative group">
                    <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-midnight-400 ring-4 ring-ivory-50 group-hover:bg-verified transition-colors" />
                    <div className="text-xs">
                      <div className="font-semibold text-midnight-900 capitalize">
                        {act.action.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[11px] text-midnight-400 font-mono mt-0.5">
                        {formatDate(act.created_at)}
                      </div>
                      {act.performed_by && (
                        <div className="text-[10px] text-midnight-500 mt-0.5">
                          By: {act.performed_by}
                        </div>
                      )}
                      {act.details && (
                        <div className="text-[11px] text-midnight-600 bg-midnight-100/50 p-1.5 rounded mt-1 font-mono text-2xs break-all">
                          {JSON.stringify(act.details)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
