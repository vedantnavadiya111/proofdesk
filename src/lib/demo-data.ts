// Demo data for ProofDesk — all data is fictional and illustrative.
// Used when Supabase is not configured or for initial seeding.

import type {
  University, Evidence, Lead, PeerVolunteer, Dossier,
  ActivityLog, DashboardStats, FunnelStep, EvidenceStatus,
} from './types';

// ─── University ─────────────────────────────────────────────
export const DEMO_UNIVERSITY_ID = '00000000-0000-0000-0000-000000000001';

export const demoUniversity: University = {
  id: DEMO_UNIVERSITY_ID,
  name: 'Noida International University',
  short_name: 'NIU',
  city: 'Greater Noida',
  state: 'Uttar Pradesh',
  established_year: 2010,
  university_type: 'Private',
  official_website: 'https://niu.edu.in/',
  ugc_url: 'https://www.ugc.gov.in/universitydetails/Private_university_other?id=550',
  niat_campus_url: 'https://www.niatindia.com/campus',
  niat_collaboration_details: 'NIAT (NxtWave Institute of Advanced Technologies) is an ed-tech upskilling program that collaborates with universities to deliver technology-enhanced education. The nature and scope of this collaboration with NIU requires direct verification from both institutions.',
  created_at: '2026-01-15T10:00:00Z',
  updated_at: '2026-11-15T10:00:00Z',
};

