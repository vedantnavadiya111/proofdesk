import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  generateDossierContent,
  buildFallbackDossier,
  isGeminiConfigured,
} from '@/lib/gemini';
import {
  demoLead,
  demoUniversity,
  demoEvidence,
  demoDossier,
  DEMO_DOSSIER_TOKEN,
} from '@/lib/demo-data';
import { generateShareToken } from '@/lib/utils';
import type { DossierLanguage, Evidence, Dossier, DossierContent } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, language = 'en' } = body as {
      lead_id: string;
      language?: DossierLanguage;
    };

    if (!lead_id) {
      return NextResponse.json(
        { error: 'lead_id is required.' },
        { status: 400 }
      );
    }

    // ── Demo mode ──────────────────────────────────────────
    if (!isSupabaseConfigured()) {
      const lead = { ...demoLead };
      const university = { ...demoUniversity };
      const evidence: Evidence[] = [...demoEvidence];

      let content: DossierContent;

      if (isGeminiConfigured()) {
        try {
          content = await generateDossierContent(
            lead.student_name,
            university.name,
            language,
            evidence
          );
        } catch {
          content = buildFallbackDossier(
            lead.student_name,
            university.name,
            language,
            evidence
          );
        }
      } else {
        content = buildFallbackDossier(
          lead.student_name,
          university.name,
          language,
          evidence
        );
      }

      const dossier: Dossier = {
        ...demoDossier,
        language,
        generated_content: content,
        generation_status: 'completed',
        share_token: DEMO_DOSSIER_TOKEN,
        updated_at: new Date().toISOString(),
      };

      return NextResponse.json({
        dossier,
        share_token: DEMO_DOSSIER_TOKEN,
        is_demo: true,
      });
    }

    // ── Supabase mode ──────────────────────────────────────
    // 1. Fetch lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*, university:universities(*)')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found.' },
        { status: 404 }
      );
    }

    const university = lead.university;
    if (!university) {
      return NextResponse.json(
        { error: 'University data not found for this lead.' },
        { status: 404 }
      );
    }

    // 2. Fetch evidence
    const { data: evidence } = await supabase
      .from('evidence')
      .select('*')
      .eq('university_id', lead.university_id)
      .order('sort_order', { ascending: true });

    const evidenceList = (evidence ?? []) as Evidence[];

    // 3. Generate dossier content
    let content: DossierContent;
    let generationStatus: 'completed' | 'failed' = 'completed';
    let generationError: string | null = null;

    if (isGeminiConfigured()) {
      try {
        content = await generateDossierContent(
          lead.student_name,
          university.name,
          language,
          evidenceList
        );
      } catch (err) {
        console.error('Gemini generation failed, using fallback:', err);
        content = buildFallbackDossier(
          lead.student_name,
          university.name,
          language,
          evidenceList
        );
        generationError = err instanceof Error ? err.message : 'AI generation failed';
      }
    } else {
      content = buildFallbackDossier(
        lead.student_name,
        university.name,
        language,
        evidenceList
      );
    }

    // 4. Check for existing dossier
    const { data: existingDossier } = await supabase
      .from('dossiers')
      .select('id, share_token')
      .eq('lead_id', lead_id)
      .eq('language', language)
      .single();

    const shareToken = existingDossier?.share_token ?? generateShareToken();

    const dossierRecord = {
      lead_id,
      university_id: lead.university_id,
      language,
      share_token: shareToken,
      generated_content: content,
      generation_status: generationStatus,
      generation_error: generationError,
      updated_at: new Date().toISOString(),
    };

    let dossier: Dossier;

    if (existingDossier) {
      // Update existing dossier
      const { data: updated, error: updateError } = await supabase
        .from('dossiers')
        .update(dossierRecord)
        .eq('id', existingDossier.id)
        .select()
        .single();

      if (updateError || !updated) {
        return NextResponse.json(
          { error: 'Failed to update dossier.' },
          { status: 500 }
        );
      }
      dossier = updated as Dossier;
    } else {
      // Create new dossier
      const { data: created, error: createError } = await supabase
        .from('dossiers')
        .insert({
          ...dossierRecord,
          view_count: 0,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError || !created) {
        return NextResponse.json(
          { error: 'Failed to create dossier.' },
          { status: 500 }
        );
      }
      dossier = created as Dossier;
    }

    // 5. Update lead status
    await supabase
      .from('leads')
      .update({
        lead_status: 'dossier_generated',
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead_id);

    // 6. Log activity
    await supabase.from('activity_logs').insert({
      lead_id,
      dossier_id: dossier.id,
      action: 'dossier_generated',
      details: { language, used_ai: isGeminiConfigured() && !generationError },
      performed_by: 'system',
    });

    return NextResponse.json({
      dossier,
      share_token: dossier.share_token,
      is_demo: false,
    });
  } catch (err) {
    console.error('POST /api/dossier/generate error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
