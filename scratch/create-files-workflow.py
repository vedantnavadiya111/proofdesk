# ProofDesk — File Creation Workflow
# This workflow creates all UI components and pages in parallel across multiple agents.

import json

PROJECT = "C:/Users/vedan/.gemini/antigravity/scratch/proofdesk"

SHARED_CONTEXT = """
You are creating files for ProofDesk, a parent trust & lead conversion platform.

CRITICAL DESIGN RULES:
- Deep midnight navy (#0f172a) primary interface
- Warm ivory/off-white (#faf8f5) surfaces
- Muted teal for verified info
- Restrained amber for pending info
- Subtle red for conflicting info
- Lucide icons ONLY (import from 'lucide-react')
- Use Tailwind CSS classes - the tailwind config has custom colors: midnight, ivory, verified, pending, conflicting, notproven
- Import from '@/lib/utils' for cn()
- Import from '@/lib/types' for all types
- Import from '@/lib/translations' for t() and getTranslations()
- Import from '@/lib/constants' for STATUS_COLORS, LEAD_STATUS_COLORS, etc.
- Import from '@/lib/demo-data' for demo data
- Use 'use client' directive for components with interactivity
- All components use TypeScript with proper typing
- NO emoji icons, NO generic gradients, NO excessive animations
- Editorial design: fine dividers, restrained borders, compact readable density
- Mobile-first responsive design
- Every component must be a complete, working file

The project is at: """ + PROJECT + """

EXISTING FILES you can import from:
- @/lib/types — all domain types (Lead, Evidence, Dossier, University, etc.)
- @/lib/utils — cn(), formatDate(), daysAgo(), generateShareToken()
- @/lib/translations — t(key, lang), getTranslations(lang), formatShareMessage()
- @/lib/constants — STATUS_COLORS, STATUS_DOT_COLORS, LEAD_STATUS_COLORS, EVIDENCE_CATEGORIES, LANGUAGES
- @/lib/demo-data — demoUniversity, demoEvidence, demoLead, demoVolunteer, demoDossier, demoActivityLogs, demoDashboardStats, demoFunnelSteps, DEMO_UNIVERSITY_ID, DEMO_LEAD_ID, DEMO_VOLUNTEER_ID, DEMO_DOSSIER_TOKEN
- @/lib/supabase — supabase, getServiceClient(), isSupabaseConfigured()
- @/lib/gemini — generateDossierContent(), buildFallbackDossier(), isGeminiConfigured()

IMPORTANT: Write COMPLETE, PRODUCTION-QUALITY files. No placeholders, no TODOs, no stubs.
Every file must be fully functional. Use 'use client' for interactive components.
"""

# ─── Agent 1: shadcn/ui base components ──────────────────────
AGENT1_PROMPT = SHARED_CONTEXT + """

YOUR TASK: Create the following shadcn/ui-style base component files. Each should be a complete, working React component using class-variance-authority, tailwind-merge, and Radix primitives where needed.

Create these files (write each with the write_file tool):

1. src/components/ui/button.tsx — Button with variants: default (midnight bg), outline, ghost, destructive, link. Sizes: default, sm, lg, icon.

2. src/components/ui/badge.tsx — Badge with variants: default, verified (teal), pending (amber), conflicting (red), notproven (indigo), outline.

3. src/components/ui/card.tsx — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter. Use ivory-50 backgrounds with fine borders.

4. src/components/ui/input.tsx — Input with midnight-900 focus ring.

5. src/components/ui/separator.tsx — Use @radix-ui/react-separator.

6. src/components/ui/tabs.tsx — Use @radix-ui/react-tabs. Midnight styling.

7. src/components/ui/tooltip.tsx — Use @radix-ui/react-tooltip. Midnight bg tooltip.

8. src/components/ui/select.tsx — Use @radix-ui/react-select. Full select with trigger, content, item, etc.

9. src/components/ui/dialog.tsx — Use @radix-ui/react-dialog. Full dialog with overlay, content, header, footer, title, description, close.

10. src/components/ui/dropdown-menu.tsx — Use @radix-ui/react-dropdown-menu.

11. src/components/ui/label.tsx — Use @radix-ui/react-label.

All components import cn from '@/lib/utils'. Use cva from class-variance-authority for variants. Use forwardRef patterns. Follow shadcn/ui conventions exactly.

After creating all files, call finish with "done".
"""