// ─── Evidence Library ───────────────────────────────────────
export const demoEvidence: Evidence[] = [
  {
    id: 'ev-001',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'identity',
    claim: 'Noida International University is a private university established by the Uttar Pradesh State Legislature under the Noida International University Act, 2010.',
    source_organisation: 'Noida International University',
    source_title: 'About NIU',
    source_url: 'https://niu.edu.in/about/',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'VERIFIED' as EvidenceStatus,
    explanation: 'The university\'s official website states its establishment under the UP State Legislature Act of 2010. This is consistent with the UGC listing.',
    sort_order: 1,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'ev-002',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'ugc',
    claim: 'Noida International University is listed in the UGC list of private universities in Uttar Pradesh and is empowered to award degrees as specified by the UGC.',
    source_organisation: 'University Grants Commission (UGC)',
    source_title: 'UGC University Details — Noida International University',
    source_url: 'https://www.ugc.gov.in/universitydetails/Private_university_other?id=550',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'VERIFIED' as EvidenceStatus,
    explanation: 'The UGC website lists Noida International University under private universities in Uttar Pradesh (ID 550). This confirms the university\'s right to confer degrees under the UGC Act, 1956. Note: UGC recognition of the university does not automatically extend to every off-campus programme, delivery arrangement, or edtech collaboration.',
    sort_order: 2,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'ev-003',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'naac',
    claim: 'Noida International University holds NAAC accreditation.',
    source_organisation: 'National Assessment and Accreditation Council (NAAC)',
    source_title: 'NAAC Institutional Accreditation',
    source_url: 'https://niu.edu.in/recognitions-approvals/',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'NOT_YET_VERIFIED' as EvidenceStatus,
    explanation: 'The university claims NAAC accreditation on its website. The current NAAC grade, validity period, and cycle need to be independently confirmed from the NAAC portal. At the time of this check, independent confirmation from the NAAC portal was not completed.',
    sort_order: 3,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'ev-004',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'statutory',
    claim: 'NIU holds relevant approvals from statutory bodies for its programmes as listed on its recognitions page.',
    source_organisation: 'Noida International University',
    source_title: 'NIU Recognitions & Approvals',
    source_url: 'https://niu.edu.in/recognitions-approvals/',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'NOT_YET_VERIFIED' as EvidenceStatus,
    explanation: 'The university lists multiple approvals on its website. Each specific programme\'s approval status (e.g., AICTE for technical programmes, BCI for law) needs individual verification from the respective statutory body. The requirement for AICTE approval depends on the specific programme and its delivery mode.',
    sort_order: 4,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'ev-005',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'niat',
    claim: 'NIAT operates in collaboration with Noida International University to deliver an enhanced technology education programme.',
    source_organisation: 'NxtWave / NIAT',
    source_title: 'NIAT Campus Directory',
    source_url: 'https://www.niatindia.com/campus',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'VERIFIED' as EvidenceStatus,
    explanation: 'The NIAT website lists Noida International University as one of its campus partners. However, the specific legal structure, formal agreement terms, and university-approved scope of this collaboration require direct verification from both NIU and NIAT.',
    sort_order: 5,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'ev-006',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'degree',
    claim: 'The degree for NIAT students at NIU is awarded by Noida International University.',
    source_organisation: 'NxtWave / NIAT',
    source_title: 'NIAT Programme Information',
    source_url: 'https://www.niatindia.com/campus',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'VERIFIED' as EvidenceStatus,
    explanation: 'According to available information, the degree is awarded by Noida International University, not by NIAT or NxtWave. NIAT provides supplementary upskilling and industry training. Parents should confirm the exact degree nomenclature and issuing institution directly with the university.',
    sort_order: 6,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'ev-007',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'program',
    claim: 'The NIAT programme at NIU offers a B.Tech/BCA or equivalent degree with integrated industry-aligned upskilling components.',
    source_organisation: 'NxtWave / NIAT',
    source_title: 'NIAT Programme Details',
    source_url: 'https://www.niatindia.com/campus',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'NOT_YET_VERIFIED' as EvidenceStatus,
    explanation: 'The specific programme details, curriculum structure, credit distribution between university academics and NIAT upskilling, and delivery mode need direct confirmation from both NIU and NIAT. The exact degree programme name should be confirmed before admission.',
    sort_order: 7,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'ev-008',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'fees',
    claim: 'The total fee structure includes university tuition fees and a separate NIAT upskilling fee.',
    source_organisation: 'NxtWave / NIAT',
    source_title: 'NIAT Fee Information',
    source_url: 'https://www.niatindia.com/',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'NOT_YET_VERIFIED' as EvidenceStatus,
    explanation: 'The exact fee breakdown — university tuition, NIAT upskilling charges, registration fees, hostel costs, and any other charges — could not be independently verified from public sources at the time of checking. Parents should request the complete written fee schedule from both the university and NIAT before making any payment.',
    sort_order: 8,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'ev-009',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'payment',
    claim: 'Payments are split between the university (for tuition and university fees) and NxtWave/NIAT (for the upskilling programme).',
    source_organisation: 'ProofDesk Analysis',
    source_title: 'Payment Structure Assessment',
    source_url: 'https://www.niatindia.com/',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'NOT_YET_VERIFIED' as EvidenceStatus,
    explanation: 'The payment split between the university and NIAT requires written confirmation. Parents should obtain documentation clearly stating which institution receives which payment, and what each payment covers, before making any financial commitment.',
    sort_order: 9,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'ev-010',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'refund',
    claim: 'Refund and cancellation conditions apply as per university and NIAT policies.',
    source_organisation: 'ProofDesk Analysis',
    source_title: 'Refund Policy Assessment',
    source_url: 'https://niu.edu.in/',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'NOT_YET_VERIFIED' as EvidenceStatus,
    explanation: 'Refund and cancellation policies for both the university component and the NIAT upskilling component could not be independently verified from public sources. The UGC guidelines on refunds for self-financed institutions may apply. Parents must obtain the written refund policy from both the university and NIAT before paying.',
    sort_order: 10,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'ev-011',
    university_id: DEMO_UNIVERSITY_ID,
    category: 'outcomes',
    claim: 'NIAT claims industry-level placements and high salary outcomes for its students.',
    source_organisation: 'NxtWave / NIAT',
    source_title: 'NIAT Placement Claims',
    source_url: 'https://www.niatindia.com/',
    publication_date: null,
    date_checked: '2026-11-15',
    status: 'NOT_YET_PROVEN' as EvidenceStatus,
    explanation: 'As NIAT is a relatively new programme, verifiable cohort-level placement data specific to NIAT students at this university is not yet available. The first batches may not have graduated yet. Cross-programme placement statistics from NxtWave\'s other offerings should not be directly attributed to the NIAT university programme. This status will change once traceable, cohort-specific outcomes are published.',
    sort_order: 11,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-11-15T10:00:00Z',
  },
];

// ─── Sample Leads ───────────────────────────────────────────
export const DEMO_LEAD_ID = '00000000-0000-0000-0000-000000000010';
export const DEMO_LEAD_ROHIT_ID = '00000000-0000-0000-0000-000000000011';
export const DEMO_LEAD_NEHA_ID = '00000000-0000-0000-0000-000000000012';

