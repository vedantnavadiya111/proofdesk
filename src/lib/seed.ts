// Seed script for ProofDesk — Run with: npx tsx src/lib/seed.ts
// Populates Supabase with demo data for the sample demonstration.

import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { createClient } from '@supabase/supabase-js';
import { demoUniversity, demoEvidence, demoLead, demoVolunteer, demoDossier, demoActivityLogs } from './demo-data';

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

  // 3. Lead
  console.log('  → Inserting sample lead...');
  const { error: leadError } = await supabase
    .from('leads')
    .upsert({
      id: demoLead.id,
      student_name: demoLead.student_name,
      parent_name: demoLead.parent_name,
      parent_phone: demoLead.parent_phone,
      parent_email: demoLead.parent_email,
      university_id: demoLead.university_id,
      city: demoLead.city,
      state: demoLead.state,
      preferred_language: demoLead.preferred_language,
      lead_source: demoLead.lead_source,
      lead_status: demoLead.lead_status,
      experiment_group: demoLead.experiment_group,
      counselling_date: demoLead.counselling_date,
      counselling_completed: demoLead.counselling_completed,
      days_since_counselling: demoLead.days_since_counselling,
      seat_block_payment: demoLead.seat_block_payment,
      seat_block_payment_date: demoLead.seat_block_payment_date,
    }, { onConflict: 'id' });
  if (leadError) throw leadError;
  console.log('    ✓ Lead inserted');

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

  // 5. Demo dossier placeholder
  console.log('  → Inserting dossier placeholder...');
  const { error: dosError } = await supabase
    .from('dossiers')
    .upsert({
      id: demoDossier.id,
      lead_id: demoDossier.lead_id,
      university_id: demoDossier.university_id,
      language: demoDossier.language,
      share_token: demoDossier.share_token,
      generated_content: demoDossier.generated_content,
      generation_status: demoDossier.generation_status,
      generation_error: demoDossier.generation_error,
      view_count: demoDossier.view_count,
    }, { onConflict: 'id' });
  if (dosError) throw dosError;
  console.log('    ✓ Dossier placeholder inserted');

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
