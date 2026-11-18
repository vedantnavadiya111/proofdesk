import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { buildFallbackDossier } from '@/lib/gemini';
import {
  demoUniversity,
  demoEvidence,
  demoLead,
  demoLeads,
  demoVolunteer,
  demoDossier,
  DEMO_DOSSIER_TOKEN,
  getDossierByToken,
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

    const url = new URL(request.url);
    const requestedLang = url.searchParams.get('lang') as DossierLanguage | null;

    // ── Supabase mode (if configured) ──────────────────────
    if (isSupabaseConfigured()) {
      try {
        const { data: dossier, error: dossierError } = await supabase
          .from('dossiers')
          .select('*')
          .eq('share_token', token)
          .maybeSingle();

        if (dossier && !dossierError) {
          const { data: lead } = await supabase
            .from('leads')
            .select('*')
            .eq('id', dossier.lead_id)
            .single();

          const { data: university } = await supabase
            .from('universities')
            .select('*')
            .eq('id', dossier.university_id)
            .single();

          const { data: evidence } = await supabase
            .from('evidence')
            .select('*')
            .eq('university_id', dossier.university_id)
            .order('sort_order', { ascending: true });

          const typedDossier = dossier as Dossier;
          const currentLang = requestedLang || typedDossier.language || lead?.preferred_language || 'hi';

          if (!typedDossier.generated_content || requestedLang) {
            typedDossier.generated_content = buildFallbackDossier(
              lead?.student_name || 'Candidate',
              university?.name || demoUniversity.name,
              currentLang,
              (evidence ?? demoEvidence) as Evidence[]
            );
            typedDossier.generation_status = 'completed';
          }

          let volunteer: PeerVolunteer | null = null;
          const { data: volunteers } = await supabase
            .from('peer_volunteers')
            .select('*')
            .eq('university_id', dossier.university_id)
            .eq('is_available', true)
            .eq('consent_status', 'consented');

          if (volunteers && volunteers.length > 0) {
            const languageMatch = volunteers.find(
              (v: PeerVolunteer) => v.language === currentLang
            );
            volunteer = (languageMatch ?? volunteers[0]) as PeerVolunteer;
          } else {
            volunteer = demoVolunteer;
          }

          // Increment view count in background
          supabase
            .from('dossiers')
            .update({ view_count: (typedDossier.view_count || 0) + 1 })
            .eq('id', typedDossier.id)
            .then(() => {});

          return NextResponse.json({
            dossier: typedDossier,
            lead: lead || demoLead,
            university: university || demoUniversity,
            evidence: evidence ?? demoEvidence,
            volunteer,
            is_demo: false,
          });
        }
      } catch (err) {
        console.warn('Supabase lookup failed, falling back to mock resolution:', err);
      }
    }

    // ── Demo / Local Resolution Mode ───────────────────────
    const matched = getDossierByToken(token);
    const lead: Lead = matched ? { ...matched.lead } : { ...demoLead };
    const lang: DossierLanguage = requestedLang || (matched ? matched.dossier.language : lead.preferred_language) || 'hi';

    const dossier: Dossier = matched
      ? { ...matched.dossier, language: lang }
      : {
          ...demoDossier,
          share_token: token,
          language: lang,
          lead_id: lead.id,
        };

    const university: University = { ...demoUniversity };
    const evidence: Evidence[] = [...demoEvidence];
    const volunteer: PeerVolunteer = { ...demoVolunteer, language: lang === 'te' ? 'te' : 'hi' };

    dossier.generated_content = buildFallbackDossier(
      lead.student_name,
      university.name,
      lang,
      evidence
    );
    dossier.generation_status = 'completed';
    dossier.view_count += 1;

    return NextResponse.json({
      dossier,
      lead,
      university,
      evidence,
      volunteer,
      is_demo: true,
    });
  } catch (err) {
    console.error('GET /api/dossier/[token] error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
