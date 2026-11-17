# ProofDesk

**Clarity before commitment.**

ProofDesk is an AI-powered parent trust and lead conversion platform for NIAT. It helps parents make informed admission decisions through verified university information, transparent evidence, and access to real student/parent conversations.

> **Note:** This is an MVP demonstration built around a single university — Noida International University (NIU), Greater Noida, Uttar Pradesh. All student and parent data is fictional and used for demonstration purposes only.

---

## Features

### For Parents (Public Dossier)
- **Trust Dossier** — A personalised, evidence-backed verification report
- **Multilingual** — Full support for English, Hindi (हिंदी), and Telugu (తెలుగు)
- **Source-linked Evidence** — Every claim links to its authoritative source
- **Financial Transparency** — Fee breakdown with verification status
- **Proven vs Not Proven** — Clear distinction between verified facts and unproven claims
- **Peer Connection** — Request a conversation with a current parent or student

### For Counsellors (Admin Workspace)
- **Dashboard** — Growth operations overview with conversion funnel
- **Lead Management** — Track stalled leads and manage dossier generation
- **Evidence Library** — Source-linked university verification records
- **Analytics** — A/B experiment tracking and conversion metrics
- **WhatsApp Sharing** — One-click dossier sharing via WhatsApp

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Next.js 15](https://nextjs.org/) | React framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI components |
| [Lucide Icons](https://lucide.dev/) | Iconography |
| [Supabase](https://supabase.com/) | Database (PostgreSQL) |
| [Gemini API](https://ai.google.dev/) | AI dossier generation |
| [Recharts](https://recharts.org/) | Analytics charts |
| [Vercel](https://vercel.com/) | Deployment |

All services use their free tiers. No paid subscriptions required.

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- A [Supabase](https://supabase.com/) account (free tier)
- A [Google AI Studio](https://aistudio.google.com/) API key (free tier)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd proofdesk
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

1. Go to your Supabase project → SQL Editor
2. Run the contents of `supabase/schema.sql`
3. Seed the demo data:

```bash
npm run seed
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the admin dashboard.

### Demo Mode

If Supabase is not configured, the app runs in **demo mode** with built-in sample data. All features work using the fictional demonstration data.

---

## Demo Walkthrough

1. **Open the admin dashboard** at `/admin`
2. **Go to Leads** → Click on **Aarav Sharma**
3. **Inspect the Evidence Library** at `/admin/evidence`
4. **Generate a Trust Dossier** — select Hindi language
5. **View the Dossier** — preview the parent-facing report
6. **Switch language** to English or Telugu on the dossier page
7. **Share via WhatsApp** — copy the share link or open WhatsApp
8. **Request a Peer Conversation** — click the button on the dossier
9. **Check the Dashboard** — see activity reflected in stats

Demo dossier direct URL: `/dossier/demo-aarav-sharma-niu-2024`

---

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — ProofDesk MVP"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Set the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)
3. Deploy

### 3. Update the App URL

After deployment, update `NEXT_PUBLIC_APP_URL` in Vercel to your production URL (e.g., `https://proofdesk.vercel.app`).

---

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Supabase Free | 500MB database, 50K monthly active users |
| Gemini API Free | 60 requests/minute, 1500 requests/day |
| Vercel Hobby | 100GB bandwidth, serverless functions |

---

## Project Structure

```
proofdesk/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin workspace pages
│   │   │   ├── leads/       # Lead management
│   │   │   ├── evidence/    # Evidence library
│   │   │   ├── volunteers/  # Peer volunteers
│   │   │   └── analytics/   # Growth analytics
│   │   ├── dossier/[token]/ # Public parent dossier
│   │   └── api/             # API routes
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   └── lib/
│       ├── types.ts         # TypeScript types
│       ├── supabase.ts      # Database client
│       ├── gemini.ts        # AI generation
│       ├── translations.ts  # i18n (en, hi, te)
│       ├── constants.ts     # Shared constants
│       ├── demo-data.ts     # Fictional demo data
│       ├── utils.ts         # Utilities
│       └── seed.ts          # Database seed script
├── supabase/
│   └── schema.sql           # Database schema
├── .env.example
└── README.md
```

---

## Important Notes

- **All demo data is fictional.** Student names, parent names, and volunteer profiles are simulated.
- **University evidence is real but independently checked.** Claims are sourced from official websites. Some information may need re-verification over time.
- **UGC recognition of a university does not automatically extend to every programme or delivery arrangement.** The evidence library distinguishes the university's legal status from specific programme approvals.
- **Gemini API content may be used by Google to improve products.** Use fictional data only. Do not submit real parents' personal information.
- **This is an MVP.** Production deployment would need proper authentication, authorization, and data protection measures.

---

## License

This project is for demonstration purposes. All referenced university information is from publicly available sources.