# ─── Agent 2: Global layout, app page, and admin layout ──────
AGENT2_PROMPT = SHARED_CONTEXT + """

YOUR TASK: Create the global app layout, the root page, and the admin layout with sidebar navigation.

Create these files:

1. src/app/globals.css — Tailwind directives (@tailwind base, components, utilities). Add @import for Inter font from Google Fonts. Add custom base styles for the midnight/ivory theme. Include a subtle scrollbar style.

2. src/app/layout.tsx — Root layout. Import globals.css. Set Inter as font. Use midnight-950 background. Include metadata: title "ProofDesk — Clarity before commitment", description about the platform.

3. src/app/page.tsx — Root page that redirects to /admin using next/navigation redirect().

4. src/app/admin/layout.tsx — Admin layout with:
   - A fixed left sidebar (w-64) with midnight-950 bg
   - ProofDesk logo/name at top
   - Navigation links with Lucide icons: Dashboard (LayoutDashboard), Leads (Users), Evidence Library (Library), Peer Volunteers (UserCheck), Analytics (BarChart3)
   - Active state highlighting with verified color
   - A demo mode banner at the top of the content area: yellow/amber banner saying "Demonstration Mode — All data shown is fictional and illustrative."
   - Main content area with ivory-50 bg, proper padding
   - Mobile responsive: hamburger menu on small screens, sidebar as drawer
   - Use 'use client' since it needs state for mobile menu

After creating all files, call finish with "done".
"""

# ─── Agent 3: Admin dashboard page ──────────────────────────
AGENT3_PROMPT = SHARED_CONTEXT + """

YOUR TASK: Create the admin dashboard page at src/app/admin/page.tsx.

This is a 'use client' page that shows:

1. HEADER: "Growth Operations" title with a subtitle.

2. STAT CARDS ROW: 7 compact stat cards in a grid (3-4 columns on desktop, 2 on tablet, 1 on mobile):
   - Stalled Leads (AlertTriangle icon, amber)
   - Dossiers Generated (FileText icon)
   - Dossiers Delivered (Send icon)
   - Peer Calls Requested (Phone icon)
   - Peer Calls Booked (PhoneCall icon)
   - Seat-Block Payments (CreditCard icon, emerald)
   - Verification Issues (AlertCircle icon, red)
   
   Each card: icon, label, number. Compact, no excessive spacing. Use ivory bg with fine border.

3. CONVERSION FUNNEL: A horizontal funnel visualization showing:
   Stalled → Dossier Generated → Dossier Delivered → Peer Call Requested → Seat-Block Payment
   Show count and percentage at each step. Use bar widths proportional to percentages.
   Use recharts BarChart or a custom CSS funnel.

4. RECENT ACTIVITY: A timeline showing recent activity logs.
   Each entry: timestamp, action description, lead name.
   Use fine left-border timeline style.

Import data from demo-data. Use actual data from demoFunnelSteps, demoDashboardStats, demoActivityLogs.

The page should check if Supabase is configured and fall back to demo data gracefully.

Make it look like a serious internal growth-operations dashboard. Compact, data-dense, professional.

Write the complete file. After creating it, call finish with "done".
"""

# ─── Agent 4: Lead management pages ─────────────────────────
AGENT4_PROMPT = SHARED_CONTEXT + """

YOUR TASK: Create the lead management pages.

Create these files:

1. src/app/admin/leads/page.tsx — Lead management table page ('use client'):
   - Page title "Lead Management"
   - Search input (magnifying glass icon)
   - Filter dropdown for status
   - Table with columns: Student, Parent, University, City, Language, Status, Days Since Counselling, Seat-Block, Dossier, Last Interaction
   - Status column uses colored badges from LEAD_STATUS_COLORS
   - Dossier column shows "Generate" button (if no dossier) or "View" / "Share" buttons
   - Row click navigates to lead detail
   - Use demo data, with realistic table styling: fine borders, compact rows, alternating subtle bg
   - Responsive: on mobile show key columns only, horizontal scroll for full table

2. src/app/admin/leads/[id]/page.tsx — Lead detail page ('use client'):
   - Back button to /admin/leads
   - Lead profile header: student name, parent name, university, city, language, status badge, experiment group badge
   - Two-column layout on desktop:
     LEFT: Lead details card, Counselling info, Payment status
     RIGHT: Activity timeline
   - Activity timeline: vertical timeline with dots and lines, showing all activity log entries
   - Bottom section: Dossier management
     - If no dossier: "Generate Dossier" button with language selector
     - If dossier exists: Dossier preview card with View, Share on WhatsApp, Copy Link buttons
   - Generate dossier: POST to /api/dossier/generate, show loading state ("Generating…"), handle errors
   - Share functionality: build WhatsApp share URL, copy to clipboard functionality
   - Use the lead ID from params to find demo data (or fetch from Supabase)

Both files must be complete and functional. Import all needed types, constants, translations, demo data.

After creating all files, call finish with "done".
"""

