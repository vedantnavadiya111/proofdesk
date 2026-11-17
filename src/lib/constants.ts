import type { DossierLanguage } from './types';

// Shared constants used across the application

export const APP_NAME = 'ProofDesk';
export const APP_TAGLINE = 'Clarity before commitment.';

export const LANGUAGES: { value: DossierLanguage; label: string; nativeLabel: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { value: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
];

export const EVIDENCE_CATEGORIES = [
  { key: 'identity', labelKey: 'cat_identity' },
  { key: 'ugc', labelKey: 'cat_ugc' },
  { key: 'naac', labelKey: 'cat_naac' },
  { key: 'statutory', labelKey: 'cat_statutory' },
  { key: 'niat', labelKey: 'cat_niat' },
  { key: 'degree', labelKey: 'cat_degree' },
  { key: 'program', labelKey: 'cat_program' },
  { key: 'fees', labelKey: 'cat_fees' },
  { key: 'payment', labelKey: 'cat_payment' },
  { key: 'refund', labelKey: 'cat_refund' },
  { key: 'outcomes', labelKey: 'cat_outcomes' },
] as const;

export const STATUS_COLORS: Record<string, string> = {
  VERIFIED: 'bg-verified-bg text-verified-dark border-verified/20',
  NOT_YET_VERIFIED: 'bg-pending-bg text-pending-dark border-pending/20',
  NOT_YET_PROVEN: 'bg-notproven-bg text-notproven-dark border-notproven/20',
  CONFLICTING_EVIDENCE: 'bg-conflicting-bg text-conflicting-dark border-conflicting/20',
};

export const STATUS_DOT_COLORS: Record<string, string> = {
  VERIFIED: 'bg-verified',
  NOT_YET_VERIFIED: 'bg-pending',
  NOT_YET_PROVEN: 'bg-notproven',
  CONFLICTING_EVIDENCE: 'bg-conflicting',
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  counselling_scheduled: 'bg-sky-50 text-sky-700 border-sky-200',
  counselling_completed: 'bg-teal-50 text-teal-700 border-teal-200',
  stalled: 'bg-amber-50 text-amber-700 border-amber-200',
  dossier_generated: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  dossier_delivered: 'bg-violet-50 text-violet-700 border-violet-200',
  peer_call_requested: 'bg-purple-50 text-purple-700 border-purple-200',
  peer_call_booked: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  seat_block_paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  enrolled: 'bg-green-50 text-green-700 border-green-200',
  opted_out: 'bg-gray-50 text-gray-500 border-gray-200',
};
