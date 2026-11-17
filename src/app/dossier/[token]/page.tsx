'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertTriangle,
  ExternalLink,
  Phone,
  MessageSquare,
  Building2,
  Scale,
  Calendar,
  CreditCard,
  Check,
  Globe,
  Share2,
  Copy,
  ChevronDown,
  Info,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  demoUniversity,
  demoEvidence,
  demoLead,
  demoVolunteer,
  DEMO_DOSSIER_TOKEN,
} from '@/lib/demo-data';
import { buildFallbackDossier } from '@/lib/gemini';
import { t, getTranslations, formatShareMessage } from '@/lib/translations';
import { formatDate } from '@/lib/utils';
import { LANGUAGES } from '@/lib/constants';
import type {
  DossierContent,
  DossierLanguage,
  EvidenceStatus,
  PeerVolunteer,
  SourceCitation,
} from '@/lib/types';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function PublicDossierPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  // Language state (defaults to lead's preference or Hindi for sample)
  const [lang, setLang] = useState<DossierLanguage>('hi');
  const [dossierData, setDossierData] = useState<DossierContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Peer call request modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferredTime, setPreferredTime] = useState('Evening (6 PM - 8 PM)');
  const [isSubmittingCall, setIsSubmittingCall] = useState(false);
  const [callRequested, setCallRequested] = useState(false);

  // Fetch or generate dossier on load and language switch
  useEffect(() => {
    async function loadDossier() {
      setLoading(true);
      try {
        const res = await fetch(`/api/dossier/${token}?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          if (data.dossier?.generated_content) {
            setDossierData(data.dossier.generated_content);
          } else {
            // Build fallback for this language
            const fallback = buildFallbackDossier(
              data.lead?.student_name || demoLead.student_name,
              data.university?.name || demoUniversity.name,
              lang,
              data.evidence || demoEvidence
            );
            setDossierData(fallback);
          }
        } else {
          // Local demo fallback
          const fallback = buildFallbackDossier(
            demoLead.student_name,
            demoUniversity.name,
            lang,
            demoEvidence
          );
          setDossierData(fallback);
        }
      } catch {
        // Fallback
        const fallback = buildFallbackDossier(
          demoLead.student_name,
          demoUniversity.name,
          lang,
          demoEvidence
        );
        setDossierData(fallback);
      } finally {
        setLoading(false);
      }
    }

    loadDossier();
  }, [token, lang]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleRequestPeerCall = async () => {
    setIsSubmittingCall(true);
    try {
      await fetch('/api/peer-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: demoLead.id,
          volunteer_id: demoVolunteer.id,
          preferred_language: lang,
          preferred_time: preferredTime,
        }),
      });
      setCallRequested(true);
      setIsModalOpen(false);
    } catch {
      setCallRequested(true);
      setIsModalOpen(false);
    } finally {
      setIsSubmittingCall(false);
    }
  };

  const getStatusBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge variant="verified" className="text-[10px] font-mono shrink-0">
            <CheckCircle2 className="w-3 h-3 mr-1 text-verified" />
            {t('ev_verified', lang)}
          </Badge>
        );
      case 'NOT_YET_VERIFIED':
        return (
          <Badge variant="pending" className="text-[10px] font-mono shrink-0">
            <Clock className="w-3 h-3 mr-1 text-pending" />
            {t('ev_not_verified', lang)}
          </Badge>
        );
      case 'NOT_YET_PROVEN':
        return (
          <Badge variant="notproven" className="text-[10px] font-mono shrink-0">
            <HelpCircle className="w-3 h-3 mr-1 text-notproven" />
            {t('ev_not_proven', lang)}
          </Badge>
        );
      case 'CONFLICTING_EVIDENCE':
        return (
          <Badge variant="conflicting" className="text-[10px] font-mono shrink-0">
            <AlertTriangle className="w-3 h-3 mr-1 text-conflicting" />
            {t('ev_conflicting', lang)}
          </Badge>
        );
    }
  };

  if (loading && !dossierData) {
    return (
      <div className="min-h-screen bg-ivory-100 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-midnight-900 border-t-verified rounded-full animate-spin mb-4" />
        <p className="text-sm font-serif text-midnight-800">
          Preparing University Trust Dossier…
        </p>
        <p className="text-xs text-midnight-500 mt-1">
          Verifying regulatory records and fee declarations
        </p>
      </div>
    );
  }

  const d = dossierData!;
  const volunteer = demoVolunteer;

  return (
    <div className="min-h-screen bg-ivory-100 text-midnight-950 font-sans antialiased selection:bg-verified-light selection:text-verified-dark pb-20">
      {/* Editorial Top Bar (Mobile-first) */}
      <header className="sticky top-0 z-40 bg-midnight-950 text-ivory-50 border-b border-midnight-800 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-verified/20 border border-verified/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-verified" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-ivory-50 font-serif">
                ProofDesk
              </span>
              <span className="hidden sm:inline-block text-[11px] text-midnight-400 ml-2 border-l border-midnight-800 pl-2">
                Parent Trust & Due Diligence Dossier
              </span>
            </div>
          </div>

          {/* Language Switcher and Share Action */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-midnight-900 border border-midnight-800 rounded-md p-0.5 text-xs">
              <Globe className="w-3.5 h-3.5 ml-1.5 mr-1 text-midnight-400" />
              {LANGUAGES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setLang(item.value)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    lang === item.value
                      ? 'bg-verified text-white font-semibold'
                      : 'text-midnight-300 hover:text-white'
                  }`}
                >
                  {item.nativeLabel}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-7 text-xs border-midnight-700 bg-midnight-900 text-ivory-100 hover:bg-midnight-800 px-2"
            >
              {isCopied ? <Check className="w-3 h-3 text-verified" /> : <Share2 className="w-3 h-3" />}
              <span className="hidden sm:inline ml-1">{isCopied ? 'Copied' : 'Share'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dossier Document Container */}
      <main className="max-w-3xl mx-auto px-4 pt-6 sm:pt-10 space-y-8">
        {/* ========================================================= */}
        {/* OPENING SECTION */}
        {/* ========================================================= */}
        <section className="bg-ivory-50 border border-midnight-200/80 rounded-xl p-5 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-midnight-200/80 pb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="outline" className="text-2xs font-mono uppercase tracking-wider text-midnight-600 bg-midnight-50">
                Official Institutional Verification
              </Badge>
              <span className="text-2xs font-mono text-midnight-500">
                Token: {token}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-midnight-950 font-serif leading-tight">
              {d.opening.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
              <div>
                <span className="text-midnight-500 block">Candidate:</span>
                <span className="font-semibold text-midnight-950 text-sm">{d.opening.student_name}</span>
              </div>
              <div>
                <span className="text-midnight-500 block">Allotted University:</span>
                <span className="font-semibold text-midnight-950 text-sm flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-verified" />
                  {d.opening.university_name}
                </span>
              </div>
            </div>
          </div>

          {/* Dossier Meta Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-midnight-50/60 p-3.5 rounded-lg border border-midnight-100">
            <div>
              <span className="text-midnight-400 block text-2xs font-mono uppercase">{t('dossier_generated', lang)}</span>
              <span className="font-medium text-midnight-800">{d.opening.generation_date}</span>
            </div>
            <div>
              <span className="text-midnight-400 block text-2xs font-mono uppercase">{t('dossier_verified', lang)}</span>
              <span className="font-medium text-midnight-800">{d.opening.last_verification_date}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-midnight-400 block text-2xs font-mono uppercase">{t('dossier_coverage', lang)}</span>
              <span className="font-semibold text-verified-dark font-mono">11 Claims Evaluated</span>
            </div>
          </div>

          {/* Editorial Purpose Statement */}
          <div className="p-4 bg-midnight-900 text-ivory-100 rounded-lg text-xs leading-relaxed font-sans">
            <p className="italic">
              "{d.opening.introduction}"
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 1: WHO AWARDS THE DEGREE? */}
        {/* ========================================================= */}
        <section className="bg-ivory-50 border border-midnight-200/80 rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-midnight-200/70">
            <div className="w-6 h-6 rounded bg-midnight-900 text-ivory-50 flex items-center justify-center font-mono font-bold text-xs">
              1
            </div>
            <h2 className="text-lg font-bold text-midnight-950 font-serif">
              {d.degree_awarding.title}
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-midnight-800 leading-relaxed">
            <p className="p-4 bg-white rounded-lg border border-midnight-200/70 leading-relaxed font-sans">
              {d.degree_awarding.content}
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-2xs font-mono uppercase tracking-wider text-midnight-500 block">
                Primary Official Documentation:
              </span>
              <div className="space-y-2">
                {d.degree_awarding.sources.map((src, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-midnight-50/60 rounded border border-midnight-100">
                    <span className="font-medium text-midnight-900">{src.title} ({src.organisation})</span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-verified-dark hover:underline flex items-center gap-1 font-medium shrink-0 ml-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Verify Link
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: UNIVERSITY RECOGNITION AND APPROVALS */}
        {/* ========================================================= */}
        <section className="bg-ivory-50 border border-midnight-200/80 rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-midnight-200/70">
            <div className="w-6 h-6 rounded bg-midnight-900 text-ivory-50 flex items-center justify-center font-mono font-bold text-xs">
              2
            </div>
            <h2 className="text-lg font-bold text-midnight-950 font-serif">
              {d.recognition.title}
            </h2>
          </div>

          <p className="text-xs text-midnight-600">
            Each entry represents a separate regulatory check. Note: University legal recognition does not automatically imply that every delivery arrangement or off-campus centre is specifically endorsed.
          </p>

          <div className="space-y-3 pt-1">
            {d.recognition.entries.map((entry, index) => (
              <div
                key={index}
                className="p-3.5 sm:p-4 bg-white rounded-lg border border-midnight-200/70 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-midnight-950 leading-snug">
                    {entry.claim}
                  </span>
                  {getStatusBadge(entry.status)}
                </div>

                <p className="text-xs text-midnight-700 leading-relaxed">
                  {entry.explanation}
                </p>

                <div className="pt-2 border-t border-midnight-100 flex items-center justify-between text-[11px] text-midnight-500">
                  <span>Source: {entry.source.organisation}</span>
                  <a
                    href={entry.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-verified-dark hover:underline flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Direct Source
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: WHO GETS PAID WHAT? (FINANCIAL TRANSPARENCY) */}
        {/* ========================================================= */}
        <section className="bg-ivory-50 border border-midnight-200/80 rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-midnight-200/70">
            <div className="w-6 h-6 rounded bg-midnight-900 text-ivory-50 flex items-center justify-center font-mono font-bold text-xs">
              3
            </div>
            <h2 className="text-lg font-bold text-midnight-950 font-serif">
              {d.financial.title}
            </h2>
          </div>

          <p className="text-xs text-midnight-600">
            Financial transparency breakdown between Noida International University and NxtWave / NIAT.
          </p>

          {/* Table */}
          <div className="border border-midnight-200/80 rounded-lg overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-midnight-200/80 bg-midnight-50 text-midnight-700 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">{t('fin_item', lang)}</th>
                  <th className="py-2.5 px-3.5">{t('fin_institution', lang)}</th>
                  <th className="py-2.5 px-3.5">{t('fin_amount', lang)}</th>
                  <th className="py-2.5 px-3.5">{t('fin_evidence', lang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight-100">
                {d.financial.table.map((row, idx) => (
                  <tr key={idx} className="hover:bg-midnight-50/50">
                    <td className="py-3 px-3.5 font-medium text-midnight-950">{row.item}</td>
                    <td className="py-3 px-3.5 text-midnight-700">{row.responsible_institution}</td>
                    <td className="py-3 px-3.5 font-mono text-midnight-600 font-medium">{row.amount}</td>
                    <td className="py-3 px-3.5">{getStatusBadge(row.evidence_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prominent Amber Warning on Fees/Refund */}
          <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-lg text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{t('dossier_s3_refund', lang)}</span>
            </div>
            <p className="leading-relaxed">
              {d.financial.refund_conditions}
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: PROVEN VS. NOT YET PROVEN (LEDGER) */}
        {/* ========================================================= */}
        <section className="bg-ivory-50 border border-midnight-200/80 rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-midnight-200/70">
            <div className="w-6 h-6 rounded bg-midnight-900 text-ivory-50 flex items-center justify-center font-mono font-bold text-xs">
              4
            </div>
            <h2 className="text-lg font-bold text-midnight-950 font-serif">
              {d.proven_vs_not.title}
            </h2>
          </div>

          <p className="text-xs text-midnight-600">
            A balanced evaluation of verifiable facts versus prospective claims that lack cohort-level documentation.
          </p>

          {/* Two-Column Ledger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Proven Column */}
            <div className="p-4 bg-white rounded-lg border-l-4 border-l-verified border-y border-r border-midnight-200/70 space-y-3">
              <div className="flex items-center gap-2 text-verified-dark font-serif font-bold text-sm pb-1 border-b border-midnight-100">
                <CheckCircle2 className="w-4 h-4 text-verified" />
                <span>{t('dossier_s4_proven', lang)}</span>
              </div>
              <div className="space-y-3 text-xs">
                {d.proven_vs_not.proven.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="font-semibold text-midnight-950">{item.claim}</p>
                    <p className="text-midnight-600 leading-relaxed text-[11px]">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Not Yet Proven Column */}
            <div className="p-4 bg-white rounded-lg border-l-4 border-l-pending border-y border-r border-midnight-200/70 space-y-3">
              <div className="flex items-center gap-2 text-pending-dark font-serif font-bold text-sm pb-1 border-b border-midnight-100">
                <Clock className="w-4 h-4 text-pending" />
                <span>{t('dossier_s4_not_proven', lang)}</span>
              </div>
              <div className="space-y-3 text-xs">
                {d.proven_vs_not.not_proven.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="font-semibold text-midnight-950">{item.claim}</p>
                    <p className="text-midnight-600 leading-relaxed text-[11px]">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: QUESTIONS EVERY PARENT SHOULD ASK */}
        {/* ========================================================= */}
        <section className="bg-ivory-50 border border-midnight-200/80 rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-midnight-200/70">
            <div className="w-6 h-6 rounded bg-midnight-900 text-ivory-50 flex items-center justify-center font-mono font-bold text-xs">
              5
            </div>
            <h2 className="text-lg font-bold text-midnight-950 font-serif">
              {d.parent_questions.title}
            </h2>
          </div>

          <p className="text-xs text-midnight-600">
            Empower yourself with these essential due-diligence questions before transferring seat-block funds:
          </p>

          <ol className="space-y-2.5 pt-1 text-xs sm:text-sm">
            {d.parent_questions.questions.map((q, idx) => (
              <li
                key={idx}
                className="p-3.5 bg-white rounded-lg border border-midnight-200/70 flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-midnight-100 text-midnight-700 flex items-center justify-center text-xs font-mono font-semibold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-midnight-900 font-medium leading-snug">{q}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: SPEAK TO A CURRENT PARENT OR STUDENT */}
        {/* ========================================================= */}
        <section className="bg-linear-to-br from-ivory-50 to-ivory-200/70 border border-midnight-200/80 rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-midnight-200/70">
            <div className="w-6 h-6 rounded bg-midnight-900 text-ivory-50 flex items-center justify-center font-mono font-bold text-xs">
              6
            </div>
            <h2 className="text-lg font-bold text-midnight-950 font-serif">
              {d.peer_connection.title}
            </h2>
          </div>

          <p className="text-xs text-midnight-700 leading-relaxed">
            {d.peer_connection.description}
          </p>

          {/* Volunteer Card */}
          <div className="p-4 sm:p-5 bg-white rounded-lg border border-midnight-200/80 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-midnight-950 font-serif">
                    {volunteer.name}
                  </span>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {volunteer.role === 'parent' ? 'Current Parent' : 'Current Student'}
                  </Badge>
                </div>
                <p className="text-xs text-midnight-500 mt-0.5">
                  Noida International University • Joined {volunteer.year_of_joining}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-verified-dark font-medium bg-verified-bg px-2.5 py-1 rounded-full border border-verified/20">
                <span className="w-2 h-2 rounded-full bg-verified" />
                <span>{t('peer_available', lang)}</span>
              </div>
            </div>

            <p className="text-xs text-midnight-700 leading-relaxed italic bg-midnight-50/50 p-3 rounded border border-midnight-100">
              "{volunteer.bio}"
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-midnight-600 pt-1">
              <div>
                <span className="text-[10px] text-midnight-400 font-mono uppercase block">{t('peer_language', lang)}</span>
                <span className="font-semibold text-midnight-900">
                  {volunteer.language === 'hi' ? 'Hindi (हिंदी)' : 'English'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-midnight-400 font-mono uppercase block">{t('peer_city', lang)}</span>
                <span className="font-semibold text-midnight-900">{volunteer.city}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-midnight-100">
              <span className="text-[11px] text-amber-800 font-mono">
                {t('peer_demo_label', lang)}
              </span>

              {callRequested ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-verified-dark bg-verified-bg px-3 py-1.5 rounded-md border border-verified/30">
                  <Check className="w-3.5 h-3.5 text-verified" />
                  {t('dossier_call_requested', lang)}
                </div>
              ) : (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-midnight-900 hover:bg-midnight-800 text-ivory-50 text-xs shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-verified" />
                  {t('dossier_request_call', lang)}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Institutional Due-Diligence Disclaimer Footer */}
        <footer className="text-center text-xs text-midnight-500 pt-6 border-t border-midnight-200/80 space-y-2">
          <p className="font-serif font-medium text-midnight-700">
            ProofDesk — Clarity before commitment.
          </p>
          <p className="text-[11px] max-w-xl mx-auto text-midnight-400 leading-relaxed">
            This verification dossier has been prepared for the designated parent using authoritative public regulatory records, university statutory disclosures, and independent verification protocols. It is intended to support parent transparency and due diligence.
          </p>
        </footer>
      </main>

      {/* Peer Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg text-midnight-950">
              Request a Conversation with {volunteer.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-midnight-600">
              Select your preferred time slot. A counsellor will coordinate an authentic peer discussion.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-midnight-900 block">Preferred Time Window</label>
              <select
                className="w-full h-9 px-3 border border-midnight-200 rounded-md bg-white text-xs"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              >
                <option value="Morning (10 AM - 12 PM)">Morning (10 AM - 12 PM)</option>
                <option value="Afternoon (2 PM - 4 PM)">Afternoon (2 PM - 4 PM)</option>
                <option value="Evening (6 PM - 8 PM)">Evening (6 PM - 8 PM)</option>
                <option value="Weekend Anytime">Weekend Anytime</option>
              </select>
            </div>

            <div className="p-3 bg-midnight-50 rounded text-[11px] text-midnight-600 space-y-1">
              <p>• Language of discussion: <strong>{volunteer.language === 'hi' ? 'Hindi (हिंदी)' : 'English'}</strong></p>
              <p>• Volunteer status: <strong>Consented Peer Parent</strong></p>
              <p className="text-amber-800 italic">• Simulated demonstration environment. No actual phone numbers will be dialed.</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleRequestPeerCall}
              disabled={isSubmittingCall}
              className="bg-midnight-900 hover:bg-midnight-800 text-ivory-50 text-xs"
            >
              {isSubmittingCall ? 'Requesting…' : 'Confirm Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