# ─── Agent 5: Evidence library page ─────────────────────────
AGENT5_PROMPT = SHARED_CONTEXT + """

YOUR TASK: Create the evidence library page and the peer volunteers page.

Create these files:

1. src/app/admin/evidence/page.tsx — Evidence library page ('use client'):
   - Title: "University Evidence Library"
   - Subtitle: "Source-linked verification records for Noida International University"
   - Category filter tabs across the top (using the EVIDENCE_CATEGORIES constant)
   - "All" tab selected by default
   - Evidence entries displayed as a structured list/table (NOT cards):
     For each evidence entry:
     - Category label (small, muted)
     - Claim text (the main text, medium weight)
     - Status badge (VERIFIED = teal, NOT_YET_VERIFIED = amber, NOT_YET_PROVEN = indigo, CONFLICTING = red)
     - Source: clickable link to source_url with source_title
     - Source organisation
     - Date checked
     - Explanation (expandable or always visible, in slightly muted text)
   - Fine dividers between entries
   - Compact, editorial layout — like a research document, not a card grid
   - Use demoEvidence data
   - Show count per category in tabs

2. src/app/admin/volunteers/page.tsx — Peer volunteers page ('use client'):
   - Title: "Peer Volunteers"
   - Volunteer cards/list showing:
     - Name
     - Role (parent/student) with badge
     - University
     - Language
     - City
     - Availability status (green dot if available)
     - Bio
     - Demo label: "(Simulated demonstration profile)" in amber text
   - Use demoVolunteer data
   - Note at bottom: "Real volunteer profiles require verification and explicit consent before appearing."

After creating all files, call finish with "done".
"""

# ─── Agent 6: Analytics page ────────────────────────────────
AGENT6_PROMPT = SHARED_CONTEXT + """

YOUR TASK: Create the analytics page.

Create this file:

1. src/app/admin/analytics/page.tsx — Analytics page ('use client'):

   SECTION 1: Overview Metrics
   - Grid of metric cards similar to dashboard but more detailed
   - Stalled leads, Dossiers generated, shared, viewed, Peer calls requested/completed, Seat-block payments, Opt-outs, Complaints
   - Each card shows the actual count from data (use demo data)
   
   SECTION 2: Conversion Funnel
   - Visual funnel chart using recharts (FunnelChart or BarChart)
   - Steps: Stalled → Dossier Generated → Delivered → Peer Call → Seat-Block Payment
   - Show absolute numbers and percentages
   
   SECTION 3: A/B Experiment
   - Title: "A/B Experiment"
   - Two columns: Control Group vs Test Group (ProofDesk)
   - For each group show:
     - Total leads
     - Call-booking rate
     - Seat-block conversion rate
     - Opt-out rate
     - Complaint rate
   - Show percentage-point difference between groups
   - Since there's insufficient real data, show "Awaiting experiment data." message prominently
   - The table structure should be there but with zeros/dashes and the awaiting message
   
   Use recharts for any charts. Import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'.
   
   Use midnight/ivory color scheme. Compact, professional layout.
   
   Data should come from demo data where available, with "Awaiting experiment data" for the A/B section.

After creating the file, call finish with "done".
"""

