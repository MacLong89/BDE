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

## LinkedIn Note

LinkedIn does not allow scraping job postings without their official API. This app reminds you to manually check each company's LinkedIn Jobs page on a schedule you configure in Settings.
