// Seed script for ProofDesk — Run with: npx tsx src/lib/seed.ts
// Populates Supabase with demo data for the sample demonstration.

import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { createClient } from '@supabase/supabase-js';
import {
  demoUniversity,
  demoEvidence,
  demoLead,
  demoLeads,
  demoVolunteer,
  demoDossier,
  demoDossiers,
  demoActivityLogs,
} from './demo-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('Copy .env.example to .env and fill in your Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('🌱 Seeding ProofDesk database...\n');

  // 1. University
  console.log('  → Inserting university...');
  const { error: uniError } = await supabase
    .from('universities')
    .upsert({
      id: demoUniversity.id,
      name: demoUniversity.name,
      short_name: demoUniversity.short_name,
      city: demoUniversity.city,
      state: demoUniversity.state,
      established_year: demoUniversity.established_year,
      university_type: demoUniversity.university_type,
      official_website: demoUniversity.official_website,
      ugc_url: demoUniversity.ugc_url,
      niat_campus_url: demoUniversity.niat_campus_url,
      niat_collaboration_details: demoUniversity.niat_collaboration_details,
    }, { onConflict: 'id' });
  if (uniError) throw uniError;
  console.log('    ✓ University inserted');

  // 2. Evidence
  console.log('  → Inserting evidence records...');
  for (let i = 0; i < demoEvidence.length; i++) {
    const ev = demoEvidence[i];
    const uuid = `00000000-0000-0000-0000-0000000001${String(i + 1).padStart(2, '0')}`;
    const { error } = await supabase
      .from('evidence')
      .upsert({
        id: uuid,
        university_id: ev.university_id,
        category: ev.category,
        claim: ev.claim,
        source_organisation: ev.source_organisation,
        source_title: ev.source_title,
        source_url: ev.source_url,
        publication_date: ev.publication_date,
        date_checked: ev.date_checked,
        status: ev.status,
        explanation: ev.explanation,
        sort_order: ev.sort_order,
      }, { onConflict: 'id' });
    if (error) throw error;
  }
  console.log(`    ✓ ${demoEvidence.length} evidence records inserted`);

  // 3. Leads
  console.log('  → Inserting sample leads...');
  for (const lead of demoLeads) {
    const { error: leadError } = await supabase
      .from('leads')
      .upsert({
        id: lead.id,
        student_name: lead.student_name,
        parent_name: lead.parent_name,
        parent_phone: lead.parent_phone,
        parent_email: lead.parent_email,
        university_id: lead.university_id,
        city: lead.city,
        state: lead.state,
        preferred_language: lead.preferred_language,
        lead_source: lead.lead_source,
        lead_status: lead.lead_status,
        experiment_group: lead.experiment_group,
        counselling_date: lead.counselling_date,
        counselling_completed: lead.counselling_completed,
        days_since_counselling: lead.days_since_counselling,
        seat_block_payment: lead.seat_block_payment,
        seat_block_payment_date: lead.seat_block_payment_date,
      }, { onConflict: 'id' });
    if (leadError) throw leadError;
  }
  console.log(`    ✓ ${demoLeads.length} leads inserted`);

  // 4. Peer volunteer
  console.log('  → Inserting peer volunteer...');
  const { error: volError } = await supabase
    .from('peer_volunteers')
    .upsert({
      id: demoVolunteer.id,
      name: demoVolunteer.name,
      role: demoVolunteer.role,
      university_id: demoVolunteer.university_id,
      language: demoVolunteer.language,
      city: demoVolunteer.city,
      state: demoVolunteer.state,
      year_of_joining: demoVolunteer.year_of_joining,
      bio: demoVolunteer.bio,
      consent_status: demoVolunteer.consent_status,
      is_available: demoVolunteer.is_available,
      is_demo: demoVolunteer.is_demo,
    }, { onConflict: 'id' });
  if (volError) throw volError;
  console.log('    ✓ Volunteer inserted');

  // 5. Demo dossiers
  console.log('  → Inserting dossier placeholders...');
  for (const dos of demoDossiers) {
    const { error: dosError } = await supabase
      .from('dossiers')
      .upsert({
        id: dos.id,
        lead_id: dos.lead_id,
        university_id: dos.university_id,
        language: dos.language,
        share_token: dos.share_token,
        generated_content: dos.generated_content,
        generation_status: dos.generation_status,
        generation_error: dos.generation_error,
        view_count: dos.view_count,
      }, { onConflict: 'id' });
    if (dosError) throw dosError;
  }
  console.log(`    ✓ ${demoDossiers.length} dossier placeholders inserted`);

  // 6. Activity logs
  console.log('  → Inserting activity logs...');
  for (let i = 0; i < demoActivityLogs.length; i++) {
    const log = demoActivityLogs[i];
    const uuid = `00000000-0000-0000-0000-0000000004${String(i + 1).padStart(2, '0')}`;
    const { error } = await supabase
      .from('activity_logs')
      .upsert({
        id: uuid,
        lead_id: log.lead_id,
        dossier_id: log.dossier_id,
        action: log.action,
        details: log.details,
        performed_by: log.performed_by,
        created_at: log.created_at,
      }, { onConflict: 'id' });
    if (error) throw error;
  }
  console.log(`    ✓ ${demoActivityLogs.length} activity logs inserted`);

  console.log('\n✅ Seed complete! ProofDesk is ready.\n');
  console.log('Demo dossier URL: /dossier/demo-aarav-sharma-niu-2024');
  console.log('Admin dashboard: /admin');
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err);
  process.exit(1);
});
