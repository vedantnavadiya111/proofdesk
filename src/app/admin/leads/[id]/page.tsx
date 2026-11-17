'use client';

import { useState, use } from 'react';
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
} from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';
import { formatShareMessage } from '@/lib/translations';
import type { DossierLanguage, DossierContent } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [selectedLang, setSelectedLang] = useState<DossierLanguage>('hi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [dossierToken, setDossierToken] = useState<string>(DEMO_DOSSIER_TOKEN);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<DossierContent | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const [timeline, setTimeline] = useState(demoActivityLogs);

  const dossierUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dossier/${dossierToken}`
    : `http://localhost:3000/dossier/${dossierToken}`;

  const shareText = formatShareMessage(
    selectedLang,
    demoLead.parent_name,
    demoLead.student_name,
    demoUniversity.name,
    dossierUrl
  );

  const handleGenerateDossier = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await fetch('/api/dossier/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: demoLead.id,
          language: selectedLang,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate dossier');
      }

      const data = await res.json();
      setDossierToken(data.share_token || DEMO_DOSSIER_TOKEN);
      setGeneratedContent(data.dossier?.generated_content || null);
      setHasGenerated(true);

      // Append activity log
      const newLog = {
        id: `act-${Date.now()}`,
        lead_id: demoLead.id,
        dossier_id: data.dossier?.id || null,
        action: 'dossier_generated',
        details: { language: selectedLang, token: data.share_token },
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

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

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
                Lead: {demoLead.student_name}
              </h1>
              <Badge variant="pending" className="text-2xs">Stalled (8 Days)</Badge>
              <Badge variant="outline" className="text-2xs bg-amber-50 text-amber-900 border-amber-300 font-mono">
                Test Cohort
              </Badge>
            </div>
            <p className="text-xs text-midnight-500 mt-0.5">
              Parent: {demoLead.parent_name} • Preferred Language: Hindi (हिंदी)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs shadow-xs">
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Share on WhatsApp
            </Button>
          </a>
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
                  <span className="font-semibold text-midnight-950 text-sm">{demoLead.student_name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-midnight-500 block">Parent / Guardian Name</span>
                  <span className="font-semibold text-midnight-950 text-sm">{demoLead.parent_name}</span>
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
                    {demoLead.city}, {demoLead.state}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-midnight-500 block">Counselling Completed</span>
                  <span className="font-medium text-midnight-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-midnight-500" />
                    {formatDate(demoLead.counselling_date!)} (8 days ago)
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-midnight-500 block">Seat-Block Payment Status</span>
                  <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    Not Paid (Stalled)
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-md text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Counsellor Note:</strong> Rajesh Sharma (father) indicated high interest in computer science, but expressed skepticism about ed-tech fee splits and wanted verifiable proof regarding whether the degree certificate is issued directly by Noida International University.
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
                <h3 className="text-xs font-semibold uppercase tracking-wider text-midnight-600">
                  Dossier Link & Parent Messaging
                </h3>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={dossierUrl}
                    className="flex-1 h-9 px-3 text-xs bg-white border border-midnight-200 rounded-md font-mono text-midnight-700 select-all"
                  />
                  <Button variant="outline" size="sm" onClick={handleCopyLink} className="h-9 text-xs">
                    {copiedLink ? <Check className="w-3.5 h-3.5 mr-1 text-verified" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copiedLink ? 'Copied' : 'Copy Link'}
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-midnight-500">
                    <span>Pre-drafted WhatsApp Message ({selectedLang.toUpperCase()}):</span>
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

                <div className="flex items-center justify-end gap-2 pt-2">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs h-9">
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      Open WhatsApp Click-to-Chat
                    </Button>
                  </a>
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
                Audited journey for Rajesh Sharma & Aarav
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
