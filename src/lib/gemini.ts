import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Evidence, DossierContent, DossierLanguage, SourceCitation, EvidenceStatus } from './types';
import { t } from './translations';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
  }
  return new GoogleGenerativeAI(apiKey);
}

const LANGUAGE_NAMES: Record<DossierLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  te: 'Telugu',
};

export async function generateDossierContent(
  studentName: string,
  universityName: string,
  language: DossierLanguage,
  evidence: Evidence[]
): Promise<DossierContent> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const evidenceText = evidence
    .map(
      (e, i) =>
        `[Evidence ${i + 1}]
Category: ${e.category}
Claim: ${e.claim}
Source: ${e.source_title} (${e.source_organisation})
URL: ${e.source_url}
Status: ${e.status}
Explanation: ${e.explanation}
Date Checked: ${e.date_checked}`
    )
    .join('\n\n');

  const prompt = `You are generating a Trust Dossier for a parent considering their child's university admission.

STUDENT: ${studentName}
UNIVERSITY: ${universityName}
LANGUAGE: Generate ALL explanatory text in ${LANGUAGE_NAMES[language]}. Keep official names, legal terms, URLs, dates, and currency in their original form.

EVIDENCE RECORDS:
${evidenceText}

Generate a structured JSON dossier with the following sections. Use ONLY the evidence provided above. Do not invent information.

Rules:
- Every factual claim must cite its source from the evidence.
- Clearly distinguish VERIFIED, NOT_YET_VERIFIED, NOT_YET_PROVEN, and CONFLICTING_EVIDENCE.
- Never invent fee details, placement outcomes, or approvals.
- If information is missing, say so explicitly.
- Do not make admission guarantees or pressure parents.
- Use a professional, neutral, trustworthy tone.
- Generate explanations in ${LANGUAGE_NAMES[language]}, but keep proper nouns, institution names, and legal terms in English.

Return ONLY valid JSON matching this structure (no markdown, no code fences):
{
  "opening": {
    "title": "${t('dossier_title', language)}",
    "student_name": "${studentName}",
    "university_name": "${universityName}",
    "generation_date": "${new Date().toISOString().split('T')[0]}",
    "last_verification_date": "latest date_checked from evidence",
    "language": "${language}",
    "evidence_coverage": "X of Y claims verified",
    "introduction": "translated introduction paragraph"
  },
  "degree_awarding": {
    "title": "${t('dossier_s1_title', language)}",
    "content": "explanation of who awards the degree, NIAT's role, university's role",
    "sources": [{"title": "...", "url": "...", "organisation": "...", "date_checked": "..."}]
  },
  "recognition": {
    "title": "${t('dossier_s2_title', language)}",
    "entries": [
      {
        "claim": "...",
        "status": "VERIFIED|NOT_YET_VERIFIED|NOT_YET_PROVEN|CONFLICTING_EVIDENCE",
        "explanation": "...",
        "source": {"title": "...", "url": "...", "organisation": "...", "date_checked": "..."}
      }
    ]
  },
  "financial": {
    "title": "${t('dossier_s3_title', language)}",
    "table": [
      {
        "item": "University tuition",
        "responsible_institution": "...",
        "amount": "verified amount or 'Not yet verified'",
        "evidence_status": "VERIFIED|NOT_YET_VERIFIED",
        "source": {"title": "...", "url": "...", "organisation": "...", "date_checked": "..."} or null
      }
    ],
    "refund_conditions": "refund information or disclaimer"
  },
  "proven_vs_not": {
    "title": "${t('dossier_s4_title', language)}",
    "proven": [{"claim": "...", "explanation": "why this is proven"}],
    "not_proven": [{"claim": "...", "explanation": "why this is not yet proven"}]
  },
  "parent_questions": {
    "title": "${t('dossier_s5_title', language)}",
    "questions": ["question 1 in ${LANGUAGE_NAMES[language]}", "..."]
  },
  "peer_connection": {
    "title": "${t('dossier_s6_title', language)}",
    "description": "translated invitation text"
  }
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Clean the response — remove markdown code fences if present
  const cleaned = text
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleaned) as DossierContent;
  } catch {
    throw new Error(`Failed to parse AI response as JSON. Raw response: ${cleaned.substring(0, 500)}`);
  }
}

export function buildFallbackDossier(
  studentName: string,
  universityName: string,
  language: DossierLanguage,
  evidence: Evidence[]
): DossierContent {
  const verifiedCount = evidence.filter((e) => e.status === 'VERIFIED').length;
  const latestCheck = evidence.reduce((latest, e) => (e.date_checked > latest ? e.date_checked : latest), '');

  const toSource = (e: Evidence): SourceCitation => ({
    title: e.source_title,
    url: e.source_url,
    organisation: e.source_organisation,
    date_checked: e.date_checked,
  });

  const byCategory = (cat: string) => evidence.filter((e) => e.category === cat);

  return {
    opening: {
      title: t('dossier_title', language),
      student_name: studentName,
      university_name: universityName,
      generation_date: new Date().toISOString().split('T')[0],
      last_verification_date: latestCheck,
      language,
      evidence_coverage: `${verifiedCount} / ${evidence.length}`,
      introduction: t('dossier_intro', language),
    },
    degree_awarding: {
      title: t('dossier_s1_title', language),
      content: byCategory('degree')[0]?.explanation ?? t('ev_not_verified', language),
      sources: byCategory('degree').map(toSource),
    },
    recognition: {
      title: t('dossier_s2_title', language),
      entries: [...byCategory('ugc'), ...byCategory('naac'), ...byCategory('statutory')].map((e) => ({
        claim: e.claim,
        status: e.status,
        explanation: e.explanation,
        source: toSource(e),
      })),
    },
    financial: {
      title: t('dossier_s3_title', language),
      table: [
        {
          item: language === 'hi' ? 'विश्वविद्यालय ट्यूशन' : language === 'te' ? 'విశ్వవిద్యాలయ ట్యూషన్' : 'University tuition',
          responsible_institution: universityName,
          amount: t('ev_not_verified', language),
          evidence_status: 'NOT_YET_VERIFIED' as EvidenceStatus,
          source: byCategory('fees')[0] ? toSource(byCategory('fees')[0]) : null,
        },
        {
          item: language === 'hi' ? 'NIAT अपस्किलिंग शुल्क' : language === 'te' ? 'NIAT అప్‌స్కిల్లింగ్ ఫీజు' : 'NIAT upskilling fee',
          responsible_institution: 'NxtWave / NIAT',
          amount: t('ev_not_verified', language),
          evidence_status: 'NOT_YET_VERIFIED' as EvidenceStatus,
          source: byCategory('fees')[0] ? toSource(byCategory('fees')[0]) : null,
        },
        {
          item: language === 'hi' ? 'पंजीकरण शुल्क' : language === 'te' ? 'రిజిస్ట్రేషన్ ఫీజు' : 'Registration fee',
          responsible_institution: t('ev_not_verified', language),
          amount: t('ev_not_verified', language),
          evidence_status: 'NOT_YET_VERIFIED' as EvidenceStatus,
          source: null,
        },
      ],
      refund_conditions: byCategory('refund')[0]?.explanation ?? t('dossier_s3_unavailable', language),
    },
    proven_vs_not: {
      title: t('dossier_s4_title', language),
      proven: evidence
        .filter((e) => e.status === 'VERIFIED')
        .map((e) => ({ claim: e.claim, explanation: e.explanation })),
      not_proven: evidence
        .filter((e) => e.status === 'NOT_YET_PROVEN' || e.status === 'NOT_YET_VERIFIED')
        .map((e) => ({ claim: e.claim, explanation: e.explanation })),
    },
    parent_questions: {
      title: t('dossier_s5_title', language),
      questions: [
        t('question_1', language),
        t('question_2', language),
        t('question_3', language),
        t('question_4', language),
        t('question_5', language),
      ],
    },
    peer_connection: {
      title: t('dossier_s6_title', language),
      description: t('dossier_s6_description', language),
    },
  };
}

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return !!(key && key !== 'your-gemini-api-key-here');
}
