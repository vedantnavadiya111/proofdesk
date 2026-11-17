import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { buildFallbackDossier } from '@/lib/gemini';
import {
  demoUniversity,
  demoEvidence,
  demoLead,
  demoVolunteer,
  demoDossier,
  DEMO_DOSSIER_TOKEN,
} from '@/lib/demo-data';
import type { Dossier, Lead, University, Evidence, PeerVolunteer, DossierLanguage } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Missing dossier token.' },
        { status: 400 }
      );
    }

    // ── Demo mode ──────────────────────────────────────────
    const url = new URL(request.url);
    const requestedLang = (url.searchParams.get('lang') as DossierLanguage) || 'hi';

    if (!isSupabaseConfigured() || token === DEMO_DOSSIER_TOKEN) {
      const dossier: Dossier = { ...demoDossier, language: requestedLang };
      const lead: Lead = { ...demoLead };
      const university: University = { ...demoUniversity };
      const evidence: Evidence[] = [...demoEvidence];
      const volunteer: PeerVolunteer = { ...demoVolunteer };

      // Build generated content for the requested language
      dossier.generated_content = buildFallbackDossier(
        lead.student_name,
        university.name,
        requestedLang,
        evidence
      );
      dossier.generation_status = 'completed';

      // Increment demo view count
      dossier.view_count += 1;

      return NextResponse.json({
        dossier,
        lead,
        university,
        evidence,
        volunteer,
        is_demo: true,
      });
    }

    // ── Supabase mode ──────────────────────────────────────
    // 1. Look up dossier by share_token
    const { data: dossier, error: dossierError } = await supabase
      .from('dossiers')
      .select('*')
      .eq('share_token', token)
      .single();

    if (dossierError || !dossier) {
      return NextResponse.json(
        { error: 'Dossier not found.' },
        { status: 404 }
      );
    }

    // 2. Fetch lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', dossier.lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead data not found.' },
        { status: 404 }
      );
    }

    // 3. Fetch university
    const { data: university, error: uniError } = await supabase
      .from('universities')
      .select('*')
      .eq('id', dossier.university_id)
      .single();

    if (uniError || !university) {
      return NextResponse.json(
        { error: 'University data not found.' },
        { status: 404 }
      );
    }

    // 4. Fetch evidence for the university
    const { data: evidence } = await supabase
      .from('evidence')
      .select('*')
      .eq('university_id', dossier.university_id)
      .order('sort_order', { ascending: true });

    // 5. Build fallback content if not generated
    const typedDossier = dossier as Dossier;
    if (!typedDossier.generated_content) {
      typedDossier.generated_content = buildFallbackDossier(
        lead.student_name,
        university.name,
        typedDossier.language,
        (evidence ?? []) as Evidence[]
      );
      typedDossier.generation_status = 'completed';
    }

    // 6. Find a matching volunteer (same university, with language preference)
    let volunteer: PeerVolunteer | null = null;
    const { data: volunteers } = await supabase
      .from('peer_volunteers')
      .select('*')
      .eq('university_id', dossier.university_id)
      .eq('is_available', true)
      .eq('consent_status', 'consented');

    if (volunteers && volunteers.length > 0) {
      // Prefer a volunteer matching the dossier language
      const languageMatch = volunteers.find(
        (v: PeerVolunteer) => v.language === typedDossier.language
      );
      volunteer = (languageMatch ?? volunteers[0]) as PeerVolunteer;
    }

    // 7. Increment view_count
    await supabase
      .from('dossiers')
      .update({ view_count: (typedDossier.view_count || 0) + 1 })
      .eq('id', typedDossier.id);

    // 8. Log activity
    await supabase.from('activity_logs').insert({
      lead_id: typedDossier.lead_id,
      dossier_id: typedDossier.id,
      action: 'dossier_viewed',
      details: { share_token: token, view_count: (typedDossier.view_count || 0) + 1 },
      performed_by: 'parent',
    });

    return NextResponse.json({
      dossier: typedDossier,
      lead,
      university,
      evidence: evidence ?? [],
      volunteer,
      is_demo: false,
    });
  } catch (err) {
    console.error('GET /api/dossier/[token] error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