# ─── Agent 7: Public dossier page ───────────────────────────
AGENT7_PROMPT = SHARED_CONTEXT + """

YOUR TASK: Create the public parent-facing Trust Dossier page and its API routes.

Create these files:

1. src/app/dossier/[token]/page.tsx — This is the MOST IMPORTANT page in the entire app.
   It's a 'use client' page that:
   - Fetches dossier data by share_token from the URL params
   - Falls back to demo data when Supabase isn't configured
   - Checks if the dossier_token matches DEMO_DOSSIER_TOKEN for demo mode
   - Shows a loading skeleton while fetching
   - Displays the full Trust Dossier with all 6 sections
   - Has a language selector in the header (3 languages)
   - Fetches /api/dossier/[token] to get the data
   
   DESIGN: This must feel like a professionally prepared university verification report.
   - Clean, mobile-first layout
   - Ivory-100 background with midnight text
   - ProofDesk branding at top (subtle, not overwhelming)
   - Student name and university prominently displayed
   - Generation date and verification date
   - Evidence coverage indicator
   
   Section 1 — Who Awards the Degree:
   - Clean prose with inline source citations (clickable links)
   
   Section 2 — Recognition & Approvals:
   - Each entry with status badge, claim text, explanation, source link
   - Status badges use the verified/pending/notproven/conflicting colors
   
   Section 3 — Financial Transparency:
   - Proper HTML table with fine borders
   - Columns: Item, Responsible Institution, Amount, Evidence
   - Each row shows the evidence status badge
   - Below table: Refund conditions section
   - If unavailable: prominent amber notice about getting written fee schedule
   
   Section 4 — Proven vs Not Yet Proven:
   - Two-column layout (stack on mobile)
   - LEFT: Proven items with teal left border and check icons
   - RIGHT: Not yet proven items with amber left border and clock icons
   - Each item has claim + explanation
   
   Section 5 — Parent Questions:
   - Numbered list of 5 questions
   - Clean, readable typography
   
   Section 6 — Peer Connection:
   - Volunteer card (if available) with name, role, university, language, city
   - Demo label if is_demo
   - "Request a Conversation" button that POSTs to /api/peer-request
   - After clicking: show success state "Conversation Requested"
   
   FOOTER: 
   - "Generated by ProofDesk — Clarity before commitment"
   - Disclaimer: "This report is generated using publicly available information and AI analysis. It is not legal or financial advice."

2. src/app/api/dossier/[token]/route.ts — GET endpoint:
   - Look up dossier by share_token
   - If Supabase not configured, use demo data
   - If dossier has no generated_content, return fallback dossier using buildFallbackDossier()
   - Increment view_count
   - Log activity: 'dossier_viewed'
   - Return { dossier, lead, university, evidence, volunteer } as JSON
   - Include volunteer info (filtered by university + language match)

3. src/app/api/dossier/generate/route.ts — POST endpoint:
   - Body: { lead_id, language }
   - Fetch lead and evidence from Supabase (or demo data)
   - Try generateDossierContent() with Gemini
   - If Gemini fails or not configured, use buildFallbackDossier()
   - Create/update dossier record with share_token
   - Log activity: 'dossier_generated'
   - Return the dossier with share_token

4. src/app/api/peer-request/route.ts — POST endpoint:
   - Body: { lead_id, dossier_id, volunteer_id, preferred_language, preferred_time }
   - Create call_request record
   - Log activity: 'peer_call_requested'
   - Return success

All API routes should handle errors gracefully and return proper HTTP status codes.
When Supabase is not configured, use demo data and return appropriate responses.

After creating all files, call finish with "done".
"""

# ─── Run all agents in parallel ──────────────────────────────
phase("Creating UI components and pages")
log("Launching 7 parallel agents to create all project files...")

SCHEMA = {"type": "string"}

results = await parallel(
    [
        ("shadcn-components", AGENT1_PROMPT),
        ("global-layout", AGENT2_PROMPT),
        ("admin-dashboard", AGENT3_PROMPT),
        ("lead-management", AGENT4_PROMPT),
        ("evidence-library", AGENT5_PROMPT),
        ("analytics-page", AGENT6_PROMPT),
        ("dossier-and-apis", AGENT7_PROMPT),
    ],
    lambda item: agent(
        prompt=item[1],
        schema=SCHEMA,
        role=item[0],
    ),
)

phase("Complete")
for r in results:
    log(f"Agent result: {r}")
