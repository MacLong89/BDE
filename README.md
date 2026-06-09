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
- **Data backup** — Export/import JSON backups (data stored locally in your browser)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

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
git remote add origin https://github.com/YOUR_USERNAME/recruitbd.git
git branch -M main
git push -u origin main
```

## LinkedIn Note

LinkedIn does not allow scraping job postings without their official API. This app reminds you to manually check each company's LinkedIn Jobs page on a schedule you configure in Settings.
