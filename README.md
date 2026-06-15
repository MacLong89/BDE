# RecruitBD — Business Development Tracker

A recruiter-focused web app for tracking business development with client companies and managing candidate placements.

## Features

- **Company profiles** — Track contacts, status, notes, and outreach history
- **Open roles** — Log roles you've opened with each company
- **Candidate submissions** — Track which candidates you've submitted and their pipeline status
- **Candidate placement side** — Full candidate profiles with notes and outreach tracking
- **Smart reminders** — Follow-up alerts based on days since last contact
- **LinkedIn job monitoring** — Reminders to check company LinkedIn jobs pages (add the jobs URL per company)
- **Browser notifications** — High-priority overdue reminders
- **Account login** — Sign in to sync your data to the cloud (works across devices)
- **Data backup** — Export/import JSON backups

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173 in your browser.

### Cloud login setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com)
2. In **Project Settings → API**, copy your **Project URL** and **anon public key**
3. Paste them into `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. In the Supabase **SQL Editor**, run the script in `supabase/schema.sql`
5. Restart the dev server and create an account on the login screen

On first sign-in, any data already in your browser is uploaded to your account automatically.

For **Vercel**, add the same two environment variables in your project settings before deploying.

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this repo to GitHub (see below).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New Project** → import your repository.
4. Vercel auto-detects Vite — leave defaults (`npm run build`, output `dist`).
5. Click **Deploy**.

## Push to GitHub

```bash
# Create a new empty repo at github.com/new (name it e.g. recruitbd), then:
git remote add origin https://github.com/MacLong89/BDE.git
git branch -M main
git push -u origin main
```

## LinkedIn Note

LinkedIn does not allow scraping job postings without their official API. This app reminds you to manually check each company's LinkedIn Jobs page on a schedule you configure in Settings.
