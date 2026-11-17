// ─── Core domain types for ProofDesk ───

export type EvidenceStatus = 'VERIFIED' | 'NOT_YET_VERIFIED' | 'NOT_YET_PROVEN' | 'CONFLICTING_EVIDENCE';
export type LeadStatus = 'new' | 'counselling_scheduled' | 'counselling_completed' | 'stalled' | 'dossier_generated' | 'dossier_delivered' | 'peer_call_requested' | 'peer_call_booked' | 'seat_block_paid' | 'enrolled' | 'opted_out';
export type DossierLanguage = 'en' | 'hi' | 'te';
export type ExperimentGroup = 'control' | 'test';
export type CallRequestStatus = 'requested' | 'matched' | 'scheduled' | 'completed' | 'cancelled';
export type ConsentStatus = 'pending' | 'consented' | 'revoked';

export interface University {
  id: string;
  name: string;
  short_name: string;
  city: string;
  state: string;
  established_year: number | null;
  university_type: string;
  official_website: string;
  ugc_url: string | null;
  niat_campus_url: string | null;
  niat_collaboration_details: string | null;
  created_at: string;
  updated_at: string;
}

export interface Evidence {
  id: string;
  university_id: string;
  category: string;
  claim: string;
  source_organisation: string;
  source_title: string;
  source_url: string;
  publication_date: string | null;
  date_checked: string;
  status: EvidenceStatus;
  explanation: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  student_name: string;
  parent_name: string;
  parent_phone: string | null;
  parent_email: string | null;
  university_id: string;
  city: string;
  state: string;
  preferred_language: DossierLanguage;
  lead_source: string;
  lead_status: LeadStatus;
  experiment_group: ExperimentGroup;
  counselling_date: string | null;
  counselling_completed: boolean;
  days_since_counselling: number | null;
  seat_block_payment: boolean;
  seat_block_payment_date: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  university?: University;
  dossiers?: Dossier[];
}

export interface Dossier {
  id: string;
  lead_id: string;
  university_id: string;
  language: DossierLanguage;
  share_token: string;
  generated_content: DossierContent | null;
  generation_status: 'pending' | 'generating' | 'completed' | 'failed';
  generation_error: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  lead?: Lead;
  university?: University;
}

export interface DossierContent {
  opening: {
    title: string;
    student_name: string;
    university_name: string;
    generation_date: string;
    last_verification_date: string;
    language: DossierLanguage;
    evidence_coverage: string;
    introduction: string;
  };
  degree_awarding: {
    title: string;
    content: string;
    sources: SourceCitation[];
  };
  recognition: {
    title: string;
    entries: {
      claim: string;
      status: EvidenceStatus;
      explanation: string;
      source: SourceCitation;
    }[];
  };
  financial: {
    title: string;
    table: {
      item: string;
      responsible_institution: string;
      amount: string;
      evidence_status: EvidenceStatus;
      source: SourceCitation | null;
    }[];
    refund_conditions: string;
  };
  proven_vs_not: {
    title: string;
    proven: { claim: string; explanation: string }[];
    not_proven: { claim: string; explanation: string }[];
  };
  parent_questions: {
    title: string;
    questions: string[];
  };
  peer_connection: {
    title: string;
    description: string;
  };
}

export interface SourceCitation {
  title: string;
  url: string;
  organisation: string;
  date_checked: string;
}

export interface PeerVolunteer {
  id: string;
  name: string;
  role: 'parent' | 'student';
  university_id: string;
  language: DossierLanguage;
  city: string;
  state: string;
  year_of_joining: number | null;
  bio: string | null;
  consent_status: ConsentStatus;
  is_available: boolean;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  university?: University;
}

export interface CallRequest {
  id: string;
  lead_id: string;
  volunteer_id: string | null;
  dossier_id: string | null;
  preferred_time: string | null;
  preferred_language: DossierLanguage;
  status: CallRequestStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  lead?: Lead;
  volunteer?: PeerVolunteer;
}

export interface ActivityLog {
  id: string;
  lead_id: string | null;
  dossier_id: string | null;
  action: string;
  details: Record<string, unknown> | null;
  performed_by: string;
  created_at: string;
}

// Dashboard stats
export interface DashboardStats {
  total_stalled: number;
  dossiers_generated: number;
  dossiers_delivered: number;
  peer_calls_requested: number;
  peer_calls_booked: number;
  seat_block_payments: number;
  verification_issues: number;
}

export interface FunnelStep {
  label: string;
  count: number;
  percentage: number;
}

export interface ExperimentMetrics {
  group: ExperimentGroup;
  total_leads: number;
  call_booking_rate: number;
  seat_block_rate: number;
  opt_out_rate: number;
  complaint_rate: number;
}
