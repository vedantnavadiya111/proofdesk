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
  getLeadById,
  getDossierByLeadId,
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

    // ── Supabase mode (if configured) ──────────────────────
    if (isSupabaseConfigured()) {
      try {
        const { data: lead, error: leadError } = await supabase
          .from('leads')
          .select('*, university:universities(*)')
          .eq('id', lead_id)
          .single();

        if (lead && !leadError) {
          const university = lead.university || demoUniversity;

          // Fetch evidence
          const { data: evidence } = await supabase
            .from('evidence')
            .select('*')
            .eq('university_id', lead.university_id)
            .order('sort_order', { ascending: true });

          const evidenceList = (evidence ?? demoEvidence) as Evidence[];

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

          // Check for existing dossier
          const { data: existingDossier } = await supabase
            .from('dossiers')
            .select('id, share_token')
            .eq('lead_id', lead_id)
            .maybeSingle();

          const shareToken = existingDossier?.share_token ||
            `demo-${lead.student_name.toLowerCase().replace(/\s+/g, '-')}-niu-2024`;

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
            const { data: updated, error: updateError } = await supabase
              .from('dossiers')
              .update(dossierRecord)
              .eq('id', existingDossier.id)
              .select()
              .single();

            if (updateError || !updated) {
              throw updateError || new Error('Failed to update dossier.');
            }
            dossier = updated as Dossier;
          } else {
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
              throw createError || new Error('Failed to create dossier.');
            }
            dossier = created as Dossier;
          }

          // Update lead status
          await supabase
            .from('leads')
            .update({
              lead_status: 'dossier_generated',
              updated_at: new Date().toISOString(),
            })
            .eq('id', lead_id);

          return NextResponse.json({
            dossier,
            share_token: dossier.share_token,
            is_demo: false,
          });
        }
      } catch (err) {
        console.warn('Supabase dossier generate error, falling back to local:', err);
      }
    }

    // ── Local / Demo mode ──────────────────────────────────
    const lead = getLeadById(lead_id) || demoLead;
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

    const matchedDossier = getDossierByLeadId(lead.id);
    const token = matchedDossier?.share_token || `demo-${lead.student_name.toLowerCase().replace(/\s+/g, '-')}-niu-2024`;

    const dossier: Dossier = {
      ...(matchedDossier || demoDossier),
      lead_id: lead.id,
      language,
      generated_content: content,
      generation_status: 'completed',
      share_token: token,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      dossier,
      share_token: token,
      is_demo: true,
    });
  } catch (err) {
    console.error('POST /api/dossier/generate error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