export const demoLead: Lead = {
  id: DEMO_LEAD_ID,
  student_name: 'Aarav Sharma',
  parent_name: 'Rajesh Sharma',
  parent_phone: '+91 98765 43210',
  parent_email: 'rajesh.sharma@example.com',
  university_id: DEMO_UNIVERSITY_ID,
  city: 'Delhi NCR',
  state: 'Delhi',
  preferred_language: 'hi',
  lead_source: 'NIAT counselling',
  lead_status: 'stalled',
  experiment_group: 'test',
  counselling_date: '2026-11-10',
  counselling_completed: true,
  days_since_counselling: 8,
  seat_block_payment: false,
  seat_block_payment_date: null,
  created_at: '2026-11-06T10:00:00Z',
  updated_at: '2026-11-18T10:00:00Z',
  university: demoUniversity,
};

export const demoLeadRohit: Lead = {
  id: DEMO_LEAD_ROHIT_ID,
  student_name: 'Rohit Kulkarni',
  parent_name: 'Anand Kulkarni',
  parent_phone: '+91 98490 12345',
  parent_email: 'anand.kulkarni@example.com',
  university_id: DEMO_UNIVERSITY_ID,
  city: 'Hyderabad',
  state: 'Telangana',
  preferred_language: 'te',
  lead_source: 'NIAT counselling',
  lead_status: 'dossier_delivered',
  experiment_group: 'test',
  counselling_date: '2026-11-12',
  counselling_completed: true,
  days_since_counselling: 6,
  seat_block_payment: false,
  seat_block_payment_date: null,
  created_at: '2026-11-08T10:00:00Z',
  updated_at: '2026-11-18T10:00:00Z',
  university: demoUniversity,
};

export const demoLeadNeha: Lead = {
  id: DEMO_LEAD_NEHA_ID,
  student_name: 'Neha Gupta',
  parent_name: 'Suresh Gupta',
  parent_phone: '+91 98111 22334',
  parent_email: 'suresh.gupta@example.com',
  university_id: DEMO_UNIVERSITY_ID,
  city: 'Delhi NCR',
  state: 'Delhi',
  preferred_language: 'en',
  lead_source: 'NIAT counselling',
  lead_status: 'seat_block_paid',
  experiment_group: 'test',
  counselling_date: '2026-11-02',
  counselling_completed: true,
  days_since_counselling: 16,
  seat_block_payment: true,
  seat_block_payment_date: '2026-11-14',
  created_at: '2026-10-28T10:00:00Z',
  updated_at: '2026-11-14T10:00:00Z',
  university: demoUniversity,
};

export const demoLeads: Lead[] = [demoLead, demoLeadRohit, demoLeadNeha];

// ─── Peer Volunteer ─────────────────────────────────────────
export const DEMO_VOLUNTEER_ID = '00000000-0000-0000-0000-000000000020';

export const demoVolunteer: PeerVolunteer = {
  id: DEMO_VOLUNTEER_ID,
  name: 'Priya Verma',
  role: 'parent',
  university_id: DEMO_UNIVERSITY_ID,
  language: 'hi',
  city: 'Noida',
  state: 'Uttar Pradesh',
  year_of_joining: 2025,
  bio: 'Parent of a second-year B.Tech student at NIU through the NIAT programme. Happy to share our family\'s experience with the admission process, campus life, and academic progress.',
  consent_status: 'consented',
  is_available: true,
  is_demo: true,
  created_at: '2026-06-01T10:00:00Z',
  updated_at: '2026-11-15T10:00:00Z',
  university: demoUniversity,
};

// ─── Demo Dossiers ──────────────────────────────────────────
export const DEMO_DOSSIER_TOKEN = 'demo-aarav-sharma-niu-2026';
export const DEMO_DOSSIER_ROHIT_TOKEN = 'demo-rohit-kulkarni-niu-2026';
export const DEMO_DOSSIER_NEHA_TOKEN = 'demo-neha-gupta-niu-2026';

export const demoDossier: Dossier = {
  id: '00000000-0000-0000-0000-000000000030',
  lead_id: DEMO_LEAD_ID,
  university_id: DEMO_UNIVERSITY_ID,
  language: 'hi',
  share_token: DEMO_DOSSIER_TOKEN,
  generated_content: null, // Will be generated on demand
  generation_status: 'pending',
  generation_error: null,
  view_count: 0,
  created_at: '2026-11-15T10:00:00Z',
  updated_at: '2026-11-18T10:00:00Z',
};

