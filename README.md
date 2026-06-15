# AI Lead Capture

Simple AI-powered lead capture tool for Upwork MVP demos.

## Features

- Clean, responsive web form (name, email, inquiry)
- Personalized AI response via Groq
- Local JSON storage for demo (`data/leads.json`)
- Simple leads table page at `/leads`

## Tech Stack

- Next.js 15 + React + TypeScript
- Tailwind CSS
- Groq API (`llama-3.3-70b-versatile`)
- Local file storage (no external DB)

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add GROQ_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Groq Setup

1. Create an account at [console.groq.com](https://console.groq.com/keys)
2. Generate an API key
3. Add `GROQ_API_KEY` to `.env.local`
4. Optional: change model with `GROQ_MODEL` (default: `llama-3.3-70b-versatile`)

## Local Storage

Submissions are saved to `data/leads.json` on the server. View them at:

- [http://localhost:3000/leads](http://localhost:3000/leads)

This is demo-only storage. For production, swap in Supabase, Postgres, or another database.

## Deploy

Works on Vercel via GitHub. Add `GROQ_API_KEY` in your hosting dashboard.

Note: on serverless hosts, local file storage may not persist between deployments or cold starts. For a live demo, run locally or accept session-only persistence.

## Upwork Demo Notes

- Budget-friendly MVP scope
- Easy to extend with email notifications, CRM webhooks, or a real database
- `/leads` page makes it easy to show captured submissions during a call
