import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { DEMO_LEAD_ID, DEMO_VOLUNTEER_ID } from '@/lib/demo-data';
import type { DossierLanguage } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lead_id,
      dossier_id,
      volunteer_id,
      preferred_language = 'en',
      preferred_time,
    } = body as {
      lead_id: string;
      dossier_id?: string;
      volunteer_id?: string;
      preferred_language?: DossierLanguage;
      preferred_time?: string;
    };

    if (!lead_id) {
      return NextResponse.json(
        { error: 'lead_id is required.' },
        { status: 400 }
      );
    }

    // ── Demo mode ──────────────────────────────────────────
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        call_request: {
          id: 'demo-call-request-001',
          lead_id: DEMO_LEAD_ID,
          volunteer_id: volunteer_id ?? DEMO_VOLUNTEER_ID,
          dossier_id: dossier_id ?? null,
          preferred_time: preferred_time ?? null,
          preferred_language,
          status: 'requested',
          admin_notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        is_demo: true,
      });
    }

    // ── Supabase mode ──────────────────────────────────────
    // 1. Verify lead exists
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found.' },
        { status: 404 }
      );
    }

    // 2. Verify volunteer exists and is available (if provided)
    if (volunteer_id) {
      const { data: volunteer, error: volunteerError } = await supabase
        .from('peer_volunteers')
        .select('id, is_available, consent_status')
        .eq('id', volunteer_id)
        .single();

      if (volunteerError || !volunteer) {
        return NextResponse.json(
          { error: 'Volunteer not found.' },
          { status: 404 }
        );
      }

      if (!volunteer.is_available || volunteer.consent_status !== 'consented') {
        return NextResponse.json(
          { error: 'This volunteer is not currently available.' },
          { status: 400 }
        );
      }
    }

    // 3. Create call_request record
    const { data: callRequest, error: createError } = await supabase
      .from('call_requests')
      .insert({
        lead_id,
        volunteer_id: volunteer_id ?? null,
        dossier_id: dossier_id ?? null,
        preferred_time: preferred_time ?? null,
        preferred_language,
        status: 'requested',
        admin_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError || !callRequest) {
      return NextResponse.json(
        { error: 'Failed to create call request.' },
        { status: 500 }
      );
    }

    // 4. Update lead status
    await supabase
      .from('leads')
      .update({
        lead_status: 'peer_call_requested',
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead_id);

    // 5. Log activity
    await supabase.from('activity_logs').insert({
      lead_id,
      dossier_id: dossier_id ?? null,
      action: 'peer_call_requested',
      details: {
        volunteer_id: volunteer_id ?? null,
        preferred_language,
        preferred_time: preferred_time ?? null,
      },
      performed_by: 'parent',
    });

    return NextResponse.json({
      call_request: callRequest,
      is_demo: false,
    });
  } catch (err) {
    console.error('POST /api/peer-request error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