export const demoDossierRohit: Dossier = {
  id: '00000000-0000-0000-0000-000000000031',
  lead_id: DEMO_LEAD_ROHIT_ID,
  university_id: DEMO_UNIVERSITY_ID,
  language: 'te',
  share_token: DEMO_DOSSIER_ROHIT_TOKEN,
  generated_content: null,
  generation_status: 'completed',
  generation_error: null,
  view_count: 2,
  created_at: '2026-11-15T10:00:00Z',
  updated_at: '2026-11-18T10:00:00Z',
};

export const demoDossierNeha: Dossier = {
  id: '00000000-0000-0000-0000-000000000032',
  lead_id: DEMO_LEAD_NEHA_ID,
  university_id: DEMO_UNIVERSITY_ID,
  language: 'en',
  share_token: DEMO_DOSSIER_NEHA_TOKEN,
  generated_content: null,
  generation_status: 'completed',
  generation_error: null,
  view_count: 5,
  created_at: '2026-11-14T10:00:00Z',
  updated_at: '2026-11-14T10:00:00Z',
};

export const demoDossiers: Dossier[] = [demoDossier, demoDossierRohit, demoDossierNeha];

// Helper functions for dynamic lead and dossier resolution
export function getLeadById(id: string): Lead | undefined {
  return demoLeads.find((lead) => lead.id === id);
}

export function getDossierByLeadId(leadId: string): Dossier | undefined {
  return demoDossiers.find((dossier) => dossier.lead_id === leadId);
}

export function getDossierByToken(token: string): { dossier: Dossier; lead: Lead } | undefined {
  const dossier = demoDossiers.find((d) => d.share_token === token);
  if (dossier) {
    const lead = demoLeads.find((l) => l.id === dossier.lead_id) || demoLead;
    return { dossier, lead };
  }
  
  // Fuzzy or slug match (matches both 2024 and 2026 tokens)
  const lower = token.toLowerCase();
  if (lower.includes('rohit')) {
    return { dossier: demoDossierRohit, lead: demoLeadRohit };
  }
  if (lower.includes('neha')) {
    return { dossier: demoDossierNeha, lead: demoLeadNeha };
  }
  if (lower.includes('aarav') || token.includes('demo-')) {
    return { dossier: demoDossier, lead: demoLead };
  }
  return undefined;
}

// ─── Activity Timeline ──────────────────────────────────────
export const demoActivityLogs: ActivityLog[] = [
  {
    id: 'act-001',
    lead_id: DEMO_LEAD_ID,
    dossier_id: null,
    action: 'lead_imported',
    details: { source: 'NIAT counselling' },
    performed_by: 'system',
    created_at: '2026-11-06T10:00:00Z',
  },
  {
    id: 'act-002',
    lead_id: DEMO_LEAD_ID,
    dossier_id: null,
    action: 'counselling_completed',
    details: { counsellor: 'Demo Counsellor' },
    performed_by: 'system',
    created_at: '2026-11-10T14:30:00Z',
  },
  {
    id: 'act-003',
    lead_id: DEMO_LEAD_ID,
    dossier_id: null,
    action: 'lead_stalled',
    details: { reason: 'No seat-block payment after 7 days' },
    performed_by: 'system',
    created_at: '2026-11-17T10:00:00Z',
  },
];

// ─── Dashboard Stats ────────────────────────────────────────
export const demoDashboardStats: DashboardStats = {
  total_stalled: 1,
  dossiers_generated: 0,
  dossiers_delivered: 0,
  peer_calls_requested: 0,
  peer_calls_booked: 0,
  seat_block_payments: 0,
  verification_issues: 3,
};

export const demoFunnelSteps: FunnelStep[] = [
  { label: 'Stalled Leads', count: 1, percentage: 100 },
  { label: 'Dossier Generated', count: 0, percentage: 0 },
  { label: 'Dossier Delivered', count: 0, percentage: 0 },
  { label: 'Peer Call Requested', count: 0, percentage: 0 },
  { label: 'Seat-Block Payment', count: 0, percentage: 0 },
];
